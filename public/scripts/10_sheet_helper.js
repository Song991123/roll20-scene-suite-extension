/*
 * Scene Suite 10 - Sheet Helper 0.6.38
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

/* SCENE_SUITE_SHEET_RECOGNITION_START */
(function () {
  /*!
   * Self-contained Brotli JSON decoder bundle
   *
   * This bundle includes code from brotli.js, base64-js, and the Browserify runtime.
   *
   * MIT License
   *
   * Copyright (c) Devon Govett
   * Copyright (c) 2014 Jameson Little
   * Copyright (c) 2010 James Halliday (mail@substack.net)
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * Apache License
   * Version 2.0, January 2004
   * http://www.apache.org/licenses/
   *
   * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   *
   * 1. Definitions.
   *
   * "License" shall mean the terms and conditions for use, reproduction,
   * and distribution as defined by Sections 1 through 9 of this document.
   *
   * "Licensor" shall mean the copyright owner or entity authorized by
   * the copyright owner that is granting the License.
   *
   * "Legal Entity" shall mean the union of the acting entity and all
   * other entities that control, are controlled by, or are under common
   * control with that entity. For the purposes of this definition,
   * "control" means (i) the power, direct or indirect, to cause the
   * direction or management of such entity, whether by contract or
   * otherwise, or (ii) ownership of fifty percent (50%) or more of the
   * outstanding shares, or (iii) beneficial ownership of such entity.
   *
   * "You" (or "Your") shall mean an individual or Legal Entity
   * exercising permissions granted by this License.
   *
   * "Source" form shall mean the preferred form for making modifications,
   * including but not limited to software source code, documentation
   * source, and configuration files.
   *
   * "Object" form shall mean any form resulting from mechanical
   * transformation or translation of a Source form, including but
   * not limited to compiled object code, generated documentation,
   * and conversions to other media types.
   *
   * "Work" shall mean the work of authorship, whether in Source or
   * Object form, made available under the License, as indicated by a
   * copyright notice that is included in or attached to the work
   * (an example is provided in the Appendix below).
   *
   * "Derivative Works" shall mean any work, whether in Source or Object
   * form, that is based on (or derived from) the Work and for which the
   * editorial revisions, annotations, elaborations, or other modifications
   * represent, as a whole, an original work of authorship. For the purposes
   * of this License, Derivative Works shall not include works that remain
   * separable from, or merely link (or bind by name) to the interfaces of,
   * the Work and Derivative Works thereof.
   *
   * "Contribution" shall mean any work of authorship, including
   * the original version of the Work and any modifications or additions
   * to that Work or Derivative Works thereof, that is intentionally
   * submitted to Licensor for inclusion in the Work by the copyright owner
   * or by an individual or Legal Entity authorized to submit on behalf of
   * the copyright owner. For the purposes of this definition, "submitted"
   * means any form of electronic, verbal, or written communication sent
   * to the Licensor or its representatives, including but not limited to
   * communication on electronic mailing lists, source code control systems,
   * and issue tracking systems that are managed by, or on behalf of, the
   * Licensor for the purpose of discussing and improving the Work, but
   * excluding communication that is conspicuously marked or otherwise
   * designated in writing by the copyright owner as "Not a Contribution."
   *
   * "Contributor" shall mean Licensor and any individual or Legal Entity
   * on behalf of whom a Contribution has been received by Licensor and
   * subsequently incorporated within the Work.
   *
   * 2. Grant of Copyright License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * copyright license to reproduce, prepare Derivative Works of,
   * publicly display, publicly perform, sublicense, and distribute the
   * Work and such Derivative Works in Source or Object form.
   *
   * 3. Grant of Patent License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * (except as stated in this section) patent license to make, have made,
   * use, offer to sell, sell, import, and otherwise transfer the Work,
   * where such license applies only to those patent claims licensable
   * by such Contributor that are necessarily infringed by their
   * Contribution(s) alone or by combination of their Contribution(s)
   * with the Work to which such Contribution(s) was submitted. If You
   * institute patent litigation against any entity (including a
   * cross-claim or counterclaim in a lawsuit) alleging that the Work
   * or a Contribution incorporated within the Work constitutes direct
   * or contributory patent infringement, then any patent licenses
   * granted to You under this License for that Work shall terminate
   * as of the date such litigation is filed.
   *
   * 4. Redistribution. You may reproduce and distribute copies of the
   * Work or Derivative Works thereof in any medium, with or without
   * modifications, and in Source or Object form, provided that You
   * meet the following conditions:
   *
   * (a) You must give any other recipients of the Work or
   * Derivative Works a copy of this License; and
   *
   * (b) You must cause any modified files to carry prominent notices
   * stating that You changed the files; and
   *
   * (c) You must retain, in the Source form of any Derivative Works
   * that You distribute, all copyright, patent, trademark, and
   * attribution notices from the Source form of the Work,
   * excluding those notices that do not pertain to any part of
   * the Derivative Works; and
   *
   * (d) If the Work includes a "NOTICE" text file as part of its
   * distribution, then any Derivative Works that You distribute must
   * include a readable copy of the attribution notices contained
   * within such NOTICE file, excluding those notices that do not
   * pertain to any part of the Derivative Works, in at least one
   * of the following places: within a NOTICE text file distributed
   * as part of the Derivative Works; within the Source form or
   * documentation, if provided along with the Derivative Works; or,
   * within a display generated by the Derivative Works, if and
   * wherever such third-party notices normally appear. The contents
   * of the NOTICE file are for informational purposes only and
   * do not modify the License. You may add Your own attribution
   * notices within Derivative Works that You distribute, alongside
   * or as an addendum to the NOTICE text from the Work, provided
   * that such additional attribution notices cannot be construed
   * as modifying the License.
   *
   * You may add Your own copyright statement to Your modifications and
   * may provide additional or different license terms and conditions
   * for use, reproduction, or distribution of Your modifications, or
   * for any such Derivative Works as a whole, provided Your use,
   * reproduction, and distribution of the Work otherwise complies with
   * the conditions stated in this License.
   *
   * 5. Submission of Contributions. Unless You explicitly state otherwise,
   * any Contribution intentionally submitted for inclusion in the Work
   * by You to the Licensor shall be under the terms and conditions of
   * this License, without any additional terms or conditions.
   * Notwithstanding the above, nothing herein shall supersede or modify
   * the terms of any separate license agreement you may have executed
   * with Licensor regarding such Contributions.
   *
   * 6. Trademarks. This License does not grant permission to use the trade
   * names, trademarks, service marks, or product names of the Licensor,
   * except as required for reasonable and customary use in describing the
   * origin of the Work and reproducing the content of the NOTICE file.
   *
   * 7. Disclaimer of Warranty. Unless required by applicable law or
   * agreed to in writing, Licensor provides the Work (and each
   * Contributor provides its Contributions) on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   * implied, including, without limitation, any warranties or conditions
   * of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
   * PARTICULAR PURPOSE. You are solely responsible for determining the
   * appropriateness of using or redistributing the Work and assume any
   * risks associated with Your exercise of permissions under this License.
   *
   * 8. Limitation of Liability. In no event and under no legal theory,
   * whether in tort (including negligence), contract, or otherwise,
   * unless required by applicable law (such as deliberate and grossly
   * negligent acts) or agreed to in writing, shall any Contributor be
   * liable to You for damages, including any direct, indirect, special,
   * incidental, or consequential damages of any character arising as a
   * result of this License or out of the use or inability to use the
   * Work (including but not limited to damages for loss of goodwill,
   * work stoppage, computer failure or malfunction, or any and all
   * other commercial damages or losses), even if such Contributor
   * has been advised of the possibility of such damages.
   *
   * 9. Accepting Warranty or Additional Liability. While redistributing
   * the Work or Derivative Works thereof, You may choose to offer,
   * and charge a fee for, acceptance of support, warranty, indemnity,
   * or other liability obligations and/or rights consistent with this
   * License. However, in accepting such obligations, You may act only
   * on Your own behalf and on Your sole responsibility, not on behalf
   * of any other Contributor, and only if You agree to indemnify,
   * defend, and hold each Contributor harmless for any liability
   * incurred by, or claims asserted against, such Contributor by reason
   * of your accepting any such warranty or additional liability.
   *
   * END OF TERMS AND CONDITIONS
   *
   * APPENDIX: How to apply the Apache License to your work.
   *
   * To apply the Apache License to your work, attach the following
   * boilerplate notice, with the fields enclosed by brackets "[]"
   * replaced with your own identifying information. (Don't include
   * the brackets!)  The text should be enclosed in the appropriate
   * comment syntax for the file format. We also recommend that a
   * file or class name and description of purpose be included on the
   * same "printed page" as the copyright notice for easier
   * identification within third-party archives.
   *
   * Copyright 2013 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="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"},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 300696 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758537) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      return restored;
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
/* SCENE_SUITE_SHEET_RECOGNITION_END */

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var SHEET_NOT_RECOGNIZED = '현재 인식된 시트가 없습니다.';

  var VERSION = '0.6.38';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};
  var pendingAttributeChanges = {};
  var pendingAttributeOrder = [];
  var attributeChangeTimer = null;

  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function arithmeticValue(expression) {
    var source = trim(expression).replace(/\s+/g, '');
    var tokens = source.match(/floor|ceil|round|min|max|abs|\d+(?:\.\d+)?|[()+\-*/,]/gi) || [];
    if (!source || tokens.join('') !== source || tokens.length > 200) return null;
    var at = 0;
    function primary() {
      var token = tokens[at++];
      if (token === '+' || token === '-') {
        var unary = primary();
        return unary === null ? null : token === '-' ? -unary : unary;
      }
      if (token === '(') {
        var nested = expressionValue();
        if (tokens[at++] !== ')') return null;
        return nested;
      }
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token || '')) {
        var name = token.toLowerCase();
        if (tokens[at++] !== '(') return null;
        var args = [expressionValue()];
        while (tokens[at] === ',') { at += 1; args.push(expressionValue()); }
        if (tokens[at++] !== ')' || args.some(function (value) { return value === null; })) return null;
        if ((name === 'min' || name === 'max') && args.length)
          return Math[name].apply(Math, args);
        if (args.length !== 1) return null;
        return Math[name](args[0]);
      }
      return /^\d+(?:\.\d+)?$/.test(token || '') ? Number(token) : null;
    }
    function term() {
      var value = primary();
      while (value !== null && (tokens[at] === '*' || tokens[at] === '/')) {
        var op = tokens[at++];
        var right = primary();
        if (right === null || (op === '/' && right === 0)) return null;
        value = op === '*' ? value * right : value / right;
      }
      return value;
    }
    function expressionValue() {
      var value = term();
      while (value !== null && (tokens[at] === '+' || tokens[at] === '-')) {
        var op = tokens[at++];
        var right = term();
        if (right === null) return null;
        value = op === '+' ? value + right : value - right;
      }
      return value;
    }
    var result = expressionValue();
    return at === tokens.length && result !== null && isFinite(result) ? result : null;
  }

  function resolvedResourceValue(characterId, raw, defaults, rowContext) {
    var source = trim(raw);
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(source)) {
      var direct = Number(source);
      return { number: direct, text: String(direct) };
    }
    var resolved = resolvedRollExpression(characterId, source,
      rowContext && rowContext.scopes || [], 0, {}, defaults, rowContext);
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(resolved)) {
        var numeric = Number(resolved);
        return { number: numeric, text: String(numeric) };
      }
      var calculated = arithmeticValue(resolved);
      if (calculated !== null) {
        calculated = Math.round(calculated * 100) / 100;
        return { number: calculated, text: String(calculated) };
      }
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function cachedAttrReader(characterId) {
    var values = dictionary();
    return function (name, type) {
      var key = trim(name) + '|' + (type || 'current');
      if (!own(values, key)) values[key] = getAttr(characterId, name, type);
      return values[key];
    };
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || ''))
      data.trackingMode = own(state, 'hide_tracking') && typeof state.hide_tracking === 'boolean'
        ? state.hide_tracking ? 'gm' : 'public'
        : 'gm';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = false;
    data.version = VERSION;
    return data;
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, prefix: prefix, values: dictionary(), names: dictionary(), refs: dictionary() };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    var orderedRows = dictionary();
    ordered.forEach(function (rowId) { orderedRows[rowId] = true; });
    Object.keys(rows).sort().forEach(function (rowId) {
      if (!orderedRows[rowId]) {
        ordered.push(rowId);
        orderedRows[rowId] = true;
      }
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 정보 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractCatalogCache = null;
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function contractDefaultMap(contract) {
    var result = dictionary();
    (contract && contract.fields || []).forEach(function (field) {
      var name = trim(field && field.name);
      if (!name || field.section || !own(field, 'default')) return;
      result[name] = String(field.default == null ? '' : field.default);
    });
    return result;
  }

  function normalizedDefault(value) {
    return trim(value).toLowerCase().replace(/\s+/g, '');
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var missingContradictions = records.map(function () { return 0; });
    var sourceContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary(),probes = [];
    var reads = typeof getSheetDefaultValue == 'function'?getSheetDefaultValue:cachedAttrReader(characterId);
    var savedUnique = records.map(function () { return 0; });
    Object.keys(savedNames || {}).forEach(function (name) {
      var owners = records.filter(function (record) { return !!record.globalSet[name]; });
      if (owners.length === 1) savedUnique[owners[0].ordinal] += 1;
    });
    function expectedDefault(record, name) {
      return own(record.defaults, name)
        ? 'value:' + normalizedDefault(record.defaults[name])
        : 'missing';
    }
    var available = dictionary();
    records.forEach(function (record) {
      Object.keys(record.defaults || {}).forEach(function (name) { available[name] = true; });
    });
    var defaultNames = Object.keys(available).sort();
    var defaultValues = dictionary();
    var separatingDefaultNames = [];
    defaultNames.forEach(function (name) {
      var firstExpected = '';
      var different = false;
      var hasNonEmpty = false;
      var values = records.map(function (record, index) {
        var expected = expectedDefault(record, name);
        if (!index) firstExpected = expected;
        else if (expected !== firstExpected) different = true;
        if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        return expected;
      });
      defaultValues[name] = values;
      if ((!savedNames || !savedNames[name]) && hasNonEmpty && different)
        separatingDefaultNames.push(name);
    });
    function nextField() {
      if (!active.length) return '';
      if (active.length === 1) {
        for (var only = 0; only < defaultNames.length; only += 1) {
          var confirmation = defaultNames[only];
          if (!used[confirmation] && !(savedNames && savedNames[confirmation]) &&
              own(active[0].defaults || {}, confirmation) &&
              normalizedDefault((active[0].defaults || {})[confirmation])) return confirmation;
        }
        return '';
      }
      var selected = '';
      var selectedSeparation = -1;
      for (var fieldAt = 0; fieldAt < separatingDefaultNames.length; fieldAt += 1) {
        var name = separatingDefaultNames[fieldAt];
        if (used[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        }
        var groups = Object.keys(counts);
        if (!hasNonEmpty || groups.length < 2) continue;
        var separation = active.length * active.length;
        groups.forEach(function (value) {
          separation -= counts[value] * counts[value];
        });
        if (separation > selectedSeparation) {
          selected = name;
          selectedSeparation = separation;
        }
      }
      return selected;
    }
    for (var attempt = 0; attempt < 48; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) missingContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: '', matches: [] });
      } else if (!actual) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        // 현재 원본에 있는 필드를 선언하지 않은 후보는 공통 기본값이 같아도 제외합니다.
        // getAttrByName 대체 경로에는 이전 시트의 저장값이 섞일 수 있습니다.
        if (typeof getSheetDefaultValue === 'function') records.forEach(function (record) {
          if (!record.globalSet[name]) sourceContradictions[record.ordinal] += 1;
          else if (own(record.defaults, name) && normalizedDefault(record.defaults[name]) !== actual &&
              /[&?]\{|\{\{/.test(record.defaults[name] + actual)) {
            // 수치 보정은 중립으로 두되, 서로 다른 원본 굴림/템플릿 조각은 구별합니다.
            var alternatives = [record.defaults[name]];
            (record.contract.fields || []).forEach(function (field) {
              if (!field.section && field.name === name)
                alternatives = alternatives.concat(field.defaultVariants || []);
            });
            alternatives = alternatives.concat(contractOptionValues((record.contract.controls || {})[name]));
            if (!alternatives.some(function (value) { return normalizedDefault(value) === actual; }))
              sourceContradictions[record.ordinal] += 1;
          }
        });
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          sourceContradictions[leaders[0].ordinal] === 0 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) candidates = records.filter(function (record) {
      return sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) return { record: null, survivors: [],
      scores: scores, probes: probes, matched: false };
    var ranked = candidates.sort(function (left, right) {
      return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
    });
    var bestScore = ranked.length ? scores[ranked[0].ordinal] : 0;
    var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
    var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
    if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
      return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
    active = ranked.filter(function (record) {
      return scores[record.ordinal] >= Math.max(0, bestScore - 1);
    });
    return { record: null, survivors: active.length ? active : ranked,
      scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var savedCounts = dictionary();
    (characters || []).forEach(function (character) { savedCounts[character.id] = 0; });
    Object.keys(ownersByName || {}).forEach(function (name) {
      Object.keys(ownersByName[name] || {}).forEach(function (characterId) {
        if (own(savedCounts, characterId)) savedCounts[characterId] += 1;
      });
    });
    var candidates = (characters || []).slice().sort(function (left, right) {
      return savedCounts[left.id] - savedCounts[right.id] ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    var character = candidates[0];
    if (!character) return fallback;
    var savedNames = dictionary();
    Object.keys(ownersByName || {}).forEach(function (name) {
      if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
    });
    var evidence = sourceDefaultEvidence(character.id, records, savedNames);
    evidence.characterId = character.id;
    return evidence;
  }

  function trieNode() {
    return { next: dictionary(), values: [] };
  }

  function trieAdd(root, value, entry) {
    var node = root;
    for (var i = 0; i < value.length; i += 1) {
      var character = value.charAt(i);
      if (!node.next[character]) node.next[character] = trieNode();
      node = node.next[character];
    }
    node.values.push(entry);
  }

  function triePrefixes(root, value) {
    var node = root;
    var result = [];
    for (var i = 0; i < value.length; i += 1) {
      node = node.next[value.charAt(i)];
      if (!node) break;
      if (node.values.length) result = result.concat(node.values);
    }
    return result;
  }

  function fieldSuffixTrie(fields) {
    var root = trieNode();
    (fields || []).forEach(function (field) {
      var suffix = '_' + field;
      trieAdd(root, suffix.split('').reverse().join(''), field);
    });
    return root;
  }

  function matchedField(root, name, prefixLength) {
    var node = root;
    var found = '';
    for (var i = name.length - 1; i >= prefixLength; i -= 1) {
      node = node.next[name.charAt(i)];
      if (!node) break;
      if (node.values.length) found = node.values[0];
    }
    return found;
  }

  function recognitionCatalog(contracts) {
    if (contractCatalogCache && contractCatalogCache.contracts.length === contracts.length &&
        contractCatalogCache.contracts.every(function (contract, index) { return contract === contracts[index]; }))
      return contractCatalogCache;
    var catalog = { contracts: contracts.slice(), records: [], exact: dictionary(), prefixes: trieNode() };
    function post(name, posting) {
      if (!name) return;
      if (!catalog.exact[name]) catalog.exact[name] = [];
      catalog.exact[name].push(posting);
    }
    contracts.forEach(function (contract, ordinal) {
      var signature = contractSignature(contract);
      var runtime = contractRuntimeIndex(contract);
      var attributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      var globalAttributes = (Array.isArray(contract.globalAttributes) ? contract.globalAttributes : attributes)
        .map(trim).filter(Boolean);
      var globalSet = dictionary();
      globalAttributes.forEach(function (name) { globalSet[name] = true; });
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        globalAttributes: globalAttributes,
        globalSet: globalSet,
        globalCount: Object.keys(globalSet).length,
        defaults: contractDefaultMap(contract),
        required: signature.entries.filter(function (entry) { return entry.required; }).map(function (entry) { return entry.name; }),
      };
      catalog.records.push(record);
      signature.entries.forEach(function (entry) {
        post(entry.name, { record: record, type: 'signature', weight: entry.weight });
      });
      Object.keys(runtime.exact).forEach(function (name) {
        post(name, { record: record, type: signature.total ? 'dependency' : 'source', key: name });
      });
      runtime.prefixes.forEach(function (prefix) {
        var section = runtime.prefixSections[prefix];
        trieAdd(catalog.prefixes, prefix, {
          record: record,
          prefix: prefix,
          section: section,
          fields: fieldSuffixTrie(runtime.sections[section] || []),
        });
      });
    });
    contractCatalogCache = catalog;
    return catalog;
  }

  function inspectContracts(characterId) {
    if (contractMatchCache.__room__) {
      if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
      return contractMatchCache.__room__;
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
    var roomCharacters = characterObjects();
    var liveOwners = dictionary();
    roomCharacters.forEach(function (character) { liveOwners[character.id] = true; });
    var attributes = (
      findObjs({ _type: 'attribute' }) ||
      findObjs({ type: 'attribute' }) ||
      []
    ).filter(function (attribute) {
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      return !!liveOwners[owner];
    });
    var names = dictionary();
    var ownersByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name) return;
      names[name] = true;
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      if (!ownersByName[name]) ownersByName[name] = dictionary();
      if (owner) ownersByName[name][owner] = true;
    });
    var contracts = sheetContracts();
    var catalog = recognitionCatalog(contracts);
    defaultEvidence = roomSourceDefaultEvidence(roomCharacters, catalog.records, ownersByName);
    var nameList = Object.keys(names);
    var persistentTotal = nameList.length;
    var repeatingTotal = nameList.filter(function (name) {
      return name.indexOf('repeating_') === 0;
    }).length;
    var stats = catalog.records.map(function () {
      return {
        signatureScore: 0, signatureSeen: dictionary(), sourceSeen: dictionary(),
        repeatingHits: 0, repeatingSections: dictionary(), support: dictionary(),
        uniqueSeen: dictionary(), uniqueOwners: dictionary(),
      };
    });
    var recognizedFieldsByOwner = dictionary();
    var compatibilityByOwner = dictionary();
    var membershipByOwner = dictionary();
    function markSupport(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.support[owner] = true; });
    }
    function markRecognized(contractsForName, name) {
      var ordinals = Object.keys(contractsForName);
      if (!ordinals.length) return;
      var membership = ordinals.join(',');
      Object.keys(ownersByName[name] || {}).forEach(function (owner) {
        recognizedFieldsByOwner[owner] = (recognizedFieldsByOwner[owner] || 0) + 1;
        if (!compatibilityByOwner[owner]) compatibilityByOwner[owner] = dictionary();
        ordinals.forEach(function (ordinal) {
          compatibilityByOwner[owner][ordinal] = (compatibilityByOwner[owner][ordinal] || 0) + 1;
        });
        if (!membershipByOwner[owner]) membershipByOwner[owner] = dictionary();
        membershipByOwner[owner][membership] = (membershipByOwner[owner][membership] || 0) + 1;
      });
    }
    function markUniqueOwners(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.uniqueOwners[owner] = true; });
    }
    nameList.forEach(function (name) {
      var exactPostings = catalog.exact[name] || [];
      var exactContracts = dictionary();
      exactPostings.forEach(function (posting) {
        exactContracts[posting.record.ordinal] = true;
        var stat = stats[posting.record.ordinal];
        if (posting.type === 'signature') {
          if (!stat.signatureSeen[name]) {
            stat.signatureSeen[name] = true;
            stat.signatureScore += posting.weight;
            markSupport(stat, name);
          }
        } else if (posting.type === 'source') {
          stat.sourceSeen[posting.key] = true;
          markSupport(stat, name);
        }
      });
      var exactOrdinals = Object.keys(exactContracts);
      if (exactOrdinals.length === 1) {
        var exactStat = stats[Number(exactOrdinals[0])];
        exactStat.uniqueSeen[name] = true;
        markUniqueOwners(exactStat, name);
        markSupport(exactStat, name);
      }
      if (name.indexOf('repeating_') !== 0) {
        markRecognized(exactContracts, name);
        return;
      }
      var matches = triePrefixes(catalog.prefixes, name);
      var seenContracts = dictionary();
      var matchedByContract = dictionary();
      for (var index = matches.length - 1; index >= 0; index -= 1) {
        var match = matches[index];
        var ordinal = match.record.ordinal;
        if (seenContracts[ordinal]) continue;
        var field = matchedField(match.fields, name, match.prefix.length);
        if (!field) continue;
        seenContracts[ordinal] = true;
        var repeatingStat = stats[ordinal];
        repeatingStat.repeatingHits += 1;
        repeatingStat.repeatingSections[match.section] = true;
        markSupport(repeatingStat, name);
        var sourceKey = 'repeating_' + match.section + '_' + field;
        matchedByContract[ordinal] = sourceKey;
        if (!match.record.signature.total) repeatingStat.sourceSeen[sourceKey] = true;
      }
      var repeatingOrdinals = Object.keys(matchedByContract);
      repeatingOrdinals.forEach(function (ordinal) { exactContracts[ordinal] = true; });
      markRecognized(exactContracts, name);
      if (repeatingOrdinals.length === 1) {
        var repeatingOrdinal = Number(repeatingOrdinals[0]);
        stats[repeatingOrdinal].uniqueSeen[matchedByContract[repeatingOrdinal]] = true;
        markUniqueOwners(stats[repeatingOrdinal], name);
      }
    });
    var recognizedOwnerCount = Object.keys(recognizedFieldsByOwner).length;
    var compatibilityVotes = catalog.records.map(function () { return 0; });
    Object.keys(recognizedFieldsByOwner).forEach(function (owner) {
      var total = recognizedFieldsByOwner[owner];
      if (total < 2) return;
      var coverage = compatibilityByOwner[owner] || {};
      var ranked = catalog.records.map(function (record) {
        return { ordinal: record.ordinal, count: coverage[record.ordinal] || 0 };
      }).sort(function (left, right) {
        return right.count - left.count || left.ordinal - right.ordinal;
      });
      var best = ranked[0];
      var runnerUp = ranked[1] || { ordinal: -1, count: 0 };
      if (!best || best.count / total < 0.9 || best.count <= runnerUp.count) return;
      var bestOnly = 0;
      var runnerOnly = 0;
      Object.keys(membershipByOwner[owner] || {}).forEach(function (membership) {
        var members = (',' + membership + ',');
        var count = membershipByOwner[owner][membership];
        var hasBest = members.indexOf(',' + best.ordinal + ',') >= 0;
        var hasRunner = members.indexOf(',' + runnerUp.ordinal + ',') >= 0;
        if (hasBest && !hasRunner) bestOnly += count;
        if (hasRunner && !hasBest) runnerOnly += count;
      });
      var completeFieldAdvantage = total >= 5 && best.count === total && bestOnly >= 1 && runnerOnly === 0;
      if (completeFieldAdvantage || (total >= 5 && bestOnly >= 2 && bestOnly > runnerOnly))
        compatibilityVotes[best.ordinal] += 1;
    });
    var scored = catalog.records.map(function (record) {
      var contract = record.contract;
      var signature = record.signature;
      var stat = stats[record.ordinal];
      var signatureScore = stat.signatureScore;
      var sourceScore = Object.keys(stat.sourceSeen).length;
      var missingRequired = record.required.filter(function (name) { return !stat.signatureSeen[name]; });
      var contractAttributes = record.attributes;
      var repeatingHits = stat.repeatingHits;
      var repeatingSections = stat.repeatingSections;
      var supportCount = Object.keys(stat.support).length;
      var uniqueEvidence = Object.keys(stat.uniqueSeen).length;
      var uniqueOwnerCount = Object.keys(stat.uniqueOwners).length;
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      var repeatingRatio = repeatingTotal ? repeatingHits / repeatingTotal : 1;
      var rankScore = score + repeatingHits * 2 + Object.keys(repeatingSections).length * 3;
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        repeatingHits: repeatingHits,
        repeatingTotal: repeatingTotal,
        repeatingRatio: repeatingRatio,
        supportCount: supportCount,
        uniqueEvidence: uniqueEvidence,
        uniqueOwnerCount: uniqueOwnerCount,
        compatibilityOwnerCount: compatibilityVotes[record.ordinal],
        defaultMatchCount: defaultEvidence.scores[record.ordinal] || 0,
        rankScore: rankScore,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) {
      return b.compatibilityOwnerCount - a.compatibilityOwnerCount ||
        b.supportCount - a.supportCount || b.uniqueEvidence - a.uniqueEvidence || b.rankScore - a.rankScore ||
        b.repeatingHits - a.repeatingHits || b.score - a.score || b.ratio - a.ratio;
    });
    if (defaultEvidence.matched) {
      var match = scored.filter(function (item) {
        return item.id === defaultEvidence.record.contract.id;
      })[0];
      return remember({ status: 'matched', contract: defaultEvidence.record.contract,
        match: match, matches: scored, recognitionReason: 'source-defaults' });
    }
    var sourceSurvivors = dictionary();
    (defaultEvidence.survivors || []).forEach(function (record) { sourceSurvivors[record.contract.id] = true; });
    var sourceSurvivorCount = Object.keys(sourceSurvivors).length;
    var sourceNarrowed = sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    var selectedRecords = dictionary();
    var selectedGlobal = dictionary();
    selection.forEach(function (item) {
      var record = catalog.records.filter(function (record) {
        return record.contract.id === item.id;
      })[0];
      selectedRecords[item.id] = record;
      (record ? record.globalAttributes : []).forEach(function (name) { selectedGlobal[name] = true; });
    });
    var structureVotes = dictionary();
    var structureVoters = 0;
    Object.keys(liveOwners).forEach(function (owner) {
      var observed = dictionary();
      Object.keys(ownersByName).forEach(function (name) {
        if (!ownersByName[name][owner] || name.indexOf('repeating_') === 0 ||
            name.indexOf('_reporder_repeating_') === 0) return;
        if (selectedGlobal[name]) observed[name] = true;
      });
      var observedNames = Object.keys(observed);
      var observedCount = observedNames.length;
      if (observedCount < 5) return;
      var ranked = selection.map(function (item) {
        var record = selectedRecords[item.id];
        var declared = record ? record.globalSet : dictionary();
        var declaredCount = record ? record.globalCount : 0;
        var hits = observedNames.filter(function (name) { return declared[name]; }).length;
        var union = observedCount + declaredCount - hits;
        return {
          id: item.id,
          score: union ? hits / union : 0,
          observedCoverage: hits / observedCount,
          declaredCoverage: declaredCount ? hits / declaredCount : 0,
        };
      }).sort(function (left, right) { return right.score - left.score; });
      var bestStructure = ranked[0];
      var runnerStructure = ranked[1] || { score: 0 };
      if (!bestStructure || bestStructure.score < 0.9 || bestStructure.observedCoverage < 0.9 ||
          bestStructure.declaredCoverage < 0.9 || bestStructure.score - runnerStructure.score < 0.05) return;
      structureVotes[bestStructure.id] = (structureVotes[bestStructure.id] || 0) + 1;
      structureVoters += 1;
    });
    var structureWinner = selection.filter(function (item) {
      return (structureVotes[item.id] || 0) * 2 > structureVoters;
    });
    if (structureVoters && structureWinner.length === 1)
      return remember({ status: 'matched', contract: structureWinner[0].contract,
        match: structureWinner[0], matches: selection, recognitionReason: 'stored-structure' });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [],
        recognitionReason: contracts.length ? 'conflicting-source-fields' : 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (!sourceNarrowed && evidence.uniqueEvidence >= 2 && (!runnerUp ||
          evidence.supportCount > runnerUp.supportCount || runnerUp.uniqueEvidence === 0) &&
          evidence.uniqueOwnerCount * 2 > recognizedOwnerCount)
        return remember({ status: 'matched', contract: evidence.contract, match: evidence, matches: selection,
          recognitionReason: 'stored-unique-attributes' });
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous'
          : persistentTotal ? 'insufficient-or-conflicting-evidence' : 'no-saved-attributes-or-default-match',
      });
    }
    var best = eligible[0];
    if (best.supportCount * 2 <= recognizedOwnerCount) {
      return remember({ status: 'ambiguous', contract: null, matches: selection, error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous' : 'insufficient-room-support' });
    }
    var close = eligible.filter(function (item) {
      return item.supportCount === best.supportCount && best.rankScore - item.rankScore <= 2 &&
        best.ratio - item.ratio < 0.1 && Math.abs(best.repeatingHits - item.repeatingHits) <= 1;
    });
    if (close.length === 1)
      return remember({ status: 'matched', contract: best.contract, match: best, matches: selection,
        recognitionReason: 'stored-signature' });
    return remember({ status: 'ambiguous', contract: null, matches: close, error: SHEET_NOT_RECOGNIZED,
      recognitionReason: sourceNarrowed
        ? 'source-defaults-ambiguous' : 'conflicting-candidates' });
  }

  function usableContractInspection(inspection) {
    return !!inspection && (inspection.status === 'matched' ||
      (inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'));
  }

  function sourceCandidateInspections(inspection) {
    if (!usableContractInspection(inspection)) return [];
    if (inspection.status === 'matched') return [inspection];
    return (inspection.matches || []).map(function (match) {
      return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
    });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (condition.never === true) return false;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractVisibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (Array.isArray(condition)) {
      condition.forEach(function (item) { contractVisibilityNames(item, found); });
      return found;
    }
    if (condition.name) found[trim(condition.name)] = true;
    ['all', 'any', 'not'].forEach(function (key) { contractVisibilityNames(condition[key], found); });
    return found;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.refs[name] || row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    var value = reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current');
    var index = contractRuntimeIndex(contract);
    var repeating = contractRepeating(roll);
    var field = repeating && index.fieldSections[repeating.section] && index.fieldSections[repeating.section][name] ||
      index.fieldGlobal[name];
    return trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractUserModeLabels(mode) {
    var internalId = normalize(mode && mode.id);
    return contractModeLabels(mode).filter(function (label) {
      var key = normalize(label);
      return key && key !== internalId && !/^mode-?[a-f0-9]{8,}$/i.test(key) &&
        humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      prefixSections: dictionary(),
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      rollsByKey: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
      presentationControls: dictionary(),
      presentationRollGates: dictionary(),
      rollVisibilityReach: dictionary(),
    };
    var visibilityReach = dictionary();
    var visibilityConditions = [];
    var visibilityNames = [];
    var rollVisibilityPolarity = dictionary();
    var valueReferences = dictionary();
    function countVisibility(condition) {
      if (!condition) return;
      var index = visibilityConditions.indexOf(condition);
      if (index < 0) {
        index = visibilityConditions.length;
        visibilityConditions.push(condition);
        visibilityNames.push(Object.keys(contractVisibilityNames(condition)));
      }
      visibilityNames[index].forEach(function (name) {
        visibilityReach[name] = (visibilityReach[name] || 0) + 1;
      });
    }
    function countRollVisibility(condition, negated) {
      if (!condition || typeof condition !== 'object') return;
      if (Array.isArray(condition)) {
        condition.forEach(function (item) { countRollVisibility(item, negated); });
        return;
      }
      if (condition.not) countRollVisibility(condition.not, !negated);
      if (condition.name && condition.op) {
        var name = trim(condition.name);
        var op = trim(condition.op).toLowerCase();
        var negative = op.indexOf('not-') === 0 || op === 'neq';
        var polarity = negative !== !!negated ? 'negative' : 'positive';
        if (!rollVisibilityPolarity[name])
          rollVisibilityPolarity[name] = {
            positive: false,
            negative: false,
            positiveValues: dictionary(),
            positiveEqualityOnly: true,
          };
        rollVisibilityPolarity[name][polarity] = true;
        if (polarity === 'positive') {
          rollVisibilityPolarity[name].positiveEqualityOnly =
            rollVisibilityPolarity[name].positiveEqualityOnly && op === 'eq';
          if (own(condition, 'value'))
            rollVisibilityPolarity[name].positiveValues[String(condition.value)] = true;
        }
      }
      ['all', 'any'].forEach(function (key) { countRollVisibility(condition[key], negated); });
    }
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      if (!field.section) {
        index.fieldGlobal[trim(field.name)] = field;
        index.exact[trim(field.name)] = true;
      }
      else {
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (!index.fieldSections[section]) index.fieldSections[section] = dictionary();
        index.fieldSections[section][trim(field.name)] = field;
      }
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      function addDependency(name, scope) {
        name = trim(name);
        if (!name) return;
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (section && scope !== 'global' && index.fieldSections[section] && index.fieldSections[section][name]) return;
        index.exact[name] = true;
      }
      [field.default, field.max].forEach(function (source) {
        String(source == null ? '' : source).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
          valueReferences[trim(name)] = true;
          addDependency(name, '');
          return token;
        });
      });
      (function visit(condition) {
        if (!condition || typeof condition !== 'object') return;
        if (Array.isArray(condition)) {
          condition.forEach(visit);
          return;
        }
        if (condition.name) addDependency(condition.name, trim(condition.scope).toLowerCase());
        ['all', 'any', 'not'].forEach(function (key) { visit(condition[key]); });
      })(field.visibility);
      countVisibility(field.visibility);
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      var prefix = 'repeating_' + section + '_';
      trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var rollKey = String(roll.key);
      if (!own(index.rollsByKey, rollKey)) index.rollsByKey[rollKey] = roll;
      countVisibility(roll.visibility);
      countRollVisibility(roll.visibility, false);
      Object.keys(contractVisibilityNames(roll.visibility)).forEach(function (name) {
        index.rollVisibilityReach[name] = (index.rollVisibilityReach[name] || 0) + 1;
      });
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          var name = contractRefName(ref);
          if (name) valueReferences[name] = true;
          addExact(name);
        });
      });
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode && mode.overrides || {}).forEach(function (name) { valueReferences[name] = true; });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || field.section || !/^(?:checkbox|radio)$/i.test(trim(field.type))) return;
      if ((visibilityReach[field.name] || 0) > 1 && !valueReferences[field.name])
        index.presentationControls[field.name] = true;
    });
    Object.keys(index.presentationControls).forEach(function (name) {
      var polarity = rollVisibilityPolarity[name];
      var field = index.fieldGlobal[name];
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel)
        index.presentationRollGates[name] = true;
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      if (!index.sections[section]) index.sections[section] = [];
      Object.keys(index.fieldSections[section]).forEach(function (field) {
        if (index.sections[section].indexOf(field) < 0) index.sections[section].push(field);
      });
      var prefix = 'repeating_' + section + '_';
      if (index.prefixes.indexOf(prefix) < 0) index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + section] = true;
    });
    var sectionCounts = dictionary();
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
      index.prefixSections['repeating_' + section + '_'] = section;
      var folded = section.toLowerCase();
      sectionCounts[folded] = (sectionCounts[folded] || 0) + 1;
    });
    Object.keys(index.sections).forEach(function (section) {
      var folded = section.toLowerCase();
      var prefix = 'repeating_' + folded + '_';
      if (section === folded || sectionCounts[folded] !== 1 || own(index.prefixSections, prefix)) return;
      index.prefixSections[prefix] = section;
      index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + folded] = true;
      if (index.fieldSections[section]) trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractDisplayLabel(value) {
    var label = trim(value).replace(/^븿\s*/, '');
    if (!humanContractLabel(label)) return '';
    if (/^[\d.,%()+\-*/]+$/.test(label) || /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(label)) return '';
    if (/^mode-?[a-f0-9]{8,}$/i.test(label) || /^roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^repeating_[^.]+\.roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^[A-Za-z0-9_$-]+_(?:check|roll|attack|damage|u)$/i.test(label)) return '';
    return label;
  }

  function contractRolls(characterId, inspection, objects, includeHidden, readLive) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    readLive = readLive || cachedAttrReader(characterId);
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = readLive(name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      var sourcePrefix = 'repeating_' + sectionName + '_';
      var prefixes = [sourcePrefix].concat(index.prefixes.filter(function (prefix) {
        return prefix !== sourcePrefix && index.prefixSections[prefix] === sectionName;
      }));
      var rows = [];
      prefixes.forEach(function (prefix) {
        var physicalSection = prefix.substring(10, prefix.length - 1);
        rows = rows.concat(collectRows(characterId, physicalSection, index.sections[sectionName], attributes, index.prefixes));
      });
      var rowPrefixes = dictionary();
      var conflicts = dictionary();
      rows.forEach(function (row) {
        if (own(rowPrefixes, row.id) && rowPrefixes[row.id] !== row.prefix) conflicts[row.id] = true;
        rowPrefixes[row.id] = row.prefix;
      });
      // 실행 주소에는 prefix가 없으므로 서로 다른 물리 그룹의 같은 ID는 선택하지 않습니다.
      rowsBySection[sectionName] = rows.filter(function (row) { return !conflicts[row.id]; });
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        var visibility = contractVisibilityResult(roll.visibility, function (name, atom) {
          if (index.presentationRollGates[name]) return { known: false };
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          var hasValue = own(attributeValues, fullName);
          var liveValue = hasValue ? attributeValues[fullName].current : read(fullName, 'current');
          hasValue = hasValue || liveValue !== undefined && liveValue !== null && String(liveValue) !== '';
          if (hasValue) {
            var options = contractOptionValues(control);
            var validatesOptions = options.length > 1 ||
              /^(?:select|radio)$/i.test(trim(control && control.type));
            if (!validatesOptions || !options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        });
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        if (!visible && rawVisible && !repeating) {
          var sourceGroups = dictionary();
          String(roll.raw || '').replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (match, name) {
            var field = index.fieldGlobal[name];
            var group = contractDisplayLabel(field && field.numericCandidate ? field.groupLabel : '');
            if (group) sourceGroups[normalize(group)] = group;
            return match;
          });
          var sourceGroupKeys = Object.keys(sourceGroups);
          if (sourceGroupKeys.length === 1) visible = sourceGroups[sourceGroupKeys[0]];
        }
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var titleRefs = dictionary();
        var sourceTitleLabels = dictionary();
        var sectionFields = repeating && index.fieldSections[repeating.section] || dictionary();
        var titleValue = '';
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          var sourceField = sectionFields[refName] || index.fieldGlobal[refName] || scopedControls[refName];
          if (expressionNames.indexOf(refName) < 0 && sourceField &&
            /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
            /^(?:text|textarea)$/i.test(trim(sourceField.type)) && !sourceField.hidden &&
            !sourceField.readonly && !sourceField.disabled && !trim(sourceField.default) &&
            // ponytail: 이름칸은 굴림 4개까지만; 더 공유하면 상한 확대.
            (index.labelRefFrequency[refName] || 0) <= 4) {
            var fieldLabels = [sourceField.label].concat(sourceField.aliases || []).map(normalize).filter(Boolean);
            var rawKey = normalize(rawVisible).replace(/(?:name|check|roll)$/i, '');
            var refKey = normalize(refName).replace(/(?:name|check|roll)$/i, '');
            var machineNamed = (normalize(rawVisible) === normalize(roll.name) || normalize(rawVisible) === normalize(roll.key)) &&
              rawKey && refKey && (rawKey.indexOf(refKey) > -1 || refKey.indexOf(rawKey) > -1);
            var editableTitle = /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              /(?:^|_)(?:name|title|label)(?:_|$)/i.test(refName);
            if (fieldLabels.indexOf(normalize(rawVisible)) > -1 || machineNamed || editableTitle) {
              titleRefs[refName] = true;
              fieldLabels.forEach(function (label) { sourceTitleLabels[label] = true; });
            }
          }
          if (expressionNames.indexOf(refName) > -1) {
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (titleRefs[refName] && value && !titleValue) titleValue = value;
          if (value) dynamic.push({
            value: value,
            frequency: index.labelRefFrequency[refName] || 0,
            title: !!titleRefs[refName],
            subject: /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              sourceField && /^(?:text|textarea)$/i.test(trim(sourceField.type)),
          });
        });
        if (Object.keys(titleRefs).length) {
          if (!titleValue) return;
          rawVisible = '';
          visible = '';
          staticLabels = staticLabels.filter(function (label) { return !sourceTitleLabels[normalize(label)]; });
        }
        dynamic.sort(function (left, right) {
          return Number(!!right.title) - Number(!!left.title) || left.frequency - right.frequency;
        });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var subjectLabels = usefulDynamic.filter(function (entry) { return entry.subject; })
          .map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels :
          !roll.name && !staticLabels.length && subjectLabels.length ? subjectLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat((roll.aliases || []).filter(function (label) { return !sourceTitleLabels[normalize(label)]; }))
          .concat(staticLabels)
          .concat(expressionNames.length === 1 ? ['자유 주사위', expressionNames[0]] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          characterId: characterId,
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: displayLabels[0] || '',
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function actionableContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    objects = objects || attrObjects(characterId);
    readLive = readLive || cachedAttrReader(characterId);
    var rolls = [];
    candidates.forEach(function (candidate) {
      rolls = rolls.concat(contractRolls(characterId, candidate, objects, includeHidden, readLive));
    });
    return rolls;
  }

  function contractFieldMatch(index, name) {
    if (index.fieldGlobal[name]) return { field: index.fieldGlobal[name], name: name, rowId: '' };
    var matches = triePrefixes(index.fieldPrefixes, name);
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      var match = matches[i];
      var fieldName = matchedField(match.fields, name, match.prefix.length);
      if (!fieldName) continue;
      var suffix = '_' + fieldName;
      var rowId = name.substring(match.prefix.length, name.length - suffix.length);
      if (!rowId) continue;
      return {
        field: index.fieldSections[match.section][fieldName],
        name: name,
        rowId: rowId,
        section: match.section,
        prefix: match.prefix,
      };
    }
    return null;
  }

  function localFieldLabel(field) {
    var label = contractDisplayLabel(field && field.label);
    var group = contractDisplayLabel(field && field.groupLabel);
    if (!group) return label;
    var groupKey = normalize(group);
    var candidates = [label].concat(field && field.aliases || []).map(contractDisplayLabel);
    for (var index = 0; index < candidates.length; index += 1) {
      var key = normalize(candidates[index]);
      if (groupKey && key.indexOf(groupKey) === 0) key = key.slice(groupKey.length);
      else if (groupKey && key.slice(-groupKey.length) === groupKey) key = key.slice(0, -groupKey.length);
      if (/^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(key)) return '현재';
      if (/^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/i.test(key)) return '최대';
      if (/^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/i.test(key)) return '시작';
      if (/^(?:45|80%|threshold|문턱값|기준값)$/i.test(key)) return '4/5';
    }
    return label;
  }

  function fieldChoiceLegend(value) {
    return /(?:^|\s)-?\d+(?:\.\d+)?\s*=\s*\S+/.test(trim(value));
  }

  function fieldRangeOnly(value) {
    return /^\(?\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)?$/i.test(trim(value));
  }

  function cleanFieldRange(value) {
    return trim(value).replace(/\s*\(\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)\s*$/i, '');
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) {
      var sourceLabel = contractDisplayLabel(field && field.label);
      label = /^(?:현재|current|now).+|.+(?:현재|current|now)$/i.test(normalize(sourceLabel)) &&
        normalize(sourceLabel) !== normalize(name) && !generic.test(normalize(sourceLabel))
        ? sourceLabel : group;
    }
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label)) || fieldChoiceLegend(label)) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias)) &&
          !fieldChoiceLegend(alias) && !fieldRangeOnly(alias);
      })[0];
      if (preferred) label = cleanFieldRange(preferred);
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function userFacingField(field) {
    var name = trim(field && field.name);
    var label = contractDisplayLabel(field && field.label);
    if (label && (normalize(label) !== normalize(name) || /[가-힣]/.test(name))) return true;
    return (field && field.aliases || []).some(function (alias) {
      return contractDisplayLabel(alias) && normalize(alias) !== normalize(name);
    });
  }

  function numericFieldValue(characterId, value, defaults, rowContext) {
    if (value === undefined || value === null || trim(value) === '') return null;
    var resolved = resolvedResourceValue(characterId, value, defaults, rowContext);
    return resolved.number === null || !isFinite(resolved.number) ? null : resolved.number;
  }

  function fieldAliases(field, label, rowLabel, fullName) {
    var seen = dictionary();
    return [label, rowLabel, localFieldLabel(field)]
      .concat(field && field.aliases || [])
      .concat([field && field.name, fullName])
      .map(trim).filter(function (alias) {
        var key = normalize(alias);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function fieldPairLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    return fieldPairLabels(field, label, rowLabel).concat(field && field.aliases || [])
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function maximumFieldLabel(labels) {
    return (labels || []).some(function (label) {
      return /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalize(label)) ||
        /^(?:최대|maximum|max).+$/i.test(normalize(label));
    });
  }

  function fieldPairKeys(labels) {
    var ignored = {
      current: true, maximum: true, max: true, value: true, score: true,
      현재: true, 최대: true, 값: true, 수치: true, 점수: true,
    };
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(label);
      var stripped = key.replace(/^(?:현재|최대|current|maximum|max)/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || ignored[candidate] || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function fieldPairNameKey(name) {
    return normalize(name)
      .replace(/^(?:현재|최대|current|maximum|max|now)/i, '')
      .replace(/(?:현재|최대|current|maximum|max|now)$/i, '');
  }

  function pairResourceMaximums(resources, references) {
    var maximumByKey = dictionary();
    var maximumByName = dictionary();
    (references || []).forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      var nameKey = fieldPairNameKey(candidate.name);
      if (nameKey) {
        if (!maximumByName[nameKey]) maximumByName[nameKey] = [];
        maximumByName[nameKey].push({ candidate: candidate, index: index });
      }
      fieldPairKeys(candidate.pairLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    (resources || []).forEach(function (item) {
      if (item.max !== null || maximumFieldLabel(item.sourceLabels)) return;
      var scores = dictionary();
      var candidates = [];
      function score(entry, amount) {
        if (entry.candidate.name === item.name) return;
        if (!scores[entry.index]) candidates.push(entry);
        scores[entry.index] = (scores[entry.index] || 0) + amount;
      }
      fieldPairKeys(item.pairLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          score(entry, 1);
        });
      });
      (maximumByName[fieldPairNameKey(item.name)] || []).forEach(function (entry) {
        score(entry, 1000);
      });
      var best = 0;
      var match = null;
      var matchCount = 0;
      candidates.forEach(function (entry) {
        var score = scores[entry.index];
        if (score < best) return;
        if (score > best) {
          best = score;
          match = entry.candidate;
          matchCount = 1;
        } else matchCount += 1;
      });
      if (matchCount === 1) {
        item.max = match.value;
        item._maxDefinition = match._definition || '';
      }
    });
  }

  function liveResourceFields(fields) {
    var result = dictionary();
    var maximums = dictionary();
    var maximumsByName = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      var nameKey = fieldPairNameKey(field.name);
      if (nameKey) {
        if (!maximumsByName[nameKey]) maximumsByName[nameKey] = [];
        maximumsByName[nameKey].push(field);
      }
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !/^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) return;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      var namedMaximums = maximumsByName[fieldPairNameKey(field.name)] || [];
      if (namedMaximums.length === 1 && namedMaximums[0] !== field) {
        result[field.name] = true;
        result[namedMaximums[0].name] = true;
      }
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
  }

  function contractUnsavedFieldValue(field, live, fallback, maximum) {
    var variants = !maximum && Array.isArray(field && field.defaultVariants) ? field.defaultVariants : [];
    if (variants.length) fallback = variants[0];
    if (live !== undefined && live !== null && trim(live) !== '') {
      var hiddenDefault = variants.slice(1).some(function (value) {
        return trim(value) === trim(live);
      });
      if (!hiddenDefault) return live;
    }
    return fallback;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive, includeDefinition) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
      else if (trim(field.type).toLowerCase() === 'checkbox') fieldDefaults[field.name] = '0';
    });
    readLive = readLive || cachedAttrReader(characterId);
    var attributes = objects || attrObjects(characterId);
    var attributeByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeByName[name] = attribute;
    });
    var rowLabels = dictionary();
    (rolls || []).forEach(function (instance) {
      var repeating = instance.roll && contractRepeating(instance.roll);
      if (!instance.row || !repeating) return;
      var section = trim(repeating.section);
      var key = (instance.row.prefix || 'repeating_' + section + '_') + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = match.prefix + match.rowId + '_' + name;
        if (attributeByName[fullName])
          return { known: true, value: attributeByName[fullName].get('current') };
        var live = readLive(fullName, 'current');
        if (live !== undefined && live !== null && String(live) !== '')
          return { known: true, value: live };
        var sourceField = match.section && index.fieldSections[match.section]
          ? index.fieldSections[match.section][name]
          : index.fieldGlobal[name];
        if (sourceField && own(sourceField, 'default'))
          return { known: true, value: sourceField.default };
        var control = index.controls[name];
        return control && own(control, 'default')
          ? { known: true, value: control.default }
          : { known: false };
      });
    }
    function fieldRowContext(match) {
      if (!match.section || !match.rowId) return null;
      var fields = index.fieldSections[match.section] || dictionary();
      var prefix = match.prefix + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if (attribute) {
          if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
          if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        } else {
          current = contractUnsavedFieldValue(field, readLive(fullName, 'current'), field.default, false);
          var liveMaximum = readLive(fullName, 'max');
          maximum = liveMaximum !== undefined && liveMaximum !== null && trim(liveMaximum) !== ''
            ? liveMaximum : field.max;
        }
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function sourceFieldValue(name, valueType) {
      var attribute = attributeByName[name];
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      var field = index.fieldGlobal[name];
      var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
      var live = readLive(name, valueType);
      if (valueType !== 'max' && field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled)
        return contractUnsavedFieldValue(field, live, fallback, false);
      return live !== undefined && live !== null && trim(live) !== '' ? live : fallback;
    }
    var valueContext = { scopes: [], values: dictionary(), resolveAttribute: sourceFieldValue };
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field)) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.prefix + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match) || valueContext;
      rowContext.resolveAttribute = sourceFieldValue;
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
        field.defaultVariants || [],
      ]) : '';
      var number = /^(?:text|number|range)$/.test(type)
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !index.presentationControls[field.name] && !!field.trackCandidate &&
        (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
      };
      if (number === null) return;
      // A literal HTML input limit is not the character's resource maximum.
      var sourceMaximum = /@\{[^}]+\}/.test(trim(field.max)) ? field.max : '';
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && sourceMaximum) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = sourceMaximum;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        statusResource: statusResource,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
        _maxDefinition: sourceMaximum ? JSON.stringify(sourceMaximum) : '',
      };
      result.references.push(item);
      if (!field.numericCandidate) return;
      result.resources.push(item);
      result.byAttribute[fullName] = item;
      aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!result.aliases[key]) result.aliases[key] = [];
        result.aliases[key].push(item);
      });
    }
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      var name = trim(field.name);
      var attribute = attributeByName[name];
      if (attribute) add({ field: field, name: name, rowId: '' }, attribute);
      else if (!field.hidden && field.trackCandidate && trim(field.type).toLowerCase() === 'checkbox')
        add({ field: field, name: name, rowId: '' }, null, field.default);
      else if (!field.hidden && /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          fallback = contractUnsavedFieldValue(field, live, fallback, false);
        }
        add({ field: field, name: name, rowId: '' }, null, fallback);
      }
    });
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (index.fieldGlobal[name]) return;
      var match = contractFieldMatch(index, name);
      if (match && match.section) add(match, attribute);
    });
    pairResourceMaximums(result.resources, result.references);
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function contractFieldItemFingerprint(item) {
    return JSON.stringify([
      item.name, item._structure || '', item.kind || '', trim(item.onValue),
      item.writable !== false, item.automationVisible === true,
    ]);
  }

  function commonContractFieldItems(characterId, inspection, objects, rolls, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractFieldItems(characterId, inspection, objects, rolls, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length)
      return { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    var results = candidates.map(function (candidate) {
      return contractFieldItems(
        characterId,
        candidate,
        objects,
        contractRolls(characterId, candidate, objects, false, readLive),
        readLive,
        true,
      );
    });
    function shared(property, dictionaryProperty) {
      var lists = results.map(function (result) {
        return dictionaryProperty
          ? Object.keys(result[property] || {}).map(function (name) { return result[property][name]; })
          : result[property] || [];
      });
      var indexes = lists.slice(1).map(function (items) {
        var found = dictionary();
        items.forEach(function (item) { found[contractFieldItemFingerprint(item)] = item; });
        return found;
      });
      return (lists[0] || []).filter(function (item) {
        var key = contractFieldItemFingerprint(item);
        return indexes.every(function (index) { return !!index[key]; });
      }).map(function (item) {
        var key = contractFieldItemFingerprint(item);
        var peers = [item].concat(indexes.map(function (index) { return index[key]; }));
        var merged = merge({}, item);
        ['aliases', 'sourceLabels'].forEach(function (property) {
          var seen = dictionary();
          merged[property] = [];
          peers.forEach(function (peer) {
            (peer[property] || []).forEach(function (value) {
              var normalized = normalize(value);
              if (!normalized || seen[normalized]) return;
              seen[normalized] = true;
              merged[property].push(value);
            });
          });
        });
        if (!own(item, 'max')) return merged;
        merged.max = peers.every(function (peer) {
          return peer.max === item.max;
        }) ? item.max : null;
        return merged;
      });
    }
    var value = {
      resources: shared('resources'),
      tracked: dictionary(),
      aliases: dictionary(),
      byAttribute: dictionary(),
      references: shared('references'),
    };
    pairResourceMaximums(value.resources, value.references);
    shared('tracked', true).forEach(function (item) { value.tracked[item.name] = item; });
    value.resources.forEach(function (item) {
      value.byAttribute[item.name] = item;
      item.aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!value.aliases[key]) value.aliases[key] = [];
        value.aliases[key].push(item);
      });
    });
    return value;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete attributeObjectCache[characterId];
    } else {
      cache = {};
      attributeObjectCache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    if (!force && cache[characterId] && cache[characterId].characterName === trim(character.get('name')))
      return cache[characterId];
    var objects = attrObjects(characterId);
    attributeObjectCache[characterId] = objects;
    var contractMatch = contractMatchCache[characterId] || inspectContracts(characterId, objects);
    var value = {};
    value.warnings = [];
    value.ok = true;
    value.profileId = 'sheet';
    value.score = contractMatch.match && contractMatch.match.score || 0;
    value.matched = contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    value.attributeByName = dictionary();
    objects.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) value.attributeByName[name] = attribute;
    });
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = commonContractRolls(characterId, value.contractMatch, true, objects, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = commonContractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
    value.resources = fields.resources;
    value.trackedFields = fields.tracked;
    value.resourceAliases = fields.aliases;
    value.resourcesByAttribute = fields.byAttribute;
    value.fieldReferences = fields.references;
    cache[characterId] = value;
    return value;
  }

  function scannedContractRolls(characterId, includeHidden) {
    var data = scan(characterId);
    return (includeHidden ? data.contractAllRolls : data.contractRolls) || [];
  }

  function preferredContractRolls(data) {
    // 일반/보너스 짝을 먼저 고른 뒤 시트 후보 간 동등화를 해야 짝이 유실되지 않습니다.
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false);
    var preferred = dictionary();
    collapseEquivalentContractCandidates(data.characterId, preferSingleInlineRollActions(
      uniqueContractCandidates(instances.map(function (instance) {
        return { instance: instance };
      })),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    return instances.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기', '장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시', '일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check|굴림|roll|판정)$/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function matchesDetectedRole(labels, role) {
    var wanted = DETECTED_ROLE_LABELS[role] || [];
    return detectedLabelKeys(labels).some(function (key) { return wanted.indexOf(key) > -1; });
  }

  function uniqueDetectedItems(items, role) {
    function collect(useToggleAliases) {
      var seen = dictionary();
      return (items || []).filter(function (item) {
        var labels = item && item.kind === 'toggle' && item.fieldLabel && !useToggleAliases
          ? [item.fieldLabel] : item && item.sourceLabels;
        if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
        seen[item.name] = true;
        return true;
      });
    }
    var matches = collect(false);
    if (!matches.length && (items || []).some(function (item) { return item && item.kind === 'toggle'; }))
      matches = collect(true);
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function linkedStartingSanityField(item, sanityName, labels) {
    var starting = detectedLabelKeys(labels).some(function (key) {
      return /^(?:시작|초기|starting|initial|start)(?:값|수치|점수|value|score)?$/i.test(key);
    });
    var candidateKey = fieldPairNameKey(item && item.name)
      .replace(/^(?:starting|initial|start|시작|초기)/i, '')
      .replace(/(?:starting|initial|start|시작|초기)$/i, '');
    return starting && candidateKey && candidateKey === fieldPairNameKey(sanityName);
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (data.resources || []).filter(function (item) {
          return role === 'startingSanity' ||
            !maximumFieldLabel(item.sourceLabels) &&
            !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
        });
    var detected = uniqueDetectedItems(items, role);
    if (role !== 'startingSanity' || detected.matches.length) return detected;
    var sanity = uniqueDetectedItems((data.resources || []).filter(function (item) {
      return !maximumFieldLabel(item.sourceLabels) &&
        !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
    }), 'sanity');
    if (!sanity.item) return detected;
    var seen = dictionary();
    var matches = items.filter(function (item) {
      if (!item || item.automationVisible !== true || seen[item.name] ||
        !linkedStartingSanityField(item, sanity.item.name, item.sourceLabels)) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function detectedRollLabels(instance) {
    return [instance && instance.label, instance && instance.roll && instance.roll.label]
      .concat(instance && instance.roll && instance.roll.aliases || [])
      .concat((instance && instance.roll && instance.roll.staticLabels || []).map(function (entry) {
        return entry && entry.value;
      }));
  }

  function neutralSourceRoll(instance) {
    var roll = instance && instance.roll;
    if (!roll || (Array.isArray(instance.modes) && instance.modes.length)) return false;
    var diceFields = 0;
    String(roll.raw || '').replace(/\{\{\s*[^={}]+?\s*=\s*([^}]*)\}\}/g, function (token, value) {
      if (/\[\[[\s\S]*?\b\d*d\d+/i.test(value)) diceFields += 1;
      return token;
    });
    if (diceFields !== 1) return false;
    var template = instance.contract && instance.contract.resultTemplates &&
      instance.contract.resultTemplates[roll.template];
    var groups = dictionary();
    (template && Array.isArray(template.rules) ? template.rules : []).forEach(function (rule) {
      if (rule && own(rule, 'group')) groups[String(rule.group)] = true;
    });
    return Object.keys(groups).length <= 1;
  }

  function detectedRollRole(data, role) {
    var seen = dictionary();
    var rolls = preferredContractRolls(data);
    var matches = rolls.filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (!matches.length) {
      var field = detectedFieldRole(data, role, 'resource');
      var namedFields = (data.resources || []).filter(function (item) {
        return item.automationVisible === true && matchesDetectedRole([item.name], role);
      });
      var name = field.item && field.item.name || (namedFields.length === 1 && namedFields[0].name);
      seen = dictionary();
      if (name) matches = rolls.filter(function (instance) {
        var key = instance && instance.key;
        var references = false;
        String(instance && instance.roll && instance.roll.raw || '').replace(
          /@\{([^{}|]+)(?:\|max)?\}/g,
          function (token, sourceName) {
            if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(sourceName)) === name)
              references = true;
            return token;
          },
        );
        if (!key || seen[key] || !references) return false;
        seen[key] = true;
        return true;
      });
    }
    matches = preferSingleInlineRollActions(matches.map(function (instance) {
      return { instance: instance };
    })).map(function (candidate) { return candidate.instance; });
    if (matches.length > 1) {
      var neutral = matches.filter(neutralSourceRoll);
      if (neutral.length === 1) matches = neutral;
    }
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

 function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function(id){return id==='all'||getObj('player',id)&&!playerIsGM(id);});
  }

  function profileCharacters() {
    return characterObjects().filter(function (character) {
      return usableContractInspection(inspectContracts(character.id));
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    if (!explicitId && msg && own(msg, '_kibSheetResolvedCharacter'))
      return msg._kibSheetResolvedCharacter;
    var resolved = resolveCharacterNow(msg, explicitId);
    if (!explicitId && msg) msg._kibSheetResolvedCharacter = resolved;
    return resolved;
  }

  function speakingCharacter(msg) {
    var player = getObj('player', msg && msg.playerid);
    var match = trim(player && player.get('speakingas')).match(/^character\|(.+)$/i);
    if (!match)
      return { ok: false, error: '채팅 입력창의 As를 사용할 캐릭터로 바꾼 뒤 다시 입력해 주세요.' };
    var character = getObj('character', match[1]);
    if (!character) return { ok: false, error: '현재 As 캐릭터를 찾지 못했습니다.' };
    return canControl(character, msg.playerid)
      ? { ok: true, character: character }
      : { ok: false, error: '현재 As 캐릭터를 조작할 권한이 없습니다.' };
  }

  function resolveCharacterNow(msg, explicitId) {
    if (explicitId) {
      var direct = getObj('character', explicitId);
      if (!direct) return { ok: false, error: '버튼에 기록된 캐릭터를 찾지 못했습니다.' };
      if (!canControl(direct, msg.playerid))
        return { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    var speaking = speakingCharacter(msg);
    if (!speaking.ok) return speaking;
    if (explicitId && speaking.character.id !== explicitId)
      return { ok: false, error: '현재 As 캐릭터와 버튼에 기록된 캐릭터가 다릅니다. 현재 As의 현황을 다시 열어 주세요.' };
    return speaking;
  }

  function resolveInspectionCharacter(msg) {
    if (playerIsGM(msg.playerid)) {
      var managed = getObj('character', initState().managerCharacterId);
      if (managed) return { ok: true, character: managed };
    }
    return resolveCharacter(msg, '');
  }

  function ensureSheet(character) {
    var contractMatch = inspectContracts(character.id);
    if (!usableContractInspection(contractMatch))
      return {
        ok: false,
        error: contractMatch.error || SHEET_NOT_RECOGNIZED,
      };
    return { ok: true, data: scan(character.id) };
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function contractCutinKey(instance) {
    return resultKey('sheet', instance.key);
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateHasField(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\{\\{\\s*' + escaped + '\\s*=', 'i').test(content);
  }

  function contractResultMode(message, payload) {
    var mode = 'normal';
    var modeLabel = normalize(payload && payload.modeLabel);
    if (/(?:보너스|bonus).*2/.test(modeLabel)) mode = 'bonus2';
    else if (/(?:보너스|bonus).*1/.test(modeLabel)) mode = 'bonus1';
    else if (/(?:패널티|페널티|penalty).*2/.test(modeLabel)) mode = 'penalty2';
    else if (/(?:패널티|페널티|penalty).*1/.test(modeLabel)) mode = 'penalty1';
    var diceType = templateValue(message, 'dice_type');
    if (mode === 'normal') {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    return mode;
  }

  function sourceResultTemplateForContract(contract, key) {
    if (!contract || !contract.resultTemplates) return null;
    var roll = contractRuntimeIndex(contract).rollsByKey[String(key)];
    if (!roll || !roll.template) return null;
    if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
    var wanted = normalize(roll.template);
    var names = Object.keys(contract.resultTemplates);
    for (var index = 0; index < names.length; index += 1) {
      if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
    }
    return null;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) === String(payload.contractId))
        return sourceResultTemplateForContract(contract, payload.key);
    }
    return null;
  }

  function sourceResultOperand(message, value) {
    var raw = trim(value);
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    return templateValue(message, raw);
  }

  function sourceResultCondition(message, condition) {
    if (!condition || !Array.isArray(condition.args) || !condition.args.length) return false;
    var matched = false;
    if (condition.op === 'present') matched = templateHasField(message, condition.args[0]);
    else {
      var left = sourceResultOperand(message, condition.args[0]);
      if (left === null) matched = false;
      else if (condition.op === 'eq') {
        var right = sourceResultOperand(message, condition.args[1]);
        matched = right !== null && left === right;
      } else if (condition.op === 'gt') {
        var greater = sourceResultOperand(message, condition.args[1]);
        matched = greater !== null && left > greater;
      } else if (condition.op === 'lt') {
        var less = sourceResultOperand(message, condition.args[1]);
        matched = less !== null && left < less;
      } else if (condition.op === 'between') {
        var lower = sourceResultOperand(message, condition.args[1]);
        var upper = sourceResultOperand(message, condition.args[2]);
        matched = lower !== null && upper !== null && left >= lower && left <= upper;
      }
    }
    return condition.not ? !matched : matched;
  }

  function sourceResultGroupMatches(group, mode) {
    var expected = mode === 'bonus2' ? '+2'
      : mode === 'bonus1' ? '+1'
        : mode === 'penalty2' ? '-2'
          : mode === 'penalty1' ? '-1'
            : '0';
    return String(group) === expected;
  }

  function sourceContractResult(message, payload, mode) {
    var template = sourceResultTemplate(payload);
    var rules = template && Array.isArray(template.rules) ? template.rules : [];
    if (!rules.length) return null;
    var grouped = rules.some(function (rule) { return own(rule, 'group'); });
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (!rule || !OUTCOMES[rule.outcome] || !Array.isArray(rule.conditions)) continue;
      if (grouped && (!own(rule, 'group') || !sourceResultGroupMatches(rule.group, mode))) continue;
      if (!rule.conditions.every(function (condition) { return sourceResultCondition(message, condition); })) continue;
      var total = templateValue(message, rule.valueField);
      if (total === null) continue;
      return { total: total, outcome: rule.outcome, outcomeLabel: OUTCOMES[rule.outcome] };
    }
    return null;
  }

 function contractResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var critical = templateValue(message, 'critical');
    var fumble = templateValue(message, 'fumble');
    var mode = contractResultMode(message, payload);
    var sourceOutcome = sourceContractResult(message, payload, mode);
    if (sourceOutcome) {
      sourceOutcome.target = target;
      sourceOutcome.hard = hard;
      sourceOutcome.extreme = extreme;
      sourceOutcome.mode = mode;
      return sourceOutcome;
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'normal' && rolled === null) rolled = roll1;
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (target === null) {
      var genericTotal = rolled;
      if (genericTotal === null && message && Array.isArray(message.inlinerolls) && message.inlinerolls.length) {
        var firstTotal = message.inlinerolls[0] && message.inlinerolls[0].results && Number(message.inlinerolls[0].results.total);
        genericTotal = isFinite(firstTotal) ? firstTotal : null;
      }
      return genericTotal === null ? null : { total: genericTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (rolled === null) return null;
    var outcome = 'failure';
    if (critical !== null && rolled <= critical) outcome = 'critical';
    else if (fumble !== null && rolled >= fumble) outcome = 'fumble';
    else if (extreme !== null && rolled <= extreme) outcome = 'extreme';
    else if (hard !== null && rolled <= hard) outcome = 'hard';
    else if (rolled <= target) outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    var result = payload.contractId ? contractResult(message, payload) : null;
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var automaticInsanity = payload._automaticInsanity;
    delete payload._automaticInsanity;
    if (automaticInsanity) finishAutomaticInsanity(payload, result, automaticInsanity);
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function messageTemplateFields(message) {
    var fields = dictionary();
    String(message && message.content || '').replace(/\{\{\s*([^={}]+?)\s*=\s*([^}]*)\}\}/g, function (token, name, value) {
      fields[trim(name).toLowerCase()] = trim(value);
      return token;
    });
    return fields;
  }

  function sourceTemplateFieldNames(raw) {
    var found = dictionary();
    String(raw || '').replace(/\{\{\s*([^={}]+?)\s*=/g, function (token, name) {
      found[trim(name).toLowerCase()] = true;
      return token;
    });
    return Object.keys(found);
  }

  function normalizedTemplateText(value) {
    return normalize(String(value == null ? '' : value).replace(/<[^>]*>/g, ' '));
  }

  function directResultCharacters(message, fields) {
    var speaking = speakingCharacter(message);
    return speaking.ok ? [speaking.character] : [];
  }

  function directInstanceScore(characterId, instance, fields) {
    var roll = instance.roll || {};
    var score = 0;
    var rejected = false;
    var hasIdentity = false;
    var matchedIdentity = false;
    (Array.isArray(roll.staticLabels) ? roll.staticLabels : []).forEach(function (entry) {
      if (rejected || !entry || typeof entry !== 'object' || !entry.field) return;
      hasIdentity = true;
      var field = trim(entry.field).toLowerCase();
      if (!own(fields, field)) return;
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(entry.value)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
      if (rejected || !ref || !ref.field) return;
      hasIdentity = true;
      var field = trim(ref.field).toLowerCase();
      if (!own(fields, field)) return;
      var expected = contractLabelRef(characterId, instance.contract, roll, instance.row, ref);
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(expected)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    if (rejected || (hasIdentity && !matchedIdentity)) return -1;
    sourceTemplateFieldNames(roll.raw).forEach(function (field) {
      if (own(fields, field)) score += 1;
    });
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    (instance.aliases || []).forEach(function (alias) {
      if (values[normalize(alias)]) score += 3;
    });
    return score;
  }

  function directInstanceIdentity(instance) {
    var roll = instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(roll.name),
      normalize(roll.template),
      normalize(instance.label),
      repeating && repeating.section || '',
      instance.row && instance.row.id || '',
      roll.staticLabels || [],
      roll.labelRefs || [],
    ]);
  }

  function captureDirectResult(message) {
    if (!message || !message.rolltemplate || !Array.isArray(message.inlinerolls)) return false;
    var fields = messageTemplateFields(message);
    var matches = [];
    directResultCharacters(message, fields).forEach(function (character) {
      var data = scan(character.id);
      if (!data.ok || !data.contractMatch) return;
      var instances = data.contractMatch.status === 'matched'
        ? data.contractRolls
        : actionableContractRolls(character.id, data.contractMatch, false);
      var template = normalize(message.rolltemplate);
      instances.forEach(function (instance) {
        if (normalize(instance.roll && instance.roll.template) !== template) return;
        var score = directInstanceScore(character.id, instance, fields);
        if (score > 0) matches.push({ character: character, instance: instance, score: score });
      });
    });
    if (!matches.length) return false;
    var bestScore = Math.max.apply(Math, matches.map(function (match) { return match.score; }));
    var best = matches.filter(function (match) { return match.score === bestScore; });
    var keys = dictionary();
    best.forEach(function (match) { keys[contractCutinKey(match.instance)] = true; });
    if (Object.keys(keys).length !== 1) {
      var identities = dictionary();
      best.forEach(function (match) { identities[directInstanceIdentity(match.instance)] = true; });
      if (Object.keys(identities).length !== 1) return false;
    }
    var match = best[0];
    emitResult({
      source: 'sheet',
      system: 'sheet',
      kind: match.instance.roll.kind || 'contract',
      characterId: match.character.id,
      contractId: match.instance.contract.id,
      sourceHash: match.instance.contract.sourceHash || '',
      key: match.instance.roll.key,
      label: match.instance.label,
      aliases: match.instance.aliases || [],
      cutinKey: contractCutinKey(match.instance),
      mode: '',
      modeLabel: '',
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    }, message);
    return true;
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/<!--\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*-->/i) ||
      content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch) {
      if (own(pendingResults, tokenMatch[1])) {
        var pending = pendingResults[tokenMatch[1]];
        delete pendingResults[tokenMatch[1]];
        emitResult(pending.payload, message);
      }
      return true;
    }
    return captureDirectResult(message);
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' <!--kib_sheet_result=' + token + '-->');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes, defaults, rowContext) {
    var candidates = [];
    var rowLocal = rowContext && rowContext.fields && own(rowContext.fields, name);
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    if (!rowLocal) candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var valueKey = candidates[i].name + '|' + valueType;
      var resolved = !rowLocal && rowContext && typeof rowContext.resolveAttribute === 'function'
        ? rowContext.resolveAttribute(candidates[i].name, valueType) : undefined;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : resolved !== undefined ? resolved
          : getAttr(characterId, candidates[i].name, valueType);
      if ((value === undefined || trim(value) === '') && defaults && own(defaults, candidates[i].name))
        value = defaults[candidates[i].name];
      if (value !== undefined && trim(value) !== '')
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail, defaults, rowContext) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || [], defaults, rowContext);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = dictionary();
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
        defaults,
        rowContext,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

 function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: (instance.label || '시트 굴림') + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      used[key] = (used[key] || 0) + 1;
      choice.label += ' (선택 ' + used[key] + ')';
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = null;
    var failed = '';
    var expansions = 0;
    function savedAttribute(name) {
      if (!savedAttributes) {
        savedAttributes = dictionary();
        (attributeObjectCache[characterId] || attrObjects(characterId)).forEach(function (attribute) {
          savedAttributes[trim(attribute.get('name'))] = attribute;
        });
      }
      return savedAttributes[name] || null;
    }
    function sourceValue(name, maximum) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var value = field && field[maximum ? 'max' : 'default'];
      if ((value === undefined || value === null || trim(value) === '') && !maximum) {
        var control = sourceControls[name] || runtimeIndex.controls[name];
        value = control && control.default;
      }
      if ((value === undefined || value === null || trim(value) === '') && !maximum && field && field.type === 'checkbox')
        value = '0';
      return value === undefined || value === null || trim(value) === '' ? null : String(value);
    }
    function missingValueError(name) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var label = field && userFacingField(field) ? fieldLabel(field, '') : '';
      var rollLabel = contractDisplayLabel(instance.label) || '선택한';
      return label && normalize(label) !== normalize(rollLabel)
        ? rollLabel + ' 굴림에 필요한 ' + label + ' 값이 비어 있습니다.'
        : rollLabel + ' 굴림에 필요한 수치가 비어 있습니다.';
    }
    function expand(fragment, depth, trail, required) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body, offset) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        var requiredHere = required || source.lastIndexOf('[[', offset) > source.lastIndexOf(']]', offset);
        if (!maximum && own(overrides, name)) {
          if (requiredHere && trim(overrides[name]) === '') {
            failed = missingValueError(name);
            return '';
          }
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail, requiredHere);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var live = stored ? null : getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null && !maximum
            ? contractUnsavedFieldValue(sourceField, live, visibleDefault, false)
            : live;
        if (actual !== undefined && actual !== null && trim(actual) !== '' && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail, requiredHere);
        }
        if (actual !== undefined && actual !== null && trim(actual) !== '') return String(actual);
        if (stored) {
          var savedField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
          if (savedField && savedField.type === 'checkbox') return '0';
          if (!savedField || !savedField.hidden) {
            if (requiredHere) failed = missingValueError(name);
            return '';
          }
        }
        var fallback = sourceValue(name, maximum);
        if (fallback !== null) {
          var fallbackKey = 'default|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[fallbackKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var fallbackTrail = dictionary();
          Object.keys(trail).forEach(function (key) { fallbackTrail[key] = true; });
          fallbackTrail[fallbackKey] = true;
          return expand(fallback, depth + 1, fallbackTrail, requiredHere);
        }
        if (requiredHere) failed = missingValueError(name);
        return '';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {}, false);
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 굴림 방식이 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression, modeLabelOverride);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트에서 같은 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    var content = qualified.content;
    var system = 'sheet';
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(instance),
      mode: mode ? String(mode.id || '') : normalize(modeLabelOverride),
      modeLabel: trim(modeLabelOverride) || modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status !== 'matched' &&
        !(inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'))
      return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
    var allowed = inspection.status === 'matched'
      ? [inspection.contract.id]
      : (inspection.matches || []).map(function (match) { return match.id; });
    if (allowed.indexOf(String(contractId)) < 0)
      return { ok: false, error: '선택한 굴림 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = actionableContractRolls(characterId, inspection, !!includeHidden).filter(function (instance) {
      return String(instance.contract.id) === String(contractId) &&
        String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 굴림 또는 반복행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 굴림은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible, primaryOnly) {
    var found = dictionary();
    var result = [];
    var labels = primaryOnly ? [instance.label,
      trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, '')] : instance.aliases || [];
    labels.forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible, primaryOnly) {
    var actionAliases = contractInstanceAliases(instance, compatible, primaryOnly);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractUserModeLabels(mode).forEach(function (label) {
        modeAliases = modeAliases.concat(contractLookupKeys(label, compatible));
      });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, modeValues: modeAliases,
        exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function contractMatchRank(values, wanted) {
    var best = 3;
    values.forEach(function (value) {
      wanted.forEach(function (key) {
        if (value === key) best = 0;
        else if (best > 1 && value.indexOf(key) === 0) best = 1;
        else if (best > 2 && value.indexOf(key) > -1) best = 2;
      });
    });
    return best;
  }

  function closestContractActions(instances, query, includeHidden) {
    var wanted = contractLookupKeys(query, true);
    var best = 12;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted) * 4 +
        contractMatchRank(contractInstanceAliases(instance, true, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 12 ? found : [];
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key + '|' +
        String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractBehaviorContent(value, instance) {
    var content = String(value);
    var identityFields = dictionary();
    (instance.roll.labelRefs || []).concat(instance.roll.staticLabels || []).forEach(function (entry) {
      var field = trim(entry && entry.field);
      if (field) identityFields[field] = true;
    });
    Object.keys(identityFields).forEach(function (field) {
      var escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp('(\\{\\{\\s*' + escaped + '\\s*=)[^}]*(\\}\\})', 'gi'), '$1*$2');
    });
    return content.replace(/\[\[([\s\S]*?)\]\]/g, function (token, expression) {
      return '[[' + expression.replace(
        /(\b\d*d(?:\d+|%|f))(?:c[fs](?:[<>=]?[-+]?\d+(?:\.\d+)?)?)+/gi,
        '$1',
      ) + ']]';
    }).replace(/\r\n?/g, '\n').trim();
  }

  function contractCandidateEquivalenceKey(characterId, candidate, expression) {
    var instance = candidate.instance;
    var mode = candidate.mode || null;
    function normalized(values) {
      return (values || []).map(normalize).filter(Boolean).sort();
    }
    function qualifiedSignature(selectedMode) {
      var qualified = qualifyContractMacro(characterId, instance, selectedMode, expression);
      return qualified.ok
        ? ['ok', contractBehaviorContent(qualified.content, instance)]
        : ['error', qualified.reason || '', qualified.error || ''];
    }
    var modeSignatures = mode ? [] : (instance.modes || []).map(function (availableMode) {
      return [normalized(contractUserModeLabels(availableMode)), qualifiedSignature(availableMode)];
    }).sort(function (left, right) {
      return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });
    var resultTemplate = sourceResultTemplateForContract(instance.contract, instance.roll.key);
    return JSON.stringify([
        normalize(instance.label),
        instance.row ? instance.row.id : '',
        instance.roll.kind || 'contract',
        mode ? normalized(contractUserModeLabels(mode)) : modeSignatures,
        qualifiedSignature(mode),
        resultTemplate || null,
        !!instance.hidden,
      ]);
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var copies = dictionary();
    candidates = candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var labels = contractStaticLabels(roll);
      var labelKey = normalize(trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, ''));
      if (!labels.length || !roll.raw || !labels.some(function (label) {
        return normalize(label) === labelKey;
      })) return true;
      // 같은 행의 동일 출력/식 복제 버튼만 합치며 원본 계약과 키는 그대로 둡니다.
      var key = JSON.stringify([
        instance.contract.id, instance.row ? instance.row.id : '', roll.repeating || null,
        labelKey, labels, roll.raw, roll.refs || [], roll.expressionRefs || [], roll.modes || [],
        instance.hidden ? roll.visibility || null : null, !!instance.hidden, roll.kind || '', candidate.mode || null,
        roll.template || '',
      ]);
      if (copies[key]) return false;
      copies[key] = true;
      return true;
    });
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = contractCandidateEquivalenceKey(characterId, candidate, expression);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function commonContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractRolls(characterId, inspection, objects, includeHidden, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    var groups = dictionary();
    actionableContractRolls(characterId, inspection, includeHidden, objects, readLive).forEach(function (instance) {
      var key = contractCandidateEquivalenceKey(characterId, { instance: instance });
      if (!groups[key]) groups[key] = instance;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }

  function preferDirectContractActions(instances, compatible) {
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(preferDirectContractActions(grouped[id], compatible));
      });
      return result;
    }
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[key];
    });
  }

  function contractModeContext(mode) {
    var found = dictionary();
    var labels = Array.isArray(mode && mode.labelPath)
      ? mode.labelPath
      : [mode && (mode.labelPath || mode.label)];
    labels.forEach(function (label) {
      String(label).split(/\s*(?:\|\||::|[|｜/>])\s*/).forEach(function (part) {
        var key = normalize(part);
        if (key) found[key] = true;
      });
    });
    return found;
  }

  function preferCurrentModeContext(characterId, candidates) {
    if (candidates.length < 2 || candidates.some(function (candidate) { return !candidate.mode; })) return candidates;
    function contextKey(candidate) {
      var rowId = candidate.instance.row ? candidate.instance.row.id : '';
      return candidate.instance.contract.id + '|' + candidate.instance.roll.key + '|' + rowId + '|' +
        Object.keys(contractOverrides(candidate.mode)).sort().join(',');
    }
    var sharedKey = contextKey(candidates[0]);
    if (candidates.some(function (candidate) { return contextKey(candidate) !== sharedKey; })) return candidates;
    var best = 0;
    var overrideKey = Object.keys(contractOverrides(candidates[0].mode)).sort().join(',');
    var currentModes = currentContractModes(characterId, candidates[0].instance).filter(function (mode) {
      return Object.keys(contractOverrides(mode)).sort().join(',') === overrideKey;
    });
    if (!currentModes.length) return candidates;
    var current = currentModes.map(contractModeContext);
    var ranked = candidates.map(function (candidate) {
      var wanted = contractModeContext(candidate.mode);
      var score = 0;
      current.forEach(function (currentLabels) {
        var overlap = Object.keys(wanted).filter(function (key) { return currentLabels[key]; }).length;
        if (overlap > score) score = overlap;
      });
      if (score > best) best = score;
      return { candidate: candidate, score: score };
    });
    return best ? ranked.filter(function (entry) { return entry.score === best; })
      .map(function (entry) { return entry.candidate; }) : candidates;
  }

  function contractMultipleRollRequest(query) {
    var matched = trim(query).match(
      /^(.+?)\s*((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus\s*[12]|penalty\s*[12])$/i,
    );
    return matched ? { base: trim(matched[1]), mode: trim(matched[2]) } : null;
  }

  function contractRollStructure(instance) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    return raw.replace(/@\{([^{}|]+)\}/g, function (reference, name) {
      var field = fields[name] || index.fieldGlobal[name];
      if (!field) return reference;
      var value = instance.characterId
        ? getAttr(instance.characterId, contractRowAttr(instance.contract, instance.roll, instance.row, name)) : null;
      if (value === undefined || value === null || trim(value) === '') value = field.default;
      if (!/[&?]\{|\{\{/.test(String(value || ''))) return reference;
      var fragment = Object.assign({}, instance, { roll: Object.assign({}, instance.roll, { raw: reference }) });
      var qualified = qualifyContractMacro(instance.characterId, fragment);
      return qualified.ok ? qualified.content : reference;
    });
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    contractRollStructure(instance).replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function preferSingleInlineRollActions(candidates) {
    if (candidates.length < 2) return candidates;
    var groups = dictionary();
    candidates.forEach(function (candidate) {
      if (candidate.mode) return;
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var structure = contractRollStructure(instance);
      var baseRaw = structure
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        roll.visibility || null,
        roll.repeating || null,
        (roll.refs || []).filter(function (ref) {
          return structure.indexOf('@{' + contractRefName(ref) + (ref.max ? '|max' : '') + '}') > -1;
        }),
        roll.expressionRefs || [],
        roll.modes || [],
        baseRaw,
      ]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var chosen = dictionary();
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var counts = group.map(function (candidate) { return contractInlineRollCount(candidate.instance); });
      var minimum = Math.min.apply(Math, counts);
      var maximum = Math.max.apply(Math, counts);
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1 || minimum === maximum || best.length !== 1) return;
      group.forEach(function (candidate) {
        chosen[candidate.instance.contract.id + '|' + candidate.instance.key] = best[0];
      });
    });
    var seen = dictionary();
    var result = [];
    candidates.forEach(function (candidate) {
      var replacement = chosen[candidate.instance.contract.id + '|' + candidate.instance.key] || candidate;
      var key = replacement.instance.contract.id + '|' + replacement.instance.key + '|' +
        String(replacement.mode && replacement.mode.id || '');
      if (seen[key]) return;
      seen[key] = true;
      result.push(replacement);
    });
    return result;
  }

  function preferVisibleContractCandidates(candidates) {
    var visible = candidates.filter(function (candidate) {
      var instance = candidate.instance || candidate;
      return !instance.hidden;
    });
    return visible.length ? visible : candidates;
  }

  function contractMultipleRollCandidates(instances, query) {
    var requested = contractMultipleRollRequest(query);
    if (!requested) return [];
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(contractMultipleRollCandidates(grouped[id], query));
      });
      return uniqueContractCandidates(result);
    }
    var matched = closestContractActions(instances, requested.base, true);
    if (!matched.length) return [];
    var wantedMode = contractLookupKeys(requested.mode, true);
    var modes = [];
    matched.forEach(function (instance) {
      modes = modes.concat(contractModeCandidates(instance, true).filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wantedMode, false);
      }));
    });
    modes = preferLeastOverrideModes(uniqueContractCandidates(modes));
    if (modes.length) return modes;
    if (matched.length < 2) return [];
    var counts = matched.map(contractInlineRollCount);
    var maximum = Math.max.apply(Math, counts);
    var minimum = Math.min.apply(Math, counts);
    if (maximum < 2 || maximum === minimum) return [];
    return uniqueContractCandidates(matched.filter(function (instance) {
      return contractInlineRollCount(instance) === maximum;
    }).map(function (instance) { return { instance: instance, requestedMode: requested.mode }; }));
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: false, result: null };
    var instances = actionableContractRolls(character.id, inspection, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var primary = instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible, true), wanted, false) ||
          contractModeCandidates(instance, compatible, true).some(function (candidate) {
            return contractKeysMatch(candidate.partialValues, wanted, false);
          });
      });
      var matching = primary.length ? primary : instances;
      var modes = [];
      matching.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(primary.length ? candidate.partialValues : candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(matching.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(exact));
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    var deferredModeConflict = exact.length > 1 && exact.every(function (candidate) { return !!candidate.mode; })
      ? exact : [];
    if (exact.length > 1 && !deferredModeConflict.length)
      return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      preferVisibleContractCandidates(contractMultipleRollCandidates(instances, query)),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(preferVisibleContractCandidates(
      closestContractActions(instances, query),
    ), true);
    var partialActionRank = partialActions.length
      ? contractMatchRank(contractInstanceAliases(partialActions[0], true), wanted)
      : 3;
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      var directModes = modes.filter(function (candidate) {
        return contractKeysMatch(candidate.modeValues, wanted, true);
      });
      var matchingModes = directModes.length ? directModes : modes.filter(function (candidate) {
        return contractMatchRank(candidate.partialValues, wanted) < 2;
      });
      partial = preferLeastOverrideModes(uniqueContractCandidates(matchingModes));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    var roleNames = Object.keys(DETECTED_ROLE_LABELS).filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(normalize(query)) > -1;
    });
    if (roleNames.length === 1) {
      var detected = detectedRollRole(scan(character.id), roleNames[0]);
      if (detected.item)
        return { handled: true, result: executeContractInstance(character, detected.item, '', secret) };
    }
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = actionableContractRolls(character.id, inspection, false).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    instances = collapseEquivalentContractCandidates(character.id, instances.map(function (instance) {
      return { instance: instance };
    }), safe).map(function (candidate) { return candidate.instance; });
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  var ROLL_STATUS_GROUPS = [
    { key: 'characteristic', title: '특성치' },
    { key: 'check', title: '기능 / 판정' },
    { key: 'combat', title: '무기' },
    { key: 'spell', title: '주문' },
    { key: 'madness', title: '광기' },
    { key: 'other', title: '기타 주사위' },
  ];

  function rollStatusContext(instance) {
    var roll = instance && instance.roll || {};
    var groups = [];
    var labels = contractStaticLabels(roll).concat(roll.aliases || []);
    var sourceRaw = contractRollStructure(instance);
    var structure = [roll.template].concat(sourceTemplateFieldNames(sourceRaw));
    var repeating = contractRepeating(roll);
    if (repeating && instance && instance.contract) {
      var index = contractRuntimeIndex(instance.contract);
      var fields = index.fieldSections[repeating.section] || dictionary();
      contractRollFields(instance.contract, roll, index.controls).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        groups.push(field.groupLabel);
        structure.push(field.label);
        structure = structure.concat(field.aliases || []);
      });
    }
    return {
      sourceRaw: sourceRaw,
      groups: sortedUnique(groups.map(contractDisplayLabel).filter(Boolean)),
      labels: sortedUnique(labels.map(contractDisplayLabel).filter(Boolean)),
      structure: sortedUnique(structure.map(trim).filter(Boolean)),
    };
  }

  function rollStatusMatches(labels, pattern) {
    return (labels || []).some(function (label) { return pattern.test(trim(label)); });
  }

  function rollStatusLabel(instance) {
    var roll = instance && instance.roll || {};
    var rollName = normalize(roll.name);
    var rollKey = normalize(roll.key);
    var sourceLabels = contractStaticLabels(roll).map(normalize);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && (key !== rollName && key !== rollKey || sourceLabels.indexOf(key) > -1);
    })[0] || '';
  }

  function rollHasOutcomeStructure(item) {
    var roll = item && item.roll || {};
    var resultTemplates = item && item.contract && item.contract.resultTemplates;
    var template = resultTemplates && resultTemplates[roll.template];
    if (!template || !Array.isArray(template.rules)) return false;
    var sourceFields = dictionary();
    function addFields(raw) {
      sourceTemplateFieldNames(raw).forEach(function (name) { sourceFields[name] = true; });
    }
    addFields(item.sourceRaw || roll.raw);
    (roll.modes || []).forEach(function (mode) {
      var overrides = contractOverrides(mode);
      Object.keys(overrides).forEach(function (name) { addFields(overrides[name]); });
      contractQueries(mode).forEach(function (query) {
        addFields(query.raw);
        addFields(query.value);
      });
    });
    var matched = dictionary();
    template.rules.forEach(function (rule) {
      if (!rule || !rule.outcome) return;
      var refs = [rule.valueField];
      (rule.conditions || []).forEach(function (condition) { refs = refs.concat(condition.args || []); });
      refs.forEach(function (name) {
        name = trim(name).toLowerCase();
        if (sourceFields[name]) matched[name] = true;
      });
    });
    return Object.keys(matched).length > 1;
  }

  function rollHasPercentileThreshold(item) {
    var raw = String(item && (item.sourceRaw || item.roll && item.roll.raw) || '');
    if (!/\b(?:\d+)?d100/i.test(raw) || !/@\{[^}]+\}/.test(raw)) return false;
    return sourceTemplateFieldNames(raw).some(function (name) {
      return /(?:^|[_-])(?:stat|threshold|target|success|skill|ability|characteristic|score)(?:$|[_-])/i.test(name);
    });
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && (matchesDetectedRole(context, 'characteristic') ||
        rollStatusMatches(item.structureLabels, /(?:^|[_-])characteristic(?:$|[_-])/i))) return 'characteristic';
    if (rollHasOutcomeStructure(item) || rollHasPercentileThreshold(item)) return 'check';
    if (rollStatusMatches(context, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(context, /(?:주문|마법|주술|spell|magic|ritual)/i)) return 'spell';
    if (rollStatusMatches(context, /(?:무기|weapon)/i)) return 'combat';
    return 'other';
  }

  function groupedRollItems(items) {
    var groups = dictionary();
    ROLL_STATUS_GROUPS.forEach(function (group) { groups[group.key] = []; });
    (items || []).forEach(function (item) { groups[rollStatusCategory(item)].push(item); });
    return ROLL_STATUS_GROUPS.map(function (group) {
      return { key: group.key, title: group.title, items: groups[group.key] };
    });
  }

  function statusResourceItems(data) {
    return (data && data.resources || []).filter(function (item) { return item.statusResource === true; });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(data, instance) {
    var characterId = data.characterId;
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var tm = String(instance.roll.raw).match(tr);
    var m = tm ? qualifyContractMacro(characterId, Object.assign({}, instance, {
      roll: Object.assign({}, instance.roll, { raw: tm[0] }),
    }), null) : null;
    if (m && m.ok) {
      var v = m.content.match(tr);
      var n = v && resolvedResourceValue(characterId, v[1].replace(/\[\[/g, '(').replace(/\]\]/g, ')'));
      if (n && n.number !== null) return n.text;
    }
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = data.attributeByName || dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var resource = data.resourcesByAttribute && data.resourcesByAttribute[fullName];
        var property = valueType === 'max' ? 'max' : 'value';
        var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        if (field && /^(?:checkbox|radio)$/i.test(trim(field.type))) return match;
        var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
        if ((fallback === undefined || fallback === null || trim(fallback) === '') && valueType !== 'max') {
          var control = sourceControls[name] || runtimeIndex.controls[name];
          fallback = control && control.default;
        }
        var stored = savedAttributes[fullName];
        var live = stored ? null : getAttr(characterId, fullName, valueType || 'current');
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? contractUnsavedFieldValue(field, live, fallback, valueType === 'max') : live;
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractRollDamageText(characterId, instance) {
    var qualified = qualifyContractMacro(characterId, instance, null);
    if (!qualified.ok) return '';
    var fields = messageTemplateFields({ content: qualified.content });
    var name = Object.keys(fields).filter(function (key) {
      return /^(?:피해|damage|dmg)$/i.test(trim(key));
    })[0];
    var value = trim(name && fields[name]);
    var inline = value.match(/^\[\[([\s\S]*)\]\]$/);
    return trim(inline ? inline[1] : value);
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 굴림목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 굴림선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (usableContractInspection(data.contractMatch)) {
      var rolls = preferredContractRolls(data);
      var counts = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(characterId, instance) {
    var groups = dictionary();
    var candidates = contractModeCandidates(instance, true);
    var current = currentContractModes(characterId, instance);
    var context = rollStatusContext(instance);
    var category = rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
    if (current.length && category === 'combat') candidates = candidates.filter(function (candidate) {
      return current.indexOf(candidate.mode) > -1 || contractUserModeLabels(candidate.mode).some(function (label) {
        return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label));
      });
    });
    candidates.forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      var parts = labels.join(' | ').split(/\s*(?:\|\||::|[|｜/>])\s*/).map(normalize).filter(Boolean);
      var key = parts.length ? parts[parts.length - 1] : trim(candidate.mode && candidate.mode.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var selected = [];
    Object.keys(groups).forEach(function (key) {
      selected = selected.concat(preferCurrentModeContext(characterId, groups[key]));
    });
    var result = [];
    uniqueContractCandidates(selected).forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      labels.filter(function (label) {
        var key = normalize(label);
        if (labels.some(function (other) {
          return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(other));
        }) && /^\d+\s*개(?:\s|$)/.test(label) &&
            !contractDisplayLabel(label.replace(/^\d+\s*개\s*/, ''))) return false;
        return !/(?:보너스|패널티|페널티|bonus|penalty)/i.test(key) || !labels.some(function (other) {
          var otherKey = normalize(other);
          return otherKey.indexOf(key) === 0 && /^\+?\d+(?:개)?$/.test(otherKey.slice(key.length));
        });
      }).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    var source = trim(roll.name) ? 'name:' + trim(roll.name) : 'raw:' + String(roll.raw || '');
    return JSON.stringify([
      instance && instance.contract && instance.contract.id || '',
      roll.kind || 'contract',
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
      source,
      instance && instance.modes || [],
    ]);
  }

  function statusRollLabelIdentity(instance) {
    if (!rollStatusLabel(instance)) return '';
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(rollStatusLabel(instance)),
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
    ]);
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    var seenLabels = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    // 같은 행이 원본 정렬에 여러 번 있으면 유지하고, 그 행의 보조 버튼만 제외합니다.
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data);
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        sourceRaw: context.sourceRaw,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!label && (!modeEntries.length || rollStatusCategory(item) !== 'madness')) return;
      if (rollStatusCategory(item) === 'combat')
        item.damage = contractRollDamageText(data.characterId, instance);
      if (!seen[key]) seen[key] = item;
      var labelKey = statusRollLabelIdentity(instance);
      if (labelKey && !seenLabels[labelKey]) seenLabels[labelKey] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)] || seenLabels[statusRollLabelIdentity(instance)];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(data.characterId, instance));
    });
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeLayout(rolls) {
    var uses = dictionary();
    (rolls || []).forEach(function (item) {
      (item.modeEntries || []).forEach(function (entry) {
        if (!entry.id) return;
        uses[entry.id] = uses[entry.id] || dictionary();
        uses[entry.id][item.roll.key] = true;
      });
    });
    var shared = dictionary();
    Object.keys(uses).forEach(function (id) {
      if (Object.keys(uses[id]).length > 1) shared[id] = true;
    });
    var diceTypes = [];
    var madnessModes = dictionary();
    var items = [];
    (rolls || []).forEach(function (item) {
      var localModes = item.damage ? ['피해 ' + item.damage] : [];
      (item.modeEntries || []).forEach(function (entry) {
        if (entry.modifier) diceTypes.push(entry.label);
        else if (!shared[entry.id]) localModes.push(entry.label);
      });
      localModes = sortedUnique(localModes);
      if (rollStatusCategory(item) === 'madness' && localModes.length) {
        localModes.forEach(function (label) {
          var key = normalize(label);
          if (madnessModes[key]) return;
          madnessModes[key] = true;
          items.push(merge(merge({}, item), {
            label: label, value: '', localModes: [], contextLabels: (item.contextLabels || []).concat(item.label),
          }));
        });
        return;
      }
      item.localModes = localModes;
      items.push(item);
    });
    return { items: items, diceTypes: sortedUnique(diceTypes) };
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat(statusResourceItems(data).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)), command: '',
      };
    }));
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { contract: '굴림', resource: '수치' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function recognizedTable(items, actions) {
    return '<table style="width:100%;border-collapse:collapse"><tr>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">항목</th>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">현재값 / 방식</th>' +
      (actions ? '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:right">실행</th>' : '') + '</tr>' +
      (items || []).map(function (item) {
        var detail = [];
        if (item.value !== '' && item.value !== undefined) detail.push('<b>' + escapeHtml(item.value) + '</b>');
        if (item.localModes && item.localModes.length) detail.push(item.localModes.map(escapeHtml).join(' / '));
        return '<tr><td style="padding:6px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b></td>' +
          '<td style="padding:6px;border-bottom:1px solid #ddd">' + detail.join('<br>') + '</td>' +
          (actions ? '<td style="padding:4px 6px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap">' +
            (item.command ? button('실행', item.command, '#111') : '') + '</td>' : '') + '</tr>';
      }).join('') + '</table>';
  }

  function recognizedTablesHtml(data, actions, includeEveryInstance) {
    var layout = statusModeLayout(statusRollItems(data, includeEveryInstance));
    var groups = dictionary();
    groupedRollItems(layout.items).forEach(function (group) { groups[group.key] = group; });
    var html = '';
    ['characteristic', 'check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    var statusResources = statusResourceItems(data);
    if (statusResources.length) {
      var resources = statusResources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)),
        };
      });
      html += section('수치 ' + resources.length + '개', recognizedTable(resources, false));
    }
    if (groups.other && groups.other.items.length)
      html += section(groups.other.title + ' ' + groups.other.items.length + '개', recognizedTable(groups.other.items, actions));
    if (layout.diceTypes.length)
      html += section('다이스 종류 ' + layout.diceTypes.length + '개', recognizedTable(layout.diceTypes.map(function (label) {
        return { label: label, value: '' };
      }), false));
    return html;
  }

 function cutinItems() {
    var found = dictionary();
    var sourceLabels = dictionary();
    function add(item, kind, system, key, characterName) {
      if (!item || !trim(item.label)) return;
      system = system || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    var character = profileCharacters()[0];
    if (character) {
      (scan(character.id).contractRolls || []).forEach(function (instance) {
        var key = contractCutinKey(instance);
        if (!found[key]) {
          var seenLabels = dictionary();
          sourceLabels[key] = [instance.roll.label].concat(instance.roll.aliases || [])
            .map(contractDisplayLabel).filter(function (label) {
              var labelKey = normalize(label);
              if (!labelKey || seenLabels[labelKey] || labelKey === normalize(instance.label) ||
                  labelKey === normalize(instance.roll.name) || labelKey === normalize(instance.roll.key)) return false;
              seenLabels[labelKey] = true;
              return true;
            });
        }
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          key,
          character.get('name'),
        );
      });
    }
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    var sourceLabelCounts = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
      var labels = sourceLabelCounts[labelKey] || (sourceLabelCounts[labelKey] = dictionary());
      (sourceLabels[item.key] || []).forEach(function (label) {
        var key = normalize(label);
        labels[key] = (labels[key] || 0) + 1;
      });
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      var sourceLabel = (sourceLabels[item.key] || []).filter(function (label) {
        return sourceLabelCounts[labelKey][normalize(label)] < counts[labelKey];
      })[0];
      item.displayLabel = item.label + ' (' + (sourceLabel ? sourceLabel + ' / ' : '') +
        (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function managerHtml() {
    var data = initState();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 현황보기|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">' + SHEET_NOT_RECOGNIZED + '</span>';
    var trackingLabel = data.trackingMode === 'public' ? '전체 공개' : data.trackingMode === 'gm' ? 'GM만' : '끄기';
    var trackingControls = '<b>수치 변화 알림:</b> ' + trackingLabel + '<br>' +
      button('전체 공개', '!시트 변화알림|공개', data.trackingMode === 'public' ? '#111' : '#53657d') + ' ' +
      button('GM만', '!시트 변화알림|GM', data.trackingMode === 'gm' ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 변화알림|끄기', data.trackingMode === 'off' ? '#111' : '#53657d') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = usableContractInspection(viewed.contractMatch);
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = viewed.contractRolls.some(function (instance) {
          return instance.roll && instance.roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false);
      } else body += section('인식 결과', SHEET_NOT_RECOGNIZED);
      if (issues.length) body += section('확인할 항목', issues.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 캐릭터별 인식 항목과 현재 수치 현황<br>' +
      '<code>!!점검</code> 현황에서 확인 중인 캐릭터의 인식 상태 점검<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀<br>' +
      '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위<br>' +
      '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함</div>';
  }

  function playerHelpHtml() {
    var character = profileCharacters()[0];
    var contractFree = !!character && scannedContractRolls(character.id, true).some(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 보너스/패널티개수', '보너스 또는 패널티 주사위 개수를 붙여 굴립니다. 예: <code>!!관찰력 보너스1</code>, <code>!!관찰력 패널티2</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
      [':수치이름+3', '내 캐릭터 수치를 바꿉니다. 예: <code>:체력-1d3</code>, <code>:마력=10</code>'],
    ];
    if (contractFree)
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = statusRollItems(data);
    var modeLayout = statusModeLayout(rolls);
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div>';
    body += modeLayout.items.length ? rollGroupSections(modeLayout.items, function (item) {
      return '<span style="display:inline-block;margin:0 8px 3px 0">' + escapeHtml(item.label) +
        (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '') +
        (item.localModes && item.localModes.length ? ' <span style="color:#555">(' + item.localModes.map(escapeHtml).join(' / ') + ')</span>' : '') + '</span>';
    }) : section('굴릴 항목', '<span style="color:#777">없음</span>');
    if (modeLayout.diceTypes.length)
      body += section('다이스 종류 ' + modeLayout.diceTypes.length + '개', modeLayout.diceTypes.map(escapeHtml).join(', '));
    var statusResources = statusResourceItems(data);
    if (statusResources.length)
      body += section('현재 수치 ' + statusResources.length + '개', statusResources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item))) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = usableContractInspection(data.contractMatch)
      ? (data.contractRolls || []).filter(function (instance) { return instance.roll && instance.roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && !usableContractInspection(recognition))
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = usableContractInspection(recognition);
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + statusResourceItems(data).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function uniqueResources(items) {
    var seen = dictionary();
    return (items || []).filter(function (item) {
      if (!item || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }

  function resolveResource(data, query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '바꿀 수치 이름을 적어 주세요.' };
    var exact = uniqueResources(data.resourceAliases[wanted] || []);
    if (exact.length === 1) return { ok: true, item: exact[0] };
    var primary = exact.filter(function (item) {
      return normalize(item.label) === wanted || normalize(item.name) === wanted;
    });
    if (primary.length === 1) return { ok: true, item: primary[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var roles = ['health', 'magicPoints', 'sanity', 'startingSanity'].filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(wanted) > -1;
    });
    if (roles.length === 1) {
      var detected = detectedFieldRole(data, roles[0], 'resource');
      if (detected.item) return { ok: true, item: detected.item };
    }
    var partial = uniqueResources((data.resources || []).filter(function (item) {
      return item.aliases.some(function (alias) { return normalize(alias).indexOf(wanted) > -1; });
    }));
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return { ok: false, error: '이름이 비슷한 수치가 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', ') };
    return { ok: false, error: '현재 시트에서 ' + trim(query) + ' 수치를 찾지 못했습니다.' };
  }

  function rollAmount(expression) {
    var source = trim(expression || '');
    var dice = source.match(/^(\d*)d(\d+)$/i);
    if (!dice) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(dice[1] || 1);
    var sides = Number(dice[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i += 1) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function toggleValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function sanityValueText(characterId, item, current, hideMaximum) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        var labels = [field.label].concat(field.aliases || []);
        return matchesDetectedRole(labels, 'startingSanity') ||
          linkedStartingSanityField(field, sanity.item.name, labels);
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (!hideMaximum && sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw, hideSanityMaximum) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current, hideSanityMaximum);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceRawValue(characterId, item) {
    if (!item) return undefined;
    if (item.attribute) return item.attribute.get('current');
    var current = getAttr(characterId, item.name);
    return current === undefined || current === null ? item.value : current;
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before, true);
    var currentText = fieldValueText(character.id, item, current, true);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#aaa">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#aaa">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#b8b8b8">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat(settings.trackingMode === 'gm' ? '시트 헬퍼' : '',
      settings.trackingMode === 'gm' ? '/w gm ' + content : '/desc ' + content, null);
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    var text = String(value);
    var attribute = item.attribute;
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === text)
      return { attribute: attribute, changed: false };
    var key = suppressKey(characterId, item.name);
    var marker = { value: text };
    suppressedAttributeChanges[key] = marker;
    setTimeout(function () {
      if (suppressedAttributeChanges[key] === marker) delete suppressedAttributeChanges[key];
    }, 5000);
    if (!attribute) {
      var initial = getAttr(characterId, item.name);
      attribute = createObj('attribute', {
        characterid: characterId,
        name: item.name,
        current: String(initial == null ? '' : initial),
      });
    }
    if (!attribute) return { attribute: null, changed: false, error: '시트 수치를 저장하지 못했습니다.' };
    if (typeof attribute.setWithWorker === 'function') attribute.setWithWorker({ current: text });
    else attribute.set('current', text);
    return { attribute: attribute, changed: true };
  }

  function trackedRawValue(characterId, item) {
    return item && item.attribute
      ? item.attribute.get('current')
      : getAttr(characterId, item && item.name);
  }

  function trackedToggleEnabled(characterId, item) {
    if (!item) return false;
    var raw = trim(trackedRawValue(characterId, item));
    return trim(item.onValue) ? raw === trim(item.onValue) : toggleValue(raw) === true;
  }

  function activateTrackedToggle(character, item, detail, notifyChange) {
    if (!item || trackedToggleEnabled(character.id, item)) return false;
    var before = trackedRawValue(character.id, item);
    var next = trim(item.onValue) || '1';
    var saved = setResourceValue(character.id, item, next);
    if (!saved.changed) return false;
    item.attribute = saved.attribute;
    if (notifyChange !== false) sendTrackedChange(character, item, before, next, detail || '자동 활성화');
    return true;
  }

  function detectedRoleProblem(character, label, detected) {
    var suffix = detected && detected.ambiguous
      ? '같은 뜻의 항목이 여러 개입니다: ' + detected.matches.map(function (item) { return item.label; }).join(', ')
      : '해당 항목을 시트에서 찾지 못했습니다.';
    whisperGm('<b>' + escapeHtml(character.get('name')) + '</b> / ' + escapeHtml(label) + ' 자동 처리 생략: ' + escapeHtml(suffix));
    return label + ' 자동 처리 생략';
  }

  function successfulOutcome(result) {
    return result && ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1;
  }

  function finishAutomaticInsanity(payload, result, automation) {
    if (!successfulOutcome(result) || !automation || !automation.temporaryName) return;
    var character = getObj('character', payload.characterId);
    if (!character) return;
    var data = scan(character.id);
    if (automation.sourceHash && !sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return automation.sourceHash === candidate.contract.sourceHash;
    })) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current, scannedData) {
    var data = scannedData || scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var healthItem = health.item || health.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedHealth = healthItem && healthItem.name === changedItem.name;
    if (changedHealth) {
      var maximum = healthItem.max;
      var canCheckMajorDamage = maximum !== null && maximum > 0;
      if (!canCheckMajorDamage)
        details.push(detectedRoleProblem(character, '최대 체력', { ambiguous: false, matches: [] }));
      var major = detectedFieldRole(data, 'majorWound', 'toggle');
      var majorActive = major.item && trackedToggleEnabled(character.id, major.item);
      if (canCheckMajorDamage && beforeNumber - currentNumber >= maximum / 2 && !majorActive) {
        if (!major.item) details.push(detectedRoleProblem(character, '중상', major));
        else if (activateTrackedToggle(character, major.item, '최대 체력의 절반 이상 피해', false)) {
          majorActive = true;
          details.push('중상 활성화');
        }
      }
      if (currentNumber <= 0 && majorActive) {
        var dying = detectedFieldRole(data, 'dying', 'toggle');
        if (!dying.item) details.push(detectedRoleProblem(character, '빈사', dying));
        else if (activateTrackedToggle(character, dying.item, '체력 0 및 중상 상태', false)) details.push('빈사 활성화');
      }
      if (details.length) {
        invalidate(character.id);
        scheduleManager();
      }
      return details;
    }

    var sanity = detectedFieldRole(data, 'sanity', 'number');
    var sanityItem = sanity.item || sanity.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedSanity = sanityItem && sanityItem.name === changedItem.name;
    if (!changedSanity) return details;
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item &&
      numericFieldValue(character.id, resourceRawValue(character.id, startingSanity.item));
    var longTriggered = !longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5;
    if (longTriggered) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
      longActive = true;
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) return details;
    var intelligence = detectedRollRole(data, 'intelligence');
    if (!intelligence.item) {
      details.push(detectedRoleProblem(character, '지능 판정', intelligence));
      return details;
    }
    var temporary = detectedFieldRole(data, 'temporaryInsanity', 'toggle');
    if (!temporary.item) {
      details.push(detectedRoleProblem(character, '일시적 광기', temporary));
    }
    var rolled = executeContractInstance(character, intelligence.item, '', false);
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
      rolled.payload._automaticInsanity = {
        sourceHash: rolled.payload.sourceHash || '',
        longName: longInsanity.item ? longInsanity.item.name : '',
        temporaryName: temporary.item ? temporary.item.name : '',
      };
      details.push('지능 판정 자동 실행');
    } else details.push('지능 판정은 실행했지만 결과를 자동 인식할 수 없음');
    return details;
  }

  function applyResourceChange(character, query, operator, expression) {
    var data = scan(character.id);
    var resolved = resolveResource(data, query);
    if (!resolved.ok) return resolved;
    var amount = rollAmount(expression);
    if (!amount.ok) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var item = resolved.item;
    var current = numericFieldValue(character.id, resourceRawValue(character.id, item));
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next, data));
    sendTrackedChange(character, item, current, next, details.join(' / '));
    invalidate(character.id);
    scheduleManager();
    return { ok: true, value: next };
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    if (content.charAt(0) !== ':') return false;
    var match = content.match(/^:\s*(.+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)\s*$/i);
    if (!match) {
      whisper(msg, '수치 변경은 <code>:체력+3</code>, <code>:이성-1d3</code>, <code>:마력=10</code>처럼 입력해 주세요.');
      return true;
    }
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok) {
      reportResult(msg, resolved);
      return true;
    }
    reportResult(msg, applyResourceChange(resolved.character, match[1], match[2], match[3]));
    return true;
  }

 function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 굴림선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function handleLegacyAliasRoll(msg, body) {
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok || !usableContractInspection(inspectContracts(resolved.character.id))) return false;
    var contracted = resolveContractAction(resolved.character, body, false, { exactOnly: true });
    if (!contracted.handled) return false;
    reportResult(msg, contracted.result);
    return true;
  }

 function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    if (handleLegacyAliasRoll(msg, body)) return true;

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var tracking = body.match(/^(변화알림|추적)\s+(공개|public|show|GM|비공개|hide|끄기|해제|off)$/i);
    if (tracking) {
      handleNamespaced(msg, '!시트 변화알림|' + tracking[2]);
      return true;
    }
    var gmTracking = body.match(/^(GM캐릭터알림|GM전용추적)\s+(켜기|on|표시|show|끄기|해제|off|숨김|hide)$/i);
    if (gmTracking) {
      handleNamespaced(msg, '!시트 GM캐릭터알림|' + gmTracking[2]);
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var secretMatch = body.match(/^비밀\s+(.+)$/);
    if (secretMatch) {
      secret = true;
      body = trim(secretMatch[1]);
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) body = trim(original[1]);

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        return contracted || { ok: false, error: SHEET_NOT_RECOGNIZED };
      });
    }

    return withCharacter(msg, '', function (character) {
      var contracted = resolveContractAction(character, body, secret);
      if (!contracted.handled) {
        var categorized = body.match(/^(?:판정|무기|주문|방어구)\s+(.+)$/);
        if (categorized) contracted = resolveContractAction(character, trim(categorized[1]), secret);
      }
      if (contracted.handled) return contracted.result;
      if (contracted.inspection && !usableContractInspection(contracted.inspection) && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && usableContractInspection(contracted.inspection)
          ? '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.'
          : SHEET_NOT_RECOGNIZED,
      };
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '추적') action = '변화알림';
    else if (action === 'gm전용추적') action = 'gm캐릭터알림';
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var inspected = resolveInspectionCharacter(msg);
      if (!inspected.ok) return reportResult(msg, inspected);
      return reportResult(msg, (function (character) {
        var recognition = inspectContracts(character.id);
        if (!usableContractInspection(recognition))
          return { ok: false, error: recognition.error || SHEET_NOT_RECOGNIZED };
        whisper(msg, inspectionHtml(scan(character.id, true)));
        return { ok: true };
      })(inspected.character));
    }
    if (action === '굴림목록' || action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (!usableContractInspection(inspection))
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = preferredContractRolls(scan(character.id)).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '굴림선택' || action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 굴림 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '변화알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var trackingMode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(trackingMode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(trackingMode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|해제|off)$/.test(trackingMode)) initState().trackingMode = 'off';
      else return whisperGm('변화 알림은 공개, GM, 끄기 중 하나를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('수치 변화 알림: <b>' + (initState().trackingMode === 'public' ? '전체 공개' : initState().trackingMode === 'gm' ? 'GM만' : '끄기') + '</b>');
    }
    if (action === 'gm캐릭터알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmTracking = normalize(parts[0]);
      if (/^(?:켜기|on|표시|show)$/.test(gmTracking)) initState().trackGmOnly = true;
      else if (/^(?:끄기|해제|off|숨김|hide)$/.test(gmTracking)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('플레이어 권한이 없는 GM 캐릭터 변화 알림: <b>' + (initState().trackGmOnly ? '켜기' : '끄기') + '</b>');
    }
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '현황보기' || action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        whisper(msg, statusHtml(scan(character.id)));
        return { ok: true };
      });
      return true;
    }
    return false;
  }

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    var catalog = recognitionCatalog(sheetContracts());
    return !!catalog.exact[wanted] || triePrefixes(catalog.prefixes, wanted).length > 0;
  }

  function trackAttributeChange(attribute, previous, scannedData) {
    if (!attribute || !previous) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var before = String(previous.current == null ? '' : previous.current);
    if (!characterId || before === current) return;
    var key = suppressKey(characterId, name);
    if (suppressedAttributeChanges[key]) {
      if (suppressedAttributeChanges[key].value === current) {
        delete suppressedAttributeChanges[key];
        return;
      }
      delete suppressedAttributeChanges[key];
    }
    if (!contractRelevant(name)) return;
    var data = scannedData || scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current, data);
    sendTrackedChange(character, item, before, current, details.join(' / '));
  }

  function cachedUntrackedToggle(characterId, name) {
    var data = cache[characterId];
    var candidates = data && sourceCandidateInspections(data.contractMatch);
    if (!candidates || !candidates.length || data.trackedFields && data.trackedFields[name]) return false;
    return candidates.every(function (candidate) {
      var field = contractRuntimeIndex(candidate.contract).fieldGlobal[name];
      return !!(field && /^(?:checkbox|radio)$/i.test(trim(field.type)));
    });
  }

  function flushAttributeChanges() {
    attributeChangeTimer = null;
    var changes = pendingAttributeOrder.map(function (key) { return pendingAttributeChanges[key]; });
    pendingAttributeChanges = {};
    pendingAttributeOrder = [];
    if (!changes.length) return;

    var allMembershipChanged = changes.some(function (change) { return change.membershipChanged; });
    var affected = {};
    changes.forEach(function (change) { affected[change.characterId] = true; });
    if (allMembershipChanged) invalidate();
    else Object.keys(affected).forEach(function (characterId) { invalidate(characterId); });

    var scanned = {};
    changes.forEach(function (change) {
      if (!change.previous || change.presentationOnly ||
        change.membershipChanged && change.previous.current === undefined) return;
      var data = scanned[change.characterId];
      if (!data) data = scanned[change.characterId] = scan(change.characterId);
      if (!data.ok || cachedUntrackedToggle(change.characterId, change.name)) return;
      trackAttributeChange(change.attribute, change.previous, data);
    });
    scheduleManager();
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var key = characterId + '|' + name;
    var pending = pendingAttributeChanges[key];
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    invalidate(characterId);
    if (!pending) {
      pending = pendingAttributeChanges[key] = {
        attribute: attribute,
        previous: previous,
        membershipChanged: membershipChanged,
        presentationOnly: presentationOnly,
        characterId: characterId,
        name: name,
      };
      pendingAttributeOrder.push(key);
    } else {
      pending.attribute = attribute;
      if (!pending.previous && previous) pending.previous = previous;
      pending.membershipChanged = pending.membershipChanged || membershipChanged;
      pending.presentationOnly = pending.presentationOnly && presentationOnly;
    }
    if (attributeChangeTimer) clearTimeout(attributeChangeTimer);
    attributeChangeTimer = setTimeout(flushAttributeChanges, 25);
  }

  api.version = VERSION;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId);
  };
  api.contractRolls = function (characterId) {
    return commonContractRolls(characterId, inspectContracts(characterId), false);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        return { sheets: sheetContracts().length };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>:수치이름+3</code> 내 캐릭터 수치 변경',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀',
        '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위 설정',
        '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함',
        '<code>!!관리</code> GM용 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api' && captureResult(msg)) return;
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'general' && handleGeneralChange(msg)) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
      }
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    invalidate();
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate();
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
