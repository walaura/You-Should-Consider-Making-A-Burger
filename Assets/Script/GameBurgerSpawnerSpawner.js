#pragma strict

public var hud:GameObject;
public var floor:GameObject;
public var uiDead:GameObject;
public var uiGood:GameObject;
public var mainAudio:AudioSource;

private var velocity = 0f;
private var interactive = false;

private var formerSpawner:GameObject;
private var activeSpawner:GameObject;

private var uiStreak:UnityEngine.UI.Text;
private var uiFinishable:UnityEngine.UI.Text;
private var uiStreakPanel:GameObject;
private var uiScoreboard:UnityEngine.UI.Text;
private var uiFinalScore:UnityEngine.UI.Text;

private var audioSource:AudioSource;

public var finishableAt:int = 0;
public var score:int = 0;
public var streak = 1;

private var displace:int = 18;

function Start () {

	spawnSpawner();

	uiScoreboard = hud.transform.Find('Scoreboard').GetComponent.<UnityEngine.UI.Text>();
	uiFinishable = hud.transform.Find('Finish').GetComponent.<UnityEngine.UI.Text>();
	uiStreak = hud.transform.Find('StreakPanel/Streak').GetComponent.<UnityEngine.UI.Text>();
	uiFinalScore = uiDead.transform.Find('Score').GetComponent.<UnityEngine.UI.Text>();
	uiStreakPanel = hud.transform.Find("StreakPanel").gameObject;

	gameObject.AddComponent.<AudioSource>();
	audioSource = gameObject.GetComponent.<AudioSource>();
	audioSource.playOnAwake = false;
}

function removeSpawner() {
  	interactive = false;
	formerSpawner = activeSpawner;
	activeSpawner = null;
}

function spawnSpawner(){
  	interactive = false;
  	finishableAt = 5+streak*2;
	var item = Resources.Load("GameBurgerSpawner", GameObject);
  	var spawner = Instantiate(item, Vector3(displace,0,0), Quaternion.identity, gameObject.transform);
  	activeSpawner = spawner;
  	activeSpawner.GetComponent.<GameBurgerSpawner>().floor = floor;
  	activeSpawner.GetComponent.<GameBurgerSpawner>().finishableAt = finishableAt;
}

function Update() {

	if(formerSpawner){
		formerSpawner.transform.position.x = Mathf.SmoothDamp(
			formerSpawner.transform.position.x, 
			(displace*-1),
		    velocity, 
		    0.3
		);
		if(formerSpawner.transform.position.x <= (displace-1)*-1) {
			interactive = true;
			GameObject.Destroy(formerSpawner);
			formerSpawner = null;
		}
	}
	if(activeSpawner){

		mainAudio.pitch = 1.0f + (activeSpawner.GetComponent.<GameBurgerSpawner>().height*1.0f/50.0f) - 0.2 + streak*1.0f/10;

		uiScoreboard.text = 
		(score + activeSpawner.GetComponent.<GameBurgerSpawner>().height * streak).ToString();
		activeSpawner.transform.position.x = Mathf.SmoothDamp(
			activeSpawner.transform.position.x, 
			0,
		    velocity, 
		    0.3
		);
		if(activeSpawner.transform.position.x <= 1) {
			interactive = false;
			uiGood.SetActive(false);
		}
		if(activeSpawner && activeSpawner.GetComponent.<GameBurgerSpawner>().lost == true) {
			score += activeSpawner.GetComponent.<GameBurgerSpawner>().height * streak;
			uiFinalScore.text = score+ ' POINTS';

			var params = System.Collections.Generic.Dictionary.<System.String, System.Object>();

			params.Add("score",score);
			UnityEngine.Analytics.Analytics.CustomEvent("gameOver", params);

			removeSpawner();
			streak = 1;
			score = 0;
			uiDead.SetActive(true);
		}
		if(activeSpawner && activeSpawner.GetComponent.<GameBurgerSpawner>().won == true) {

			var pop = Resources.Load("yay", AudioClip);

			audioSource.PlayOneShot(pop,1);
			score += activeSpawner.GetComponent.<GameBurgerSpawner>().height * streak;
			streak++;
			removeSpawner();
			spawnSpawner();
			uiGood.SetActive(true);
			uiStreak.text = 'X'+streak;
		}
		if(activeSpawner && activeSpawner.GetComponent.<GameBurgerSpawner>().finishable === true) {
			uiFinishable.text = '[F] – COMPLETE BURGER';
			uiFinishable.enabled = true;
		}
		else if(activeSpawner && activeSpawner.GetComponent.<GameBurgerSpawner>().height > 2 && activeSpawner.GetComponent.<GameBurgerSpawner>().height - 1 < finishableAt) {
			var left = finishableAt - activeSpawner.GetComponent.<GameBurgerSpawner>().height + 1;
			uiFinishable.text = left+' more to complete';
			uiFinishable.enabled = true;
		}
		else {
			uiFinishable.enabled = false;
		}
		if(score + activeSpawner.GetComponent.<GameBurgerSpawner>().height * streak < 2) {
			uiScoreboard.enabled = false;
		}
		else {
			uiScoreboard.enabled = true;
		}
	}
	else {
		uiFinishable.enabled = false;
	}

	if(streak < 2) {
		uiStreakPanel.SetActive(false);
	}
	else {
		uiStreakPanel.SetActive(true);
	}
	if (Input.GetButtonDown("Jump") && interactive){
		uiDead.SetActive(false);
		spawnSpawner();
	}
}