# Sync apparatus
You might ask yourself, what could a sync apparatus possibly be?!
This sync apparatus in particular pushes lua files to ROBLOX studio.

Why? You might ask.<br>
Answer: ROBLOX itself doesn't perform with git and anything else that's not
included in ROBLOX studio itself.

# Project status
At the time of writing this, the project _somewhat_ works. As the project is a
work in progress, it is quite crusty at the moment.

# Usage
This project is build with Angular 2, fun

## Getting started

Angular likes being installed globally, so you probably should do that.
<code>npm install @angular/cli -g</code>

Getting all of the required node modules is easy, just run
<code>npm install</code>

## NPM scripts
You can run these by running npm run script_name
* <code>electron</code> Just runs electron
* <code>electron:dev</code> Runs electron with a webpack dev server running in
the background, your changes reload automagically! :)
* <code>electron:build</code> Builds the angular application and runs electron
after.
* <code>pack</code> Builds a portable windows executable

# The ROBLOX Plugin
At the moment, you have to manually install the ROBLOX plugin. You do this by
copying the <code>sync-apparatus-plugin</code> folder to <code>%LocalAppData%\\Roblox\\Plugins</code>
