#pragma strict

private var dimension = 10;

function Start () {
	var item = Resources.Load("AutoBurgerSpawner", GameObject);

	for(var cols = 0;cols < dimension;cols++) {
		for(var rows = 0;rows < dimension;rows++) {
			Debug.Log(rows);
			Debug.Log(cols);
			var locationX = (cols - (dimension/2)) * 4;
			var locationZ = (rows - (dimension/2)) * 4;
  			var hangingItem = Instantiate(item, Vector3(locationX,0,locationZ), Quaternion.identity, gameObject.transform);
		}
	}

}

function Update () {

}