// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { MakeReservationDialog } = require('./componentDialogs/makeReservationDialog');

class RESTUARANTBOT extends ActivityHandler {
    constructor(conversationState,userState) {
        super();

        this.conversationState=conversationState;
        this.userState=userState;
        this.dialogState=conversationState.createProperty("dialogState");
        this.makeReservationDialog = new MakeReservationDialog(this.conversationState,this.userState);
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            await this.dispatchToIntentAsync(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    

        this.onMembersAdded(async (context, next) => {
            await this.SendWelcomeMessage(context);
        
        // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

        async SendWelcomeMessage(turncontext)
        {
            const {activity} =turncontext;
            //iterate over new members added
            for (const idx in activity.membersAdded)
            {
                if(activity.membersAdded[idx].id!==activity.recipient.id)
                {
                    const welcomeMessage=`Welcome to Restuarant Reservation Bot ${activity.membersAdded[idx].name}.`;
                    await turncontext.sendActivity(welcomeMessage);
                    await this.SendSuggestedActions(turncontext);
                }
            }

        }
    async SendSuggestedActions(turncontext) {
        var reply=MessageFactory.suggestedActions(['Make Reservation','Cancel Reseravtion','Restuarant Address'],'What would you like to do');
        await turncontext.sendActivity(reply);
    }
    async dispatchToIntentAsync(context)
    {
        switch(context.activity.text)
        {
            case 'Make Reservation':
                await this.makeReservationDialog.run(context,this.dialogState);
                break;
      
            default:
                console.log("did not match Make Reservation case")
                break;
            }
    }
    
}

module.exports.RESTUARANTBOT = RESTUARANTBOT;

