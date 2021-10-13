const {WaterfallDialog, ComponentDialog} = require('botbuilder-dialogs');
const {ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt} = require('botbuilder-dialogs');
const {DialogSet, DialogTurnStatus} = require('botbuilder-dialogs');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'; 
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const DATETIME_PROMPT = 'DATETIME_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog ='';

class MakeReservationDialog extends ComponentDialog
{
constructor() {
    super('makeReservationDialog');
    this.addDialog(new TextPrompt(TEXT_PROMPT));
    this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT)); 
    this.addDialog(new NumberPrompt(NUMBER_PROMPT,this.noOfParticipantsValidator));
    this.addDialog(new DateTimePrompt(DATETIME_PROMPT));

    this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
        this.firstStep.bind(this),//ask confirmation from user
        this.getName.bind(this),//ask user name
        this.getNumberOfParticipants.bind(this),//ask noofparticipants
        this.getDate.bind(this),//ask date
        this.getTime.bind(this),//ask time
        this.confirmStep.bind(this),//ask for confirmation
        this.summaryStep.bind(this)//show all summary values entered by user and ask confirmation to make reservation
    ]));

   

    this.intialDialogId = WATERFALL_DIALOG;
    


}
async run(turncontext,accessor)
{
const dialogSet=new DialogSet(accessor);
dialogSet.add(this);
const dialogContext=await dialogSet.createContext(turncontext);


const results = await dialogContext.continueDialog();
if (results.status === DialogTurnStatus.empty) {
    await dialogContext.beginDialog(this.id);
}
}

async firstStep(step)
{
    //console.log(step)
    endDialog = false;
    return await step.context.prompt(CONFIRM_PROMPT, 'Would you like to make reservation?',['yes','no']);
}
async getName(step)
{
    if(step.results===true){

    
    return await step.prompt(TEXT_PROMPT,'In what name  reservation is to be made?');
}
}
async getNumberOfParticipants(step)
{
    step.values.name=step.result;
    return await step.prompt(NUMBER_PROMPT,'How many participants[0-150]?');
}
async getDate(step)
{
    step.values.noOfParticipants=step.result;
    return await step.prompt(DATETIME_PROMPT,'On which date you have to make reservation?');
}
async getTime(step)
{
    step.values.date=step.result;
    return await step.prompt(DATETIME_PROMPT,'At what time?');

}
async confirmStep(step)
{
    step.values.time=step.result;
    var msg=`You have entered following values:\n Name:${step.values.name}\nParticipants:${step.values.noOfParticipants}\nDate:${step.values.date}\nTime:${step.values.time}`;
    return await step.context.sendActivity(msg);
    return await step.prompt(CONFIRM_PROMPT,'Would you like to make reservation?',['yes','no']);
}
async summaryStep(step)
{
if (step.result===true){
//bussinesss
 await step.context.sendActivity("Reservation made successfully.You reservation id=12345")
 return await step.endDialog();
}
}
async noOfParticipantsValidator(promptContext)
{
    return promptContext.recognized.succeeded && promptContext.recognized.value>1 && promptContext.recognized.value<150;
}

}

module.exports.MakeReservationDialog=MakeReservationDialog;






