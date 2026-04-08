<template>
    <iframe
        :src="info.iframe"
        :height="height"
    ></iframe>
</template>

<script>
    export default {
        name: "Sandbox",
        props: {
            height: {
                type: [Number, String],
                default: '500'
            },
            openConsole: {
                type: Boolean,
                default: false
            },
            close: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: 'tmk-es6-empty'
            }
        },
        computed: {
            info: function () {
                console.log(this.console)
                let url = `https://stackblitz.com/edit/${this.id}`;
                return {
                    iframe: `https://stackblitz.com/edit/${this.id}?embed=1&hideNavigation=1${this.close ? `&hideExplorer=1` : ''}${this.openConsole ? `&devtoolsheight=${this.height}` : ''}`,
                }
            }
        }
    }
</script>

<style scoped>
    iframe {
        border: none;
        width: 100%;
        margin: .5rem 0;
    }
</style>
