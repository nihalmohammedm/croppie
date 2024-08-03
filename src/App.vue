<template lang="pug">
  section#app.section
    .container
      .columns
        .column.is-one-third
          .card
            .card-content
              .columns
                .column
                  .field
                    label.label Width
                    .control
                      input.input(v-model="size.width" @change="refresh")
                .column
                  .field
                    label.label Height
                    .control
                      input.input(v-model="size.height" @change="refresh")
              .field
                label.label Image
                .control
                  input.input(type="file" accept="image/*" @change="setImage")
              //- .columns
              //-   .column
              //-     .field
              //-       label.label Quality
              //-       .control
              //-         input.input(type="range" v-model="quality" max="1" min="0" step=".1")
              //-   .column
              //-     .mt-5.pt-3 {{quality*100}}
              
              .mb-4
                label.checkbox
                  input.mr-2(type="checkbox" v-model="addname") 
                  | Add Name

              .field(v-if="addname")
                label.label Enter Name
                input.input(v-model="name")

              .mb-4
                label.checkbox
                  input.mr-2(type="checkbox" v-model="adddate") 
                  | Add Date

              .field(v-if="adddate")
                label.label Enter Date
                input.input(v-model="date")

              .field
                p.control
                  button.button.is-success(@click="cropImage") Crop
              

        .column
          .card
            .card-content
              .columns.is-centered
                .column
                  div
                    vue-croppie(
                      ref='croppieRef' 
                      :enableorientation='true' 
                      :enableResize='false' 
                      :boundary='{ width: parseInt(size.width)+100, height: parseInt(size.height)+100}' 
                      :viewport="{ width: size.width, height: size.height }" 
                      )
                  
                  .field(style="text-align: center;")
                    input.mx-2.cr-slider(type="range" step="90" aria-label="zoom" min="-270" max="270" value=0 @input='rotate')

                  

                  

                .column
                  img.has-shadow(:src="cropped")
                  p(v-if="imgFileSize>0") ~ {{imgFileSize}} kb

</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {
      size: {
        width: 150,
        height: 200,
      },
      quality: 1,
      cropped: '',
      addname: false,
      adddate: false,
      name: '',
      date: '',
      imgFileSize: 0,
      angle: 0,
    }
  },
  methods:{
    rotate($event) {
      var angle = $event.target.value - this.angle;
      console.log(angle)
      this.$refs.croppieRef.rotate(angle);
      this.angle = $event.target.value;
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      // alert();
      var _this = this;
      let options = {
          type: 'rawcanvas',
          format: 'jpeg',
          // quality: this.quality,
      }
      this.$refs.croppieRef.result(options, (c) => {
        console.log(c);
        console.log(c.toDataURL('image/jpeg','1'));

        var cutout = (_this.addname?20:0) + (_this.adddate?20:0);

        if(_this.addname || _this.adddate){
          var ctx = c.getContext("2d");

          ctx.fillStyle = "white";
          ctx.fillRect(0, parseInt(_this.size.height)-parseInt(cutout), parseInt(_this.size.width), parseInt(cutout));

          ctx.fillStyle = 'black';
          ctx.font = '14px sans-serif';
          ctx.textAlign = "center";
        
          if(_this.addname){
            ctx.fillText(_this.name, parseInt(_this.size.width)/2, (parseInt(_this.size.height)-parseInt(cutout))+14, parseInt(_this.size.width)-10);
          }

          if(_this.adddate){
            cutout = _this.addname && _this.adddate ? cutout/2 : cutout; 
            ctx.fillText(_this.date, parseInt(_this.size.width)/2, (parseInt(_this.size.height)-parseInt(cutout))+14, parseInt(_this.size.width)-10);
          }

        }
        _this.cropped = c.toDataURL('image/jpeg',_this.quality);
        var head = 'data:image/jpeg;base64,';
        _this.imgFileSize = Math.round(((_this.cropped.length - head.length)*3/4)/1024) ;
      });
    
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          this.imgSrc = event.target.result;

          await this.$nextTick();
          this.$refs.croppieRef.bind({
            url: event.target.result
          });
          
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    refresh(){
      this.$refs.croppieRef.refresh()
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
.has-shadow{
  box-shadow: 0px 0px 5px rgba(200,200,200,.5);
}
</style>
