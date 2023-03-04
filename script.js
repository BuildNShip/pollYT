(function () {
    'use strict';

    var parentDiv = document.createElement("div");
    parentDiv.classList.add("poll");
    var getData = new Promise(function (resolve, reject) {
        fetch(
            "https://textdb.dev/api/data/7ac86f40-9770-4da7-9e41-7d7682aea1f2",
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        )
            .then((response) => response.json())
            .then((json) => resolve(json));
    });

    function showOptions() {
        var location = window.location.href;
        getData.then((data) => {
            var innerData = data[location];
            var tileTag = document.createElement("p");
            tileTag.innerHTML = innerData["title"];
            tileTag.classList.add("title");
            parentDiv.replaceChildren();
            parentDiv.appendChild(tileTag);
            var buttonsDiv = document.createElement("div")
            for (const opt in innerData["options"]) {
                var optButton = document.createElement("button");
                optButton.classList.add("option");
                optButton.textContent = opt;
                optButton.addEventListener("click", function () {
                    getData.then((data) => {
                        data[location]["options"][opt] += 1;

                        fetch(
                            "https://textdb.dev/api/data/7ac86f40-9770-4da7-9e41-7d7682aea1f2",
                            {
                                method: "POST",
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        localStorage.setItem("ytPollVoted", true);
                        showData();
                    });
                });
                buttonsDiv.appendChild(optButton)
            }
            buttonsDiv.classList.add("buttons_container");
            parentDiv.appendChild(buttonsDiv);
        });
    }

    function showData() {
        var location = window.location.href;
        getData.then((data) => {
            var innerData = data[location];
            var tileTag = document.createElement("h2");
            tileTag.innerHTML = innerData["title"];
            parentDiv.replaceChildren();
            parentDiv.appendChild(tileTag);
            var totalVotes = 0;
            for (const opt in innerData["options"]) {
                totalVotes += innerData["options"][opt];
            }
            for (const opt in innerData["options"]) {
                var progressBarContainer = document.createElement("div");
                progressBarContainer.classList.add("progress_bar_container");
                var progressLabel = document.createElement("p");
                progressLabel.classList.add("progress_label");
                var progressText = document.createElement("p");
                progressText.classList.add("progress_text");
                var progressBar = document.createElement("progress");
                progressBar.classList.add("progress_bar");

                progressBar.setAttribute('max', '100')
                progressBar.setAttribute('value', Math.round((innerData["options"][opt] / totalVotes) * 100));

                progressLabel.innerHTML = opt + ": "

                progressText.innerHTML = Math.round((innerData["options"][opt] / totalVotes) * 100) + "%";

                progressBarContainer.appendChild(progressLabel)
                progressBarContainer.appendChild(progressBar)
                progressBarContainer.appendChild(progressText)

                parentDiv.appendChild(progressBarContainer);
            }
        });
    }

    function loadPoll() {
        var location = window.location.href;
        getData.then((data) => {
            if (!(location in data)) {
                var addPollButton = document.createElement("button");
                var optionContainer = document.createElement("div");
                optionContainer.classList.add("option_container")
                addPollButton.textContent = "Add Poll";
                addPollButton.classList.add("option");
                addPollButton.addEventListener("click", function () {
                    var title = document.createElement("input");
                    title.classList.add("input_field")
                    title.placeholder = "Title";
                    var opt1 = document.createElement("input");
                    opt1.classList.add("input_field")
                    opt1.placeholder = "Option 1";
                    optionContainer.appendChild(opt1);
                    var opt2 = document.createElement("input");
                    opt2.classList.add("input_field")
                    opt2.placeholder = "Option 2";
                    optionContainer.appendChild(opt2)
                    var opt3 = document.createElement("input");
                    opt3.classList.add("input_field")
                    opt3.placeholder = "Option 3";
                    optionContainer.appendChild(opt3)
                    var createPollButton = document.createElement("button");
                    createPollButton.textContent = "Create Poll";
                    createPollButton.classList.add("option")
                    createPollButton.addEventListener("click", function () {
                        getData.then((data) => {
                            data[location] = {
                                title: title.value,
                                options: {
                                    [opt1.value]: 0,
                                    [opt2.value]: 0,
                                    [opt3.value]: 0,
                                },
                            };

                            fetch(
                                "https://textdb.dev/api/data/7ac86f40-9770-4da7-9e41-7d7682aea1f2",
                                {
                                    method: "POST",
                                    body: JSON.stringify(data),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                            showOptions();
                        });
                    });
                    parentDiv.replaceChildren();
                    parentDiv.appendChild(title);
                    parentDiv.appendChild(optionContainer);
                    parentDiv.appendChild(createPollButton);
                });
                parentDiv.appendChild(addPollButton);
            } else {
                var vote = localStorage.getItem("pollVote");
                if (vote) {
                    showData()
                } else {
                    showOptions();
                }
            }
        });

        var videoDetails = document.querySelector("#above-the-fold");
        videoDetails.insertBefore(parentDiv, videoDetails.secondChild);
    }

    setTimeout(loadPoll, 3000);

})();