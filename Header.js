import React from "react";
import Styled from "styled-components";

import Bulk from "./Bulk";

let HeaderCont  = Styled.div `width:100%;display:flex;justify-content:space-between;align-items:center; `;
let Logo        = Styled.img `width:200px;padding:50px;`;
let SearchBox   = Styled.div `position:relative;`;
let SearchImg   = Styled.img `position:absolute;width:20px;padding:9px;`;
let SearchInput = Styled.input `background-color:#000;border-radius:20px;width:300px;font-size:24px;color:#747779;border:0px;padding:4px 20px 4px 35px;outline:none;`;

class Header extends React.Component {
    render(){
        return (
            <Bulk.Consumer>
                {(app)=>{
                    return(
                        <React.Fragment>
                            <HeaderCont>
                                <div>
                                    <Logo src={require('./assets/logo.png')} alt="fikracamps logo" />
                                </div>
                                <SearchBox>
                                    <SearchImg src={require('./assets/searchlogo.png')} alt="search logo" />
                                    <SearchInput 
                                        type="search" 
                                        placeholder="search a topic" 
                                        autoComplete="off" 
                                        onKeyUp={(event)=>{app.action.onEnterKerPress(event)}} 
                                        defaultValue={app.state.SearchQuery}
                                        dir="auto" />
                                </SearchBox>
                            </HeaderCont>
                        </React.Fragment>
                    )
                }}
            </Bulk.Consumer>
        )
    }
}

export default Header;