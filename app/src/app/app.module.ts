import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ConsentActivityComponent } from "./consent-activity/consent-activity.component";
import { OverviewActivityComponent } from "./overview-activity/overview-activity.component";
import { BackgroundActivityComponent } from "./background-activity/background-activity.component";
import { PreSurveyActivityComponent } from "./pre-survey-activity/pre-survey-activity.component";
import { TaskActivityComponent } from "./task-activity/task-activity.component";
import { LiveActivityComponent } from "./live-activity/live-activity.component";
import { PostSurveyActivityComponent } from "./post-survey-activity/post-survey-activity.component";
import { ThanksActivityComponent } from "./thanks-activity/thanks-activity.component";

import { HttpErrorHandler } from "./services/http-error-handler.service";
import { MessageService } from "./services/message.service";
import { ChatService } from "./services/socket.service";
import { UtilsService } from "./services/utils.service";

import { Message } from "./models/message";
import { SessionPage, DeploymentConfig } from "./models/config";

const config: SocketIoConfig = {
  url: DeploymentConfig.SERVER_URL,
  options: { timeout: 5000, forceNew: true, autoConnect: false, withCredentials: true, transports: ["websocket"] },
};

@NgModule({
  declarations: [
    AppComponent,
    ConsentActivityComponent,
    OverviewActivityComponent,
    BackgroundActivityComponent,
    PreSurveyActivityComponent,
    TaskActivityComponent,
    LiveActivityComponent,
    PostSurveyActivityComponent,
    ThanksActivityComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, SocketIoModule.forRoot(config), NgbModule],
  providers: [
    Title,
    SessionPage,
    Message,
    HttpErrorHandler,
    MessageService,
    ChatService,
    UtilsService,
    AppComponent,
    ConsentActivityComponent,
    OverviewActivityComponent,
    BackgroundActivityComponent,
    PreSurveyActivityComponent,
    TaskActivityComponent,
    LiveActivityComponent,
    PostSurveyActivityComponent,
    ThanksActivityComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
