import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { EDIT_PORTFOLIO } from "../../utils/mutations";


function RemoveProject(params) {
    const styles = {
        container: {
            marginTop: '5%',
            width: '100%'
          },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
        },
        title: {
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '10px',
          marginBottom: '40px',
          letterSpacing: '1.5px',
          fontFamily: 'Justink'
        },
        btn: {
          marginLeft: '5%',
          padding: '0 5px',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        inputContainer: {
            marginLeft: '5%',
            marginRight: '5%',
            display: 'flex',
        },
        inputHeadings: {
            fontWeight: 'bold',
            letterSpacing: '1px',
            fontFamily: 'Justink'
          },
        btnShadow: {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
            width: '100%'
        },
        deleteBtn: {
            border: 'none',
            textAlign: 'center',
            color: 'white',
            backgroundColor: 'red',
            borderRadius: '100%',
            height: 'fit-content',
            width: '8%',
            marginLeft: '5px',
            fontSize: '20px'
        }
    }

    const portfolio = params.userData.portfolio[0]
    console.log()

    const [formState, setFormState] = useState([]);
    const [saveProject] = useMutation(EDIT_PORTFOLIO);
    const payload = 
        { 
            portfolioStyle: portfolio.portfolioStyle, 
            name: portfolio.name, 
            contactEmail: portfolio.contactEmail,
            bio: portfolio.bio, 
            portrait: portfolio.portrait, 
            title: portfolio.title, 
            resumeUrl: portfolio.resumeUrl, 
            projects: portfolio.projects 
        }
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const keepProject = []
        payload.projects.forEach(project => {
            if (formState.indexOf(project.projectName) < 0) {
                keepProject.push({
                    projectName: project.projectName, 
                    projectUrl: project.projectUrl, 
                    projectPreview: project.projectPreview
                })
            }
        });
        const arr = [...keepProject]
        payload.projects = arr
        console.log(payload.projects)
        saveProject({
        variables: { input: { ...payload } },
        });        
        window.location.assign('/profile');
    };

    const handleChange = (event) => {
        const projectName = event.target.name
         if (event.target.checked) {
            setFormState([
                ...formState,
                projectName
            ]);
         } else {
            const arr = [...formState]
            arr.splice(arr.indexOf(projectName),1)
            setFormState([
                ...arr
            ]);
         }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <h2 style={styles.title}>DELETE PROJECT</h2>
                <button  id="cancel" style={styles.btn}>Cancel</button>
            </div> 
            <form onSubmit={handleFormSubmit} style={styles.form}>
            {portfolio.projects.map((project) => (
                <div style={styles.inputContainer} key={project.projectName}>
                    <h2 htmlFor="projectName" style={styles.inputHeadings}>{project.projectName}:</h2>
                    <input type="checkbox" name={project.projectName}  onChange={handleChange} />
                </div>
            ))}
                <div className="flex-row flex-end">
                    <button style={styles.btn}>Remove projects</button>
                </div>
            </form>
        </div>
    )
}

export default RemoveProject