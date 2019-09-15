import "./styles.scss"

import "reset-css"
import 'fullpage.js/dist/fullpage.css';

import fullpage from "fullpage.js"

var myFullpage = new fullpage('#fullpage', {
    licenseKey: 'YOUR_KEY_HERE',
    //Navigation
    menu: '#mainMenu',
    anchors:['amain', 'adescription', "aservices", "aadvantages", "acontacts"],
});

//methods
fullpage_api.setAllowScrolling(true);