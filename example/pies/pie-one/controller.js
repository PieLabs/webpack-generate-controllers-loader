import _ from 'lodash';

export class Controller {

  model(question, session, env){
    console.log("[pie-one controller] model");
    _.forEach([1,2,3], console.log);
  }

  outcome(question, session, env){
    console.log("[pie-one controller] outcome")
  }
}