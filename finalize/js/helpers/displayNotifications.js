function displayNotification(message, type) {
    require(['core/notification'], function (notification) {
        notification.addNotification({
            message: message,
            type: type
        });
    });
}
export default displayNotification;