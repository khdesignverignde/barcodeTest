/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Result passed to onSuccess function.
 * 
 * This is purely for docs, code completition and mocking.
 * 
 * @class {CodeScannerResult}
 */
function CodeScannerResult()
{
	/**
	 * Resulting code.
	 * @type String
	 */
	this.text = '12345-mock';
	/**
	 * Code format.
	 * @type String
	 */
	this.format = 'MOCK';
	/**
	 * Was canceled.
	 * @type Boolean
	 */
	this.cancelled = false;
}

/**
 * Simple mock-class for the BarcodeScanner PhoneGap Plugin.
 *
 * Docs:
 * <li> Plugins Basics: https://build.phonegap.com/docs/plugins-using
 * <li> BarcodeScanner usage: https://github.com/wildabeast/BarcodeScanner/blob/master/README.md
 * <li> BarcodeScanner types and functions: https://github.com/phonegap/phonegap-plugins/tree/master/iOS/BarcodeScanner
 * 
 * @note You will need to add script call to your index.html. Plugin/phonegap.js files are injected automatically by PGB.
 * 	<!-- plugin(s) -->
 * 	<!-- phonegap.js = cordova.js (file is injected automatically) -->
 * 	<script src="phonegap.js"></script>
 * 	<script src="barcodescanner.js"></script>
 *
 * Author: Maciej Jaros
 * Web: http://enux.pl/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * @class {CodeScanner}
 */
function CodeScanner()
{
	/**
	 * True if scanner is o be run in mocking mode.
	 * @type Boolean
	 */
	this.mockingEnabled = false;

	/**
	 * True if scanner is available.
	 *
	 * @readonly
	 * @type Boolean
	 */
	this.scannerAvailable = false;

	/**
	 * This is actualy a BarcodeScanner PhoneGap Plugin object. The type is for Netbeans.
	 * @type CodeScanner
	 */
	var scanner = null;
	
	/**
	 * Scanner initialization.
	 *
	 * Should be called before scanning.
	 * @returns {Boolean} true If scanner is available.
	 */
	this.init = function()
	{
		// various versions just in case...
		if ('plugins' in window && 'barcodeScanner' in window.plugins) {
			scanner = window.plugins.barcodeScanner;
		}
		else if ('barcodeScanner' in window) {
			scanner = window.barcodeScanner;
		}
		else if ('cordova' in window) {
			// barcodeScanner 1.0
			if ('plugins' in cordova && 'barcodeScanner' in cordova.plugins) {
				scanner = cordova.plugins.barcodeScanner;
			// barcodeScanner 0.7
			} else {
				scanner = cordova.require("cordova/plugin/BarcodeScanner");
			}
		}

		// ready?
		if (scanner != null) {
			this.scannerAvailable = true;
			this.mockingEnabled = false;
		}

 		// mock
		if (this.mockingEnabled) {
			this.scannerAvailable = true;
		}
		return this.scannerAvailable;
	};
	
	/**
	 * Read code from scanner
	 *
	 * @param {Function} onSuccess
	 * @param {Function} onError
	 * @returns {Boolean} true If scan was started, false if scanner is unavailable.
	 */
	this.scan = function(onSuccess, onError)
	{
		// make sure init was run
		if (!this.scannerAvailable) {
			this.init();
			if (!this.scannerAvailable) {
				return false;
			}
		}

		// mock
		if (this.mockingEnabled) {
			onSuccess(new CodeScannerResult());
			return;
		}

		// std. scan
		scanner.scan(
			/**
			 * Success.
			 * @param {CodeScannerResult} result
			 */
			function(result)
			{
				onSuccess(result);
			}
			,
			/**
			 * Fail.
			 * @param {String} error
			 */
			function(error)
			{
				if (typeof (onError) == "function") {
					onError(error);
				}
			}
		);
	};
}
window.codeScanner = new CodeScanner();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scanBarcode, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        codeScanner.init();
        
        console.log('Received Event: ' + id);
    },
    
    
    scanBarcode: function(){
        console.log('scanBarcode');
        console.log(codeScanner);
        
        var output = document.getElementById('output');
        output.innerHTML += 'mockingEnabled: ' + codeScanner.mockingEnabled + ', scannerAvailable: ' + codeScanner.scannerAvailable;
        
//        var output = document.getElementById('output');
//        
//        console.log(window.plugin);
//        
//        
//        for(var i in window){
//            output.innerHTML += i;
//            if(typeof window[i] !== 'function'){
//                output.innerHTML += ': <span style="color:red">' + window[i]+'</span>';
//            }
//            
//            output.innerHTML += '<br>';
//        }
//        
//        console.log(window.cordova);
//        console.log(cordova);
//        console.log(cordova.prototype);
//        console.log(cordova.callbacks);
        
        
        //cordova.plugins.barcodeScanner 
        //com.phonegap.plugins.barcodescanner
        codeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                      "Result: " + result.text + "\n" +
                      "Format: " + result.format + "\n" +
                      "Cancelled: " + result.cancelled);
            }, 
            function (error) {
                alert("Scanning failed: " + error); 
            }
         );
        
    }
};
