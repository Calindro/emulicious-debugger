# Emulicious-debugger README

The "emulicious-debugger" extension enables debugging with Emulicious in VS Code.
This extension requires [Emulicious](https://emulicious.net/).

For breakpoints to work you need a language extension for the language you are using.

For usage instructions see [Usage](#Usage).

Known issues are listed in [Known Issues](#Known%20Issues).

If you encounter any other issues please inform about them so they can be fixed.

If anything is unclear please also inform about that so the explanations can be improved.

## Requirements

The "emulicious-debugger" extension requires Visual Studio Code (VS Code) or VSCodium and [Emulicious](https://emulicious.net/).

For breakpoints to work you need a language extension for the language you are using.

If you are using C you can for example use the C language extension that is built into VS Code.

For other languages you should be able to find a corresponding language extension in VS Code's Extension Marketplace.

For example if you are developing for the Game Boy (Color) with RGBDS you can find Donald Hays's [RGBDS Z80 extension](https://marketplace.visualstudio.com/items?itemName=donaldhays.rgbds-z80).

## Usage

If you want to attach to a running debug session in Emulicious or want to launch a debug session in a running instance of Emulicious, you need to enable `Remote Debugging` in Emulicious's Tools menu.

If you want VS Code to start Emulicious when you launch the Emulicious Debugger, you need to specify the path to Emulicious in your configuration.
You can either set it globally in your user/workspace settings via CTRL+, -> Extensions -> Emulicious Debugger or locally for your project only via a launch configuration. You can let `emuliciousPath` point to either `Emulicious.jar`, `Emulicious.exe`, `Emulicious.bat` or the folder containing `Emulicious.jar`.

After that is set up, you have multiple ways in VS Code to start debugging with Emulicious:
1) From the command palette (CTRL+SHIFT+P) select "Attach to Emulicious" to attach the VS Code debugger to a running debug session of Emulicious.
2) Select the ROM file in VS Code and click on Run/Debug Editor Contents in top right corner. It is possible that both of these options are hidden in the ... menu.
3) Click on Run (CTRL+SHIFT+D) in the left toolbar and either click on "create a launch.json file" or on "Show". When you click "Show" you can choose from "Attach to Emulicious" and "Launch in Emulicious". That will create a launch configuration. By default that launch configuration always asks for the program to run but you can enter the name into the launch configuration. You can also add "preLaunchTask":${defaultBuildTask} if you have a default build task set up. With this setting, you make VS Code start the build task before debugging.
4) If a launch configuration is already available you can press F5 to start debugging.

Option 3) is the preferred one because it allows building and launching with a single press of a button (F5).

When building your program, make sure that debug symbols get generated.

For assembler code, this typically is a *.sym or *.lst file.

For C code with SDCC, this is a *.cdb file.

Please consult the documentation of your assembler/compiler to determine how to generate such files.

For example when using `lcc` from GBDK, you can pass `-debug` to it to make it generate debug symbols. If you invoke `sdcc` directly, you need to pass `--debug` to each call to it.

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

### Operation Not Permitted

On Mac OS, you might see the following error message:

![Operation Not Permitted](https://raw.githubusercontent.com/Calindro/emulicious-debugger/master/images/readme/operation-not-permitted.png)

This error is caused by missing permissions. You can fix this error by granting the required permissions to `/System/Library/CoreServices/Jar Launcher.app`.

### Missing Exception Breakpoints

Due to the way how VS Code handles exception breakpoints, you need to start another debug session to make the list of exception breakpoints update.

### Unexpected Behavior In C Debugging

When debugging C code, you might notice that sometimes the debugger does not behave the way you would expect. This is not really an issue of the debugger or your program.

The unexpected behavior is caused by optimizations done by SDCC. SDCC makes changes to your code which provide a performance gain without altering the semantics of your code. So it is possible that (unused) variables get eliminated and that the order of instructions is swapped.

Another optimization done by SDCC is called register allocation. That means that some variables live in CPU registers. For their values, the debugger shows the note `(value in register)`. At points where the value is not relevant, the value might not be in the specified register. In that case, the displayed value doesn't match the actual value of the variable.

Please consult the documentation of SDCC if you want to disable these optimizations or want to learn more about them.

Debugging code that uses `inline` can be confusing because in the debug symbols, the inlined code is treated as if it was inlined at the call site. As a consequence, it's not possible to step over the call site, like you could at a regular call site. You also cannot step out of the inlined code for the same reason. If you try to step out of the inlined code, you are stepping out of the caller because the caller hasn't called the other code, it's inlined instead. Furthermore, there's no separate variable scope for the inlined scope, the inlined scope is merged with the caller's scope.

## Emulicious

[Emulicious](https://emulicious.net/) is a free to use multi-system emulator for Windows, Linux, Raspberry Pi OS, Mac OS(X) and any other operating system supporting Java SE.

It is focused on reverse-engineering, ROM hacking and development. For that it provides several tools such as a debugger with a smart disassembler (splitting code from data).

Emulicious emulates the Game Boy and Game Boy Color, the MSX1 and the Master System and the Game Gear.

## Release Notes

### 1.3.0

Added an error message if no port is specified

Added `system` for launch configurations to specify the system to emulate

Fixed typos in some error messages

### 1.2.0

Added `maxAttempts` to specify the number of attempts when trying to connect to Emulicious after launching it

Added `host` to specify the host to connect to

### 1.1.2

Added fallback to run Emulicious from PATH if `emuliciousPath` is not set

### 1.1.1

Fixed unnecessary delays caused by stdio

### 1.1.0

Added support for launching Emulicious from VS Code

Added `emuliciousPath` to specify the path to Emulicious

Added `javaPath` to specify the path to Java, if another runtime should be used than the default

### 1.0.5

Added `additionalSrcFolders` property for launch configurations

Added better error message for when Emulicious is not running

README improvements

### 1.0.4

Added description of Emulicious and added gamegear keyword

### 1.0.3

Added some missing keywords and improved some screenshots

### 1.0.2

README improvements

### 1.0.0

Initial release of "emulicious-debugger"