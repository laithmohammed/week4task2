import React from "react";
import ReactDOM from "react-dom";
import Styled from "styled-components";
import 'babel-polyfill';
import * as firebase from 'firebase';

import Bulk from "./Bulk";
import Header from "./Header";
import DropList from "./DropList";
import Articles from "./Articles";

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCart0L-ZH3PU1g2VJzH70yPCHWLXTu8Es",
    authDomain: "newsappexpo.firebaseapp.com",
    databaseURL: "https://newsappexpo.firebaseio.com",
    projectId: "newsappexpo",
    storageBucket: "newsappexpo.appspot.com",
    messagingSenderId: "265764513634"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);
const DataBase = firebase.firestore().collection('data');

// Encoding Article key (title+publishedAt) to avoid this symboles "/ ~ ] [ . &", those symbles not accepted as document path address
function encodingString(str){
    let encodeStr = str.toLowerCase().replace(/\]/g, "_5D").replace(/\[/g,"_5B").replace(/\//g,"_2F").replace(/\*/g,"_2A").replace(/\~/g,"_7E");
    return encodeStr;
}

//set ClientID
function setUserId(){
    let clientid = localStorage.getItem('ClientID');
    let set = true;
    if(!clientid){
        // get uniqid by check firebase user document
        do {
            let id = Math.floor(Math.random() * 10000000000);
            DataBase.doc('user').get().then(doc => {
                let data = doc.data();
                if(!data[id]){
                    let idObj = '{"'+id+'" : {}}';
                    DataBase.doc('user').update(JSON.parse(idObj));
                    localStorage.setItem("ClientID",id)
                    set = true;
                }
            })
        }while(set == false)
    }
}
setUserId();

// Body style
let Div = Styled.div `width:80%;padding:0px 10%;`;

// main class for this app
class App extends React.Component{
    constructor (){
        super();
        this.state = {
            Data:[],                // data of articles are saved here
            SearchQuery: "luffy",   // default value for input search
            ArticleNum: "5",        // default number of articles
            ArtSortedBy: "title"    // default value for sorting action
        }
    }
    // after components are mounted, try to get default article data
    componentDidMount(){
        this.getArticles(this.state.SearchQuery,this.state.ArticleNum);
    }
    // Sorting function, the Article are sorted by default, title, date and votes numbers
    MainSortedByFun(value){
        let SortedData = this.state.Data;
        let SortedWord = value;
        let x, y;
        if(!SortedWord){ SortedWord = "default"; }
        // sorting base on number from minimum value to maximum value for articles index default value
        if(SortedWord == "default"){ SortedData.sort(function(a,b){ x=a.default;y=b.default;return x - y;}); }
        // sorting according date string value from newest to oldest articles
        if(SortedWord == "publishedAt"){ SortedData.sort(function(a,b){ x=a.publishedAt.toString().toLowerCase();y=b.publishedAt.toString().toLowerCase();return x > y ? -1 : x < y ? 1 : 0;}); }
        // sorting according title string of articles from 0-9a-zA-Z
        if(SortedWord == "title"){ SortedData.sort(function(a,b){ x=a.title.toString().toLowerCase();y=b.title.toString().toLowerCase();return x < y ? -1 : x > y ? 1 : 0;}); }
        // sorting according to vote value of articles that set it within newsData array objects
        if(SortedWord == "vote"){ SortedData.sort(function(a,b){ x=a.vote;y=b.vote;return y - x;}); }
        // set status
        this.setState({ Data : SortedData, ArtSortedBy : SortedWord })
    }

    async getArticles(q,n){
        let Data     = []; //Final Atricles data saved here befor setStatus
        let query    = q;  // search query string
        let artNum   = n;  // number of required articles
        let date     = new Date();
        let clientid = localStorage.getItem('ClientID'); // get client id
        let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&from=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}&apiKey=b60f15202abc40cf895fd1162f96752b&pageSize=${artNum}`);
        let data     = await response.json();
        let len = data.articles.length;
        data.articles.map((art,i)=>{
            let Key  = art.title + art.publishedAt;
            let VoTe = 0;
            let Voted= "none";
            let encodeKey = encodingString(Key);
            DataBase.doc('article').get().then(doc => {
                let err = false;
                let ArtData = doc.data();
                // check if this is new or old article
                if(ArtData[encodeKey] !== undefined){
                    let voters = ArtData[encodeKey].voters;
                    let Result = Object.values(voters);
                    if(voters[clientid]){ Voted = voters[clientid]; } // if current client voted this articale, set it is vote value
                    Result.map((index)=>{ // count total vote value none => 0, upvote => +1, downvote => -1
                        if(index == 'upvote') { VoTe++; }
                        if(index == 'dnvote') { VoTe--; }
                    })
                }else {
                    try {
                        let Obj = `{"${encodeKey}": { "voters" : {} }}`;
                        DataBase.doc('article').update(JSON.parse(Obj));    
                    } catch (error) { err = true; } // check code lines 28 to 32
                    
                }
                if(err == false){ // if there are no errors, push article data
                    data.articles[i].default = i; // location of article as default index
                    data.articles[i].vote = VoTe; // total votes number, check code lines 114 to 117
                    data.articles[i].voted= Voted;// current client vote value, check code line 113
                    Data.push(data.articles[i])
                    if(i + 1 == len){ // at final stage
                        this.setState({ Data : Data, SearchQuery : query }) //  setStatus
                        this.MainSortedByFun(this.state.ArtSortedBy);  // sorting articles data according sorting value
                        console.log("Totlal Articles Number : " + Data.length)
                    }
                }
            });
        })
    }

    voting(e){
        let action = e.target.id.substring(0,6);
        let index  = e.target.id.substring(6);
        let Key    = e.target.title;
        let encodeKey = encodingString(Key);
        let ClientID = localStorage.getItem('ClientID');
        let count  = 0;
        DataBase.doc('article').get().then(doc => {
            let Artdata = doc.data()[encodeKey];
            let Voters  = Artdata.voters;
            if(Voters[ClientID]){
                switch (Voters[ClientID]) {
                case 'upvote':
                    if(action == 'upvote'){ alert(`you cann't make up voting more than one time !!!`) }
                    if(action == 'dnvote'){ Voters[ClientID] = 'none' }
                    break;
                case 'dnvote':
                    if(action == 'dnvote'){ alert(`you cann't make down voting more than one time !!!`) }
                    if(action == 'upvote'){ Voters[ClientID] = 'none' }
                    break;
                case 'none':
                    if(action == 'upvote'){ Voters[ClientID] = 'upvote' }
                    if(action == 'dnvote'){ Voters[ClientID] = 'dnvote' }
                    break;
                }

            }else{
                Voters[ClientID] = action;
            }
            let Obj = `{"${encodeKey}" : { "voters" : ${JSON.stringify(Voters)} }}`
            DataBase.doc('article').update(JSON.parse(Obj))
            let Result = Object.values(Voters);
            Result.map((index)=>{
                if(index == 'upvote') { count++; }
                if(index == 'dnvote') { count--; }
            })
            if(Voters[ClientID] == "none"){ document.getElementById('upvote'+index).style.backgroundColor = "silver";document.getElementById('dnvote'+index).style.backgroundColor = "silver"; }
            if(Voters[ClientID] == "upvote"){ document.getElementById('upvote'+index).style.backgroundColor = "green";document.getElementById('dnvote'+index).style.backgroundColor = "silver"; }
            if(Voters[ClientID] == "dnvote"){ document.getElementById('upvote'+index).style.backgroundColor = "silver";document.getElementById('dnvote'+index).style.backgroundColor = "green"; }
            document.getElementById('votenum'+index).innerHTML = count;
            
        })
    }

    render(){
        return (
            <Bulk.Provider value ={
                {
                    state: this.state,
                    action: {
                        onEnterKerPress: (event)=>{
                            if(event.keyCode == 13){
                                if(event.target.value.length > 0){
                                    this.getArticles(event.target.value, this.state.ArticleNum);
                                }else{ alert("type your query at search box !!!"); }
                            }
                        },
                        votingFun: (e)=>{this.voting(e)},
                        SortedByFun: this.MainSortedByFun.bind(this),
                        ArticlesNumberFun: async (value)=>{
                            this.setState({ ArticleNum : value })
                            this.getArticles(this.state.SearchQuery, value);
                        }
                    }
                }
            }>
                <Div>
                    <Header />
                    <DropList />
                    <Articles />
                </Div>
            </Bulk.Provider>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('demo')
);