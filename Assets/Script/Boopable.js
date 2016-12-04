#pragma strict

private var audioSource:AudioSource;
private var boop:AudioClip;
private var played:boolean = false;

function Start () {

	boop = Resources.Load("boop", AudioClip);

	gameObject.AddComponent.<AudioSource>();
	audioSource = gameObject.GetComponent.<AudioSource>();
	audioSource.playOnAwake = false;
}

function OnCollisionEnter () {
	if(!played){
		audioSource.PlayOneShot(boop,1.5f);
		played = true;
	}
}