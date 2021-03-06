// global
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
// local
import { ChatService } from "../services/socket.service";
import { UtilsService } from "../services/utils.service";
import { SessionPage, InteractionTypes, EventTypes, AppConfig, UserConfig } from "../models/config";

window.addEventListener("beforeunload", function (e) {
  // Cancel the event
  e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  e.returnValue = "";
});

@Component({
  selector: "app-live-activity",
  templateUrl: "./live-activity.component.html",
  styleUrls: ["./live-activity.component.scss"],
  providers: [ChatService],
})
export class LiveActivityComponent implements OnInit, AfterViewInit {
  private subscription: Subscription = new Subscription();

  capitalize: any;
  appConfig: any;
  userConfig: any;

  unableToLoad!: boolean;
  socketConnected!: boolean;
  loadingRecommendation!: boolean;
  showingRecommendation!: boolean;
  reviewingRecommendation!: boolean;
  taskComplete!: boolean;

  assets: any;
  currentScenario!: number;
  selectedId!: number;

  constructor(
    public session: SessionPage,
    private titleService: Title,
    private chatService: ChatService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.appConfig = AppConfig; // for use in HTML
    this.userConfig = UserConfig; // for use in HTML
    this.capitalize = this.utilsService.capitalize; // for use in the HTML
  }

  // ========================= INITIALIZATION METHODS ========================

  ngOnInit(): void {
    // flags
    this.unableToLoad = true; // assume unable to load until all parameters can be verified
    this.socketConnected = false; // hide app HTML until socket connnection is established
    this.loadingRecommendation = false; // shows loading symbol while fetching recommendation
    this.showingRecommendation = false; // keep recommendation hidden until user asks for it
    this.reviewingRecommendation = false; // if user doesn't get recommendation before hitting save, this becomes true
    this.taskComplete = false; // when finished, set this to true
    // values
    this.currentScenario = 0; // scenario number => increment by 1
    this.selectedId = -1; // currently selected card's id number
    if (this.session.appOrder && this.session.appType) {
      this.userConfig[this.session.appMode].appType = this.session.appType; // set appType in user config
      switch (this.session.appMode) {
        case "practice":
          this.unableToLoad = false; // load the page!
          this.titleService.setTitle("Practice"); // set the page title
          this.chatService.connectToSocket(this); // Connect to Server to Send/Receive Messages over WebSocket
          break;
        case "hiring":
          this.unableToLoad = false; // load the page!
          this.titleService.setTitle("Hiring"); // set the page title
          this.chatService.connectToSocket(this); // Connect to Server to Send/Receive Messages over WebSocket
          break;
        case "movies":
          this.unableToLoad = false; // load the page!
          this.titleService.setTitle("Movies"); // set the page title
          this.chatService.connectToSocket(this); // Connect to Server to Send/Receive Messages over WebSocket
          break;
        default:
          this.titleService.setTitle("Error");
          break;
      }
    } else {
      this.titleService.setTitle("Error");
    }
  }

  ngAfterViewInit(): void {}

  /**
   * Called by chatService when connection is established.
   */
  socketOnConnect(): void {
    let app = this;
    // get assets from appConfig
    app.assets = app.appConfig[app.session.appMode]; // get task assets
    // subscribe to listen for interaction response coming from server
    app.subscription.add(
      app.chatService.registerEventHandler(EventTypes.INTERACTION_RESPONSE).subscribe((obj) => {
        app.socketConnected = true; // load the page!
      })
    );
    // send init message to initialize PID in server logs and load the page
    let message = app.utilsService.initializeNewMessage(app);
    message.interactionType = InteractionTypes.INITIALIZE_APP;
    app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
  }

  /**
   * Get card filenames and filepaths to populate cards on page.
   * @returns List of card objects
   */
  getCards() {
    return this.assets.scenarios[this.currentScenario].choices.map((cn: any) => ({
      id: cn,
      filepath: `${this.assets.dir}/cards/${cn}.png`,
    }));
  }

  /**
   * Gets formatted string for card element.
   * @param id Card id
   * @returns String containing id for card element.
   */
  getCardId(id: any) {
    return `card${id}`;
  }

  // =========================== INTERACTION METHODS =========================

  /**
   * Updates user config with currently selected id.
   * @param event Event object
   * @param id Card id
   */
  onSelectCard(event: any, id: any): void {
    if (!this.taskComplete) {
      let app = this;
      // set selected ID in user config
      app.selectedId = id;
      // send card clicked message
      let message = app.utilsService.initializeNewMessage(app);
      (message.interactionType = InteractionTypes.CARD_CLICKED),
        (message.currentScenario = app.currentScenario),
        (message.selectedId = app.selectedId),
        (message.recommendationShown = app.showingRecommendation);
      app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
    }
  }

  /**
   * Load recommendation element.
   */
  getRecommendation(fromClick: boolean): void {
    let app = this;
    if (fromClick) {
      // send recommendation shown interaction message
      let message = app.utilsService.initializeNewMessage(app);
      (message.interactionType = InteractionTypes.GET_RECOMMENDATION),
        (message.currentScenario = app.currentScenario),
        (message.selectedId = app.selectedId),
        (message.recommendationShown = true);
      app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
    }
    // show loading icon
    app.loadingRecommendation = true;
    // show recommendation after 3-5 seconds, randomly
    setTimeout(function () {
      app.loadingRecommendation = false; // hide loading icon
      app.showingRecommendation = true; // show recommendation
    }, Math.floor(Math.random() * (3.8 - 1.3) + 1.3 * 1000));
  }

  /**
   * Saves selection to user config and prepares next scenario.
   */
  saveSelection(): void {
    let app = this;
    const scenarios = app.assets.scenarios;
    // save selections log to user config
    app.userConfig[app.session.appMode].selections.push({
      selectedId: app.selectedId,
      botChoice: scenarios[app.currentScenario].choices[scenarios[app.currentScenario].answer],
      recommendationShown: app.showingRecommendation,
      savedAt: app.utilsService.getCurrentTime(),
    });
    // send selection saved interaction message
    let message = app.utilsService.initializeNewMessage(app);
    (message.interactionType = InteractionTypes.SAVE_SELECTION),
      (message.currentScenario = app.currentScenario),
      (message.selectedId = app.selectedId),
      (message.recommendationShown = app.showingRecommendation);
    app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
    // reset current selection
    app.selectedId = -1;
    if (!app.showingRecommendation) {
      // force user to review recommendation
      app.reviewingRecommendation = true;
      app.getRecommendation(false);
    } else {
      // move on to the next round
      app.nextRound();
    }
  }

  nextRound(): void {
    let app = this;
    if (app.currentScenario == app.assets.scenarios.length - 1) {
      app.taskComplete = true; // last scenario reached => enable Finish button
    } else {
      if (app.reviewingRecommendation) {
        // continue button clicked => send interaction message to server
        let message = app.utilsService.initializeNewMessage(app);
        (message.interactionType = InteractionTypes.CONTINUE),
          (message.currentScenario = app.currentScenario),
          (message.selectedId = app.selectedId),
          (message.recommendationShown = app.showingRecommendation);
        app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
      }
      // reset recommendations and get next scenario
      app.reviewingRecommendation = false;
      app.showingRecommendation = false;
      app.currentScenario++;
    }
  }

  // ============================== PAGE METHODS =============================

  /**
   * Moves the application to the next page.
   */
  next() {
    let app = this;
    // send app closed message
    let message = app.utilsService.initializeNewMessage(app);
    message.interactionType = InteractionTypes.CLOSE_APP;
    app.chatService.sendMessage(EventTypes.ON_INTERACTION, message);
    // save message to save selection logs
    app.chatService.sendMessage(EventTypes.SAVE_SELECTION_LOG, {
      log: app.userConfig[app.session.appMode],
      pid: app.session.participantId,
    });
    // unsubscribe from any event listener streams registered
    app.subscription.unsubscribe();
    // disconnect from socket
    app.chatService.disconnectFromSocket();
    // Record page complete timestamp
    switch (app.session.appMode) {
      case "practice":
        app.session.live_practice.complete(new Date().getTime());
        break;
      case "hiring":
        app.session.live_hiring.complete(new Date().getTime());
        break;
      case "movies":
        app.session.live_movies.complete(new Date().getTime());
        break;
    }
    // Move on to the next page
    let idx = app.session.appOrder.indexOf(app.session.appMode); // get current index of current appMode
    if (idx == 0) {
      // finished practice mode => move on to pre-survey
      app.router.navigateByUrl("/pre-survey");
    } else if (idx < app.session.appOrder.length - 1) {
      // still have tasks to do => to the next task page
      app.session.appMode = app.session.appOrder[idx + 1]; // get next appMode in the list
      app.router.navigateByUrl(`/task-${app.session.appMode}`);
    } else {
      // reached the final task => move on to post-survey
      app.router.navigateByUrl("/post-survey");
    }
  }
}
