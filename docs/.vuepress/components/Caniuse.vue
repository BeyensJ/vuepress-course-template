<!--
https://caniuse.bitsofco.de/
-->
<template>
    <div class="can-i-use">
        <div v-if="interactive">
            <iframe :src="info.iframe"></iframe>
        </div>
        <div v-else>
            <p>
                <a :href="info.caniuse" target="_blank">
                    <img :src=info.jpg :alt="info.caniuse" :title="info.caniuse">
                </a>
            </p>
        </div>
    </div>

</template>

<script>
    export default {
        props: {
            interactive : {
                type: Boolean,
                default: false
            },
            feat: {
                type: String,
                default: ''
            }
        },
        computed: {
            info: function () {
                let url = `https://caniuse.bitsofco.de/image/${this.feat}`;
                return {
                    webp: `${url}.webp`,
                    png: `${url}.png`,
                    jpg: `${url}.jpg`,
                    caniuse: `https://caniuse.com/#feat=${this.feat}`,
                    iframe: `https://caniuse.bitsofco.de/embed/index.html?feat=${this.feat}&periods=future_3,future_2,future_1,current,past_1,past_2&accessible-colours=false&image-base=none`,
                }
            }
        }
    }
</script>

<style scoped>
    img {
        width: 100%;
        height: auto;
    }
    iframe {
        width: 100%;
        height: 470px;
        border: none;
    }
</style>
