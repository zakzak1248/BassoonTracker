UI.MainPanel = function(){
	var me = UI.panel(0,0,canvas.width,canvas.height,true);
	me.name = "mainPanel";
	var i;
	var trackControls = [];
	var currentView = "main";

	var mainLayout = LAYOUTS.column5;
	var tracks = getUrlParameter("tracks");
	if (tracks && tracks>4)  mainLayout = LAYOUTS.column5Full;
	if (getUrlParameter("layout")== "full") mainLayout = LAYOUTS.column5Full;
	var mainDefaultLayout = mainLayout;

	var mainBack = UI.scale9Panel(0,0,me.width,me.height,UI.Assets.panelMainScale9);
	me.addChild(mainBack);

	// menu
	var menuBackground = UI.scale9Panel(0,0,0,0,UI.Assets.menuMainScale9);
	me.addChild(menuBackground);

	var logo = UI.button();
	logo.setProperties({
		background: UI.Assets.panelInsetScale9,
		activeBackground: UI.Assets.buttonDarkScale9,
		image: cachedAssets.images["skin/logo_grey_70.png"],
		activeImage: cachedAssets.images["skin/logo_colour_70.png"]
	});
	logo.onClick = function(){
		console.error("click");
		logo.toggleActive();
		console.error(logo.isActive);
	};
	me.addChild(logo);

	//mod name
	var modNameInputBox = UI.inputbox({
		name: "modName",
		onChange: function(value){
			Tracker.getSong().title = value;
		}
	});
	me.addChild(modNameInputBox);

	// instrument listbox
	var listbox = UI.listbox();
	listbox.setItems([
		{label: "abem 1", data: 1},
		{label: "item 2", data: 2},
		{label: "item 3", data: 3}
	]);
	me.addChild(listbox);
	listbox.onClick = function(e){
		Input.setFocusElement(listbox);
		var item = listbox.getItemAtPosition(listbox.eventX,listbox.eventY);
		if (item){
			//Audio.playSample(item.data);
			Tracker.setCurrentSampleIndex(item.data);
		}
	};

	var songPanel = UI.scale9Panel(0,0,0,0,UI.Assets.panelInsetScale9);
	me.addChild(songPanel);

	var songlistbox = UI.listbox();
	songlistbox.setItems([
		{label: "00:01", data: 1}
	]);
	me.addChild(songlistbox);

	var spPlus = UI.Assets.generate("button20_20");
	spPlus.setLabel("↑");
	spPlus.onClick = function(){
		var index = songlistbox.getSelectedIndex();
		var pattern = Tracker.getSong().patternTable[index];
		pattern++;
		Tracker.updatePatternTable(index,pattern);

	};
	me.addChild(spPlus);

	var spMin = UI.Assets.generate("button20_20");
	spMin.setLabel("↓");
	spMin.onClick = function(){
		var index = songlistbox.getSelectedIndex();
		var pattern = Tracker.getSong().patternTable[index];
		if (pattern>0) pattern--;
		Tracker.updatePatternTable(index,pattern);
	};
	me.addChild(spMin);

	for (i=0;i<Tracker.getTrackCount();i++){
		trackControls[i] = UI.trackControl();
		me.addChild(trackControls[i]);
	}

	var songControl = UI.songControl();
	me.addChild(songControl);

	var patternPanel = UI.scale9Panel(0,0,0,0,UI.Assets.panelInsetScale9);
	me.addChild(patternPanel);
	var spinBoxPattern = UI.spinBox();
	spinBoxPattern.setProperties({
		name: "Pattern",
		label: "Pattern",
		value: 0,
		max: 100,
		min:0,
		font: window.fontMed,
		onChange : function(value){Tracker.setCurrentPattern(value);}
	});
	me.addChild(spinBoxPattern);

	var spinBoxPatternLength = UI.spinBox({
		value: 64,
		name: "PatternLength",
		label: "Length",
		max: 64,
		min:64,
		font: window.fontMed
	});
	me.addChild(spinBoxPatternLength);

	var spinBoxSample = UI.spinBox({
		name: "Sample",
		label: "Sample",
		value: 1,
		max: 64,
		min:1,
		font: window.fontMed,
		onChange : function(value){Tracker.setCurrentSampleIndex(value);}
	});
	me.addChild(spinBoxSample);

	var buttons = [];
	var buttonsSide = [];
	var buttonsInfo=[
		{label:"Play", onClick:function(){Tracker.playSong()}},
		{label:"Play Pattern", onClick:function(){Tracker.playPattern()}},
		{label:"Stop", onClick:function(){Tracker.stop();}},
		{label:"Disk op", onClick:function(){UI.toggleDiskOperations();}},
		//{label:"Save", oncClick:function(){Tracker.save();}},
		//{label:"Record", onClick:function(){Tracker.toggleRecord();}},
		{label:"Sample Editor", onClick:function(){UI.toggleSampleEditor();}}
	];

	for (i = 0;i<buttonsInfo.length;i++){
		var buttonInfo = buttonsInfo[i];
		var buttonElm = UI.button();
		buttonElm.info = buttonInfo;
		buttonElm.onClick =  buttonInfo.onClick;
		buttons[i] = buttonElm;
		me.addChild(buttonElm);
	}

	var buttonsSideInfo=[
		{label:"Lotus 2", onClick:function(){Tracker.load('demomods/lotus20.mod')}},
		{label:"Lotus 1", onClick:function(){Tracker.load('demomods/lotus10.mod')}},
		{label:"Stardust", onClick:function(){Tracker.load('demomods/StardustMemories.mod')}},
		{label:"Monday", onClick:function(){Tracker.load('demomods/Monday.mod')}},
		{label:"Lunatic", onClick:function(){Tracker.load('demomods/sound-of-da-lunatic.mod')}},
		{label:"Tinytune", onClick:function(){Tracker.load('demomods/Tinytune.mod')}},
		{label:"Exodus baum", onClick:function(){Tracker.load('demomods/exodus-baum_load.mod')}},
		{label:"Demomusic", onClick:function(){Tracker.load('demomods/demomusic.mod')}},
		{label:"Space Debris", onClick:function(){Tracker.load('demomods/spacedeb.mod')}},
		{label:"Test", onClick:function(){Tracker.load('demomods/vibrato.mod')}}
	];

	var sideButtonPanel = new UI.panel();
	sideButtonPanel.setProperties({
		name: "sideButtonPanel"
	});

	for (i = 0;i< buttonsSideInfo.length;i++){
		var buttonSideInfo = buttonsSideInfo[i];
		var buttonElm = UI.button();
		buttonElm.info = buttonSideInfo;
		buttonElm.onClick =  buttonSideInfo.onClick;
		buttonsSide[i] = buttonElm;
		//me.addChild(buttonElm);
		sideButtonPanel.addChild(buttonElm);
	}
	me.addChild(sideButtonPanel);

	var spinBoxSongLength = UI.spinBox({
		name: "SongLength",
		label: "SongLen",
		value: 1,
		max: 200,
		min:1,
		font: window.fontMed,
		onChange : function(value){
			var currentLength = Tracker.getSong().length;
			if (currentLength>value){
				Tracker.removeFromPatternTable();
			}else if(currentLength<value){
				Tracker.addToPatternTable();
			}

		}
	});
	me.addChild(spinBoxSongLength);

	var spinBoxBmp = UI.spinBox({
		name: "BPM",
		label: "BPM",
		value: 125,
		max: 200,
		min:30,
		font: window.fontMed,
		onChange : function(value){Tracker.setBPM(value)}
	});
	me.addChild(spinBoxBmp);

	var patternView = UI.PatternView();
	patternView.setProperties({
		name: "patternViewPanel"
	});
	me.addChild(patternView);

	var sampleView = UI.SampleView();
	sampleView.setProperties({
		name: "sampleViewPanel"
	});
	me.addChild(sampleView);

	var diskOperations = UI.DiskOperations();
	diskOperations.setProperties({
		name: "diskoperations"
	});
	me.addChild(diskOperations);

	var visualiser = UI.visualiser();

	visualiser.connect(Audio.cutOffVolume);
	visualiser.name = "mainAnalyser";
	visualiser.onClick = function(){
		visualiser.nextMode();
	};
	me.visualiser = visualiser;
	// note: don't attacj as child to main panel, this gets attached to main UI


	// events
	EventBus.on(EVENT.songPropertyChange,function(event,song){
		modNameInputBox.setValue(song.title,true);
		spinBoxSongLength.setValue(song.length,true);
	});

	EventBus.on(EVENT.sampleChange,function(event,value){
		spinBoxSample.setValue(value,true);
	});
	EventBus.on(EVENT.patternChange,function(event,value){
		spinBoxPattern.setValue(value,true);
		patternView.refresh();
	});
	EventBus.on(EVENT.patternPosChange,function(event,value){
		patternView.refresh();
	});
	EventBus.on(EVENT.cursorPositionChange,function(event,value){
		patternView.refresh();
	});
	EventBus.on(EVENT.recordingChange,function(event,value){
		patternView.refresh();
	});
	EventBus.on(EVENT.trackStateChange,function(event,state){
		// set other tracks to mute if a track is soloed
		if (state.solo && typeof state.track != "undefined"){
			for (i = 0;i< Tracker.getTrackCount();i++){
				if (i != state.track){
					trackControls[i].setProperties({mute:true});
				}
			}
		}
	});

	EventBus.on(EVENT.songPositionChange,function(event,value){
		songlistbox.setSelectedIndex(value,true);
	});
	EventBus.on(EVENT.patternTableChange,function(event,value){
		me.setPatternTable(Tracker.getSong().patternTable);
	});

	EventBus.on(EVENT.sampleChange,function(event,value){
		listbox.setSelectedIndex(value-1);
	});

	EventBus.on(EVENT.songBPMChange,function(event,value){
		spinBoxBmp.setValue(value,true);
	});

	EventBus.on(EVENT.sampleNameChange,function(event,sampleIndex){
		var sample = Tracker.getSample(sampleIndex);
		if (sample){
			var instruments = me.getInstruments();
			for (var i = 0, len = instruments.length; i<len;i++){
				if (instruments[i].data == sampleIndex){
					instruments[i].label = sampleIndex + " " + sample.name;
					UI.mainPanel.setInstruments(instruments);
					break;
				}
			}
		}
	});

	me.setLayout = function(newX,newY,newW,newH){
		me.clearCanvas();

		me.width = newW;
		me.height = newH;

		if (me.width<730){
			mainLayout = LAYOUTS.column5Full;
		}else{
			mainLayout = mainDefaultLayout;
		}

		// UI coordinates
		me.defaultMargin =  4;
		me.menuHeight = 20;

		me.controlPanelHeight = 200;
		me.equaliserPanelHeight = 60;
		me.controlBarHeight = 30;

		me.equaliserTop = me.controlPanelHeight;
		me.controlBarTop = me.equaliserTop + me.equaliserPanelHeight;
		me.patternTop = me.controlBarTop + me.controlBarHeight + 2;
		me.patternHeight = me.height - me.patternTop - me.defaultMargin;

		me.col1W = Math.floor((me.width - (6*me.defaultMargin)- 3)/5);
		me.col2W = (me.col1W*2) + me.defaultMargin;
		me.col3W = (me.col1W*3) + (me.defaultMargin*2);
		me.col4W = (me.col1W*4) + (me.defaultMargin*3);
		me.col5W = (me.col1W*5) + (me.defaultMargin*4);

		me.col1X = me.defaultMargin;
		me.col2X = (me.defaultMargin*2) + me.col1W;
		me.col3X = (me.defaultMargin*3) + (me.col1W*2);
		me.col4X = (me.defaultMargin*4) + (me.col1W*3);
		me.col5X = (me.defaultMargin*5) + (me.col1W*4);

		var patterViewWidth = me.col4W;
		var patterViewLeft = me.col2X;
		me.patternMargin = 0;
		me.patternMarginRight = 0;

		if (mainLayout == LAYOUTS.column5Full){

			patterViewWidth = me.width-14;
			patterViewLeft = 6;
			me.patternMargin = 24; // for the linenumers
			me.patternMarginRight = 16; // for the scrollbar

			me.controlPanelHeight = 240;

			me.equaliserTop = me.controlPanelHeight;
			me.controlBarTop = me.equaliserTop + me.equaliserPanelHeight;
			me.patternTop = me.controlBarTop + me.controlBarHeight + 2;
			me.patternHeight = me.height - me.patternTop - me.defaultMargin;
		}

		me.trackMargin = 4;
		me.trackWidth = (patterViewWidth - me.patternMargin - me.patternMarginRight)/Tracker.getTrackCount()-me.trackMargin;


		var spinButtonHeight = 28;
		var songPanelHeight = spinButtonHeight*3 + me.defaultMargin + 2;
		var topPanelHeight = me.controlPanelHeight - me.menuHeight - (me.defaultMargin*2);
		var buttonHeight = Math.floor(topPanelHeight/5) + 1;
		var inputBoxHeight = 20;

		var songlistboxWidth = me.col1W - 40;
		var songlistboxButtonWidth = 20;

		if (mainLayout == LAYOUTS.column5Full){
			songPanelHeight = spinButtonHeight*5 + me.defaultMargin + 2;

			var songlistboxWidth = Math.floor((me.col1W/3) * 2);
			var songlistboxButtonWidth = Math.floor(me.col1W/6);
		}



		var topRow1 = me.menuHeight + me.defaultMargin;
		var topRow2 = me.equaliserTop - songPanelHeight - me.defaultMargin;
		var topRow3 = 0;

		var layout = {
			menuBackground: me.col2W,
			logo:{
				left: me.col1X,
				width: me.col2W,
				height: topPanelHeight - songPanelHeight - me.defaultMargin,
				top: topRow1
			},
			modNameInputBox:{
				left: me.col4X,
				width: me.col2W,
				top: topRow1,
				height: inputBoxHeight
			},
			listbox:{
				left: me.col4X,
				width: me.col2W,
				height: topPanelHeight - inputBoxHeight - me.defaultMargin,
				top: me.menuHeight + me.defaultMargin + inputBoxHeight + me.defaultMargin
			},
			songPanel:{
				left: me.defaultMargin,
				top: topRow2,
				width: me.col1W,
				height: songPanelHeight
			},
			patternPanel:{
				left:me.col2X,
				top:topRow2,
				width: me.col1W,
				height:songPanelHeight
			},
			sideButtonPanel:{
				visible: true,
				left:me.col1X,
				top: me.patternTop,
				width: me.col1W,
				height:me.patternHeight
			},
			patternView:{
				left: patterViewLeft,
				top : me.patternTop,
				width: patterViewWidth,
				height: me.patternHeight
			},
			sampleView:{
				left: me.col1X,
				top : me.patternTop,
				width: me.col5W,
				height: me.patternHeight
			},
			diskOperations:{
				left: 0,
				top: 10,
				height: me.controlPanelHeight-10,
				width: me.width
			},
			songControl:{ // play/record buttons
				left: me.col1X,
				top: me.controlBarTop,
				width: me.col1W,
				height: me.controlBarHeight
			},
			spinBoxPattern:{
				left:me.col2X,
				top: topRow2 + 3,
				width: me.col1W,
				height: spinButtonHeight
			},
			spinBoxPatternLength:{
				left:me.col2X,
				top: topRow2 + spinButtonHeight + 3,
				width: me.col1W,
				height: spinButtonHeight
			},
			spinBoxSample:{
				left:me.col2X,
				top: topRow2 + (spinButtonHeight*2) + 3,
				width: me.col1W,
				height: spinButtonHeight
			},
			spinBoxSongLength:{
				left: me.defaultMargin,
				top : me.equaliserTop,
				height: spinButtonHeight,
				width: me.col1W
			},
			spinBoxBmp:{
				left: me.defaultMargin,
				top : me.equaliserTop + spinButtonHeight,
				height: spinButtonHeight,
				width: me.col1W
			},
			buttonsInfo:{
				left: me.col3X,
				top: topRow1,
				width: me.col1W,
				height:buttonHeight
			},
			buttonsSideInfo:{
				left:0,
				top: me.defaultMargin,
				width: me.col1W,
				height:buttonHeight
			}
		};

		if (mainLayout == LAYOUTS.column5Full){
			layout.sideButtonPanel.left = -500;

			layout.spinBoxSongLength.left =  me.col2X;
			layout.spinBoxSongLength.top =  topRow2 + (spinButtonHeight*3) + 3;

			layout.spinBoxBmp.left =  me.col2X;
			layout.spinBoxBmp.top =  topRow2 + (spinButtonHeight*4) + 3;

			layout.songPanel.height = songPanelHeight - me.controlBarHeight;
			layout.songControl.top = layout.songPanel.top + layout.songPanel.height;
		}

		menuBackground.setSize(layout.menuBackground ,me.menuHeight);
		mainBack.setSize(me.width,me.height);

		setDimensions(logo,layout.logo);
		setDimensions(modNameInputBox,layout.modNameInputBox);
		setDimensions(listbox,layout.listbox);

		// buttons
		for (i = 0;i<buttonsInfo.length;i++){
			var button = buttons[i];
			button.setProperties({
				left:layout.buttonsInfo.left,
				top: layout.buttonsInfo.top + (i*buttonHeight),
				width: layout.buttonsInfo.width,
				height:layout.buttonsInfo.height,
				label: button.info.label,
				textAlign:"left",
				background: UI.Assets.buttonLightScale9,
				font:window.fontMed
			});
		}

		for (i = 0;i<buttonsSideInfo.length;i++){
			var button = buttonsSide[i];
			button.setProperties({
				left:layout.buttonsSideInfo.left,
				top: (i*buttonHeight) + layout.buttonsSideInfo.top,
				width: layout.buttonsSideInfo.width,
				height:layout.buttonsSideInfo.height,
				label: button.info.label,
				textAlign:"left",
				background: UI.Assets.buttonLightScale9,
				font:window.fontMed
			});
		}

		setDimensions(sideButtonPanel,layout.sideButtonPanel);
		setDimensions(songPanel,layout.songPanel);

		//songlistbox
		songlistbox.setProperties({
			left: songPanel.left,
			top: songPanel.top,
			width: songlistboxWidth,
			height: songPanel.height,
			centerSelection: true,
			onChange: function(){
				Tracker.setCurrentSongPosition(songlistbox.getSelectedIndex());
			}
		});

		spMin.setProperties({
			left: (songPanel.left + songPanel.width) - songlistboxButtonWidth,
			top:songPanel.top + (Math.floor(songPanel.height - spPlus.height)/2),
			width: songlistboxButtonWidth,
			name:"PatternDown"
		});

		spPlus.setProperties({
			left: spMin.left - songlistboxButtonWidth,
			top:spMin.top,
			width: songlistboxButtonWidth,
			name:"PatternUp"
		});

		// controlBar
		for (i = 0;i< Tracker.getTrackCount();i++){
			trackControls[i].setProperties({
				track:i,
				left2: me["col" + (i+2) + "X"],
				left: patterViewLeft + me.patternMargin + (me.trackWidth+me.trackMargin)*i,
				top: me.controlBarTop,
				width: me.trackWidth,
				height: me.controlBarHeight
			});
		}

		setDimensions(songControl,layout.songControl);
		setDimensions(patternPanel,layout.patternPanel);

		setDimensions(spinBoxPattern,layout.spinBoxPattern);
		setDimensions(spinBoxPatternLength,layout.spinBoxPatternLength);
		setDimensions(spinBoxSample,layout.spinBoxSample);
		setDimensions(spinBoxSongLength,layout.spinBoxSongLength);
		setDimensions(spinBoxBmp,layout.spinBoxBmp);

		setDimensions(patternView,layout.patternView);
		setDimensions(sampleView,layout.sampleView);
		setDimensions(diskOperations,layout.diskOperations);

		visualiser.setProperties({
			left: patterViewLeft + me.patternMargin,
			top: me.equaliserTop,
			width: patterViewWidth - me.patternMargin - me.patternMarginRight,
			height: me.equaliserPanelHeight
		});

		me.setSize(me.width,me.height);
	};

	function setDimensions(element,properties){
		var visible = (typeof properties.visible == "boolean") ? properties.visible : true;
		if (visible){
			element.setProperties({
				left: properties.left,
				width: properties.width,
				top: properties.top,
				height: properties.height
			});
		}else{
			//element.hide();
		}
	}

	me.setLayout(0,0,me.width,me.height);


	me.setInstruments = function(items){
		listbox.setItems(items);
	};

	me.getInstruments = function(){
		return listbox.getItems();
	};

	me.setPatternTable = function(patternTable){
		var items = [];
		for (var i = 0, len = Tracker.getSong().length; i<len; i++){
			var value = patternTable[i];
			items.push({label: padd2(i) + ":" + padd2(value), data:value});
		}


		/*

		 {label: "01:01", data: 1},
		 {label: "02:01", data: 1},
		 {label: "03:04", data: 4}
		 */
		songlistbox.setItems(items);
	};

	function padd2(s){
		s = "" + s;
		if (s.length < 2){s = "0" + s}
		return s;
	}

	me.setView = function(viewName){

		//reset main
		patternView.show();
		sideButtonPanel.show();
		sampleView.hide();
		diskOperations.hide();


		if (viewName == "sample"){
			patternView.hide();
			sideButtonPanel.hide();
			sampleView.setLayout();
			sampleView.show(true,true);
		}else if(viewName == "diskop"){
			diskOperations.setLayout();
			diskOperations.refreshList();
			diskOperations.show();
		}

		currentView = viewName;
		me.refresh();
	};

	me.getCurrentView = function(){
		return currentView;
	};


	return me;


};

