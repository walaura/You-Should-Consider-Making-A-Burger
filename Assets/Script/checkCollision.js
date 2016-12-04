#pragma strict

public var died:boolean = false;

function OnCollisionEnter () {
	died = true;
}