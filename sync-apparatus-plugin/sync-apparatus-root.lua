local plugin = PluginManager():CreatePlugin()
local toolbar = plugin:CreateToolbar("Sync apparatus")

local CONFIG = {
	HTTP_HOSTNAME = "localhost",
	HTTP_PORT = 2020,
	HTTP_PROTOCOL = "http",
}

local SERVICES = {
	HttpService = game:GetService("HttpService"),
	CoreGui = game:GetService("CoreGui"),
	Selection = game:GetService("Selection"),
}

local buttons = {
	Run = toolbar:CreateButton("Interface with the sync apparatus", "Start ze sync apparatus", "appbar.tree.pine.png"),
	ToLocalScript = toolbar:CreateButton("Morph a script to a LocalScript", "Morph to LocalScript", "script_code.png"),
	ToScript = toolbar:CreateButton("Morph a script to a Script", "Morph to Script", "script_code_red.png"),
}

local og_print = print
local og_warn = warn
local fmt_string = "sync-apparatus-ui :: %s"

local function print(...)
	local tab = {}
	for k, v in pairs({ ... }) do
		tab[k] = tostring(v)
	end

	local str = fmt_string:format(table.concat(tab, " "))
	og_print(str)
end

local function warn(...)
	local tab = {}
	for k, v in pairs({ ... }) do
		tab[k] = tostring(v)
	end

	local str = fmt_string:format(table.concat(tab, " "))
	og_warn(str)
end

local e = {
	New = (function(_, className)
		return function(classData)
			local object = Instance.new(className)
			for k,v in pairs(classData) do
				object[k] = v
			end

			return object
		end
	end),
	Apply = (function(_, object)
		return function(classData)
			for k,v in pairs(classData) do
				object[k] = v
			end

			return object
		end
	end),
	Clone = (function(_, object)
		return function(classData)
			object = object:Clone()
			for k,v in pairs(classData) do
				object[k] = v
			end

			return object
		end
	end)
}

e.String = {
	Trim = (function(_, input)
		return string.match(input, "^%s*(.-)%s*$")
	end),
	Split = (function(_, inputstr, sep)
		if (not sep) then sep = "%s"; end
		local t = {}
		for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
			table.insert(t, str)
		end
		return t
	end),
}

urls = setmetatable({
	MakeBaseURL = (function(t)
		return string.format("%s://%s:%d/", CONFIG.HTTP_PROTOCOL, CONFIG.HTTP_HOSTNAME, CONFIG.HTTP_PORT)
	end),
}, {
	__index = (function(t, k)
		return t:MakeBaseURL() .. tostring(k)
	end),
})

Interface = {
	New = (function(this)
		local interface = {}
		local roots = { "sync-apparatus-ui" }

		interface["sync-apparatus-ui"] = e:New "ScreenGui" {
			Archivable = true,
			Name = "sync-apparatus-ui",
			Enabled = false,
		}

		interface["sync-apparatus-ui.ConnectionFrame"] = e:New "Frame" {
			Parent = interface["sync-apparatus-ui"],
			Style = Enum.FrameStyle.Custom,
			Active = true,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0.20000000298023,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0.5, -110, 0.5, -50),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(0, 220, 0, 100),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "ConnectionFrame",
		}

		interface["sync-apparatus-ui.ConnectionFrame.Port"] = e:New "TextBox" {
			Parent = interface["sync-apparatus-ui.ConnectionFrame"],
			ClearTextOnFocus = true,
			MultiLine = false,
			Font = Enum.Font.Legacy,
			FontSize = Enum.FontSize.Size8,
			Text = "2020",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			Active = true,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0,
			BorderColor3 = Color3.new(1, 1, 1),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 150, 0, 40),
			Rotation = 0,
			Selectable = true,
			Size = UDim2.new(0, 60, 0, 20),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "Port",
		}

		interface["sync-apparatus-ui.ConnectionFrame.TextLabel"] = e:New "TextLabel" {
			Parent = interface["sync-apparatus-ui.ConnectionFrame"],
			Font = Enum.Font.Legacy,
			FontSize = Enum.FontSize.Size8,
			Text = "Confirm your connection information",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			Active = true,
			BackgroundColor3 = Color3.new(0.63921570777893, 0.63529413938522, 0.64705884456635),
			BackgroundTransparency = 1,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 10, 0, 10),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(0, 200, 0, 20),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "TextLabel",
		}

		interface["sync-apparatus-ui.ConnectionFrame.Cancel"] = e:New "TextButton" {
			Parent = interface["sync-apparatus-ui.ConnectionFrame"],
			Font = Enum.Font.Legacy,
			FontSize = Enum.FontSize.Size8,
			Text = "Cancel",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			AutoButtonColor = true,
			Modal = false,
			Selected = false,
			Style = Enum.ButtonStyle.Custom,
			Active = true,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0,
			BorderColor3 = Color3.new(1, 1, 1),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 60, 0, 70),
			Rotation = 0,
			Selectable = true,
			Size = UDim2.new(0, 70, 0, 20),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "Cancel",
		}

		interface["sync-apparatus-ui.ConnectionFrame.OK"] = e:New "TextButton" {
			Parent = interface["sync-apparatus-ui.ConnectionFrame"],
			Font = Enum.Font.Legacy,
			FontSize = Enum.FontSize.Size8,
			Text = "OK",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			AutoButtonColor = true,
			Modal = false,
			Selected = false,
			Style = Enum.ButtonStyle.Custom,
			Active = true,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0,
			BorderColor3 = Color3.new(1, 1, 1),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 140, 0, 70),
			Rotation = 0,
			Selectable = true,
			Size = UDim2.new(0, 70, 0, 20),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "OK",
		}

		interface["sync-apparatus-ui.ConnectionFrame.Host"] = e:New "TextBox" {
			Parent = interface["sync-apparatus-ui.ConnectionFrame"],
			ClearTextOnFocus = true,
			MultiLine = false,
			Font = Enum.Font.Legacy,
			FontSize = Enum.FontSize.Size8,
			Text = "localhost",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			Active = true,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0,
			BorderColor3 = Color3.new(1, 1, 1),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 10, 0, 40),
			Rotation = 0,
			Selectable = true,
			Size = UDim2.new(0, 130, 0, 20),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "Host",
		}

		interface["sync-apparatus-ui.LogFrame"] = e:New "Frame" {
			Parent = interface["sync-apparatus-ui"],
			Style = Enum.FrameStyle.Custom,
			Active = false,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = 0.20000000298023,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 0, 0, 0),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(0, 150, 1, 0),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "LogFrame",
		}

		interface["sync-apparatus-ui.LogFrame.Header"] = e:New "TextLabel" {
			Parent = interface["sync-apparatus-ui.LogFrame"],
			Font = Enum.Font.SourceSans,
			FontSize = Enum.FontSize.Size14,
			Text = "Sync apparatus log",
			TextColor3 = Color3.new(1, 1, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			Active = false,
			BackgroundColor3 = Color3.new(1, 1, 1),
			BackgroundTransparency = 1,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 0, 0, 0),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(1, 0, 0, 25),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "Header",
		}

		interface["sync-apparatus-ui.LogFrame.List"] = e:New "Frame" {
			Parent = interface["sync-apparatus-ui.LogFrame"],
			Style = Enum.FrameStyle.Custom,
			Active = false,
			BackgroundColor3 = Color3.new(1, 1, 1),
			BackgroundTransparency = 1,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 0, 0, 35),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(1, 0, 1, -50),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "List",
		}

		interface["UIListLayout"] = e:New "UIListLayout" {
			Parent = interface["sync-apparatus-ui.LogFrame.List"],
			Padding = UDim.new(0, 0),
		}

		interface["sync-apparatus-ui.Template"] = e:New "Frame" {
			Parent = interface["sync-apparatus-ui"],
			Style = Enum.FrameStyle.Custom,
			Active = false,
			BackgroundColor3 = Color3.new(1, 1, 1),
			BackgroundTransparency = 0,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0, 0, 0, 0),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(0, 0, 0, 0),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = false,
			ZIndex = 1,
			Archivable = true,
			Name = "Template",
		}

		interface["sync-apparatus-ui.Template.LogItem"] = e:New "TextLabel" {
			Parent = interface["sync-apparatus-ui.Template"],
			Font = Enum.Font.SourceSans,
			FontSize = Enum.FontSize.Size14,
			Text = "Label",
			TextColor3 = Color3.new(0.50980395078659, 0.79607850313187, 1),
			TextScaled = false,
			TextStrokeColor3 = Color3.new(0, 0, 0),
			TextStrokeTransparency = 1,
			TextTransparency = 0,
			TextWrapped = false,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			Active = false,
			BackgroundColor3 = Color3.new(1, 1, 1),
			BackgroundTransparency = 1,
			BorderColor3 = Color3.new(0.10588236153126, 0.16470588743687, 0.20784315466881),
			BorderSizePixel = 1,
			ClipsDescendants = false,
			Draggable = false,
			Position = UDim2.new(0.050000000745058, 0, 0, 0),
			Rotation = 0,
			Selectable = false,
			Size = UDim2.new(1, 0, 0, 25),
			SizeConstraint = Enum.SizeConstraint.RelativeXY,
			Visible = true,
			ZIndex = 1,
			Archivable = true,
			Name = "LogItem",
		}


		return interface
	end),
	Init = (function(this, ie)
		if(e ~= ie and ie)then
			e = ie
		end

		return this
	end),
}

buttons.ToLocalScript.Click:Connect(function()
	local results = {}

	for _, v in pairs(SERVICES.Selection:Get()) do
		if (v.ClassName:lower():find("script")) then
			local newInstance = e:New "LocalScript" {
				Parent = v.Parent,
				Source = v.Source,
				Name = v.Name,
			}
			for _, x in pairs(v:GetChildren()) do
				x.Parent = v
			end

			table.insert(results, newInstance)

			v:Destroy()
		end
	end

	SERVICES.Selection:Set(results)
end)

buttons.ToScript.Click:Connect(function()
	local results = {}

	for _, v in pairs(SERVICES.Selection:Get()) do
		if (v.ClassName:lower():find("script")) then
			local newInstance = e:New "Script" {
				Parent = v.Parent,
				Source = v.Source,
				Name = v.Name,
			}
			for _, x in pairs(v:GetChildren()) do
				x.Parent = v
			end

			table.insert(results, newInstance)

			v:Destroy()
		end
	end

	SERVICES.Selection:Set(results)
end)

buttons.Run.Click:Connect(function()
	toggleInterface()
end)

local currentInterface, logItemTemplate;

function enableInterface()
	if (currentInterface["sync-apparatus-ui"]) then
		currentInterface["sync-apparatus-ui"].Enabled = true
	end
end

function disableInterface()
	if (currentInterface["sync-apparatus-ui"]) then
		currentInterface["sync-apparatus-ui"].Enabled = false
	end
end

function setConnectionFrame(b)
	if (currentInterface["sync-apparatus-ui"]) then
		currentInterface["sync-apparatus-ui"].ConnectionFrame.Visible = b
	end
end

function toggleInterface()
	if (currentInterface["sync-apparatus-ui"]) then
		currentInterface["sync-apparatus-ui"].Enabled = not currentInterface["sync-apparatus-ui"].Enabled
	end
end

function getInterfaceInput()
	if (not currentInterface["sync-apparatus-ui"]) then
		return warn("Sync apparatus ui went missing?!")
	end

	local host = currentInterface["sync-apparatus-ui"].ConnectionFrame.Host
	local port = currentInterface["sync-apparatus-ui"].ConnectionFrame.Port

	if (host and port) then
		host, port = host.Text, port.Text

		port = tonumber(port)
		if (not port) then
			return warn("Invalid port input")
		end

		return host, port
	end

	warn("Something happened")
end

local currentLogItems = {}
function addLogItem(item)
	if (currentInterface and logItemTemplate) then
		local logItem = e:Clone(logItemTemplate) {
			Parent = currentInterface["sync-apparatus-ui.LogFrame.List"],
			Text = tostring(item),
		}

		table.insert(currentLogItems, logItem)
		if (#currentLogItems > 30) then
			currentLogItems[1]:Destroy()
			table.remove(currentLogItems, 1)
		end
	end
end

function httpGet(url)
	local content = ""

	local win = pcall(function()
		content = SERVICES.HttpService:GetAsync(url)
	end)

	if (content) then
		pcall(function()
			local json = SERVICES.HttpService:JSONDecode(content)
			if (json) then
				content = json
			end
		end)
	end

	return content, win
end

function httpPost(url, data, headers)
	local response = ""

	local data = SERVICES.HttpService:JSONEncode(data)

	local win = pcall(function()
		response = SERVICES.HttpService:PostAsync(
			url,
			data,
			Enum.HttpContentType.ApplicationJson,
			false,
			headers
		)
	end)

	return response, win
end

local API = {
	Poll = (function()
		return httpGet(urls.poll)
	end),
	GetChanges = (function()
		return httpGet(urls.changes)
	end),
	TakeChanges = (function()
		return httpGet(urls["changes/take"])
	end),
	GetStructure = (function()
		return httpGet(urls.structure);
	end),
	ResolveChanges = (function(_, changeIds)
		local n, win = httpPost(urls["changes/resolve"], changeIds)
		n  = tonumber(n)
		if (not n) then
			n = 0
		end

		return n, win
	end)
}

function makeInterface()
	currentInterface = Interface:New()

	local root = currentInterface["sync-apparatus-ui"]
	root.Parent = SERVICES.CoreGui
	logItemTemplate = root.Template.LogItem

	root.ConnectionFrame.OK.MouseButton1Click:Connect(function()
		local host, port = getInterfaceInput()
		CONFIG.HTTP_HOSTNAME = host
		CONFIG.HTTP_PORT = port

		setConnectionFrame(false)

		local content, win = API:Poll()
		if (not win) then
			warn("Don't forget to enable HttpService!")
		end
		runSync()
	end)

	root.ConnectionFrame.Cancel.MouseButton1Click:Connect(function()

	end)
end

function folderToModule(input)
	local instance = e:New "ModuleScript" {
		Parent = input.Parent,
		Name = input.Name
	}

	for _, v in pairs(input:GetChildren()) do
		v.Parent = instance
	end

	input:Destroy(); input = nil
	return instance
end

local FS = {
	Root = game,
	Mapping = {},

	ResolveMapping = (function(this, path)
		local morphed = path

		for _, t in pairs(this.Mapping) do
			if (path:sub(1, t.source:len()) == t.source) then
				morphed = t.target .. path:sub(t.source:len() + 1)
			end
		end

		return morphed
	end),

	Resolve = (function(this, path, root)
		local instance = root or this.Root

		path = this:ResolveMapping(path)

		local matcha = path:match("(.*)%.lua")
		if (matcha) then
			path = matcha
		end

		for _,sub in pairs(e.String:Split(path, "/")) do
			if (sub ~= "") then
				instance = instance:FindFirstChild(sub)
				if (not instance) then
					break
				end
			end
		end

		return instance
	end),
	MKDirs = (function(this, path, root)
		local instance = root or this.Root

		local resolve = this:Resolve(path)
		if (resolve) then
			return resolve
		end

		path = this:ResolveMapping(path)

		for _,sub in pairs(e.String:Split(path, "/")) do
			if (sub ~= "") then
				if (not instance:FindFirstChild(sub)) then
					instance = e:New "Folder" {
						Name = sub,
						Parent = instance
					}
				else
					instance = instance:FindFirstChild(sub)
				end

				if (not instance) then break; end
			end
		end

		return instance
	end),
	MKFile = (function(this, path, root)
		local instance = root or this.Root

		path = this:ResolveMapping(path)

		local resolve = this:Resolve(path, root)
		if (resolve) then
			if (resolve:IsA("Folder")) then
				return folderToModule(resolve)
			end

			if (resolve.ClassName:lower():find("script")) then
				return resolve
			end

			warn(("Attempted to make file %s, but is was already an incompatible type"):format(path))
			return nil
		end

		local split = e.String:Split(path, "/")
		if (#split < 2) then
			return nil
		end

		for i = 1, #split - 1, 1 do
			if (split[i] ~= "") then
				instance = instance:FindFirstChild(split[i])
				if (not instance) then
					warn(("File %s led to a dead end"):format(path))
					return nil
				end
			end
		end

		instance = e:New "ModuleScript" {
			Parent = instance,
			Name = tostring(split[#split])
		}

		return instance
	end),
	RMFile = (function(this, path, root)
		if (not root) then root = this.Root; end

		path = this:ResolveMapping(path)

		local instance = this:Resolve(path, root)
		if (instance) then
			instance:Destroy()
			return true
		end

		return false
	end),
	SetMapping = (function(this, mapping)
		this.Mapping = mapping
	end),
}

function makeStructure(structure)
	for _,folder in pairs(structure) do
		local instance = FS:MKDirs(folder)
		if (not instance) then
			warn(("Failed to create folder %s"):format(folder))
		end
	end
end

function getContent(changes, change)
	local idx = nil

	for k, v in pairs(changes.index) do
		if (v == change.id) then
			idx = k
		end
	end

	if (idx) then
		return changes.contents[idx]
	end

	return ""
end

function applyChanges(changeInfo, changes)
	local resolved = {}

	for _,change in pairs(changeInfo) do
		print("Applying change " .. tostring(change.id))
		print("isDirectory : " .. tostring(change.isDirectory))
		print("isFile : " .. tostring(change.isFile))
		print("deleted : " .. tostring(change.deleted))
		print("relative : " .. tostring(change.relative))

		local path, ext = change.relative:match("^(.*)(%..+)$")
		if (change.deleted) then
			if (path and ext) then
				FS:RMFile(path)
			else
				print("DELETING DIRECTORY " .. change.relative)
				FS:RMFile(change.relative)
			end

			table.insert(resolved, change.id)
		else
			if (change.isFile and path and ext and tostring(ext):lower() == ".lua") then
				local file = FS:MKFile(path)
				if (file) then
					file.Source = getContent(changes, change)
					table.insert(resolved, change.id)
				end

				local sfilename = e.String:Split(change.relative, "/")
				if (#sfilename > 0) then
					local filename = sfilename[#sfilename]
					addLogItem(filename)
				end
			end
		end
	end

	return resolved
end

function doStuff()
	local poll, win = API:Poll()
	if (not win) then return; end

	local structure, win = API:GetStructure()
	if (not win) then return; end

	if (poll.mapping) then
		FS:SetMapping(poll.mapping)
	end

	makeStructure(structure)

	if (poll.nchanges > 0) then

		local changeInfo, win = API:GetChanges()
		if (not win) then return; end

		local changes, win = API:TakeChanges()
		if (not win) then return; end

		local resolvedChanges = applyChanges(changeInfo, changes)
		local chnum, win = API:ResolveChanges(resolvedChanges)
		if (not win) then return; end
	end
end

local running = false
function runSync()
	running = true
	spawn(function()
		while (wait(1) and running) do
			doStuff()
		end
	end)
end

function stopSync()
	running = false
end

makeInterface()
