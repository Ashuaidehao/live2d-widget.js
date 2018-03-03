import { Live2DFramework } from "./lib/Live2DFramework";
import { PlatformManager } from "./PlatformManager";
import { cModel } from "./cModel";
import { cDefine } from "./cDefine";

function cManager() {
  // console.log("--> cManager()");

  this.models = [];
  this.count = -1;
  this.reloadFlg = false;

  Live2DFramework.setPlatformManager(new PlatformManager());

}

cManager.prototype.createModel = function () {

  var model = new cModel();
  this.models.push(model);

  return model;

}


cManager.prototype.changeModel = function (gl, modelurl) {
  // console.log("--> cManager.update(gl)");

  if (this.reloadFlg) {
    this.reloadFlg = false;
    this.releaseModel(0, gl);
    this.createModel();
    this.models[0].load(gl, modelurl);
  }

};


cManager.prototype.getModel = function (no) {
  // console.log("--> cManager.getModel(" + no + ")");

  if (no >= this.models.length) return null;

  return this.models[no];
};



cManager.prototype.releaseModel = function (no, gl) {
  // console.log("--> cManager.releaseModel(" + no + ")");

  if (this.models.length <= no) return;

  this.models[no].release(gl);

  delete this.models[no];
  this.models.splice(no, 1);
};



cManager.prototype.numModels = function () {
  return this.models.length;
};



cManager.prototype.setDrag = function (x, y) {
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].setDrag(x, y);
  }
}

cManager.prototype.tapEvent = function (x, y) {
  if (cDefine.DEBUG_LOG)
    console.log("tapEvent view x:" + x + " y:" + y);

  for (var i = 0; i < this.models.length; i++) {

    if (this.models[i].hitTest('head', x, y)) {

      if (cDefine.DEBUG_LOG)
        console.log("Tap face.");

      this.models[i].setRandomExpression();
    }
    else if (this.models[i].hitTest('body', x, y)) {

      if (cDefine.DEBUG_LOG)
        console.log("Tap body." + " models[" + i + "]");

      this.models[i].startRandomMotion('tap_body',
        config.reactPriorityNormal);
    }
  }

  return true;
};

export{
  cManager,
}
