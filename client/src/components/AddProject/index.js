import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { EDIT_PORTFOLIO } from "../../utils/mutations";

function AddProject(params) {
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
            flexDirection: 'column'
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
    }

    const portfolio = params.userData.portfolio[0]

    const [formState, setFormState] = useState( { projectName: '', projectUrl: '', projectPreview: ''} );
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
        const removeType = []
        payload.projects.forEach(project => {
            removeType.push({
                projectName: project.projectName, 
                projectUrl: project.projectUrl, 
                projectPreview: project.projectPreview
            })
        });
        const arr = [...removeType, formState]
        payload.projects = arr
        saveProject({
        variables: { input: { ...payload } },
        });        
        window.location.assign('/profile');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
        ...formState,
        [name]: value,
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <h2 style={styles.title}>ADD PROJECT</h2>
                <button  id="cancel" style={styles.btn}>Cancel</button>
            </div> 
            <form onSubmit={handleFormSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label htmlFor="projectName" style={styles.inputHeadings}>Project Name:</label>
                    <input
                        style={styles.btnShadow}
                        name="projectName"
                        type="text"
                        id="projectName"
                        onChange={handleChange}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label htmlFor="projectUrl" style={styles.inputHeadings}>Project URL:</label>
                    <input
                        style={styles.btnShadow}
                        name="projectUrl"
                        type="text"
                        id="projectUrl"
                        onChange={handleChange}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label htmlFor="projectPreview" style={styles.inputHeadings}>Project Preview:</label>
                    <input
                        style={styles.btnShadow}
                        name="projectPreview"
                        id="projectPreview"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-row flex-end">
                    <button type="submit" style={styles.btn}>Add project +</button>
                </div>
            </form>
        </div>
    )
}

export default AddProject