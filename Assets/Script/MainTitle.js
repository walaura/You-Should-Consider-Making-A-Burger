#pragma strict

public var music:GameObject;
public var spawner:GameObject;

function Start() {
	gameObject.GetComponent.<Canvas>().enabled = true;
	Camera.main.gameObject.GetComponent.<UnityStandardAssets.ImageEffects.Blur>().enabled = true;
}

function Update () {
	if (Input.GetButtonDown("Jump")){
		GameObject.Destroy(gameObject);
		Camera.main.gameObject.GetComponent.<UnityStandardAssets.ImageEffects.Blur>().enabled = false;
		music.SetActive(true);
		spawner.SetActive(true);
		GameObject.Destroy(gameObject);
	}

}