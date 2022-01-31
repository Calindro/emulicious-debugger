import * as vscode from 'vscode';
import { WorkspaceFolder, DebugConfiguration, ProviderResult, CancellationToken } from 'vscode';
import * as net from 'net';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_PORT = 58870;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('emulicious-debugger.runEditorContents', (resource: vscode.Uri) => {
			vscode.debug.startDebugging(undefined, {
				type: 'emulicious-debugger',
				name: 'Run Editor Contents',
				request: 'launch',
				program: resource.fsPath,
				noDebug: true,
				port: DEFAULT_PORT
			});
		}),
		vscode.commands.registerCommand('emulicious-debugger.debugEditorContents', (resource: vscode.Uri) => {
			vscode.debug.startDebugging(undefined, {
				type: 'emulicious-debugger',
				name: 'Debug Editor Contents',
				request: 'launch',
				program: resource.fsPath,
				port: DEFAULT_PORT,
				stopOnEntry: true
			});
		}),
		vscode.commands.registerCommand('emulicious-debugger.attach', () => {
			vscode.debug.startDebugging(undefined, {
				type: 'emulicious-debugger',
				name: 'Attach to Emulicious',
				request: 'attach',
				port: DEFAULT_PORT
			});
		})
	);

	context.subscriptions.push(vscode.commands.registerCommand('emulicious-debugger.getProgramName', config => {
		return vscode.window.showInputBox({
			placeHolder: "Please enter the name of a rom file in the workspace folder"
		});
	}));

	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('emulicious-debugger', new EmuliciousDebugConfigurationProvider()));
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('emulicious-debugger', {
		provideDebugConfigurations(folder: WorkspaceFolder | undefined): ProviderResult<DebugConfiguration[]> {
			return [
				{
					type: 'emulicious-debugger',
					name: 'Attach to Emulicious',
					request: 'attach',
					port: DEFAULT_PORT
				},
				{
					type: 'emulicious-debugger',
					name: 'Launch in Emulicious',
					request: 'launch',
					program: '${file}',
					port: DEFAULT_PORT
				}
			];
		}
	}, vscode.DebugConfigurationProviderTriggerKind.Dynamic));

	let factory: vscode.DebugAdapterDescriptorFactory = new EmuliciousDebugAdapterDescriptorFactory();
	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('emulicious-debugger', factory));
	if ('dispose' in factory) {
		context.subscriptions.push(factory);
	}
}

export function deactivate() {}

class EmuliciousDebugConfigurationProvider implements vscode.DebugConfigurationProvider {

	resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {

		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === 'emulicious-debugger.supportedRoms') {
				config.type = 'emulicious-debugger';
				config.name = 'Launch';
				config.request = 'launch';
				config.program = '${file}';
				config.port = DEFAULT_PORT;
				config.stopOnEntry = true;
			}
		}

		return config;
	}
}

class EmuliciousDebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(session: vscode.DebugSession, _: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		return new Promise((resolve, reject) => {
			const startEmulicious = () => {
				if (session.configuration.request === 'attach') {
					return reject("Failed to attach to Emulicious Debugger.\n" +
								  "Please make sure that Emulicious is running and Remote Debugging is enabled in Emulicious's Tools menu.");
				}
				const rejectMessage = "Failed to connect to Emulicious Debugger after attempting to launch Emulicious.\n" +
									  "Please contact the author about this error.\n" +
									  "Until this is fixed, you can just start Emulicious yourself and enabled Remote Debugging from Emulicious's Tools menu before trying to launch a program.";
				const workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('emulicious-debugger');
				let emuliciousPath = session.configuration.emuliciousPath || workspaceConfig.emuliciousPath;
				if (!emuliciousPath) {
					const emulicious = spawn("emulicious", [ "-remotedebug", session.configuration.port ], { stdio: 'ignore' });
					if (typeof emulicious.pid !== 'number') {
						return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
									 "Could not connect to Emulicious and could not start Emulicious because emuliciousPath is not set.\n" +
									 "Please make sure to set emuliciousPath either in your workspace/user settings of vscode (CTRL+, -> Extensions -> Emulicious Debugger) or in the launch configuration of your project.");
					}
				}
				else {
					if (!fs.existsSync(emuliciousPath)) {
						return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
									  "The file or folder specified in emuliciousPath does not exist:\n\n" +
									  "emuliciousPath: " + emuliciousPath + "\n\n" +
									  "Please check your configuration.");
					}
					if (fs.lstatSync(emuliciousPath).isDirectory()) {
						const emuliciousJar = path.join(emuliciousPath, "Emulicious.jar");
						if (!fs.existsSync(emuliciousJar)) {
							return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
										  "The file or folder specified in emuliciousPath does not contain Emulicious.jar:\n\n" +
										  "emuliciousPath: " + emuliciousPath + "\n\n" +
										  "Please check your configuration.");
						}
						emuliciousPath = emuliciousJar;
					}
					if (emuliciousPath.endsWith('.jar')) {
						let javaPath = session.configuration.javaPath || workspaceConfig.javaPath;
						const args = [ "-jar", emuliciousPath, "-remotedebug", session.configuration.port ];
						let emulicious = spawn(javaPath || "java", args, { stdio: 'ignore' });
						if (typeof emulicious.pid !== 'number') {
							if (javaPath) {
								return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
											  "Could not start the jar file specified by emuliciousPath with Java specified by javaPath:\n\n" +
											  "emuliciousPath: " + emuliciousPath + "\n" +
											  "javaPath: " + javaPath + "\n\n" + 
											  "Please check your configuration.\n" +
											  "javaPath should point to the executable of Java (e.g. java.exe).");
							}
							javaPath = path.join(path.dirname(emuliciousPath), "java", "bin", "java.exe");
							emulicious = spawn(javaPath, args, { stdio: 'ignore' });
							if (typeof emulicious.pid !== 'number') {
								return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
											  "Could not start the jar file specified by emuliciousPath:\n\n" +
											  "emuliciousPath: " + emuliciousPath + "\n\n" +
											  "Please check your configuration.\n" +
											  "You might need to install Java or download Emulicious with Java.\n" +
											  "If you already have Java installed, you can specify the path to Java via javaPath in your configuration.");
							}
						}
						emulicious.on('exit', (code, signal) => {
							if (code) {
								if (args[1].startsWith("/mnt/")) {
									args[1] = args[1].replace(/\/mnt\/(.)\//, "$1:/");
									emulicious = spawn(javaPath || "java", args, { stdio: 'ignore' });
									if (typeof emulicious.pid !== 'number') {
										return reject(rejectMessage);
									}
									emulicious.on('exit', (code, signal) => {
										if (code) {
											return reject(rejectMessage);
										}
									});
								}
								else {
									return reject(rejectMessage);
								}
							}
						});
					}
					else {
						const emulicious = spawn(emuliciousPath, [ "-remotedebug", session.configuration.port ], { stdio: 'ignore' });
						if (typeof emulicious.pid !== 'number') {
							return reject("Failed to launch Emulicious Debugger for the following reason:\n" +
										  "Could not start the file specified by emuliciousPath:\n\n" +
										  "emuliciousPath: " + emuliciousPath + "\n\n" +
										  "Please check your configuration.");
						}
					}
				}
				
				const maxAttempts = 20;
				let attempt = 0;
				function tryToConnect() {
					function retryToConnect() {
						if (++attempt < maxAttempts) {
							setTimeout(tryToConnect, 100);
						}
						else {
							socket.destroy();
							reject(rejectMessage);
						}
					}
					const socket = new net.Socket();
					socket.setTimeout(100);
					socket.on('connect', () => { socket.destroy(); resolve(new vscode.DebugAdapterServer(session.configuration.port)); });
					socket.on('timeout', () => { socket.destroy(); retryToConnect(); });
					socket.on('error', () => { socket.destroy(); retryToConnect(); });
					socket.connect(session.configuration.port);
				}
				tryToConnect();
			};
			const socket = new net.Socket();
			socket.setTimeout(100);
			socket.on('connect', () => { socket.destroy(); resolve(new vscode.DebugAdapterServer(session.configuration.port)); });
			socket.on('timeout', () => { socket.destroy(); startEmulicious(); });
			socket.on('error', () => { socket.destroy(); startEmulicious(); });
			socket.connect(session.configuration.port);
		});
	}

	dispose() {
	}
}