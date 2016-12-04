#pragma strict

private var hit:RaycastHit = new RaycastHit();
private var y;
private var parts = ['Cheese','Lettuce','Patty','Tomato'];
private var velocity = Vector3.zero;
private var hangingItem:GameObject;
private var lastHangingItem:GameObject;
private var incoming:boolean;
private var timeLeft:float;
private var timeLeftForTop:float;
private var isTopped:boolean;
private var interactive:boolean;


private var startedFinish:boolean = false;

public var score:UnityEngine.UI.Text;
public var height:int;
public var floor:GameObject;
public var won:boolean;
public var lost:boolean;
public var finishable:boolean;
public var finishableAt:int;

private var floorScript:checkCollision;
private var audioSource:AudioSource;

function Start() {
	if(!finishableAt) {
		finishableAt = 5;
	}
	floorScript = floor.GetComponent.<checkCollision>();
	gameObject.AddComponent.<AudioSource>();
	audioSource = gameObject.GetComponent.<AudioSource>();
	audioSource.playOnAwake = false;
	restart();
}

function restart() {
	stop();
	reset();
	floorScript.died = false;
	isTopped = false;
	interactive = true;
	won = false;
	lost = false;
	height = 0;
	y = 2;
	spawn(false);
}

function stop() {
	interactive = false;
}

function reset() {
	incoming = false;
	timeLeft = 1f;
	timeLeftForTop = 2f;
	hangingItem = null;
}

function win() {
	stop();
	won = true;
}

function lose() {
	stop();
	lost = true;
}

function Update () {

	if(floorScript.died === true) {
		lose();
	}

	if(height > finishableAt && !startedFinish) {
		finishable = true;
	}

    if(hangingItem !== null) {
 		if (finishable && Input.GetButtonDown("Finish")){
 			finishable = false;
 			startedFinish = true;
 			GameObject.Destroy(hangingItem);
 			spawn(true);
		}

    	var variance = height / 2;
    	if(variance > 0) {
			hangingItem.transform.position.x = Mathf.PingPong(Time.time*variance, variance * .8) - (variance*.8)/2;
		}
		if (Input.GetButtonDown("Jump")){
			var name = hangingItem.name;
			hangingItem.AddComponent.<Rigidbody>();
			reset();
			if (name == "Top") {
				isTopped = true;
			}
			else {
				incoming = true;
			}
		}
    }

    if(incoming === true && floorScript.died === false) {
		timeLeft -= Time.deltaTime;
		if(timeLeft < 0) {spawn(false);}
    }

    if(isTopped === true && floorScript.died === false) {
		timeLeft -= Time.deltaTime;
		if(timeLeft < 0) {win();}
    }

    var velocity = 0.0f;
	Camera.main.transform.position.y = Mathf.SmoothDamp(
		Camera.main.transform.position.y, 
		lastHangingItem.transform.position.y+5,
	    velocity, 
	    0.3
	);
}

function spawn(finish:boolean) {
	incoming = false;

	var part;
	if(finish === true) {
		part = 'Top';
	}
	else if(height <= 0) {
		part = 'Bottom';
	}
	else {
		part = parts[Random.Range(0,parts.Length)];
	}

	if (Physics.Raycast(Vector3(0,y,0), Vector3.down, hit, y)){
		y = hit.point.y + 2;
	}

	var item = Resources.Load("Burger/"+part, GameObject);
	var pop = Resources.Load("pop", AudioClip);

	audioSource.PlayOneShot(pop,.125f);

    hangingItem = Instantiate(item, transform.position + Vector3(0,y,0), Quaternion.identity, gameObject.transform);
    hangingItem.name = part;
	var euler = hangingItem.transform.eulerAngles;
	euler.y = Random.Range(0.0, 360.0);
	hangingItem.transform.eulerAngles = euler;
	hangingItem.AddComponent.<Boopable>();
    lastHangingItem = hangingItem;
    if(!finish) height++;
}