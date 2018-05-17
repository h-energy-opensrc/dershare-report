<template>
  <section >
    <header-menu></header-menu>
    <div class="content--container">
      <div class="sidebar--container pb2 ph4 bg-black-80 white pt4 flex justify-between flex-column">
        <div class="sidebar--content">
          <a class="code link f2 white" href="./" id="logo">iDEP _<span class="f5">ABOUT</span></a>
          <p class="pv4 f6 ttu tracked karla font-smoothing">
            <a href="javascript:void(0);" class="dim no-underline fw6 white font-smoothing mobile--filter--toggle">Filter</a>
            <span class="mobile--filter--toggle"> · </span>
            <a href="./about" class="ttu tracked dim no-underline fw6 white font-smoothing">Login</a> · 
            <a href="./nominate" class="ttu tracked dim no-underline fw6 white font-smoothing">SignUp</a>
          </p>
          <div class="code mt3">
            <h4> Pro </h4>
            <hr/>
            <ul class="code f6">
              <li>
                <a class="code w-100 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="switchContent(1)">iDEP Realtime Compute (PRO)</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="drawPlots(1)">Report Generator</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> R libraries </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="kMeans()"> remote API </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="pca()"> Ticket </a>
              </li>
            </ul>            
          </div>
          <hr/>
          <div class="code mt3">
            <h4> All </h4>
            <hr/>
            <ul class="code f6">
              <li>
                <a class="code w-100 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="switchContent(1)">iDEP Realtime Compute (Comm)</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="drawPlots(1)">Pre-Process</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> Remove Images </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="kMeans()"> kMeans </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="pca()"> PCA </a>
              </li>
            </ul>            
          </div>
          <div class="code mt3">
            <h4> FAQ </h4>
            <hr/>
            <ul class="f6">
              <li>
                <a class="code w-100 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="switchContent(1)">License</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="drawPlots(1)">Data Policy</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> Feeds </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="pca()"> Contact Us </a>
              </li>
            </ul>            
          </div>

        </div>
        <div class="sidebar--footer pb3 pt5 code">
            <p> ge-lab.org c 2016 <br/><br/> designed by Kevin Son</p>
        </div>
      </div>
      <div class="main--container ph3" >
         <ul class="code f3 wd-10 center list flex">
            <li class="link mh3"><a href="/"> Home </a></li>
            <li class="link mh3"><a href="/idepTest"> idep summary</a></li>
            <li class="link mh3"><a href="/about"> idep about</a></li>
            <li class="link mh3"><a href="/comic"> idep comic</a></li>
          </ul>
          <h3> This is bla bla bla </h3>
          <p> bla bla bla </p>
      </div>
    </div>
  </section>
</template>
<script></script>
<style></style>