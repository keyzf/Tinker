const promisifyAjax = (options) => {
    return new Promise((resolve, reject) => {
        $.ajax({...options, success: resolve, error: reject })
    })
}