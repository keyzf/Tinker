$(async() => {
    const guildId = $("#guildId").text().replace(/\s/g, '');

    const loadingSettingsContainer = $("#loadingSettingsContainer")
    const settingsContainer = $("#settingsContainer")

    const guildSettingsUpdate_prefix = $("#guildSettingsUpdate-prefix");

    loadingSettingsContainer.show();
    settingsContainer.hide();

    // populate default / current settings
    try {
        let data;
        data = await promisifyAjax({ type: "GET", url: `/api/guild/${guildId}?token=${token}` });
        console.log(data);

        guildSettingsUpdate_prefix.attr("placeholder", data.prefix);

        // data = await promisifyAjax({ type: "GET", url: `/api/channel/all/${guildId}?token=${token}` });
        // console.log(data);


        // when done and no errors, hide loading screen & show content
        loadingSettingsContainer.hide();
        settingsContainer.show();
    } catch (err) {
        console.error(err);
        makeToast("/images/flash/error.png", "Error", "There was an issue populating original settings, please reload or contact support");
    }

    // guildSettings update
    $("#guildSettings_prefixUpdateBtn").click(() => {

        // set prefix
        const prefix = guildSettingsUpdate_prefix.val();
        $.ajax({
            type: "POST",
            url: `/api/guild/${guildId}/settings/prefix?token=${token}`,
            data: { prefix },
            success: (res) => {
                makeToast("/images/flash/info.png", "Success", "Prefix updated successfully");
            },
            error: (res) => {
                makeToast("/images/flash/error.png", "Error", "Failed to update prefix");
            }
        });


    });
});