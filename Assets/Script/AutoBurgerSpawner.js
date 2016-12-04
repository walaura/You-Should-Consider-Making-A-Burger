#pragma strict

private var parts = ['Cheese','Lettuce','Patty','Tomato'];

public var height:int = 0;
public var targetHeight:int = 0;


function Start() {
	doot();
}

function Update() {
	if (Input.GetButtonDown("Jump")){
		for (var child:Transform in transform) {
			GameObject.Destroy(child.gameObject);
		}
		doot();
	}
	if (Input.GetButtonDown("Add")){
		doot();
	}
}

function doot() {
	height = 0;
	targetHeight = Random.Range(3,12);
	spawn();

	for(var i = 0;i < targetHeight; i++) {
		spawn();
	}
}

function spawn() {
	var part;
	if(height <= 0) {
		part = 'Bottom';
	}
	else if (height >= targetHeight) {
		part = 'Top';
	}
	else {
		part = parts[Random.Range(0,parts.Length)];
	}

	var item = Resources.Load("Burger/"+part, GameObject);

    var hangingItem = Instantiate(item, gameObject.transform.position + Vector3(0,height,0), Quaternion.identity, gameObject.transform);

	var euler = hangingItem.transform.eulerAngles;
	euler.y = Random.Range(0.0, 360.0);
	hangingItem.transform.eulerAngles = euler;

	hangingItem.AddComponent.<Rigidbody>();
	hangingItem.GetComponent.<Rigidbody>().mass = .000000001;

    height++;

}