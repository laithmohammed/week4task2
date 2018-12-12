import React from "react";
import Styled from "styled-components";

import Bulk from "./Bulk";
import News from "./News";

import Art from "./Art";

let Articales   = Styled.div `display:flex;`;
let RecentLinks = Styled.div `flex-grow:2;flex-basis:1200px;`;

class Articles extends React.Component{
    render(){
        return(
            <Bulk.Consumer>
                {(app)=>{
                    return(
                        <React.Fragment>
                            <Articales>
                                <RecentLinks>
                                    <span>Recent Links</span>
                                    <hr /><br />
                                    <main>
                                        <Art.Provider value={{ 
                                            state: { Data : app.state.Data },
                                            action: {
                                                votingFun: (e)=>{app.action.votingFun(e)}
                                            }
                                            }}>
                                            <News />
                                        </Art.Provider>
                                    </main>  
                                </RecentLinks>  
                            </Articales>
                        </React.Fragment>
                    )
                }}
            </Bulk.Consumer>
        )
    }
}
export default Articles;