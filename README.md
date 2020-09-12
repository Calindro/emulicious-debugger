# Emulicious-debugger README

The "emulicious-debugger" extension enables debugging with Emulicious in VS Code.
This extension requires Emulicious (https://emulicious.net/).
In Emulicious you need to have "Remote Debugging" enabled. This option can be found in Emulicious's Tools menu.
For breakpoints to work you need a language extension for the language you are using.

For usage instructions see [Usage](#Usage).

Known issues are listed in [Known Issues](#Known%20Issues).

If you encounter any other issues please inform about them so they can be fixed.

If anything is unclear please also inform about that so the explenations can be improved.

## Requirements

The "emulicious-debugger" extension requires Visual Studio Code (VS Code) and Emulicious (https://emulicious.net/).
In Emulicious you need to have "Remote Debugging" enabled. This option can be found in Emulicious's Tools menu.
For breakpoints to work you need a language extension for the language you are using.
If you are using C you can for example use the C language extension that is built into VS Code.
For other languages you should be able to find a corresponding language extension in VS Code's Extension Marketplace.
For example if you are developing for the Game Boy (Color) with RGBDS you can find Donald Hays's RGBDS Z80 extension.

## Usage

Make sure that Emulicious is running and that "Remote Debugging" (in Emulicious's Tools menu) is enabled.
After that is set up, you have multiple ways to start debugging with Emulicious:
- From the command palette select "Attach to Emulicious" to attach the VS Code debugger to a running debug session of Emulicious.
- Select the ROM file in VS Code and click on Run/Debug Editor Contents in top right corner.
- Click on Run (CTRL+SHIFT+D) in the left toolbar and either click on "create a launch.json file" or on "Show". When you click "Show" you can choose from "Attach to Emulicious" and "Launch in Emulicious". That will create a launch configuration. By default that launch configuration always asks for the program to run but you can enter the name into the launch configuration. You can also add "preLaunchTask":${defaultBuildTask} if you have a default build task set up. With this setting, you make VS Code start the build task before debugging.
- If a launch configuration is already available you can press F5 to start debugging.

When building your program, make sure that debug symbols get generated. For example, when building C code with SDCC you should pass the commandline flag `--debug` to sdcc and the commandline flag `-y` to the linker. That will generate the required debug symbols in a *.cdb file.

## Features

The "emulicious-debugger" extension enables source level debugging for assembler code and C code (SDCC).

# Source-level Stepping

Step through your own ASM source code.

![Source-level Stepping](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/asmlevel-stepping.gif)

# Source Breakpoints

Break on breakpoints in your ASM source code.

![Source-level Breakpoints](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/asmlevel-breakpoints.png)

# Callstack

Keep an eye on your callstack.

![Callstack](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/callstack.png)

# Investigate Registers

Investigate registers annotated with symbols.

![Investigate Registers](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/registers.png)

# Investigate Stackframes

Investigate stackframes.

![Investigate Stackframes](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/stackframe.png)

# Investigate System State

Investigate system state.

![Investigate System State](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/investigate-system-state.png)

# Inspection on Hover

Inspect symbols on hover.

![Inspection on Hover](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/inspection-on-hover.png)

# Debug Console

Evaluate expressions in debug console

![Evaluate in Debug Console](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/evaluate-expressions-debug-console.png)

# Disassemble

Disassemble with Emulicious and step through the disassembly in VS Code.

![Disassemble](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/disassemble-using-symbols.png)

# C-level Stepping

Step through your C source code line by line, into procedures or out of them.

![C-level Stepping](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/clevel-stepping.gif)

# C-level Breakpoints

Break on breakpoints in your C source code.

![C-level Breakpoints](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/clevel-breakpoints.png)

# C Callstack

Keep an eye on your C callstack.

![C Callstack](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/c-callstack.png)

# C Local Variables

Keep track of your local variables.

![C Local Variables](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/c-local-variables.png)

# C Inspection of Structured Type

Inspect your C arrays and structs via Watch expressions, on hover or via the debug console.

![C Inspection of C Types in Watch expressions](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/watch-structured-c-types.png)

![C Inspection of C Types on Hover](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/inspection-of-structured-c-types-on-hover.png)

![C Inspection of C Types in Debug Console](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/inspection-of-structured-c-types-in-debug-console.png)

## Known Issues

Trying to start a debug session without Emulicious running or without Remote Debugging enabled yields an error message saying that the connection was refused.

![Connection Refused](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/connection-refused.png)

If you see this error make sure that you are running Emulicious and that Remote Debugging is enabled.

## Release Notes

### 1.0.3

Added some missing keywords
Improved some screenshots

### 1.0.2

README improvements

### 1.0.0

Initial release of "emulicious-debugger"