#pragma strict

function Start () {
Debug.Log(Application.persistentDataPath);
}

function Update () {
	
	if (Input.GetButtonDown("Screenshot")){
		Application.CaptureScreenshot(Application.persistentDataPath+"/"+"shot-"+System.DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss")+".png");
	}
}