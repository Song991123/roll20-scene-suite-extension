/*
 * Scene Suite 10 - Sheet Helper 0.6.18
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
  if (compressed.length !== 291208 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4651793) throw new Error('Invalid embedded sheet data length.');
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
      return { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
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

  var VERSION = '0.6.18';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};

  // ===== 공통 처리 =====
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
          rows[rowId] = { id: rowId, values: dictionary(), names: dictionary(), refs: dictionary() };
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

  // ===== 시트 HTML 인식 =====
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
    var active = records.slice();
    var used = dictionary();
    var probes = [];
    var reads = cachedAttrReader(characterId);
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
    for (var attempt = 0; attempt < 24; attempt += 1) {
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
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      // 두 개의 우연히 같은 기본값만 보고 현재 시트를 확정하면 이후의 더 강한
      // 구분값을 읽지 못합니다. 최대 24개를 끝까지 비교한 뒤 한 번만 결정합니다.
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) candidates = records.slice();
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
    var candidates = (characters || []).slice().sort(function (left, right) {
      function savedCount(character) {
        var count = 0;
        Object.keys(ownersByName || {}).forEach(function (name) {
          if (ownersByName[name] && ownersByName[name][character.id]) count += 1;
        });
        return count;
      }
      return savedCount(left) - savedCount(right) ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    for (var index = 0; index < candidates.length; index += 1) {
      var character = candidates[index];
      var savedNames = dictionary();
      Object.keys(ownersByName || {}).forEach(function (name) {
        if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
      });
      var evidence = sourceDefaultEvidence(character.id, records, savedNames);
      evidence.characterId = character.id;
      if (evidence.matched) return evidence;
      if (evidence.survivors.length < fallback.survivors.length ||
          evidence.survivors.length === fallback.survivors.length && evidence.probes.length > fallback.probes.length)
        fallback = evidence;
    }
    return fallback;
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
        var section = prefix.substring(10, prefix.length - 1);
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
    // Roll20 방에는 한 종류의 캐릭터 시트가 적용됩니다. 캐릭터별 저장값의
    // 차이 때문에 판별 결과가 갈리지 않도록, 실제로 저장된 방 전체 Attribute의
    // 이름만 합쳐 시트 구조를 한 번 판별합니다. 값과 반복행은 이후 현재
    // 캐릭터를 읽을 때만 사용합니다.
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
        matchedByContract[ordinal] = match.prefix + field;
        if (!match.record.signature.total) repeatingStat.sourceSeen[match.prefix + field] = true;
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
    var sourceNarrowed = sourceSurvivorCount > 0 && sourceSurvivorCount < catalog.records.length;
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
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [], recognitionReason: 'no-contracts' });
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
    return trim(reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current'));
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
          rollVisibilityPolarity[name] = { positive: false, negative: false };
        rollVisibilityPolarity[name][polarity] = true;
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
      if (polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length)
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
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
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
      rowsBySection[sectionName] = collectRows(characterId, sectionName, index.sections[sectionName], attributes, index.prefixes);
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
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
            var options = /^(?:select|radio)$/i.test(trim(control && control.type))
              ? contractOptionValues(control) : [];
            if (!options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        });
        // A contract without CSS has no condition. Unsupported/missing state is unknown and stays usable.
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          if (expressionNames.indexOf(refName) > -1) {
            var sourceField = index.fieldGlobal[refName] || scopedControls[refName];
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (value) dynamic.push({ value: value, frequency: index.labelRefFrequency[refName] || 0 });
        });
        dynamic.sort(function (left, right) { return left.frequency - right.frequency; });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        if (!usefulDynamic.length) usefulDynamic = dynamic;
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat(roll.aliases || [])
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

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) label = group;
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label))) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias));
      })[0];
      if (preferred) label = preferred;
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
    var maximums = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    var result = dictionary();
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !/^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) return;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
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
      var key = section + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = 'repeating_' + match.section + '_' + match.rowId + '_' + name;
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
      var prefix = 'repeating_' + match.section + '_' + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
        if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field)) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.section + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match);
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
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
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && trim(field.max)) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = field.max;
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
        _maxDefinition: trim(field.max) ? JSON.stringify(field.max) : '',
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
          if (live !== undefined && live !== null && trim(live) !== '') fallback = live;
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
        var maximum = JSON.stringify([item.max, item._maxDefinition || '']);
        merged.max = peers.every(function (peer) {
          return JSON.stringify([peer.max, peer._maxDefinition || '']) === maximum;
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

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check)$/i, '');
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
    var seen = dictionary();
    var matches = (items || []).filter(function (item) {
      var labels = item && item.kind === 'toggle' && item.fieldLabel ? [item.fieldLabel] : item && item.sourceLabels;
      if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
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
    return uniqueDetectedItems(items, role);
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
    var matches = (data.contractRolls || []).filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
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
      .some(function (playerId) { return playerId === 'all' || !playerIsGM(playerId); });
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
    var tokenMatch = content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch && pendingResults[tokenMatch[1]]) {
      var pending = pendingResults[tokenMatch[1]];
      delete pendingResults[tokenMatch[1]];
      emitResult(pending.payload, message);
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
      sendChat('character|' + character.id, content + ' {{kib_sheet_result=' + token + '}}');
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
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : getAttr(characterId, candidates[i].name, valueType);
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
    if (/\{\{\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
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
        var actual = getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var stored = actual === undefined || actual === null || trim(actual) === '' || trim(actual) === '0'
          ? savedAttribute(fullName) : null;
        if (stored) actual = stored.get(maximum ? 'max' : 'current');
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
    if (/\{\{\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
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

  function contractInstanceAliases(instance, compatible) {
    var found = dictionary();
    var result = [];
    (instance.aliases || []).forEach(function (value) {
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

  function contractModeCandidates(instance, compatible) {
    var actionAliases = contractInstanceAliases(instance, compatible);
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
    var best = 3;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 3 ? found : [];
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

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    String(instance && instance.roll && instance.roll.raw || '').replace(
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
      var baseRaw = String(roll.raw || '')
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        normalize(roll.name),
        roll.visibility || null,
        roll.repeating || null,
        roll.refs || [],
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
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = preferSingleInlineRollActions(collapseEquivalentContractCandidates(character.id, exact));
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
    partial = preferSingleInlineRollActions(collapseEquivalentContractCandidates(character.id, partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
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
    var structure = [roll.template].concat(sourceTemplateFieldNames(roll.raw));
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
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && key !== rollName && key !== rollKey;
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
    addFields(roll.raw);
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

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && matchesDetectedRole(context, 'characteristic')) return 'characteristic';
    if (rollHasOutcomeStructure(item)) return 'check';
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

  function contractRollDisplayValue(characterId, instance) {
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
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
        var raw = getAttr(characterId, fullName, valueType || 'current');
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
      var counts = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data.characterId, instance),
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
    contractModeCandidates(instance, true).forEach(function (candidate) {
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
      contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    return normalize(rollStatusLabel(instance)) + (instance.row ? '|row:' + instance.row.id : '');
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    data.contractRolls.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    data.contractRolls.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && !instance.row && seen[key]) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data.characterId, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!seen[key]) seen[key] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)];
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
      var localModes = [];
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

  // ===== 관리 핸드아웃 =====
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
    characterObjects().forEach(function (character) {
      if (!usableContractInspection(inspectContracts(character.id))) return;
      var data = scan(character.id);
      data.contractRolls.forEach(function (instance) {
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          contractCutinKey(instance),
          character.get('name'),
        );
      });
    });
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      item.displayLabel = item.label + ' (' + (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
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

  // ===== 안내 =====
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

  // ===== 명령 처리 =====
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
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
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

  function sanityValueText(characterId, item, current) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        return matchesDetectedRole([field.label].concat(field.aliases || []), 'startingSanity');
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current);
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
    var beforeText = fieldValueText(character.id, item, before);
    var currentText = fieldValueText(character.id, item, current);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#777">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#777">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="color:#555"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#aaa">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat('시트 헬퍼', settings.trackingMode === 'gm' ? '/w gm ' + content : '/direct ' + content, null, { noarchive: true });
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

  function applyDetectedRules(character, changedItem, before, current) {
    var data = scan(character.id);
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
    if (longActive) {
      details.push('장기적 광기 활성화 상태라 지능 판정 생략');
      return details;
    }
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
    details = details.concat(applyDetectedRules(character, item, current, next));
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

    // 원본 시트에 관리 명령과 같은 이름의 굴림이 있으면 원본 굴림을 우선합니다.
    // 관리 기능은 명시형 !시트 명령으로 항상 실행할 수 있습니다.
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
        var matches = (scan(character.id).contractRolls || []).filter(function (instance) {
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

  function trackAttributeChange(attribute, previous) {
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
    var data = scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current);
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

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    var refreshBeforeTracking = !!(previous && !membershipChanged && !presentationOnly && cache[characterId] &&
      !(cache[characterId].trackedFields && cache[characterId].trackedFields[name]) &&
      numericFieldValue(characterId, attribute.get('current')) !== null);
    if (previous && !presentationOnly && !refreshBeforeTracking) trackAttributeChange(attribute, previous);
    if (membershipChanged) invalidate();
    else invalidate(characterId);
    if (refreshBeforeTracking) trackAttributeChange(attribute, previous);
    scheduleManager();
  }

  // ===== 외부 연결 =====
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
