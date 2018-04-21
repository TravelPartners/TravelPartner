import Home from './Home.vue';

new Vue({
    el: "#TG",
    template: "<Home />",
    components: { Home }
});
var d = new Date();
document.getElementById("Timeinfo").innerHTML = d;
function Upload() {
    document.getElementById("Uploadinfo").innerHTML = Date();
}

