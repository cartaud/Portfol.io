import React, { useState } from "react";
import { useQuery } from '@apollo/client';
import StyleOne from "../components/StyleOne";
import StyleTwo from "../components/StyleTwo";
import StyleThree from "../components/StyleThree";
import EditPortfolio from "../components/EditPortfolio";
import AddProject from "../components/AddProject";
import RemoveProject from "../components/RemoveProject";
import { Link } from "react-router-dom";

import { QUERY_ME } from '../utils/queries';

const Profile = () => {
  const styles = {
    errMsg: {
      width: '50%',
      margin: '25%',
      textAlign: 'center',
      fontSize: '20px'
    },
    link: {
      textDecoration: 'none',

      color: 'blue',
    },
    container: {
      marginTop: '45px',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    body: {
      width: '100%'
    },
    btn: {
      width: '100%'
    },
  }
    const { loading, data } = useQuery(QUERY_ME);
    const profile = data?.me || {};
    const [portfolioBody, setPortfolioBody] = useState('none');
    const [editContent, setEditContent] = useState(<button id="edit" style={styles.btn} >Edit Portfolio</button>)
    const [addProjContent, setAddProjContent] = useState(<button style={styles.btn} id="project">Add Project+</button>)
    const [shareBtn, setShareBtn] = useState(<button id="share" style={styles.btn}>Share Portfolio</button>)
    const [removeProjContent, setRemoveProj] = useState(<button style={styles.btn} id="remove">Delete Project-</button>)

    const [btnContainer, setBtnContainer] = useState({
        width: '10%',
        top: '45px'
    })

    const copyUrl = () => {
      const shareUrl = window.location.href + '/' + profile._id
      navigator.clipboard.writeText(shareUrl)
      setShareBtn('Copied to Clipboard')
    };

    if (!profile?.username) {
        return (
          <h4 style={styles.errMsg}>
            Oops, looks like you're not logged in! Click 
            <Link to="/login" style={styles.link}> here </Link>
            to log in.
          </h4>
        );
    } else if (profile.portfolio.length === 0) {
      return (
        <h4 style={styles.errMsg}>
            Looks like you haven't created a portfolio yet! Click
            <Link to="/create" style={styles.link}> here </Link>
            to get started
        </h4>
      )
    } else if (portfolioBody == 'none') {
      const portfolio = profile.portfolio[0]
      const portfolioStyle = portfolio.portfolioStyle
      
      if (portfolioStyle === 'one') {
        setPortfolioBody(<StyleOne portfolio={portfolio}/>)
      } else if (portfolioStyle === 'two') {
        setPortfolioBody(<StyleTwo portfolio={portfolio}/>)
      } else if (portfolioStyle === 'three') {
        setPortfolioBody(<StyleThree portfolio={portfolio}/>)
      } else {
        return <></>
      }
  }
    
  const btnClick = (e) => {
    if (e.target.id === "share") {
      copyUrl();
      setShareBtn(<button id="share" style={styles.btn} >Copied to Clipboard</button>)
    } else if (e.target.id === "edit") {
      setEditContent(<EditPortfolio userData={profile} />)
      setBtnContainer({
        width: '50%'
      })
      setShareBtn('')
      setAddProjContent('')
      setRemoveProj('')
    } else if (e.target.id === "project") {
      setAddProjContent(<AddProject userData={profile} />)
      setBtnContainer({
        width: '35%'
      })
      setShareBtn('')
      setEditContent('')
      setRemoveProj('')
    } else if (e.target.id === "remove") {
      setShareBtn('')
      setEditContent('')
      setAddProjContent('')
      setRemoveProj(<RemoveProject userData={profile} />)
      setBtnContainer({
        width: '30%'
      })
    } else if (e.target.id === "cancel") {
      setShareBtn(<button id="share" style={styles.btn}>Share Portfolio</button>)
      setEditContent(<button id="edit" style={styles.btn} >Edit Portfolio</button>)
      setAddProjContent(<button style={styles.btn} id="project">Add Project+</button>)
      setRemoveProj(<button style={styles.btn} id="remove">Delete Project-</button>)
      setBtnContainer({
        width: '10%'
      })
    }
      
  }

  return (
    <div style={styles.container}>
      <div style={btnContainer} onClick={btnClick}>
        <div>{shareBtn}</div>
        <div>{editContent}</div>
        <div>{addProjContent}</div>
        <div>{removeProjContent}</div>
      </div>
      <div style={styles.body}>
        {portfolioBody}
      </div>
    </div>
  )
}

export default Profile