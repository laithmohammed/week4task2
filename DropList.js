import React from "react";
import Styled from "styled-components";

import Bulk from "./Bulk";

let Als         = Styled.div `position:absolute;right:10%;margin-top:-4px;`;
let Dropdown    = Styled.div `position: relative;display:flex;align-items:center;`;
let SpanSort    = Styled.span `padding-left:30px;padding-right:10px;`;
let Select      = Styled.select `background-color:#000;width:200px;font-size:20px;color:white;border:0px;padding:2px 10px;outline:none;margin-right:6px;`;
let Option      = Styled.option `background-color:#f1f1f1;color:black;padding:2px 10px;`;

class DropList extends React.Component {
    render(){
        return (
            <Bulk.Consumer>
                {(app)=>{
                    return (
                        <React.Fragment>
                            <Als>
                                <Dropdown>
                                    <SpanSort>Sorted by : </SpanSort>
                                    <Select onChange={(event)=>{app.action.SortedByFun(event.target.value)}} value={app.state.ArtSortedBy}>
                                        <Option value="default" >Default</Option>
                                        <Option value="title" >Title</Option>
                                        <Option value="publishedAt" >Date</Option>
                                        <Option value="vote" >Vote</Option>
                                    </Select>
                                    <SpanSort>Article number : </SpanSort>
                                    <Select onChange={(event)=>{app.action.ArticlesNumberFun(event.target.value)}} value={app.state.ArticleNum}>
                                        <Option value="90" >90</Option>
                                        <Option value="80" >80</Option>
                                        <Option value="70" >70</Option>
                                        <Option value="60" >60</Option>
                                        <Option value="50" >50</Option>
                                        <Option value="40" >40</Option>
                                        <Option value="30" >30</Option>
                                        <Option value="20" >20</Option>
                                        <Option value="15" >15</Option>
                                        <Option value="10" >10</Option>
                                        <Option value="5" >5</Option>
                                    </Select>
                                </Dropdown>
                            </Als>
                        </React.Fragment>
                    )
                }}
            </Bulk.Consumer>
        )
    }
}

export default DropList;