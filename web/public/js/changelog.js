'use strict'

$(() => {
    const loadingChangelogContainer = $("#loadingChangelogContainer");
    const changelogContainer = $("#changelogContainer");
    const changelogList = $("#changelogList");

    loadingChangelogContainer.show();
    changelogContainer.hide();

    // populate guildSettings
    $.ajax({
        type: "GET",
        url: `/api/changelog`,
        success: (res) => {
            console.log(res)
            // populate default / current settings
            res.forEach(change => {
                changelogList.append(`<h5 class="mt-4"> <span class="p-2 bg-light shadow rounded text-success" style="line-height:2.5;"> Version ${change.version} <small class="text-muted">${change.date}</small> </span> - ${change.title}</h5>`)
                thisChangesList = changelogList.append(`<ul class="list-unstyled mt-3"></ul>`)
                change.changes.forEach((c) => {
                    thisChangesList.append(`<li class="text-muted ml-3">${c}</li>`)
                })
            });


            // hide loading
            loadingChangelogContainer.hide();
            // show content
            changelogContainer.show();
        },
        error: (res) => {
            console.log("error", res)
        },
        complete: (res) => {
            console.log("complete")
        }
    });


});