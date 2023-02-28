import {fetchShop} from "mktg-with-google-common/api/shopClient";

type VerificationTagWindow = Window & {
    psxMktgWithGoogleControllerLink: string;
    contextPsAccounts: any;
}

const correlationId = `${Math.floor(Date.now() / 1000)}`;


document.addEventListener("load", function(){
    window.alert(`coucou ${correlationId}`);
});