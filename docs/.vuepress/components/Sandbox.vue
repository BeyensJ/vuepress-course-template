<template>
    <iframe :src="info.iframe"
            :height="height"
            style="margin-top: 1rem"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
</template>

<script>
    export default {
        name: "Sandbox",
        props: {
            height: {
                type: [Number, String],
                default: '500px'
            },
            open : {
                type: String,
                default: 'index.html'
            },
            id: {
                type: String,
                default: ''
            }
        },
        computed: {
            info: function () {
                let url = `https://codesandbox.io/s/${this.id}`;
                return {
                    iframe: `https://codesandbox.io/embed/${this.id}?&fontsize=12&forcerefresh=1&codemirror=1`,
                }
            }
        }
    }
</script>

<style scoped>
    iframe {
        border: none;
        width: 100%;
    }
</style>
