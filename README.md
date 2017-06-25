# Sync apparatus
You might ask yourself, what could a sync apparatus possibly be?!
This sync apparatus in particular pushes lua files to ROBLOX studio.

Why? You might ask.<br>
Answer: ROBLOX itself doesn't perform with git and anything else that's not
included in ROBLOX studio itself.

With the sync apparatus in place, you can edit scripts outside of ROBLOX studio
using your favourite editor. Or even better, manage team projects with Git
instead of ROBLOX' horrific version management.

# Project status
At the time of writing this, the project _somewhat_ works. As the project is a
work in progress, it is quite crusty at the moment.

Release builds are available through the GitHub release page somewhere above
this readme, and should run without installing any sort of 'weird' software.

# Usage / release binary
1. Open the portable executable
2. Use the browse button to select your roblox project<br>
	2.1. Install the studio plugin locally through the settings pane,
	if you haven't yet
3. Use the studio plugin
4. ???
5. PROFIT!

Everything is synced as a ModuleScript until you transform one of them into
a Script object or a LocalScript object. The plugin does not care what it
is putting source code into, as long as it is a LuaScriptContainer.

# Usage / Development build
This project is built with Angular 2, fun. You can use the commands below to
run the development builds and hope it doesn't blow up in your face. The
development builds have the chrome debugging tools enabled.

# The ROBLOX Plugin
At the moment you have two ways of installing the ROBLOX plugin

## 1: The sensible way
The sync apparatus has a settings panel that has a button that allows you to
magically install the plugin into the right folders. You should go on an
adventure to find this button and click it. Beware: this only works with
the release builds.

## 2: If option 1 fails
The second way of installing the plugin is just by copying it over yourself.
You do this by copying the <code>sync-apparatus-plugin</code> folder to
<code>%LocalAppData%\\Roblox\\Plugins</code>

## Getting started with the development builds
The plugin installer _does not work_ in the development builds. please re-read
the plugin section :)

Angular likes being installed globally, so you probably should do that.
<code>npm install @angular/cli -g</code>

Getting all of the required node modules is easy, just run
<code>npm install</code>

## NPM scripts
You can run these by running <code>npm run script_name</code>
* <code>electron</code> Just runs electron
* <code>electron:dev</code> Runs electron with a webpack dev server running in
the background, your changes reload automagically! :)
* <code>electron:build</code> Builds the angular application and runs electron
after.
* <code>pack</code> Builds a portable windows executable
