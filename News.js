import React from "react";
import Styled from "styled-components";

import Art from "./Art";

let ArticaleDiv = Styled.article `display:flex;margin-bottom:20px;position:relative;box-shadow:1px 1px 20px rgba(0,0,0,0.2);border-radius:5px;padding:10px;`;
let ImgCont     = Styled.div `display:flex;flex-basis:150px;`;
let NewImg      = Styled.img `height:150px;width:150px;`;
let TextCont    = Styled.div `position:relative;padding-left:20px;padding-right:80px;`;
let Texttitle   = Styled.span `text-transform:capitalize;font-weight:bolder;display:block;font-family: 'Libre Baskerville', serif;font-size:24px;padding:0px 4px 0px 0px;color:#000;`;
let TextSpan    = Styled.span `display:block;color:silver;padding:0px 10px 0px 20px;font-family: 'Source Sans Pro', sans-serif;font-size:18px;padding-bottom:40px;`;
let TextTime    = Styled.time `position:absolute;bottom:0px;color:blue;font-family: 'Source Sans Pro', sans-serif;`;
let VoteCont    = Styled.div `position:absolute;text-align:center;right:0px;padding-right:20px;`;
let VoteUp      = Styled.img `cursor:pointer;width:30px;height:30px;background-color:silver;`;
let VoteSpan    = Styled.span `font-size:30px;font-weight:bolder;`;
let VoteDown    = Styled.img `cursor:pointer;width:30px;height:30px;background-color:silver;`;
let LinkNews    = Styled.a `text-decoration:none;`;

class News extends React.Component{
    constructor(){
        super();
        this.state = {
            Error : false
        }
    }
    render(){
        return(
            <Art.Consumer>
                {(data)=>{
                    return(
                        <React.Fragment>
                            {data.state.Data.map((article,i)=>{
                                let VoteColorUp = {backgroundColor:"silver"};
                                let VoteColorDn = {backgroundColor:"silver"};
                                if(article.voted == "upvote"){ VoteColorUp = {backgroundColor:"green"}; }
                                if(article.voted == "dnvote"){ VoteColorDn = {backgroundColor:"green"}; }
                                let uriImage = article.urlToImage;
                                if(this.state.Error == true){ uriImage = require("./assets/newspaper.png");this.state.Error = false;  }
                                if(!uriImage){ uriImage = require("./assets/newspaper.png") }
                                return (
                                    <ArticaleDiv key={i}>
                                        <ImgCont>
                                            <NewImg src={uriImage} onError={()=>{this.setState({Error : true})}} alt="news picture" />
                                        </ImgCont>
                                        <TextCont>
                                            <LinkNews href={article.url} target="_blank">
                                                <Texttitle id={'title' + i}>{article.title}</Texttitle>
                                            </LinkNews>
                                            <TextSpan>{article.description}</TextSpan>
                                            <TextTime id={"time" + i} dateTime={article.publishedAt}>{article.publishedAt}</TextTime>
                                        </TextCont>
                                        <VoteCont>
                                            <VoteUp src={require('./assets/upvote.png')} style={VoteColorUp} id={"upvote" + i}  
                                                    title={article.title + article.publishedAt} alt={article.default}
                                                    onClick={(e)=>{data.action.votingFun(e)}} />
                                            <br />
                                            <VoteSpan id={"votenum" + i}>{article.vote}</VoteSpan>
                                            <br />
                                            <VoteDown src={require('./assets/downvote.png')} style={VoteColorDn} id={"dnvote" + i}
                                                      title={article.title + article.publishedAt} alt={article.default}
                                                      onClick={(e)=>{data.action.votingFun(e)}}/>
                                        </VoteCont>
                                    </ArticaleDiv>
                                )
                            })}
                        </React.Fragment>
                    )
                }}
            </Art.Consumer>
        )
    }
}
export default News;