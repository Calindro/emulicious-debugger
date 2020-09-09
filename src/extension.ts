import * as vscode from 'vscode';
import { WorkspaceFolder, DebugConfiguration, ProviderResult, CancellationToken } from 'vscode';

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
		return new vscode.DebugAdapterServer(session.configuration.port);
	}

	dispose() {
	}
}