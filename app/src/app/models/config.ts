// global
import { Injectable } from "@angular/core";
// local
import { UtilsService } from "../services/utils.service";
import practiceScenarios from "../../assets/practice/scenarios.json";
import hiringTask from "../../assets/hiring/task.json";
import hiringScenarios from "../../assets/hiring/scenarios.json";
import moviesTask from "../../assets/movies/task.json";
import moviesScenarios from "../../assets/movies/scenarios.json";

var UtilsServiceObj = new UtilsService();
var participantId = UtilsServiceObj.generateRandomUniqueString(12);

class PageRecord {
  completed: any;
  timestamp: any;

  constructor() {
    this.completed = false;
    this.timestamp = null;
  }

  complete(timestamp: any) {
    this.completed = true;
    this.timestamp = timestamp;
  }

  save() {
    return { completed: this.completed, timestamp: this.timestamp };
  }
}

@Injectable()
export class SessionPage {
  participantId: any;
  appOrder: any;
  appType: any;
  appMode: any;
  consent: any;
  overview: any;
  background: any;
  live_practice: any;
  presurvey: any;
  task_hiring: any;
  live_hiring: any;
  task_movies: any;
  live_movies: any;
  postsurvey: any;
  thanks: any;

  constructor() {
    // ids
    this.participantId = participantId; // 12 character long unique identifier
    // conditions
    this.appOrder = []; // Order of Tasks, e.g., {practice, hiring, movies}
    this.appType = ""; // Condition {CTRL, WTHN, BTWN, BOTH}
    // states
    this.appMode = ""; // Current Task
    // pages
    this.consent = new PageRecord();
    this.overview = new PageRecord();
    this.background = new PageRecord();
    this.live_practice = new PageRecord();
    this.presurvey = new PageRecord();
    this.task_hiring = new PageRecord();
    this.live_hiring = new PageRecord();
    this.task_movies = new PageRecord();
    this.live_movies = new PageRecord();
    this.postsurvey = new PageRecord();
    this.thanks = new PageRecord();
  }
}

export const DeploymentConfig = Object.freeze({
  SERVER_URL: "https://cs6795-group-project-server.herokuapp.com/",
  // SERVER_URL: "http://localhost:3000",
});

/**
 * INTERACTION TYPES
 */
export const InteractionTypes = Object.freeze({
  INITIALIZE_APP: "init_app",
  CARD_CLICKED: "card_clicked",
  GET_RECOMMENDATION: "get_recommendation",
  SAVE_SELECTION: "save_selection",
  CONTINUE: "continue",
  CLOSE_APP: "close_app",
});

/**
 * SERVER EVENT TYPES
 */
export const EventTypes = Object.freeze({
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SAVE_SESSION_LOG: "save_session_log",
  SAVE_SELECTION_LOG: "save_selection_log",
  GET_NEW_APP_STATE: "get_new_app_state",
  NEW_APP_STATE_RESPONSE: "new_app_state_response",
  ON_INTERACTION: "on_interaction",
  INTERACTION_RESPONSE: "interaction_response",
});

/**
 * APPLICATION-SPECIFIC SETTINGS
 */
export const AppConfig: any = {
  /**
   * Security passcodes to prevent the user from spamming the Next button.
   */
  continueCode: {
    "background-activity": "qp5mz",
    "pre-survey-activity": "8sb34",
    "post-survey-activity": "e3h0a",
  },
  /**
   * URLs for embedded Qualtrics surveys.
   */
  backgroundSurveyURL: "https://gatech.co1.qualtrics.com/jfe/form/SV_7OIzFHat7ALsmZo",
  preSurveyURL: "https://gatech.co1.qualtrics.com/jfe/form/SV_6zdbHRJf6D2NKDA",
  postSurveyURL: {
    CTRL: "https://gatech.co1.qualtrics.com/jfe/form/SV_cvxQpGOAeYHHlhY",
    WTHN: "https://gatech.co1.qualtrics.com/jfe/form/SV_0wVgA6nk0lY5x6m",
    BTWN: "https://gatech.co1.qualtrics.com/jfe/form/SV_0wVgA6nk0lY5x6m",
    BOTH: "https://gatech.co1.qualtrics.com/jfe/form/SV_0wVgA6nk0lY5x6m",
  },
  /**
   * PRACTICE MODE
   */
  practice: {
    dir: "assets/practice",
    cards: [1, 2, 3],
    scenarios: practiceScenarios,
    title: "Grocery Store",
  },
  /**
   * hiring MODE
   */
  hiring: {
    dir: "assets/hiring",
    cards: Array.apply(null, Array(50)).map(function (_, i) {
      return i + 1;
    }),
    task: hiringTask,
    scenarios: hiringScenarios,
    title: "candidate",
  },
  /**
   * movies MODE
   */
  movies: {
    dir: "assets/movies",
    cards: Array.apply(null, Array(49)).map(function (_, i) {
      return i + 1;
    }),
    task: moviesTask,
    scenarios: moviesScenarios,
    title: "movie",
  },
};

/**
 * USER-SPECIFIC SETTINGS
 */
export var UserConfig: any = {
  /**
   * PRACTICE MODE
   */
  practice: {
    participantId: participantId,
    appMode: "practice",
    appType: "",
    selections: [],
  },
  /**
   * hiring MODE
   */
  hiring: {
    participantId: participantId,
    appMode: "hiring",
    appType: "",
    selections: [],
  },
  /**
   * movies MODE
   */
  movies: {
    participantId: participantId,
    appMode: "movies",
    appType: "",
    selections: [],
  },
};
