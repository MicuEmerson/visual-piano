<template>
    <v-card>
        <v-card-title class="header">
            <h2>About</h2>
            <v-icon @click="onClose" class="piano-icon">mdi-close</v-icon>
        </v-card-title>
        
        <v-card-text>
            <div class="about-section">
            <h3>The App</h3>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet commodo massa. Phasellus lacinia eros vel tristique scelerisque. Donec sodales, sem eu pharetra maximus, augue mi ultrices lorem, ut fringilla lorem nulla id nisl. Phasellus tincidunt purus tortor, sed vehicula erat sollicitudin sed. Phasellus vehicula laoreet diam vel interdum. Cras in erat orci. Phasellus imperdiet ultricies dui sed aliquam. Vivamus non accumsan lorem.
            </p>
            </div>

            <div class="about-section">
            <h3>The Team</h3>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet commodo massa. Phasellus lacinia eros vel tristique scelerisque. Donec sodales, sem eu pharetra maximus, augue mi ultrices lorem, ut fringilla lorem nulla id nisl. Phasellus tincidunt purus tortor, sed vehicula erat sollicitudin sed. Phasellus vehicula laoreet diam vel interdum. Cras in erat orci. Phasellus imperdiet ultricies dui sed aliquam. Vivamus non accumsan lorem.
            </p>
            </div>

            <div class="about-section"> 
            <h3>Feedback</h3>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet commodo massa. Phasellus lacinia eros vel tristique scelerisque. Donec sodales, sem eu pharetra maximus, augue mi ultrices lorem, ut fringilla lorem nulla id nisl. Phasellus tincidunt purus tortor, sed vehicula erat sollicitudin sed. Phasellus vehicula laoreet diam vel interdum. Cras in erat orci. Phasellus imperdiet ultricies dui sed aliquam. Vivamus non accumsan lorem.
            </p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['onClose']
}
</script>


<style scoped>

.header {
    display: flex;
    justify-content: space-between;
    background-color: var(--v-primary-base);
    color: var(--v-text-base);
}

.v-icon.v-icon {
    font-size: 1.5em;
}  

.piano-icon {
    color: var(--v-text-base) !important;
}

.piano-icon:hover {
    color:var(--v-accent-base) !important;
}

.about-section {
    padding: 1em 0;
}

.about-section:first-child {
    padding-top: 2em;
}

.about-section:last-child {
    padding-bottom: 0;
}

</style>