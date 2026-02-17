document.addEventListener("DOMContentLoaded", ()=>{

    //SEARCH BAR AND SUBMIT BUTTON
    const usernameInput = document.getElementById("searchBar");
    const searchButton = document.getElementById("submit");

    //MAINDATA BLOCK
    const mainDataBlock = document.querySelector(".mainData");
    mainDataBlock.classList.add("hidden");

    //RANK + CODER NAME
    const rankField = document.getElementById("rank");
    const nameFeild = document.getElementById("coderNamee");

    //ACTIVE DAYS + SOLVED PROBLEMS + MAX STREAK
    const activeDayField = document.getElementById("totalActiveDay");
    const totalSolvedField = document.getElementById("totalSolved");
    const streakField = document.getElementById("maxStreak");

    // TOTAL BLOCK [ SOLVED / TOTAL + LINE + ACCEPTANCE RATE + SOLVED PERCENTAGE + TOTAL SUBMISSION]
    const totalDivSolvedFeild = document.getElementById("totalDivSolved");
    const progressfillCSS = document.querySelector(".progress-fill");
    const accpetanceRateFeild = document.getElementById("accpetanceRate");
    const solvedPercentageFeild = document.getElementById("solvedPercentage");
    const totalSubmissionFeild = document.getElementById("totalSubmission");

    //EASY - PIE + CSS VAR + SOLVED EASY / TOTAL EASY + EASY BEAT
    const epieCSS = document.querySelector(".ePie");
    const easySolvedPercentFeild = document.getElementById("easySolvedPercent");
    const easySolvedFeild = document.getElementById("easySolved");
    const easyBeatsFeild = document.getElementById("easyBeats");

    //MED - PIE + CSS VAR + SOLVED MED / TOTAL MED + MED BEAT
    const mPieCSS = document.querySelector(".mPie");
    const medSolvedPercentFeild = document.getElementById("medSolvedPercent");
    const medSolvedFeild = document.getElementById("medSolved");
    const medBeatsFeild = document.getElementById("medBeats");

    //HARD - PIE + CSS VAR + SOLVED HARD / TOTAL HARD + HARD BEAT
    const hPieCSS = document.querySelector(".hPie");
    const hardSolvedPercentFeild = document.getElementById("hardSolvedPercent");
    const hardSolvedFeild = document.getElementById("hardSolved");
    const hardBeatsFeild = document.getElementById("hardBeats");
    

    function validateUsername(username){
        if(username === ""){
            alert("Username should not be Empty!");
            return false;
        }
        
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);

        if(!isMatching){
            alert("Invalid Username!");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        try {
            usernameInput.disabled = true;
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const proxyServer = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = "https://leetcode.com/graphql/";
            const myHeader = new Headers();
            
            myHeader.append("content-type", "application/json");

            const graphql = JSON.stringify({
                 query: "\n\
                    query fullDashboard($username: String!) {\n\
                    allQuestionsCount {\n\
                        difficulty\n\
                        count\n\
                    }\n\
                    \n\
                    matchedUser(username: $username) {\n\
                        username\n\
                        profile {\n\
                        realName\n\
                        ranking\n\
                        }\n\
                        submitStats {\n\
                        acSubmissionNum {\n\
                            difficulty\n\
                            count\n\
                            submissions\n\
                        }\n\
                        totalSubmissionNum {\n\
                            difficulty\n\
                            count\n\
                            submissions\n\
                        }\n\
                        }\n\
                        userCalendar {\n\
                        streak\n\
                        totalActiveDays\n\
                        submissionCalendar\n\
                        }\n\
                    }\n\
                    \n\
                    userProfileUserQuestionProgressV2(userSlug: $username) {\n\
                        numAcceptedQuestions { count difficulty }\n\
                        numFailedQuestions { count difficulty }\n\
                        numUntouchedQuestions { count difficulty }\n\
                        userSessionBeatsPercentage { difficulty percentage }\n\
                        totalQuestionBeatsPercentage\n\
                    }\n\
                    }\n",
                variables: {"username": `${username}`}
            });
            const requestOption = {
                method: "POST",
                headers: myHeader,
                body: graphql,
                redirect: "follow"
            }

            //const response = await fetch(proxyServer+targetUrl, requestOption);
            const response = await ffetch("/leetcode", requestOption);

            if(!response.ok){
                // throw new Error ("No User Found");
                const text = await response.text();
                console.error("Server error body:", text);
                throw new Error("Fetch failed: " + response.status); 
            }
            const dataLog = await response.json();
            console.log("Logging data: ",dataLog);

            displayUserData(dataLog);
            
        } 
        catch(error) {
            mainDataBlock.innerHTML = `<p style="color: rgb(216, 82, 4); text-shadow: 0px 0px 15px black, 0px 0px 10px rgba(128, 128, 128, 0.6); padding-bottom: 10px; font-weight: 800">|| USER NOT FOUND ||</p>`;
            //setTimeout(()=>{location.reload()}, 1000);
        }
        finally{
            usernameInput.disabled = false;
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function displayUserData(dataLog){
        mainDataBlock.classList.remove("hidden");
        /*
        =====================================
              PICKING UP DATA FROM JSON 
        =====================================
        */

        //RANK AND NAME
        const rank = dataLog.data.matchedUser.profile.ranking;
        const name = dataLog.data.matchedUser.profile.realName;

        //STREAK AND ACTIVE DAYS
        const activeDays = dataLog.data.matchedUser.userCalendar.totalActiveDays;
        const streak = dataLog.data.matchedUser.userCalendar.streak;

        //SUBMISSIONS AND ACCEPTANCE RATE
        const totalSubmission = dataLog.data.matchedUser.submitStats.totalSubmissionNum[0].submissions;
        const sucessSubmission = dataLog.data.matchedUser.submitStats.acSubmissionNum[0].submissions;
        const accepanceRate = (sucessSubmission/totalSubmission)*100;

        //TOTAL QUESTION STATS
        const allLeetQuestion = dataLog.data.allQuestionsCount[0].count;
        const allEasyQuestion = dataLog.data.allQuestionsCount[2].count;
        const allMedQuestion = dataLog.data.allQuestionsCount[3].count;
        const allHardQuestion = dataLog.data.allQuestionsCount[1].count;

        //DONE QUESTIONS STATS
        const doneAllQuestions = dataLog.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const doneEasyQuestions = dataLog.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const doneMedQuestions = dataLog.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const doneHardQuestions = dataLog.data.matchedUser.submitStats.acSubmissionNum[3].count;

        //BEAT PERCENT
        const easyBeat = dataLog.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[0].percentage;
        const medBeat = dataLog.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[1].percentage;
        const hardBeat = dataLog.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[2].percentage;

        /*
        =====================================
          PASTING TOOKED DATA INTO FRONTEND
        =====================================
        */

        //RANK + NAME
        rankField.textContent = rank;
        nameFeild.textContent = name;

        //ACTIVE DAYS + SOLVED PROBLEMS + MAX STREAK
        activeDayField.textContent = activeDays;
        totalSolvedField.textContent = doneAllQuestions;
        streakField.textContent = streak;

        // TOTAL BLOCK [ SOLVED / TOTAL + LINE + ACCEPTANCE RATE + SOLVED PERCENTAGE + TOTAL SUBMISSION]
        totalDivSolvedFeild.textContent = `${doneAllQuestions} / ${allLeetQuestion}`;
        progressfillCSS.style.setProperty("--progress-bar", `${((doneAllQuestions/allLeetQuestion)*100).toFixed(2)}%`);
        accpetanceRateFeild.textContent = `${accepanceRate.toFixed(2)} %`;
        solvedPercentageFeild.textContent = `${((doneAllQuestions/allLeetQuestion)*100).toFixed(2)} %`;
        totalSubmissionFeild.textContent = totalSubmission;

        //EASY - PIE + CSS VAR + SOLVED EASY / TOTAL EASY + EASY BEAT
        epieCSS.style.setProperty("--progress-degree", `${((doneEasyQuestions/allEasyQuestion)*100).toFixed(2)}%`);
        easySolvedPercentFeild.textContent = `${((doneEasyQuestions/allEasyQuestion)*100).toFixed(2)} %`;
        easySolvedFeild.textContent = `${doneEasyQuestions} / ${allEasyQuestion}`;
        easyBeatsFeild.textContent = easyBeat == null ? "Beats: 0%" : `Beats: ${easyBeat.toFixed(1)}%`;

        //MED - PIE + CSS VAR + SOLVED MED / TOTAL MED + MED BEAT
        mPieCSS.style.setProperty("--progress-degree", `${((doneMedQuestions/allMedQuestion)*100).toFixed(2)}%`);
        medSolvedPercentFeild.textContent = `${((doneMedQuestions/allMedQuestion)*100).toFixed(2)} %`;
        medSolvedFeild.textContent = `${doneMedQuestions} / ${allMedQuestion}`;
        medBeatsFeild.textContent = medBeat == null ? "Beats: 0%" : `Beats: ${medBeat.toFixed(1)}%`;

        //HARD - PIE + CSS VAR + SOLVED HARD / TOTAL HARD + HARD BEAT
        hPieCSS.style.setProperty("--progress-degree", `${((doneHardQuestions/allHardQuestion)*100).toFixed(2)}%`);
        hardSolvedPercentFeild.textContent = `${((doneHardQuestions/allHardQuestion)*100).toFixed(2)} %`;
        hardSolvedFeild.textContent = `${doneHardQuestions} / ${allHardQuestion}`;
        hardBeatsFeild.textContent = hardBeat == null ? "Beats: 0%" : `Beats: ${hardBeat.toFixed(1)}%`;

    }

    /* MAIN METHOD */
    searchButton.addEventListener('click', ()=>{
        const username = usernameInput.value;
        console.log("Logging Username: ",username);

       if(validateUsername(username)){
            fetchUserDetails(username);
       }
    });    

});

//footerYear
let year = new Date().getFullYear();
let footer = document.getElementById("yearFoot");
footer.textContent = year;
