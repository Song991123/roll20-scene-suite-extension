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
  var compressed = 'm276RmlQIsNdGijZp93jFNWuEc38lVuKHPRO9wgPH+Lcv2tJOGjK9aCtjdBCrYF2FYd6Z+E2LzQzCa8RbHUq6nRzU9cYPbDBNDWz7q/rB6JiOPeQpE9EAnyJlFj8B42JNWGMVTp0SCOlHWKHqo4hOiAEsKpW+3sJVVVVVVV1YzKRtZokmLQUyiMVUQQffHZ1n9u9O4maOm85FAEF8a5UlFwkhVKHkhgMDgqrFA61yJMmuhy+phG5aw2OrsuCBM90PrUBAQ1UDV4N1qzEJuNevkXJa0aDaKcR+yCqSZPGHJ4m4m3Tw4sPe9JvJygarMcwrWEmaWctEzX2GGFYcxNvGCfkpIx6hDspnM9lIwkYceYvC1nolZnZHDeJMXpfibg6235u0gE7tNyFK6EPxjifs5FqBot11ekNvmZvtKJ9pMacUL8rUiT6JB710jonidUwWfHCdcMnolS3kvixbbjPRN6eDwx2l+xVJ5KgidMv2jnF2VWCdPmYUVfQtaLoOvOwtfwboWMnqrQz0f4P22dkocxbg5bc4fhzRkUfo5FSuWZ/xdBhQGHw3ReCiV/0LOuZJHqX/XI76RYFdoVYgyyKKsyobz/SiBzXSj6K5vNLEkwxWpFJIS5jxmklLiuWJD1/uYuO3S858jWJWVSZmCjCpCofnjOKjizCIPp8LJK/ZkT/yXcYeM1qkf4nuxkWsbZZ9h4OECwwDFAoxBJMJcvKTO37wQIMllDQtnFcr+P6naDrHHiHYQS/5+EohuA+xLEiSQqV+RjIISNCmuYFNE7Ap2CUpLADOqrssUV5Js/BmCBEbaFpo6c8ZRSkIUJdzGii0JuTRavJpY0lJOor1fI1k4bhW7RErDg0NxWWt3eYGjiLtYHkWtyvYilil7S0gd48CGx3AnKfIHrUCJ7oM31R8FEJvA72eCO7HHaNLWIyz1Voz9+H5INmKPBpYMDwS2cm6/7G+6LfGSY/I5hfjIO/dfSPsRSLNl2UshNyojCwmIuvO/+2mbwSXSZ/ze/rt2NHh15bEkBfu5fhCrSAWRK11ztCEpQtEZZgj72sVLOidN+Z1mEsBlmkghmqWL9a3ZM843xfVf+nlUdT0oELgOW9/6da10qRlKy4NDl2GtT3ujJKTSCVp+f9kVbRMRszhrXrSvaa2nu6pjbbqad4i7BQmoyPLeehNN+cLOVhaL5tQKiKk1AaaMnHA6mXvF7IHI2BpbJpSsnhAApd+bY0sHOAD7Qtrf5PV2p+iJ4AfiHmYxdImGFbqFlJGE9XNZhoZmV1KbgrRdCfV054j/w0077TlV9/S6ZTjlUUJaU/MsCct+02IMris0hooYaLG26M1JJ4rY/SV85mt/8OCBIAOfEk6V6S7D0uj+S76sOQzVgF9NPYT6htypIK1d+RMOXfWGxsUbFsgBkE6FfifxCVSTf+n75q75wVO/M2RkJWvhad9iECAWLGzC+aGtBqgUL8tqxbxpt2yoIWHvKaEx3h78/5TfsNk0lobtM9+BQFrDT1bC1K2YuvSwrQiYclHuohfz+pKkxBRSWdl2+86Udgir7cPmov8In9UGdrWagOSE//XV6vGaWAhMlJ/t7kzEuj2hZfYBE53TCN5cBgA8qLWsQGOqLiipYthPQhN19wHSm1/CHtlUegHpcpO1vQWAxCn0aRXwK00YxhZQf6QsQ42TBW+c7JZqxuIGCLqj+00YzV9wBmysMCJwrJwOzTtwkD9TXxyazahfovkI/5bFe1MENynFcp3e0nun+eqvafV+1mpVHoig0zCiYZDJhLgG3oebdpEFRL0bLVzApXlYvGRmeyhM+nUCAg0gKn/IS6T9qGeYzFUWVnJt0/Rv6AMt9ssFg7L8iFDcHYwlguAAivLSyMILdCaRmeA5z8lqSmTRpxBLMtVuG3R1pU1JBukyA3KeXfT8ItsICTlFKjPnD+f1PtPb8y5oFUwCau9AP1U+vjzrkGH0eQlssfQ+uiF26Yu4sBl8vsL0BLKR/r5zT3vTcEOIC4TJskboKCUyqqHIrOVRdyU7sqKMmB3zGUhs93ogAtlPd0+n6TbQV0DA/DwKJtIZAWDvqv5f9shCmsvX0c0cmXZg/BxajUvztLysoghEarISdF4bCY73zlwbivENdZPVFqSafb94fmEUQTaUOzysyqfz5AgzxrGzttVzt7acU9Qevt7mfdeEEhVKbidlVG+u4AmJ0dgllCZ8nscZ4ensA1GjiCBp5wqi2bfiadKHWRubd7iYnK3f5zQX//ab+vyk4Okhu1SrQayhp0pRrkyvX1f7yI05BVS0jvxok4r7jpZ1PVALlWy2g9kF+5TkSczCEUbt36/82qTzxLT80mH0MYklJKkJ3tnaFx5gPIjBhFtlJ1Z+3wtiL8OVIFpXGvt6hG4/cJMRxoDp//Zc5KF/4XWmviPZfE9Os/lBhmt2SjXDXTwBlng+guP9E9st2wp2ZE7c3CeWvmMod7eCBt7SCW0lhQP0QjW/v7lTmVMGQJhcFQZJN5PasuJ2W1glcNrmCAqi7692GbiKtUPYbd//EEucs68cH/0976n/2ZmJTEjiJEZ+nqOrMIMkVhEbJ3ndqniEmFZAT4AWvfG8hW3bn9Sckl4czQGmPwH3XmemWrKBW/bhw7ZkymhST/Ato5ssN2SrB2ypNURrdHnmr1ey3h2VlrJC1aMSNgZGpDcKe3+mP/C0lOWQ6xuJG/+s97ThGFDJjhAU5mesaR7SKto+6+ZfbSr/VfySlLNjKABnA001X6bzY4ySESEnUbrhxiogbsunuqW2FHl/enlVOmIXG02pUorZ4Z6UbrnAH0+wCQeydEDF//e6vkT74p+s3WQKTqXxsys+cIwo6KzDVeUskPYeDmk2/5QQMYlf+9r/r1KXUpPpKC3qD1OM5EKahxfD1ObaNgoodz9z6rBFyAVSQkVJMSWdPPsIbj3V77HLAvILILFwRVIPW6SmNs5v73sU/in+Q2iX4W/en4h5b/fzmY3yy1t50fUIiptAUYfL4XxXFl59vWWqN7xxi6xQPEjmqwoBj4hy5Tz4MRWcGUv+/fdQuGdIvabOkcO9G41xmWwPf9tDdu0yjITv+Sun9IzIg6P2j2Gb+lCd7wRhtHmwgDTmirQoKvb5lSaTFSWKWt33VhekaIO6R7XNCIK+Y9ZyYbiiDsfqKJKo7p9z/tFadSYpizSvujpCMcW3913SpLaYCa7+i+kdzaTDozSukoHBYM5j1k6BVEtKyS3s2beWMhm+6efxkqMaDrqeo4/x7JGYIrKqt77O1bT8UEBd8ADGQc4aJCJyT20KfotUeqQGyMUlI18D7dnLeeVEOPYqmdfbwaRjDtf+8vP7Qm7UDowT2nqDEOpX9uqHXdHr9OLVV67r9zwNaUaHKAD6m0Y0lSCusmHkCimvw//f2XOvljWzj4LENp1QvS0VgEA54KDsoAnaW6K2PlUiE1gV3u51TEq0aIh6D0S++MBYOc9ig39DzSPjI9jzcAuVHPmnEs+1nCGEXthB5QO9V3alWb4L9vrxndGCD177rv6Uhd1XJkJGVAvNQET5C/nCRnsRmCsM+gBasGzvttYjJ/BiE1dWBf16fr1psPzZ4FQ5hrlu38ZykTundgcl3NEPLA//8v+2bJQRhkCkL1pOohFfkvhELome73+hCDR6m67967e2KRG7KQCDsJLShCWU1IFq1F2gA5YCfvUb0UeNcBDeRj7NfW9NTDJexZxsf7y+5avdPdLkjCGYLv+2U/i5Mf94Um5BkJyoXYHoex2TJ07TTxDvGt+wgn2LpHOwph5fp+Uw0vRWZdsjJ1zGIgQxRf7snXbubCEETHumf0X5BfodILgDpnt6D2gC/k1ybNUrPw/f/FRFNLoVPj0UeZXZWcgpfyfXveLEQFPbbqFVIjsNPJDY1Q2LWQBn9pOidAYSSYr9pdlPr5GKlyLID4OZkQajH4///7Sm2wBAOYWAu8v6nWxxbKCk0TcEyrqm9hUxoDFA71aofKXfso9zBrRCcALKjvT9QCWMybdE6g6hXz5FnW/loPo/9d7wOVaT8Xa1yKcr+xLbWGD5gnicyZ2hvo9QfOWxQIkj1ZZ0imHWes/b+Hat0mLPDUr7Kkxxw5CoUjYTH6JF85RmXG9mjp792+1O3zQA4D+rNacmRJ3d6srtbEnxMQMwOATG0CHUbQzIDs4X712vLKlp2++0SyVYb3vU0+yrJFI5OZyeQT7H1AYwrkSAugNbr9RieZyea6VwAU1gMqUdl0AAlkeB47Uf+zfsEDsW62ZDJZhiVcLsMC0wk24//5v6fpO9vmrpV8MBwd+xhmhQGHAVOOEbat5OyDfKl1V8S4/1O1bMkBdDodtU+OsehclADxqYPIkfwsUXcOpZtmlyA5b5fayL1H59y6ncEfUCTwwQWBAZW4uqB1jPX59W4aV5Wfy3PThtgUVzrkpijd1bbovk/dCKx4HPea17kUfk9NVecW5JqPAQtp4jadUCABDfz77aX57FK/NRmTnaGEolGWE4dSGLEvubQmPH9pml9KvobE+WiOD/HvcUdpA8S4IBL+JfuOQv9GQ29NUqMtUR5tDeffd5DgdYOzDaDHBYDwlC675PFGf+NNwg03ize6k3Bro+gMku/3LVWcF2R3GAIDoOtdOsNdm0ZoCNflvDupBbEAgPRkSnf+zEi53TuXlZ5RcADB9svpv0/TLttUgsIyAUwZeTZFN/0y5JFHSUdBpSOgI628adUojYAAHkqrv36hyB9gpAcKTpQfs0lyQZMN/f7VVaX8qp51Pt4oFqrSx/wPY2BdlO0JaL0Zzq91UdKIr14aSnqDKGkMdJ+x2SVBuhfdO+jjp78XCusjDFLHAeo5fzLsnd8pzWWNsve3nk6gDgT6CP9f01cg5N1UbMgy0q7LfeemSCsUhEqlMGZNcesonSBiAP+9S/Pp+WS/TakojO76HM2mSWmboBDeXFKcUpfAABpLOvn+6d6M25v5VYt+QvgHHB380NsvI+klR4pun1pTXqn/ODMUIqVmKUHJtl4JqKEmEjDDdisx/2gm4wn/S7WyLpsqSr5lWjaKL3u4I7v7rkCAsozSkf3ylKWMi1L0fhB/3aCXoxl8GexCLomClqc8buQoB8+Xqv8V4x6Zb1SjsVnejdtAkeoWx4jhRIFGgISt5duvqn2TrXNJShhyKRJEvU8CLH2K0joXRNnCFM41HNMZgwtzW8umQUikDD1z982hdItQDL4b/fm+9C40jEehxUkGa/IVEnNkZ94IC1S1/E/axXYIO8Q7Z+MoOYwcMpInEAh+AOUAr5KdlsH8P5mgAp6ve1+9x3bx9+hiShNrVipR6dQK4BNI25deLGAZD2kQdzxATXQ/plhfsQBiVws9vyYpvIz1d/hCjVRNmkt5Ax/fFZuVUTYZPH6zFKcY2X7bkdcvlbwlpICGheKox6XpOUpuwsBn7aB9A0V/zwAsxVXuTTcdJk3RCfnPFjC08IR1L4zNia0Xc0yxy8I//6tyNi4RbiIkEmOySFbld706g5zH9KGaTY6TOLA+v7u04N7fbMWyOUm8Sc2D57/75lEpllCE2RAmOvXmvjknW+1vYFDqb/4eLiu88BfTG1qAF6j+bVHCFFrn9taNMbaYY/1S9a39eM9/5IuaubLiagEOqSV0QXbXBDhdjF1hWQR/Iugk8nLTFded1S/72awJKkShETI+BSNXSAoh/+ybG2NQSISnat/edTdk+QsnqdPmhmgtft/Skp5jZMD4UvciQ3Cj6f0OGab8uI2MVF1Vsxck54giSllvLlB6q0uU9m8naQcZHsEGgElEtEswlahZtJoJJMXTt8eD//+m/8qd1iDN0rc7CzSCb838DZOOwkOo9z1KeZpJk2R3v39Ve9uvO49c62H/wpldS8wA54gzeD9Rrnp7OSA2SPo5tW4KPYDcwOCg4Fy5uvAC/qtls7jvLA67S740xTlJHCNwakgXHDIrgwfre6qt30Uhr90WyuLdg3+ev6H26ap+CFSeT3kMAVDEZZvboTBOAod25pTzeWFYDFadpCktquHzYyfXdG0DOnebDRd1aUKV8kOME3t102GZvCG9O9gtkpRvbMwT+uEmZyozyc/tP9Pmsg0KaimYDu8NDrOCkygWWhAylH9+79hN5EwNU2MqCo9+PO9S9l+Kk1J2c6egFIdoKS7TFsi9y4MzXnP4uKNIri2xdGg+j6zz9bPI1Ir8YLQCGqhaajU4r9NL1ReQHAfYC1BlugjLhfiT1ZYJ8UlXDfT8MuY8vpVaKgiHhpTLeqljZmqCV5gZSjJ/WR1hAWpWve5M1lYxrbpkfeLu/qlK0Q2SEGKN0xlNRI4fsla9hdo76zi9+48iIGLIUSQhxyMN1mbkYpcc/RfOgioPUWauargVw2sVOSW410cyPXYgPutdRUCfkpHqNOSrNqXfzrLrMRmWucKZvbYct30BGbDjTY58fS0FUUixZpnSgqtnXHCBfjrAx1At3X7YuZhZbfSj4Pwae+22se1das6ZmQKaRJHvAg8kEUL2at8bo2ukfdlyLkq1cQGxYbdRWi0de2bWzlNVBklA84rHdm7HuRbbWH4/qbCHoO7+IwpJCyrai+SdfQeEq3AdQhH8yIGIye7eti2+LvOTIExdyMiU+kqsdakvNClwB58z8dOrbsFJzh8GhNU4XdibBwqsMWchSJsJ96ttPZheste3EXZSF4w9U2t/Ej8ZsIAlL3ddFUJWs8qJviqsYUkgzIkSxErnWkj9aielcTcsiURtyzDZajGpdfHhOf1ebBpfTXpAE+8BMULDjL/NZXTsVtu8HQrZPZ7AKEtaUO19JlcIItgtYrZLqnTJmxu//e+X70G6AupbSJ1eR7NzSdLlc1RVlpjVB2IvBwjVjejraxFY7Kefg690vopJLqeIyzKsuYL/juV/g8tftEuSKJdFRUSLHGxnqO3wiG/fmKJFh5Nav6UIurbMk2IFEaaumRVX+o+qtTtdSoIP/xlTixkLEu/OxYjuqxBsnlbUXx4i5t7egF6xXemMUlT4u2o6Sc6PsfX/c1a55aufOgGI6KbJ1cRcmNSy8XWdyVZONmQokQ9CZiqYrTyMtkRP1Y1Jh2IabQe+ujksqlUiJPcGjLU8uHxmLPw6GLv/w8lAxKV5p5bPWF8W+HiJ2mOS9O7dUb4Aot920Jmybxf+YUyT76E3pN2ILDW5NZLyTKGGsInZswvP+qFfY2+1ncikapzc/YVHg4hoNMlGaJiPmahK2CLSNeAlmKGmt/J/hWrZB1tPz7qpUx3M/zrVkD0E6dwjqfHRZcNU00G7fx5CsoIz9h0Qe2TqG/mHDOPx26KFGBZ4PtdSMIdz8Hxj5n9MqWaZ+V5ALMhVUvA13ZKzH/oY0y+L5V+rKgrGa2VTxgfRF5naV2n4AwzckGXGtEnJslpy4xmeGNN68YYtev/3iGhIwS0VcIdH1O+dWgO+9WuAvsbN2C+zAoJSMpXj/ALQejy3HfU4lZoVQBNZWjUhbfPvQwD5ydvs3h0nQBIeF0s5mOAvXrBDCw+eB3QDCVDh37TlvO9UOqpiWYYNcHmgDZSKZlDMpCv50qW5/daNBc/UtlYOKu39q5IYwePaHQR2GsVA2VKUSCH9lW8ExjEp1WONb6H/TRGHD7J3KURsGrp1uAeiB197w3FiKdpY3MIMPwlEA97uK/zFlAD39PUNq/0iw7fBAwjJm3Vz05V8WivL4s4RGHDA1aDRhghO7IeHzORdvE/3Uy3LTiEsWTGjzZUKpDT5/lDtuWd3kfRWYiEERgodWxmPO//Pv7fkRzuTLTgI2wIDnbErLwtZzLr31MFzS11fXM7ifLJNTeZ6HunFFVi2reWc0J/plMxVT29fByTpr2sHVDdIi3X+FX6fX5atEf8+Vss0nObh6jjKOExnuGbAbzqQvoO/jwPa8rbwDqcFf2C8tqZ7d4DiBw3nNePQFVwIDGsvSwFOJaN+kLkJVA9Jgbd/M0GULdsMdnPlEwTfsuYAfVrTtuImpsAFbWHwTtnFSTzXfiJRDnitqJXtBW3LwoWjhFampAei44d+TsRRcBSuquQfXtfwC1n0Shlbg76uqk5ZZoVVrGq1yGfSxYw6L87mv5/nPBgo4Z478c+c5c8vZ/bSlrTZ22zjlLb8+fwMYI/NSXdoG+oJ/6RS5/1U+/rIeWLgcV9eqkH33wbWkIO29NE2Xwa1JdqfxeOxRXPS0B4hafdtlyZviegapnzOMsMJfkseJLPs66xmdEK/pR6kFlHRzoiWdZzD9rxp8dIdbjU0IgUGDR0Y6GEQ5jJyQhUWURAFbotE5HH9VpEtCmsS+CZ7Blt0/wTiHqEXxa+B4HM26a25Kr/UHDFkJSLckARVoXB3eklJGaD+wgFQ7kmuwONCRA0XIzB+xIsoR+yQVKbsp1gh0YNUi55ENr92IeUB+/DUh5jgQBBg3ovAg1MiQnZjakQvZ1MkSnSq5GBxiWyc6mpYQ66a+IbK7+mXtO87TtOmQoSv6DhNmz2+CuM0bfb7Kyc7OdBeAuBzdoITLmxRUjUN/B+s2eQ0G9r/RAsmep8alSDxyoHGqDk2a6THbHZ0leTmrH6x9zMQMDlWxPgVLOUati0SwECDDhjQg2Hcseh98pgv/wNo+0u5Cd8ajtxri8XubQ2980vZX0HV5iIgU0i+NrL4WobNBiRQyDKrtnbGKCp97YTppah5MmdCYGPoJ3++LEMG+yiFqxuRZP9IpHEGxfh1KLECGkqM7EzFWBhzuyfAsXkqo/kCIdRegvQWHp3lRsRSz/FoUC0JUiHAYlgpZlY59odaSa3g0JLVdhp7B5ndP6K1/Zu+2R+bHMMbT0FokhFSx796zm9fHv6zMir7YQ4DeOJqCYYgpa6NEuy8vlzrG/Wp6R1oBlAm957HEsVjkw+7+tD+aw6dzl8dE1BSnXDjzAf775k5aQoQfppx88LuKqiWvWzXON92IGB+6lLZ/rRf/TwJBfB+tay3X89o9nBclneZEniPVVib41juuMbw7l9ddF/J1/YsPm6AOjlt21YcSx3XGMKx6Vg/s6D+zqP7/Twz95AlrNuTNIeO6FZeIpDfOHyMW793OxAUY8lDRZQBal6qog4QORQiBmj5qIk2QOZSCvTVrtpUmkU+o12/i6aOchNGXgN/Y8au7Xyc4cW+gPUvaKy/rGuIf1+n9zpC2g/lohDOm+RLg7XP2NZnRouXoNsCOrHbtjWD8hNXGD6PyvP5pfndqF8BOrHbpsnChaJc/ANG1w937/7RJZCu9zw/YvOTpZoKRbn4B4yuf3U+i0+xR4rluYlQWyEkDc4PH6WD5n2fnD1CbSIkFeeHV+n0eueqWIN52L41FUJScX5o6Q0sLkK2ifPj6nK8fR4v9G989gIQ5e7O63wkZFcBP6Az9/+pgCf4cAIPTua/DVZ1vLLseDR+fp+Tl7wG0xEA+wP4+JG65+8R/mlPb9wZe/j01lbNKB6cHj7W4wnoYoxMqyLIxfHhxd3ieV7Dm3GI+91hlTPsxRXud4RVbvDw98RltFfj+sQyHQLYKeDDKw9UanmxB6QjAHYG8Cnio9UEvxAT0iWAXQI+i/Yj+JYRa/eckBO7aS0R5OL4OOrvu2TzuWJSv6/f61P5fEPfjlejYe8xIG1R53hweugK/vxmltACYlQBaVPkuDg9vFbDc+8xIG2KHBenB5belO02ZEVmrBMjttuEFRmwRszXbuNVZLqOUL2uVbwsB3YfUyPz0njp6jWRd+BlfZQuC4I3YsxqTdk6hiwRM1ZrxOLKYda0HjMsqRfgfkCMfEAVTBcCm49rrqGlCC11K0Bv38YWwXQS2L6mknwvKhbgp1r8Rgmmk8AG3VVZml+xzk69gecc+hxQOSpwXjim0TmTnAJ4QpJYII1f4lOsZhau9AZrOe3CzYNa/KBmOmyonvjITTJbApqLn8IP3G8beIKvAua/Ct75txHS2IzfOOdHatiC5BLUIxyW7BXWqKuI2Qo18GT/SGL6Mjuk8b8bXmvpDaBzJHhYnfUkpvXpcdCVSoPVQeCwnHUSQ1E/lIcAGnxYO+uTmCkuLiYian+VE/8QlvuGXaoCQGOA6gqwo8T2raWdLaWSVtKhK/a8pHSuiwtAm0B1Cez4Ksna6B5AY8VAdQns+Fr9Hqj3DKBRoLoEdnyVvyn8ImpEAG0C1SWwY+kIbv+p6sqXArc6pZuked78bqnNU+CGplCa5kJpmoXM5/qgHiWgpwqYhwaQRwniqQLgIQHeUQJ3qoB2aAB26NYJ1qH14qwjEywxJzm8AZHbZUGn03ZOZDSBSenDoyiwKENXKhsfpxPK25oITD0PsBpB1vShahSIGhNomj4kjQJFM/bZ4aPoiNSbjfK2DKaeDNbJhh+0jjzoG3VAK8U5t08nAXb6VS5/X15sAo8c9n5oexuVvF263cEHr/FLaxLqNH6DpyMTW4Z2EZLHDuPSkYktQ7sI1fUiVNd0IOJh9IcbbQ8w+GE5kYktI7uI3nOHcenIxJahXYTRdYdx6cjElrFpo52e2uqpg556lC7utnqa8Sc3nDh3T2yYmkE3faMAFi9MdO9EcZMsBR6eOKcFoGMXyFEAcBy6Qr/PjqlSmVDc2Dzg4cQ554dqdsE0BRBNB/DMLmimAJZ5fniiJ1rqba3tRvca2RA0s/lq2c4qq41f26ibo6F6kFD9KKix75j3x26kH6W0sQnA0l4XMI4932cJ7VZKmwgsXQTG+fFbPditftzW2JW5s3GeSmlTs4CFEmecH33WgzzrR50ZQJz1oM36kWbzo8yaKgOOZgLfyHQXY04anlLaeKiAhVNkHJ6Sd106ldLGyoCFU2QchRbj+9lT7yPWPy8TY/zaOGdVcWu9nJNRu+RI5VvD++dbzf11RZ+vz6rn1sY4q4hX6+GcvNoF5+TV4jcnr7a8ORm10r09rKQDUtINJxlacNlnEIC/psK2BI6OBL6RK3LfgxCpsI3A0UHgmx0y0gEX6YaKjF2ROz+HNqXCtuYARweBbwg7I0fQrKcDxQ6aWe6sePFhDj/4Cq4CFjkOwcbo+feg+rd4b78vtb5bxz9RNqKPa0HFPH62HU/lKKma1y9L3B3ilODb9Zibre0Bf/hT9dS/RfcGfTNSWfP2VFbMYshZbPDch4XUISFdOMhw8EQdONEFTcDMJHXdBOsLHHda7WHviDpsTdbyiar3KMfyXZt8XgxhUFkJjzBxqDy9aqAq8PSXUdl/8ZpSY4WvNOZezHW5aD87kMDujus7yPIvStYXAEk6L8E1IOmWBBNBhyPtD/n9qn5auEFeaYP5Vsmk4YUuI+cCV7aZ9WeBP0H2jlK/nbCd1EdKBvePAGyUoYNnPANGxTxkh3M7KM5oGI4SguMafjMaeqOE3bgEqrSPSMA3fGA0dEAJG3ANGcAV6IoxDZnM0XEIdraEM0M3SpgYOkjCxND1ESZyTo34q/hLMBAIkrTxi4x48RMl8FR8gnGdP97nCPqYwltP0HsUJoJ+oTAR9PiEiaAvp/b3ZUPnFd7ddefXJWNDtxb9Vhv0HGiSsCqSJHUSfodX+Pqnji9lim5t6BAY00Y+TJgbU+0KHZRs3lfS3nx4gB/I5jT98EiBWh2G3KmQ7IRPsWDu9rWaQwlXKP7HCWs9CsT2ddEgn9yJmrhW9XGLYzGLOryiY6ziWJyiDqPoGNmHN35ZCmnI05LS6/KokmaODbDLT/tdNM9Uq1F81fS4wn/Bd7x+sXe8CnOrxE1no+8OpOd6FW46O6eqmLi5S7Uiq/e6K/yeZhl6lMNpExtOmNmEbDsN1H34XVnxZk4Y4eq49ccxOS+1OLHzP1t955k1xFktXaXGFXfFgXtkEl3PMlN18ffe2L2mljOS7jW1/CF2r6nlxFBebXvsOIbAntzbjy0ZOa5ENabER6BdnLot2sv6qlEaPnzJh0Ne06tE1OqQSqoQZ7iVfGonpYaVWWgMeLOZBb2AiVc4C+yPYP0FWXkx1l2IIa9PXCCxSCLwVjOLEaK67LRfE47SgbquveA3rTXXWwWpinS4/bl0DgLiw6JcbIffCJIuzpYhHLkEQtFdJm/8U0KjMNA3+rmLwyS/ENb0hbAmYeW/sBqoHeC7kic+9+f/MM+I9yEXzsOkyMIa5PZZ/k967qJwYRomDQlrRInnIHW67ZgO1ywgZdWV4Pc8Hm0auvtoaCptbMpIKXDFlb0rmbK0TtJlpWqdVaA4eJNZhYCDiVVwN5hYhW2DiVVANpj8hlpjUq/8nYoZ5OQJKTVxTLRHD69AhvWVcWQrjOENHgLM4C+jshpAbv4uFruHpN2O/geLRlT/QGoorM8uZlJRwuAtJhX/CyZSkb1g4hSzS30ZazZSvjfmVPHEzde+vYjVCYulRuUP+OBcwncxDZk0JKwJJ2FZUj4lhDBFvZ3YDCFNYKGX+rHFaIQtJ7NZT8wsf5DuUfOa7Pbi3XysApMpAtC0LmW33/4ilXaGvuZMjjXeIrRajw/JoHyaEpdSHmdm/iHdyGv7GD3YtgqfwY0M5dC0EGyUyAFCMeQR37cEsfuV3urjJCx4kaRZhI/fkhQnZupSjfsxbhE9jtyP4PPZJckoHEm8MAo0Ei+MQojEC6PgIPHm+gz7MbXkOfIygv+BKBSfKSDByZGTSpl627DAX8f1tOYfXe7zDohRzLX1nQBdHW27cxNnxWYq36yPkTE1Cg+eMaeJ7s3H+c3+JuKO+fuO+hvPwxBhPDzOaQx0KIxzqA1zhNoox1fA59UewoFJ0lgStviSxjqKwjKK2ipKdC2i+Me7U2yjLFCiUL8hdA8ljOiR4x4oGdrW8Q8D5dlOSaDrkqtPRuXWRs8mINdBO2LvdHu3yo97jARuHamQS5oW2esTJ0trZE8WyqkMWsgMQwbm/njQgydvWHUt3SgJJWL0xZPig/Ln0fFf6/mp9h8rf/Ebu8DVH6SN0lz69AcH+ohickJEiAUS+11cAScY8VmGFQX2Z+YEo3GSEqbQI7GF4PgJ0cQYVnm2fFAy/sI/P5b+DILI6UoakhIfETkYueAzplxiMFNlRnB65ULCkqwEBC0u8LwRH9EoXUwE6JHVdB+nmXrI48xw4fhgoKoSdd5S1hGskZwx4/HJY13xNTv7jz3yIQTn8u8IfQ1PNuaDz/r+meL8qzpB6zafplxaFEbxylUk6sXHJxicOdgueTmzaXda++x4DYmRC8gJL+5lWcL5XPSs2R5p377br8IfRJSivlIcrEQWwsyFjaWV9ZEDQYxicaTSKNsmqcZ6yQM/Dy2UaEUSX8sPvg7VmMrJdIIfis+MLEmz2WK706LOGfyZTXyzHkU0FN1rkGREN4rnAFf71Icp/f5Pldw9Ew5/Ml5MdcaP/In+e3OjfbSwKRPA0KPu/HJvqfvkumZT2yT8UNnUIwkTmxoi1Wdhn7WFO2pte9xUCan9/6mdrKEHuKbN64/mj/ymPGh98UYTw4cy3ib4KEC7KiC7egC7AfBMONa+Ef3veOekeIm6906cnyk04k2yOY70alHa9tnSOMyL/5q+HpETUFW5Hn9dB8byaRV4rGbhU15Fcl+uPs2co1zuq0+U6KxkEnALLN5SwFulDMgmU6s6/EjZ1JeOtk7n7/YUPR7zMbpbZT0mQckJditSF18/wOM1p6H1B1Cx3Y4L68NxAJHsbOmua2sRZlY1tjZmXL8LMPM2262dTZ3XE1Gg2F31GguQmwUyHiC/LaBWztyYCjYkOzv2B8fBDnfSpkH0hJlp7Gje6GP5out4ogeZHzouwfMq7pd/f4l4ZkyyxbmD4hm5gwLJgwLxR98sGabL5idUr8LMUzrMjUChGI1CR7L+z3/yO7zH7xp726LMr7iW/hPckc8F6WvAvSqUAVvJq1iqGDBeJTBgvOpdwHgVt4DxqmQB41W2AsahRgWMwGt+eoE+NkYopEUD14eh91JPFrfgwg94pX6+jjvWtYrY738+/fLEwJu4Mufe70T5hrfh8x5eEF/7dT/qcfXy90PcqLKTbyZ3WanbeOq0wpWYL+/BLzrOdIBdOFhy0Io+MYbwgKyB78tQ3XbHHTGh2bhpievzfYg2+qrcchDhpTf65ejEWJ9304mLPseJZT7HiT8+x4kZPseJ8z3Hic09x4mnPceJgT3Hilt9/1SzOWct6de/m3P2i77Dc86i0DPjZPzt+e6WF1dnFZyLWQNo0QzabcPEE+b1zB/tq/4tMMBw82FlqXDUCYxlsDuSua6KsW4ERy7yXyMQ3oqZmZM8kjn3E80dgjDzPyr4S9leSThi8s6/4GVXj0fwMivMtv/5GzmuEMydtEQSRWFv2ZImEGXuDThB90Q1H7bbnFDM0U3NLWLhxrdz7ZxSVccXZqy2cwSggM/xhXkzzdbNlhJiBxfsazzePiwXMeQwkyzNEZh6D/8IW9JNKYPiBymDAimDAhFH/12a7NcBBaO8sZPSZrcwX/F7o5uo7mb2sFs4oCi+EfaCSeduVZsQ4ji+UOqJyiwD7I2KZf+mLHvRF7BQL41/LfNAK7rWH48e/GuGB4Nnne/owb82d2wGWPwTTNHN2sxqbGeRnmGHIMY+pmGMsfmnWOUYCC9G1wOGs2LfuiDtMs0/BOKfYbAP57AWDJtVRL6so1ry1ywUixdtzanRSw0zpBo5d2lIC1xLYaKGGmw2GS+/4n+9vDpmrdsWTVImHNENFAY6CDLE4SPC7r/aZnRoiD1GeKH0klvwg0fAQDjnOLr/GveYl7ohRlDRPXdSIUohgI3lowkwXGnTBJpw+Vc8aKDgiWLTwMsOfyzi7s+/BDIhy2AGmw3ebi+MvVdzJxX8qXBIrkdotD4Od1MRh6Zr4hncrvSNiVx2Y8ZvQA7WTvZVUZI+tXCUf3mJHMDJguL6yTLXlSSLkmRRkixKkkVJtoizEKtxYBfNfd3VWF9pPtefgSq+OJRZoHcNvLuNNybOoZ55vdT0j90+oylTtYl+ou39zOvmy+65RQV29xdJ6ivOoiwe7q9ghDv37vEGeLVRj9jdjyT14ixKPNxvz4sV94dtqutBnYPcevMrapCDBxUMdgerk/XaNtpvzb+CyQYbzSOvK+jHQneKx0jd/8pNSkPVuA8lcMP9kOFIUfjvJjfBHZppwdL6cfuCr/FHfniwyw9cm7Jl7Ux3qUeEw/fvFfDcXMZnG6BnFzxV13q9Pafpfu4qOPWvya+xg9LVQtV33Ebi/mdiUJ04jTsR3nCz/c9r6D/mphXRrV+jSLmlsbRddVlmWDgOgUjFL1Rt45eME/eUMqQFBnyWk9aUOv34oTPuax+jrqS5xrKOlqXGkOhpb2cnCtBjqev5FXvIrDa7yg45zK6MQw6zq9mQw/QKNOwP9ubpCKpPCc3TU09vyYl6s20/csoL8F5bU0mTPeY3+bcMIs12MH6HqFHLY/cd3S+kLgStDGFuE8Q+lAijSkS5/xCY6g2OqAtBK0OY2wSxDyXCqBJRjSII7CcVFUgfJkw6z3u9jSedC70epmoCrLfnTP2UOdS0T9Ft85laBuoddvzWc3obztTCTA/jt8LSw0wtlfQwfmsePUzS4kUP07QK4cBrIUSPrsuU5xdZbexy5PKP9tB1D9J+JMbUiF0IESaVCHAj3HFXZyL090YMrTqI6WEKISSlYAQn5GPg9kCrDmJ6mEIISSnAjD5qolftnwnK2A5Fb5co3bJFSjaPId4qxBCjZSR/6CNE97lYjxna9w+aHOejocdKYO42cWQPa+bWbuQ0dTs2zo8RQg0NQo8HQg8DYiP0D40t3lRg0dp2Hc2PwZa7jFaQhlPrT63aiiOJbK3h/4B9yCyVKzSoVNlAAEnpCzPoCkFlFUN8jid/oOYJke6soVMFKT3MoIOgUuEF1ufkv6WvuHlRqx5NcgIRVgPIxFrygCo8CKCJt6L/pr8ynuXy/BAF7K9U/41sZQQYkRYPkR7+kBz10DZgh35UGKynNN2usodB+zI+4f6ut2Lwzlxnnduh3jLXOwTDMSkLu/YIyY/ueo4SygHfSSd5hRn5K8yrXmFM+roraLrIM85zKfXQTLjpX4dDw/c3OZWW/nsg7D+UgiH9hh3INphTbhmG4NeUuo51OCgI+5UhhPQwgQxySpno3V8vpzTVcljqBi3cY1hhcn7sVag4UloRn+u4vPTJFqNd+Jbjc3JAhgHDW/qTr5MjMg4YudGnd+Cl4F/fTSYzYf6V1MQdOvSZseDu/jXawx18CeK8PPvXcg538+Ufn+H7DVqo1Nf+VF/L1SX0lxR+rSJXRH1MOCY5Jv30tmuSfxXADF4olTqbNecRQFqfopCRF/KqQkxZyRB3yvTVljVDnwQycsirIKaUDOGrQU+I59KngIwc8iqIKSVDyOd46Ldjlj4FZOSQV0FMKRlDeiPOVuiTQEYOeRXElJLkSkZUGpPSKs1o5D4134D585L+VTzjyUn962UGMPmAAcpxAtTDAohHAxh3EIDxZ/ftiIuQf1WyhNt126Pf68vw/fnLWtZMW17+1/k1XmIrZvWvphLusid0DgClQUYs7mppRPeVlDbSuLAL4VPOFg7uJGjxfRDPy7jBfzA4Ly8J/444IXsLL+Bf/yFj58tOkag7JsgEhVrAFVEX4qJCSlnJCHfEB3IX7UhtCoioIS6ClFIyggdSXtxCpDYFRNQQF0FKKZkxsqpH/5/ekvnFjf/PSYm9KPX/iSThzjbf1FpfQ1z2FvmlelaMv5DeL8b1ayn9Yjj/vKI4PkK+R6z1aJEepzaPkOQRCzxieEfv7axDSEsWAVq15sR3R2h/gMwNgYEyVav7f1rj2n8lBcgTZB4/6+Xz76zxXzjm+V04/su03IWphKdsg47LaaRFp5enSk4lX6LyJPJNMqsoxum/pP/cSqut/5duq4ofOjaERUsnZnomnkLF/otjPD+N+4/5LIr98EY61UiLGEntIilZNPre0H+yknMejv3nGDlxHfpPDXLa8J/R4/ThPxFH/zFXg9X5K85/5oL9lTnjmLHoMyhu0ZjJaBiUuSuXU4WlTe6XG75k5j8DmfA6pc0lI7mkApcS3vLobcmYLamqpcS01IZWnDkiTrD3hngSiNfy9HC+q48f3eDfqp0YUBP/uBx65Qq0jib+wq/oLyCb8fGhevSnu/mm/T6sGSu7UynEcppzbxej0DNtQd+cShuZr01C0DLhpTs6hZxWnho5XL5E5XHyZaMYvNHKf8oMvg+ms/XIwX/VTdNJiJnDf14J87ttKq5NqbMJUTaDFpuKYFOKa0JozaCvpmLVlIqaEE9Tm2l/0jgT1EdyIZZC5Bo8VQeczsYcnYco6+FWQmSugBFYPGK1NsQMzNc8PLFNhRItcOpbMFBamny27ElJnpKyVyD9/yWF4q/IL3ZC4ArHhynMumPzT1off7r5l6jPmfzrxXmqe8EtT8vxa+Kfdhn0L5jn39wZ5HpZHJ8t4H8pHF9SMN9E828HHT/5J3/Ol/xLPcdP/oGd8yT/Ls5Zk3/OZkzTxRb2LDKehaSzTnJ2BziL3GYh06zTmcUo8z/GXxF2U5KtXP22npswn4jrm/HaPwo1t+EY/BaiW/vcjk8H1HwLKvXv42UhIklAsxKVNICMhK8PQQkAy0ZMshNgZiargHR7KCrZSoFsUXxW+j6W+62ZOSGUXXOfxY/XjH4B6MmY9rxedOep4hS7V0L2yoReFcy7hcdbbkbLt26FW66+zMa3LQG3arxWHc8qU1mtYaydlYTP7Q58fm9g3R05yMMio0xxwdLu2Y3ruwphN6th+CvoX+Kq8dtUHpaEwZKpVyrsypdxJaGtZJKVCrDy5VZJuCqZTqVCqXxZVBKCSiZOqaApX76UhJWSKVIqPEpqRlVCtK79d6g0Bk7M9kvmVdrfJgffj1NVKm8/5hUmDyVfNwn8o8Ueise8gbOyEnPwwyQo0ouhacUw9lvTb617qSku2FPQWwuTO5+A2ZL0WZAmS3KtyG2tSmUtymBtKnF114wB2SnQPUKYSkbdVUB2CXSfEBslmO6fpaZysoVBN3kw9h0qSpt1Jodt4t2EXRMN91VevEU02DeJon3CKPmM+6JsRoqH8RtzZO4Ioo9fuaTYJx2K2+OnV10lTy9ivFJ4JuFR5rVCP/fSC6QaDegHbakuDHd6BRB+a/DIWW9/GEo1pdb1xfyHpPlMWjliUwfc+Uy6zYwdHOLxt1sMKTgNBRD//HpCIt/jbf1zAaPVei1hLB3rYYPG6rmGPUh2sFKAJZBlAi0XRFkQA8fTExVQ4Xw8yCs28aocafFerWSUx9sGxkBG4dryDqaBGqRpLxasA3agjogFM0ADMkSsRh82A8Om8k+NIWwcVP6pMYYNbEqkQ7xa8INZ3AxiOsriGMQwNjH89onBvx6uCvwnFt2rBbpSKS0CohX7QbaEHSPHUwyjZQ5+sbfcue0Tfwm82EnGlR9j2adltfu7S3zXfbGKxW2VE0PoIQ96zsM+Hjx+rKmUUJEC3nJW4+nX0GkmFxvBu9k4/+GlHT/IBpxYedvW21a+BkG7ME+doAJfkM/tbxcGWgRYekBnPPowgat//6NzKS3iP/x1/oMfOMcefBVKaVOYDjr4DH1maavPqvb8SftaN12mPzg94xsqsWTq5CpA2ZskiR4EA5Ydks29KNjqJeUd6EWxWivdrJSvW6KwYQVz5U1r+bxIz7o3SeZvtfLJ22oX3tDm4xbX8mw7+Y2378NK50yazLoJMGvDmJ5FeUDma78+g5vjzL2D9EdC5IDST4P8eZbcX/jWaWUlbf67Kh+8hISuSkj98VNjxLIGYQMPE4m1/Ib52GV4+ZD94k/7us1V+uHuL77r+x/rv7z1kt4ILqQkPLmWAP8tP9UD4VHJlOWJKEALfMWWGMavSN/4xvZ5yiYgJkGuIUzZpUMjgK6zP1pEcFsIRT8kwq1QaNPLVSqw0tVbe4AMlRSQPCfFH8oJ/oUVW4Jc1qBkilExiNZ95GonHWipLzGKvQzrP5lOiIWEGFY6CDcQbolgC2PQMlTdDfqZBE59dGIl8RoCoKmn0KqromrSYCpudBhjcI1419uUFVnBDIapk9ltNvp8DRshI7VKstn0RwbrIT2RZLNk2sIGyEAk2Swdn2Aaooko7d6WsBajBbSBMxn/lmu2LffcWu6ZtEoGb5bbNY7v0f3G+7u9JEeWMGcbU6WBemiffIHMK52lb6yX/vBeHKjBP1r+xgyeiuO2gnN/zYN2HZvlIHqBbcybNIttXhLfX54oGl062jcUi/gK44x6kIP8rvv1NZ+3X28neqG6Xs4YLG2qeLhKV5ljYZN31X4FOUH+M0iKmrmgyVac3odEBPAGxVzI0gP42nQs2i5UbvouNzm4Z2xyuPdzrmecD2XlF45OCK1bD2ylIAvU8vc8QSgNAhMS/G5p1QPg0TAs12nz91jWUNi/4/GZ+i58xj7i135KdPnr/CNZzWmxt86r9Xj5+PnY+YLxi1mODi71Fumwij9EiBNHYipf6Y03HfMML+/C3K/qgvybZmtZ/R7oTQt1WtEOpA0mYtreZ7Xa/0Z23/OMPIjCEKBtlOD4BL4FBvK3RNI6V7EL55kNPFyxGUcJMgNJTcZ2DpGlkBmGEf/5APlb0f4z77G6st3nwIKBtaVA3e97BHMim9wFug9ftvXXvILProqtXAfdqqkzJgoL76l5zRXnGeipg9Au9EUEtDzFewYoOEVsc9hytyC+BijrHzGLdsRs/SOuynGH3X4KJF/yFdm3Li1MMs0wW/gpM0xDD29b+62dAP73nwpyNcRybtZmBnpRE/MKxTTfC7ociCy4flzwwPhP9haGEQreuNvn0AYo09UV5/39HNqA2aXXOFf/dQ/pGsDgJjMmwRmp8TZUPIplSOVYFOt71awq0P5Tp8v1nypri/6UfRqlFp1e6alSOpXSl6jSkyh9qxI4+ATmMN+fxT9L2FVornNm3FdrilnhiNxTdGVeDqdul2V4BfnUd/k3Pg2A++MslGQpDJPG6Oki8rTxdtroOn0s3WOEnULfK3n8rVcwNwtXq1LaVN+54gekNfW9wy0e/yDJJ04M+RuUx4DU1fB/ENsW90P/SSPCQDbApNB3/SduCEOtUrSx0IlUOkDZxWr1bEm0hiFXq2U8hAoVSr12/0fQsGj5tVX6BtZjW/1lEN8QquBBiuD6qG64cIcSkB/JpicOYKZMFqGsiUfWRR/LYo2NRhZLVtnAsLGL3Ux+L5N8COtd34S/5ROFXIBGqYdiGjfdU4xJ70RfSwNbC6udEJwBvKuz5c7Q/rWbeZlA4kGA9E+7lmqHR1lyVy3VD48fCcgZBBIctuHtUP9Jsbi9WevhWLtKcnystVb53uDjupYettp46+3zDKPrr6/raayEicx8aGrEHtikRBbX7I5Pqlf5uxeRRX12GDcW2gNrvyeaGB7dHu8ilO6H9iuL3w9ot056hZWM9sApe2v+Fe1eU/al8pHGRNNEHCnii1TRRKLYIYeRQv0r6Zj4ePg4+aVsZJzQNzqYHVuC7IZyL0zDz4C1RPj2rlEWyKiFj7DKELQAv7/EpZGx0kz8WJjY5iTJWPuvJK9sWdTd0wsPL59RYbkegm9Ntb/v4stqRKTwOGQhJr6SO1ZllfvMDJdAzLTnd71gdj/tQPpO7xoi1q0SHtCIU1x7eBz3RVliSd9RBVGTGgXl3ha2ITVtyf8HNeVNlvAZfn0yvggapCIt70Eu1vY1qErp8hmUEh3fg7q0bj+DpoyyeKxoa0ZFNauBFQs7knMYj4TTR65NFhOviIBXxbeLotlFsev6tvq5RD/NynxaBH+TSL6vIM/4vaNDK3SAuCgX+uZbpP0MGbmbLyr8qkGIHzLPof3EUNXsqqNYXe50i8e/JBMnEIFeXIh2xcNIb8asU8Lt1gWZSXFnFh/tM1bjkASqwTAsWbM7XEfsgXtDbMTJGxYjTt5QFnHyhp+Iky9kRFIm9IdVuVFjJOoyvrqM0fUD34/biaeIpmASaks263ojS/ViRrYYxZPZqAwwueErCIGlW3GSSEM3WWOPfDvmHwnKLoonIYj4DPTinnWIJlfXn30WQY9TH3xk7LKpff/6lPuYXfKL2M0/RK2teDUomvnB565p4Rb3xC8ihBPhrnsQNeCb8l8WLz+8HQtudnv3P08QPG6h5JfY+a9b2nL//XkGRPfujQXuN/1etR5Z2zuOHZLCbrA+MtIVm9UDlVPMUAMJBThoa8FLuYOaN7USCYHdgSw0zd4W2RxHNOMCsvvMP75WOjRcDGVKUnIciZw1IBRkkTCFiVMp62nVVSo2HdRlKPQcxTJbmHXvx+vQRfqGxQwf1z/eWMzlYycDjBphyK1ha0ihJyQcUusPFNp1X03ZG3RKyZq4+J2cOrs0sfKlPenefFUqXJQoNchxAoqcZ+hV1kpObFG/6FICHTRPJ1d07S2tTbfE5dTnJ/8/s1REYfctBQMJz631Ho4nPk/LbsaVk72ta6Yt7RTtajhWPi4+TsbH9kRqDYncUEg9rRC9StpWArEspCp2kCXVlULECUHrj1gZUvsGPBJSaWssc5W5Qfq9/AdlV3d5mVxctS5yrKUtJ2DjE8lyi3lA7l+E+9rICcQQgyESw35hmHMVdMSd8hPCf2hjLETNoJtYRro4NU+G5sdw+nGZBLEDGXYRMP1MrYlih1XppvD4WTlsf6NImSFtYp9aiuNy46Zqym0aExZFW72EgxV/J0tSOU+QFINeVwkQ6cMbmtM8P6nn7HbISvkGo8ZeFT2caRSnu46PnYo7guuKJogXxcfRAMxo8QzoB1cOtwz/GGZ1L4I4zJOILz45TGkg9wJiLgLzflBevaKWsFj7mdUNiizNne5n+b8ZLZwFvUQBvNBlSTEgli6zUe+t+ihh6SH/i58cLVuuslIAn+iybDIgaqHene/Ed+hfbq8efvzM5evAanwBV0N9PN8sI0M5/KYSf34oSP8qvp9O0ntuK39DFs/cqha9SbALPxnGWf6UzvB+qsfKEfQy0d0PJrXVGc5qAM6sGo30SAig7BU6sfKe4YOI6PNIVXnkI+SN3Oy+Sl78bAgVfG3pzQH6NqBqR49QxafutimJmAX6pghVe9QjVGN2Z9wFd8OgpqmrKEgAJAyyR5DZzO7Cd+dzpUdsC+h/miXp/hHvU3pdRKNmlFUDhtB73UW6gJ69xQB10LDqW9C8tHmxpxtwOmGbhowCGwrLIbT7927Jry3vdESdR6JJI9XPGrnJXXEH3Amjq+ijLAjih0RB9gcyl8kdcGf8ZPMf6ryhqRKIyp7MTNly4aMsf+F1MKLSBdWg6aiT3RCnwnRUi4tV1AFRJW3vJMgOKx7vovu8qJE/F9s1D3qrXLqAugBcQKImNBEiCZQ8xXqJ8Irjs6wohM52QLQfMsRU7YAiQhImyf3o0uxQSva0fMarlT24VJdgGKMxb/UR6HpDgz7XIjaJ22RtttBH9Vf7UlPgmCA1xjEaoiES9VrM7egYyebpIKCS4vkb08ugbTlC0XjU6pWY21E2z6YBFdFRN++mBRXREZuzKaAiOtrm23SgIjpyczcVJIf5FmD6agK/dzbwHrB1BnJe1oFOi0KyXFXwHmt2zCtwcyt+emPY3ybU/neXrVmh/oz1qm71IAGSKEmD0iwCIGGQvYO19W/EVT89VF+VZC5vt+mRDassbrf43DZDIL0t/ofj38jHdHc7EeMu0UaxNRmLsS13Wv4Z1IreFqgqh4/AqboZlARIoiTtSdYLgIRBVgbG9rDJN4zQGHooeYG2TIAHQMIg6wJbe9jkG0ZoCz2UvEA+sLFxKzept28qb0+XPWO3qDbGY+psEYYaY+bnLjdVKqmkgnZVSEta0gKZwZ5AbUnsUC6O0DNEpl2Fqd3wxrwhg3roRm+sO9Ivv87UYlQCJGGSvdEysBCIFxICqWlZX8gm3k1iNtmbzdReJFUvqump20tJS1rQ7rTq4Devx5doDHlSCBNDHkwMeTBx+K0n5kQ0LlRPMY0L1VNM40L1FNO4Yb/19BuKgfCAIQbCA4YYCA+YxYPmGWbxoHmGWTxonmGMhfSIMRbSI8ZYQCAImrr+f/010AwpWmlpUu75Arn9IW3P33WF8/2ae1AQ+g2pnqNMeEuTUs8XyOIpNzSxg8XAn0c/uHZrcVN4NGpEOJ1PcAB0AHQgwiue7piza3ndsdWzXRYMrsMcQ4zTlMmKisR2n96QMnJJIcobhph4RpGmnf34JVGSVZH4JVGSfdAb3eFqcLd1ebM7NU3DEdF2hHpT2hGQXxIkyf1oEncEDV8Y7vfsPd4f75F8QRxx9tTyupRvfW1rstkpL3FBvwkMUviM1ZoGmH5Lpq/8EDcEIUM8uUwBMr6jbVsIW0nR1zAFQgYOF73b4t3dTlxRwaiR6de4f92xx7NmX78kAuKEhEA69h+B/BczU2ZYw38QnepYcxMot6TRH7lLgkrWpMQtiZHkmvDiu1Pnbtb+GJItyi7UoYZD6R1Idk5eutLRrY11k7Wi5ajV8x7nN1Jc0kLXkOlyNyQIsiIwUroZzky9GZ24+qm2TI67ITGQJE/Ub79JVOXcN62tutmAh0Fer77r35Z42MZ9KmwrdmyGi3VfZ7SsBVMnnchR9jLTejxy7bxxfhulBWzkjodF6/nZWyXyV0X85Kua0pldrcgjV08eJ10SKK4R3lITtSKHqydnsij1xbX1WdppRQ5XT8v838VyryRGsh6yUFrSqmJO67/EapGChQtntE7RAzitx+HaLWmwUE5JiGQ9JF5JiCSJhciI1pDrftvzrWQGtjxHynTN+ckrrYqR1RCvxMhqiFdiZDXEKyGSmyYGIufTsulrtVJIydyf1uNw7SzsThMdNew2Afqrs31t87b9Jv6T064EC1kzU6eu2fwL+KTbNvob+PtFMjGm1ovBgN3I3nowkg6AvZyBDoC9RIAOgD3tgA6A5XqbYe7UC4mBrAVmvb0lMSVrUeKFxEDWAvZJN+kG7UYgLWGBViSXeCExkLWAfdJNuEG7FUhLXGB5CoqSrj799TB1YQV9x0UHa7aSUyVGK/5uiL9H7/GevUf+bBym3KgordnbQvO0HoVr5wBLZUqyPBtSAtigY0NYtHRipmdNLCbCzczQCrScQhYiayFOCZG1EKdESG6etG46V2ie7LCVg25Qs0Uot8I6YQkL5GUzdrv2wHVjG1idCCUVwvKcRjs6PPVzjdkJN3ceIHEosbrZxdpgxjW7wBr2Z/DPiQhwEaTAW16bUDMA5bzMb5yw5JX9DfWj1dwbpSzny0v7olL4tNNqPHDlxdEOG92/9fnqa/7HCYmAZLB8eduE1UutQ83VOSEhkHVAEG6yDcptQFiyAlnRxVMv4GRXcuJGpekLULNFrZzZNsx/lQCVwmejVuNw5TbYJqw+KknH8/Q9Jje5EEn3xfZpag/98JhblfRh6LtT0OLtNvaHVZpY5Opl4V0+4SlLYY1Ml71GtBqHK6dmwuGXwjrELjNNq1mAchYmfxQgSEBGXyQdL92CzXxCFSGrID6JkFUQn0TIKmgN9kEAJOGbOC049YF01DhVa4zK+xdsfoELei76/uuDBEAy3D9L2yXbhBt060dWwgL1f0z6IE4IQv12yTbhBupHVqICiZkog2Tp9IkMQiDUH2SbcAP1IythgeWhXqrx9THu/Ud6wux3mY1og0RIcdPZ+uscthMRFkRIRhEWRJjXFRZ6K6HIgZ58vCoUj9JqHaULP7pPI4UaOG+YZVp1pMvG/TIp1el4sZNWC+nScd9SStUsXuyk1UK6dNzbsFLlpRc7abWQLpSP+DvnTc0l8UvUDGzFTV3NJQmQrIHEJQmQrIHEJeFWcdVKWvLXu/Yeg0oJwEaWdwhSOMmJYg4/mJ5dX+EFLt/2J2WIZCtttLwgkMyodhfxkdPuwjtyGlwsR/vuJv/OiCrrntdz+n5r6NuQQ8lyhmqW80TWf3yF7IdvQ06he91VcQzk6kFAQEBBQUELrgcAAAMDAwJFnmjMjpk44TOo40qWnaN18YEQPyRbwtP8Nok2fuaq9XeikhWoPcHBBfFAEOq3SbSJNlA9opIUSMzYdrKPfKYoFAIlDletP4HLBfFAEOq3SbRJNlA/opIUqD/90QXxQBDqt0m0yTZQO6KSFKg/edgF8UAQ6rdJtEk2UD+iEhXIy9gQvo98RhQKn3VQ4nDVzDZ9T3fsFeOEBBjOUDKcoZr8/PfMsoNn/LtVKHoZQckCVLOwu28GlorW7pJZM5MaW+Zq+zNQ10t7ydPw8V6xagBUDLcairm3UjqZ4yCKzsPwspRZrUQN4qp5T8rBurIvejTvFMBCFiZ/rJ5YpVYl8I0H1XeyhRZPcWzFLNsG8zwSt6SeBYaPDnl0iBeyJ7Do4NvBN8EGvSo4uA4ugUAVHLwOXoICoNKGseeRuCVLPUDZ6illcGr7Kiyfn56UY4LBDzc+1lzesfNrmN9Zdn5t8/nOzq9kTlfatzzjXlR0urDN5cPnBrW55PecNpfpntPm0tpz2lwOe06bS1jPaW/Z6cE4KvEPotg3iE+OV5TRcxriQcQc3kNs6wqJ33WYnfBssyXy7Q3flrRHUvKqP8XAA/FD9h3igfgh9dsj2SQbNCtHUqICy7OzYZP2MQleVxU5cHDtZbUt078/K9AeoLSBw+CyT3qlQ+4brpn4gT5shvFcTuXBZeZAxwA0cwNnOhnbpLwioGMAmrmBH4GMbRpkGdDhcM3EbyY/J4dMTobBZeZAxwA0kzMsFShe7kA7fQCGQxbG3T9sd9CzmxPKsAUE2dx/nGBUvccT2Tp7HEEFhd6YFqgwslgjJ3RI3JI9V8sW09awiwkoZqD4c3GN6dRXEWZMe70Q4bTXvxBOez0H4bTSJ5BkCfxDiW/stZDFx7An7FvGtifm82uwJ+TTOGci/oCqOqupawTZHpUTQ+ghD3rO056s6sBi8yUOiBuy35jBcmzi3mS/N1sEJa79rtlEB8QN2W8EwSbYoFg1ghIUqHqu3QFxQ/Yb4oB4IdXbItikW/Kk5cd6zX+tfM8/x425oWI5QjFfE+mMJ9rZWtaoDXWvkXe3iQv6EWdtQlVpZEVc0G/rab7V7+eIE8qWouPExpGc+Pjy1Wv4damO/CqUxxUvVoP8HJ12gbeBH5KWcSRg/I3BdenBVWwEiNT9zap6dpp7133FisuD8iL3GPIiczZT79dnK2aKV2+sOPh75aFny5eGsvFGQ6WzG91ZFDgX2vLFoiSmRAiUwYFfpISHUbYVqHCi4uDAI2DC8hHeCFQ4UXFw4MwwYy/bClQ4UXECB2Mc+lPGLTHrKRnHrA9kHLPejXG8+i3GQVWQrV/te3AMJ/YHzX8SCyFW+Yso5cG36fa/ud/PFREdYdMmtXm45LSSL2tJkyXQYFC9qZugJjoeOVRv6haCiY5HAotg1gh4JLA4CMx3gXHqDjLnrHkb2ogRJKkBfGRREgC/gv4zi/r63M6UiOtDHOzhODF0zDDHGOPMQugAmUbx6msgN8SrF4Ecr/4Bcrx6/sfx6tMfx6u3fhyvfvhxvHrYx3HqOx8Hf+/fCj8OWD7d/Ieu7sYybOBCbirTGzLtzalve/xo1Ws9frTqjx4/WvU0jx8t+pC3/cKzwyGnhTxNkO3teM+393b7ct7+vMfFnzJMb+ZlmAdD+DOKhZnt4B0gMMCcAA6H6c28KJl3iBymN7MdvAMEBpgTwCEQZii9amP52doeDGgwmN7MqyUcDOEvCxZmtoN3gMAAcwI4HKY389ohB0P4M4qFme1AxyEwwJwADoExCKzCLLGpdxyAE6sSTYwUA8BXdbdStXWx5/LhQSqhLnSL9YDN1Xl1YZWZ4dQ5VY5Tt1M5Th1K5Xh1FdVxDQt9oyx23CQH/LiwyL2Pr5ZkW7o3NPq60V2IOEiYI8LNd27T0OBmRL1RQQWLAfIVkAQcAgNsvuLK8qvNIXkisfxih/hI9vmtQ+/PjUr7p9LCfg1kyFuIUQdsqRVGXavlGHSadvumWZvi711vgg9K/hdIPXdHpnPpy7maLR/qhACyHwMCVPONAkIAGf4AAYIn2Zn06cWtjHj6Z2uenteap0+15uktrXn6QWueHs6ap++y5umVrHn6G2uensSap4+w5un9q3n69WqeHruapy+u5ullq3n6z2qenrGap8+r5unNqnn6qWqeHqiap2+p5uk1qnn6g2qenp6apw+n5umdqZn6XRq/bEu12/0TNzH1Et8Vj7+asfdwXv6zUSXpeleeX5fDHgw5JeRph2xjw3u8vZfbl+/25z0t/oomavMuBj8Uwp9FJExrAzoOgQAmhAM4RG3atRDQ8cghatPagI5DIIAJ4QACYfi1fm+uC38nRSSQOARYvxO7xQ01C8imSnw69stMcOmyL8elM74ck2728mjSgV6OSdd4OSad3uWYdGeXY81R3e3bofShklNJtlrJbXsL3sPiT3CmtX1H/KbZZfJDMmLPNJf++TIDPHrey3HpU2/KMuJfQ8s4+P0QPHll5SvTkp934VMz9w2/qUvYHWHS6152+z3604s1eWP9+OMU+uO09U4Il4LuvJhaI9Pvj3Rcfa4Q/AZ074iQXJQxlgUI++ckJSdimywcptYmEN8STVJKIOY5UffE6JUvIP5qWwFviV+iyavCo5PE7OY7dH+Y49CxYY5Dl4U5Dp0R5rhzM7jdfWBS1eG5rhBY1eQ/GT/uA4uO/LJbb9FF31oFLxy5Nwyhfgfg8fdv6YbKQL1NpH0jvk8cuvRLb7w9Z3053tzwBXHXPJj0zb2GmeoNP26fVkUVae8vGtVXnEZYMa2sYIj3dJ42+UeWP8so3az+Iu39v2hUf0eP0wjFtFLyEjeC/Kcp06+xSHQhJbb3Y1G9OI1QTEtlR2pRC+riq8E3IFTipRZVChrjtm3VVYPC0Kzv9lSgOfYknzn29J05/sScMdmlnvBz1JUJL8BHAGr6uNM2CjNtm+jSBgoqzZ1MM++6O01mjjsBZo47tWWOB2lla6F6qCP00AfmoY/H46wRhof0PX78/tj9hffNlyVlzvWZ99ycxTPHnJ8zx5x5M8ecUzPHnC0zx5wHM8eY4TIIV7yIVLOcK2+merG9l+19/hNf03Jsjh8k1wW54O2nRGPqRgdEoVtYSG5UmEVbCMsLBqn8pOVHu9wEV727v0hSX3EWZfFwf2VHbpSzL9tl+0E6ewvd/XduktSLs+jwcL+IW2g1rB96ZfhrH/eN4NcT/ZXvXI3lyCuNpn/T6cneVLn5qy8Jbryulsr9li091yV7WfURrzcYBeJ7Ju8Ia9rZrN/WhLI51lSxOdYksDnW9K451sStOd6UrJfMlfAaXeqC1P3o4bKQ+4EVt9cXbErWkL41aP9vTgheXnOGH3uxvBur7F8ZyQdLWtKoo4f/3+NBf/NzGPpHr+NPfz1FWFycuzQr3jvEYdUfiJSKbApfiriM+S6F74eA7NjXkiIZvVm7VnZBnDwWvX4t06/X+eUo/xnC4pdW9bHzcfOnMjv7zoKAXjfvtjNxbo4fJe7Rth/XancDawWNtVNEMKK+4ESkBePKywJKLfMalUxv5MrqD6o7bi4tcf2kTo54gjgNJlr006zJirNeG9MQ5xgTDOcYUwfnGJMC5xjT/eYYE/nmeFH01nseT0O/b15u263VIOQ3cDL0oMAhWg4cSz0Pt30bwHITLqawAD03PZR9wYa3PgCOBTt/chd/m5j228Krn3eLfnJnfpsY8dvCf98Wtvt4yJvMvkryzhfaVxndh9DKuZ+M6hJTQanM88Yn4zq4f9J24o9+ynTVu/MYRkyFGd8Ov5KP218IfwH8BfXNAipfpcKnpx7Yq6CdrEv7uPQAyyMENyl9ZeCpYvuCWtkT023yxDyUT0wqfYKGeOYuGa8PFLZQaK/sTozcJjCHEqJSMAR8Pd5d0CuD3CYwhxKiSpDUgq5DQsZKibkOpRLfL5ritmndRV95KGBddpVhAo6j3BGAYDYSP+Mev+Phmn2rCIRQc7tVKP7V6GeQcooh5jcWvzxsQSgFtpJLwHpsKm0EHFMJIeCYSvUAx1QSBzim0jPAMZV4AY6plApwLCVLQBmKZ2sQnt3TbD8zbVIGwDvsKRkAHE+a/xxPAv8cA2r+wy5Rsse8nEZgQFPdgNH0A05COGBM6ZBZBr6Hn+Tf2sM5XkQf+0q2fN4FfXfUVJoEWH8tJUCAYym1ARxLSQvg2ElHQIQDP2wf/Pcbtf7UHlyDIvGCW785rh2RALd5U4demwTq/W32Nb/hTlUP0oO6QWa9d/cian97WenkIp0lS6ru6m1Iwt2E9NpNSJzdhJTYTUh23YQ01k1IUN2E1NNNSCrdhHTRTUgE3YQUz01I3tyEtMxNSLjchFTKTUiS3JT0x42Hi7D5LbDY2WF4JTS5uyksFWbaBNRo/CByJZ9lA5J3uiLSYpP267/lC8oU51dUYWdVkaovZqgrgqUVNvGc068c8876psV882G+KTHZFwubEF/Dj4HOKqTqMUMdgpXCJvjnwm46q/ak6jFDHYKVwibEl/1qoLMKqXrMUIdgpbAJ7yR+P/AGOquQqscMdQhWCpvQ/hDvGfdS6axCqh4z1CFYLORBn79KngGfPAa4s58MBZhP7gFMR/vfpSP0bzqq/qYj4W86ev0mI84fIfg/uZdObCfbTpP8sPS07DQDWye3TrGuPKvusomTSyfOMbbVZSYfVh3fh+Mi4I8U7Y9JhW12uoVpAf3i9+cLDWsKI9UXTqCsMF5lCbZQugfgfKFhTWGk+sIJlBXGqyydY9Fo5lk4Iqp41SDVaRi3CnFWQ9wqhM8McTu3LEZ8VztO7aynZmzZOWY82DlmDNc5ZtzVOXas1M/6e9l4vqx4DJPGTCANlUAfGYE4IAJ1HAT8S8iLuzzvqBcreY4X33iOF5N4jhdHeI4P+3fAkmeRj6lG8xZ+X66kjSGkjKGyQXHb1uo1Y+XO+mnFt32Qfbvs4G29RzvJLwwYRw7GV4HRpCyYje19+ivMWPMOuv1cp/f4vJ12Mb3d6O20i+mdT2+nXUxvwno77WJ6P9jbaRfTW9PexYnF4D2Us4da9BBnHmYhD+XhobY7xG2HWbJDuXXIlQ5t0LEFzrEOaqdWoKLsjR7rqAkqW3Cb/WfaSiILWC+NpKiAYyT5BBwjaSXgGEkYAcdIKgg4RpI8wDGSvgGOkcQMcEykXABUL9uLL7x0mMTd+uhweZZ5daZ4AbHLGTzUBZ52Wy15hE9Yy61My88HwolfPOukD3N4jg8neI4P23eOEY933e6xfNh83KNR9wFN+YGPwA+x1XgHnH48oB6HsJB1rOHfjWx4hfNiwxicFxsu4LzYsPzmxYa/N99X+Z70lOvfKo6EJIgVtpZwV6deVuLLXTXy05IjhNIIMSxC64lwyohQ6iG0WAitEcIpDUIoghADIMTuBz334X+jmLIv0o67srYxtNwxsqDnm2x3/CfWJ65AAxm+aWs+YyAR5Hl1KRUqpbSkhISUYTlKVIHH6I/Pf6p5FcpE0IOFMO+hCb9gjglzYI4JJ2COCdtfjgmPX44JQ1+OCfdejgmrXo4JX16OCRNejgnHXY4Je12OCS9djgnjXI4Bl1zthOJR5MGdH3dRuHPh7inF3UNwdxF5znefpOTVVx2s0CgpCf+CkmpYfyGXnzZ2+E5a+StdMEbxwNhFAyMVDi1loZHHeUtGSDbsowvZtYPp4BCXGlY66jUcRJaFZv1WwIYE+i3Ezf+pXUWxxzl7lz+zj2HTv9fj73jS410wigvDWtZBD+60HANWtDPHvKILdUUb2Yo0oBVpHCv8Q2tCuhVnTvOdx0vBsPzGMQ1qHy+Aj/46HK+ETaDkPfCUvfEWVJ9Y7wxIPHEM6DlxDIg3cQwoNXEMyDJxDGgwcQwILnEMqCtxDEgpaXeZ6sPvkWtMZXrzU3QPHnwPpiKD5sfdg3tLzlTkulcgOpTIv6ZYxwdHIeU8EvZADJCf8qsBOsguB6nhoOwbPNINsrVBqjUoowaPSIPsZ5C6DMqSQc4xVEIYJWRP7ACXl1TBQPGI2LJNXfAhhQ7JnvtAG3tQzAtbETKiy/NwbrPUzab1u+E/1y867K+0A4hYOgk66wBlWQcpY1gJAspR2vSTEd3MwEUqi/0U0JbTwlMDh8OXKDwOdgbxNugU5bTlqSmHly/R8riyi+sNk8LYKg9byV8L1Ws1dt0wHsDxg0hEp348hIkJqi8v86y7dV8Po/W/gkAYGMfHbe84sDLE/L3USwPl15aDf2+ceE7vH0vgUtigjGG7PkLHVdrLO/KaPMCfW8ePDS0Op4ObRF6TkGfSqUzuMCaRwSQkl3TSkjtgSeQqCRklnZ7kDk0SWUlCGkknIrmDkET+kZA70ilH7nAjkWkkJIx0cpE7sKi9qtgn8+Bf0B1Yd0cO1Xn5m59z2nzkVnV5e3R5C7r8lNTldXV5tS7ZHfo5GYKhsS901IVMuLAGW2g8Cx1fIVMrtFhFDL+9Gbl94htgHsFQLpmzKRSUoyISjffPQ4evWSr8imcBtzOBGyCcpJBfZeIzdBaVv6i5AzxWT0SoGpru4jvgqPwqMImG1YFHTgE0CmMFCYL5Rb5G0fwLeLhjzw91P2JdV+jNeyXbN4ZqzzgmEr9xjd2I6LTt5kJ1ZSji6g5bo1sTjD6pPwJRqyCcmIaqLibyK4/BY49jxEijDpmFflzMlFOMa29kQOqXM8f1NTIY1D9nerWcjliPuUl/YqJVePqVnTYJPWyYgMN0aXtLkvSWpeCtSrhbml73d4q8oMUoH1IsQJ0KArCFg98BVzi7FFb7ovXataT/IOXbBxXHirH9Z+tA4CkLNFFxetbkyNsXmxoWsQh24FrR+BYjt0TPO35t7oD8imnJoq3QzBnSQvh1tZV13RLditAvNa8AY7XO8SrkgHrGFsFG9EiuXQ+fcAAMUE5jfCjq/ghbjb6DBwM9pDNUD/fwfoWAgfyS7YNEusNnX8mt5qy1ODkF8oYiXiVfBaiWccPIhDmACcue8HVpsDIzfg6JKgGu8CiBwuaJe9If5UQUw0QTsUQTn6TZfnIfrk4fXq5aHNkq97nraBlUetop2o78ARiinzY3By2BdEL/fcnxL0Curt5z0AOC2CWcmVSCRPPpy+r21F/GSQ2sOJM3a+lEzFU6sWyVAej2xYon1XO2H8bRtDVlSnPJm2CyTTvEl2D0eMhYstXmSIkQZS0tLxHYiYsa3gwM3S55mRfEF1K9LXw8ZaQ0GGivfVUf7ee2UJS06IABpdmpBZWdoapx315yW+4jQze3avd4j/eyO1V1poSWD/2183OLf1An6fyzOZlxa+W4OEXAExrzeIHnUB7lLt83o4Hnp1vVzPbN43rYraFU7Z4+8wpHM1ys4oEHNwOSBKObP5FbTnssmFsC+pxxWxEjnXCjl3HLuA9yK41Zj3NDAoGOxRNtsuuqA2U6VfZN7SEF8SEAPabNX/iwfc+fhHCTFW/U0VkvBpBIm0TQAhh+i9Gdk2tTEmHWB2mjQd9/saYZ/4m3zVK9nmVr2ynGtkfeY5F2Sq47titvzQSmU9ETulenX0PLvg4+P6WEXPKOlZ1R8JupUqgHBJ5MXl2JxeSA2eT0cPoEphkCzrPrwMxiCkouIL33qnAxpYSyoNoZ1uaV8F3aczCh/VF4MNGDiB9emZDx8Ap/441CoFFN9Ba8IndnDFug4wW9hFcyZJAHyFdtSWbaeGeSuCkcSylN42kmlplsqzs3eMTZKKCNFPR3JVrRSd6+DA2Qqlndi4rdU6o3WXQoY2w7+wHNy0qr1s/TP5bQz4k+INqUY1hN1mebzq6LrUuGpZL1n6VwMOZsGRljJiYQGgYEhsBy5eGTdbE+cIqgK675W7/eyPWATcqjsQU9nUJwYnAKcgtySueoCbNnIzcHHWA0UElmpSN+PtYXKhEqjKRfQ3CPcO4/mJxSMWoaH44taLU4hTzF4BS5XJIbqdMFX7MNCoDNsvo5eRiCh5AhdAjruDJFsW55AHkEYiJy3PJ6wAT7xS3KFxIoq659cfWXX5z+wPc+JpcG8kAZqAOt42xXTfSiByyG7CYDTUBPPQDwtVrGTbv0+MuUgHHqznzrLxqxeTJA0IynUCHOxwfeqHBEITTCTBM1GWv3xOwcxWcbEQZeku9vH/JPgNc2soMN7Lh5SCdnpm0GB24szQf4OVPdqYWLavXQEKZMlL3FmshOyM/vflWTFN/jb3Xc211eMjt8BC2ys0u1aRYHWny+yWOQvaAX1ytdbTG8mCUavAYyEslyNXqelWPGsoPMFKckO52+dVxpSIqx+8hXm4ZAMxVDIefOELuHuqY6/hqNoJMKKc/zrDFjxowFCxYsz+tMsGLFhg0bduzdvYBm+pi9mE4a4SVhisQKD90atKUPmskwyKtcIaOzh08+7oxeQY0KsEke15zagI24yWAzCHRseY6VIkaCBClSZMiQL/j/9V0J70/gLgNpKcrVeXLr+sw3Bv6l5kDMyUP9/328L3L/+xg5FPK8EImjwFrVu1qbw8dH066UJaSEE53HyLpt5CErr6bdIZ+9eLvHLi93+7kbxuWNai6e6VgcFz+Y1zKR+v5F5eIdFh6sgz4lE3NhHNocOtCCNeoTr5hxkyo2mi7WMnSZVVXjQeGLLpAAZuOHM3j53vCZ57DJbLHa4pPzj5tMZovVFp8Mg9xkMlustnVA+JXxuPavy4eLj+/Q67oOo0ddbaBWtALZZzMa8Prdj/zSW7EGkgv2OwefhazYugm1/mIEuYucrrZUGoxERiIjK+REGlhICputFbxAZIgEj3zIUKBCgw7rUlg5DETREBJMhIRmCVJOxXHJxJnd8Z9iErFecV1FgtsReqHQc4Jn4QGyPmTWC7Hd1QegSlmgFMRaJbfYMu+4DcgLd5n6M99xb9PX33P23R0vzvDs7SSGT9lfe6EL09/b+wwb4SBnNYi+mWkMoUuwE1EBTgM74RLgEHAyaunsvL1c88B9sRjbjzzqii1HicmEHcnyFA9sD5SvfV6B4wWSZDM4MppTY3XtcO+mrK5w48Da2TgYaQ7WJOuB3I02uIDTyeLMvJm40PjEHhOOLuRuHA2nJ7wMriCQN8s0i+QYkIH+9GXSXGUKM+0UB3tMOLLgxUmzwC2GMeHIwt97wlhWlX4xMrLw0mAzgUAgpjQH/+mAzD2D0lw0g9LsKoNQSAEFDgJ8JG4w52Kkg/vpiSHNrADINkYvGs+kIDfM5SN0me8X9rTCb55+nPu4Y9j+z6N/vI29n8/veOz9NPLx/yCe5swzfXvjNq2emdsbz4yA9lnA+2yQfQ5Y5lhfjaU6bi7VDND8twOoetMQ5IkhGrEdaOMV+6KLEoiP9UNAR2lvhXaOKi0YRN1w4yoFG3TGRM0478zsJ4bwS9jr8ILa9Yu8U97lcG0YPSwPFH9FLQZxmyG03LU/G7xwYFcnAaWcy4a0KreH5iiAdbjhMwH304B+b/cYT6F5dCFfZz1h9PGlQYBc6yHBZ9y9Lf5y5NkPwB/1FPbKpqt1j46VaDk+349ldwFZr8MCWT7niJtkEdKn0QVMedimeUGmbEkXdXuMuOC0gcvLgPzCOW5ywsCncqY7Mm4o9n7rMUPIELpp7lFjTLSwJD/ixsjJ4nDhDSl3uhlJyNubaAbx+Q7u6HBkIRui8Cyh3TrfMXRvKMoSMGmB3ewhOyNwJD9hXmHsTgE4FyuIYbwemf3M3mq6r/PbhIFRJcfP24fHxB/xi7P5hINOL7xcYj9KvtcsvOdspVoynuIfDwXJph3sumq75LiwMgFU0vD0kUnYLIDPzlBWM4wSLoeRkPYAKgi2ynOQ0CVcjG4Ymle1tYL28BybLPHimcggGOwthm2At0a8Z7Vpa64np9flBa8vr4tE96MbbUFUhRNsdJSIlWsCAaVZ5REKqHDCl4WB/VVGKMsqzxrlUKWr682yqyMhRXH19TBw4E2tXL6r+E7XS1gbPvPcNN0ey3a8lC9efe3CwAPhCspOyWYC73QzIUe8XcEcGY4szt8gJzoujQxHFZgVbAEQTHvFHBXSgHy0gJBNEBCy5QHy4LTITI2hsrkOmnMT5qh4CRFwWIG/rzp0hW67qIKENIAZ01BEcNP4NQD8mgMewvd4QZKg39dOKNMzd6en6RAzEt9CYcfMOZdcc8s9rz8L9ygVQBjustWEPxxpcmIoT50HEwyZDQaXARlRb863/po6dl4eY8t+4fgBOOR4VyFa/nz3jARBPje4OcpjmMbFEHATE4A6ax7kGOb8jsCBzSlSqwiWj2hgW4Gau1tDOvoNDa+Wiqpg81uA6q5+4FaPxjHqDf+mvZRAt5gXlhZchKMVQRej80PqkxR2yOIh1F1YzCysbOxc2eHMMEU9CPLOYlY/eeTZzeetME3YAUl5FT/4B/auJw0d8yCAJYhH/fd4o4rzN/FQ9x6NCkcUNJt4RHVnwAAyAjHZgbtzkoARdnrUsnYcTN1S/NkFlCxMMfpHVBUO5mtEPLhhPRoVjip8GIPOc9CocFSB2XDwBli3sIDnOXjzb8KPOxQUWb4vRGLzhZyi7FSSH/0RrZmgNTau68MaVOLNxB5jnLx5rqSp7EK4X+vQI+yD+mwxmPqtgr08u6sBCpaKUz9CdfEd4T9oWaiAUHUTRPlGSx+UK8fbuanA3ehFWxkLS9uyD0U/H/1Eor/0WNYWCcrN4BTLhWxTSvHCgMn9JiSewA+vcXCbV63Y1sxuOBSN21eq3lfqE2GaL5TfZgpzXOQpzMLctoj7Glj27QZ4czzbts48xDI4djGYeBjJUDL7h9o2ZVqK3EknHKITU/Boog25BIiJwlXmgGU7SiQUYgxkKmcn8ATMazX05NeFtpc6el6rgcpR0lr0MbpIm8G2OFhO0Bk3lr0yI8ajGmyujfW2I0AnaTV0lXR8LDgBVdJmwU3XQeisTx+f2OeN5WYX8e4q0b5hx5mVjn3S5TFyn+02JCBJm41/OS0flX417xI3kKUFAF4OZ4ZdChMenD7cK0h+20WOYrmJH36rYjSGaIm7ubtOWLNqYchH1ohwRNG9OaA1fGtsn1uS5u1hG+Ol7Qoy4l2I75OPfuxvq8KOvOlY5idDlmcvH+e9HTvHMZz9Bj+7nxuwyvT5OIR1fBhZedMuOiNUXbfYJ0qmuGMa2bTBj+GQC8wIr+m/F8NZyiY4XNNAo/lyu4DXh8ZGT3oDp2SBNoV7DmUUVtd7qO/721U/Jjfjj39Nk8jJeNuVwnARLR4tneh8xlfuS803iY8p8l6szkyYxy6P6XFcwYsi5vQJh6l94ubJzzCa0hxy2ohnMbTAxIcfuDnT48u3lFqHu5QMtquLoXsUUQah6EoPY1vrZwyh6TBqeK+2F53VSi8fdmF9tb1gA6+MwVQG/upitAeFWW2p7YgOYxcu0CAsZbt1Gwe6bXE34lUWdIce19rh430TZGMhdo+1X3azAuKcfnxCS86jGMxQ4/eOkwAHKQOEDGqJL2t/zDrrGWbka+AC3afgQwkcelJic35nODMbmf1phb32wmbZXhy8Kjpn+Z4pI4meMb3+k86n/tSfZ0lwcHPosKtZsi0DnAw82qg0zVUVQnnlQBG1GXBsN8oCjE2WYur8xjMk/2waWe2pms5W19ZRPZA1ojmw83b00BpTnoqL+iASLmhgIufuzcIZant4PKYyPQbeI1HziCCBd4I/3LSVnj1aUo4eMTWOUtuJXRNRQsPioEpdDMmsUsrR2B2Szq7R594qP7kkwEackzWXugwy7M9Yl1HPLZFGcjljJZW1txxww1EszXMIUgWdmdO56nj7h88C/s4b2cezLKdg81Bt8r0q4plLdgohnu9H8XlF45tGTxEdRpqf47fgfH15T8oe01XV1yisTeWYK2MOsvrFHHAkH1Si7YOdzTuMtSEQJtocJmO8VJo1hpsoFLbsHic03mN6cbh4El6Scw1Orx0dHKxhUba7CP7y7++G58904vkMprL6rA40gK2+211Z9Jmo5PUUaEsdhGB5MHbRNE6bmArT5YhJ7Lp1IxK4COK/aTRM2jRXgYgH/ACs2T4Mpc5DhlfL5JiQWyP1WcjXbBeiIzWyeHrCYLMaWCpuaMHOTCVlL4rdB0bQaqXZcUpB3EO2C+iVi2hFM6C3WR0kppoR4pa7HOylNDA3q6Mvl1G8nWNEUlXnQkCO6XiYrMOKnWevmR6r6+XKeHLvdMTHcumV2hvhy3wuwWYYO7x0wsrjptexzCy49LVeq+w0+Xy5fOnS1+/hVReSACG+tQ28EP3fwM/F/3SM6fhzVOCpRx47nHHcHaz3O98cV74dGj4LRJ2LQcCPRgUj2ralXdDgnr9xD4PhkJlltMU4OtoRgTniL3J5nnAwTt6EML+y5x2yqnCb2DvS8KFcHtqv2DWd4khxTcsm8rVHa36UsWnvEgS8Ni05akmzVn0ZFgUsdqX0cZds7vDuxDdCtW0uHVISF36yLaJc5dTEj+SM4dgq4PhGNzvA+Q1U3MthWbV1fVxKyy1pr6Ze8hMTOiyb7MjFn7tPwHsvjy7BbqigLLIu03/mGUPWTHYVhb8rcq4WvrSVd8eY23yaqnHcWW3mpy0VsYNnwtd8QmZ/WmVO8cBBdDetujZQ7ssMAzKsGVbDRA+/4odiZjK5YO5CvDf76+5VrzYpOeq4CGiFLRfM+PAOoMFDVJZW5lpS34U/rSXct+BqRa64duHqYuU8KLcXBuXiUpgKxKy44tppAzAWH1ZwAsoPdWG+8BkRNbXHAi67Ve9fdH/6YZNeiRJYE3tMOKbo3vjH0YBPjbZUFYEFxmrPV2HAqbUH4xiUmWjGPvQCC03yi+01LixTzXEezyM907z4wpW8Bl31LPl2Nq2waxMhCaAQwaSqwPGm81qvCyIen+/+eV77OWkiE3ATtK9MbMiImnXTX9GaWqWqmUfezBEYSEMp+8zkNk15Pi/J3s0Zh4QIrUKI2tJskPOQrJSpa+lC7Sfkz1/g82NlQLEIJEoh5avxCBjHxqETpOpYuIInoTw2jYBzZGjMujWLtWb8WiiYFZl3p/eWoajkCe+y1rOGrFiNmRgFiGsBlzrESmDZnW3LXl4pCIaiuuvTGeJr6oeRc0c51qmHTxP7iWRUdJYHj57TorEZU14vASn1zWeNMCzJmAm6kHsAeD0jk0rN6ckSsl/gayqhB0MulNhrjUaUMloeBnCLLdWrifEcpEWPoE5XWbodUyMrAVmNiZrqwXGqtPIoB2sxyCtAZtdzKHj1MdKjR8dqYp/qlXVjnncAG5oFC+FYiME4JEnZ74UThcXyuesx5bvQTIx+1iQABa0a4MI+wvN+kdR1OjcUb6zV7CFky5UeIN5OvBOHivQX8lJJV0c88/SoxhOnF+nRM/C4Wli1rtQSr64Iz8+TUu5tKmF87ToBBLu7d9VvafpdNDi9wHBNLKXe8xdVLBwWyDzCCpFPiwkk5rUVQJLI2ams6EWdg6wRr3kG7iPiLTh8kD6wPzMb2U/LQUuHSRva2LblF2369BpwiIuF+adXBpqM9CGak49mKupypfMVxkT78CNxHn1/nP0T4Yc7gj9B7Py0p/EzGMGR1RaMoviqX3fbamEBHBXoPLV30Ztqo7SrSiKACYUcAGPT2keUnnSNHFr3mrbZqfRj60gumdchZUgd0vq69pByzE57N/mpYt9WOLp2VI8UVH7b5VrNgRQlvyxjGerlYGUXnZZjfehMlx3BJecvmFk9CjODt9qcYrUTmeRLwLCkWbTEs6aOAzBAlvua5UsDF6iwXtmEeIWZIy5BIlHQfHUetRNWCN3gv1YVN5iMWEEP6PTuDJxN8CG0wlsT/gXfH85ZLzdN4XocsIqwc4hKP698CJ/Ez6lR3zb87GAhnUJU3zbCSjXD3pJelj7IGMgGmbsgOMS3zeuUMETDs1/xqUdloCLbewbiH/M3juPtivVhOwShFyDcC6ZXInbmUP9eZbMmIJ7V8R6H0xW9sNlV/jUf7uGnbUYIri2ENbpSlnmkFKiAHGEFSDW/8mJQxWBnSiaEY+DwG68ib2bcNGYgWnQxcXrSFmSNeFyc8uGMHx3zAxkDNRXkXZwrRKi6TE7ALFIiJWu7Uou8fVQKhrzqU5/c3CKO//CUfzmfLCIAWXToKBctPaU4ieU4ArvKCpn7W/Mm4yaEhxiNS/2csuK0XNTmdIC3mMq3nA6U9kW5LJ2idCFO4Hn9mkI020gzmN0Bqjrj0IYjyyOO82aFPUYzOkz3U7LfgAg3y8XrHFyO1ZVYYQ60lhLhYBzXy4AQ5EAtpYNQLgxV0oBtzCGM3UXcA3/75CwlCIfPZRje/FUr0Rd/lz+nCr7c9hWdwypEY5Y0g24aRMH8rFq25BUBStlAYm7M5/BDbGAPvzpMb+9EYxauKFckMu/r5wtMPEF4BvKcUxN44scJvLBVTrw/J76fE0vPiZ0Ho8MJ7aROih9mpF6Xu9LVndXhBdgc4goJm9H3es+4zbjBpbfY6aO/dfZR8s+9DjgcBk7NWv4Tgh9WwnM2kI/VbFk/JCQD8Jxw69zy5bFVNHC6l5hwcIr8W4plj1rC65qFfoAEQzan4o39PtqhfvO9ovwin5AWFWaJ2nmU8L2A/JonomNNgK08EvLovvKousXV7QmWIPab6qVMVn+nmDJTw3L1CHv1OslFlAUWBCQbWvemthUPPPkdFDF6mDba8x4qQernFnpzUdaht8qsBqMQPOAenrvST5Owzx7AJaCVGZB10jklj16gGIknzzGlleE3dAlKqAtgg6+Tz3JWrO7HwGgywJr0DpbWNGdLQjFVSs1SxxZ1vk1OHX/WHIr6cytFl0raCJx8VrtdVQLGYoh1ka2fOinjeHH6IUGPD2tTjoz9didJWonGFcR2RGOPMoqKU0l1GViMt1YwEblNH2NxUZrjziopIwC+sWXFoSaISXzADvRi+sQq5Lfiyk+xIXYPEtecELxjyOUBtR0ju1Q1DecDQJFha4fCpVxBlaF6dMSkSVaEtUU2TvESF0tvxcrXMNM0z3AR8jr5ET2iflNJBLWUsE/fwVJRoTfGwJujeXH87pGatXAc2wqO+OgeHT+hFwJ3FBPFlTJQCdwdTw32skTK3CY8e0+BWo4VPmvrHNHQuhe8baWTqDk+MhDPwLPRHUPSzzfd7J5gOBfhuJyExeMM7OTFRifCLVuIz4rdY5O5iCwMyTqEf+w1Kk1Qj/0d3hxSf6DHC1HKGGeBnB2kgd7nAYbLkpAE/FUUzloCH/jX/TbgBmgD/+R6AYy7dIaVlXa4eeifdMFCItIedG/feRk79i1x7JDuhn0vUF2B2KfF1Qdy6xlwrKKGJ12qXP77cLv/fwvFy8JqiT/UFfLSZG0l4aiK42Q+ha0UMMCM43G6LFSNARzeK33x03dtpZYMjnqdKrXSujutdreUy8IjBkmYz2EvHHDriKeDZ3mNqGKOG8g16HFQwoP6wCzopxcIHBbwRtYjGc73RWTfzxmze3Ko51Gxsn+7x7nPU8CEpeUwXBSO1lzvGeegUvnHLXee4A6gATxABugAO8qPNuqvfsiM2rZhoG9jaNS1ro+2aW99oZfanAvyovlZGUNFNJzwsEXbxj2kO9ntl4+IeTjaqQQSnOPetz2j9jueiMqOyRyfctlZmLPwRIFBhEfIQB4zno51o5R18/p2hlu76e5zfiFAi6cTEW8Jz9/jJbU2VnboXs1nkBAtf8QaY81Z/tTc8xoWiyXTEoKcDXK3tISlYMQP1Prg9SJ8QvAu4bNOizwKhn3iFHZhksq8dUA3pGX7wTXONi1lAgbTcSTnFwcgPMbP6di1prVSEJ2urqrWeE+nZ4o1fKkt2xND6hpkH+NcLCHoz2D3056HGJb85g/G+RX7Tvigx6/nuXEFRNlcugFbiOQwPedvwN7FhrP6JadNEUm2JZp71LvmRAYlCRam0Pm80UF3ETVMLB/hrb8+9H22mzK36PMOig7A2qsP6pfcrzyF3Cx/enAFcrSfZDXMH/c7rA9OFyIuagpTbxBdG/gEKr22VrDs9XRuOVTUliM5Hbl879K4Qx4aYNXS08FleVjLeAq6ERQ17tn8/0MKZt766Pt5polAGBmHMytkZDgxUywolydq96Uk/vER/SMj+kJ5XxZvCIfKCu+L+MAVFYjyIGLUrHPlI+v8dAMELxtSVRvOpFdgLutaeb2jXV1Jpcu6VdYekijf7nlZ99qFyz1x1ZX2LBzz59J8QGfpfw7Osry9ofIsLwV2zOa8vcFLdXNOwWtr9PYGw1yFE+ZjO/WVMXJudod4vL9SbZKfpN9jwLd3yzxLu5mej6m6fHz5kiCYaBZ21iBWF8GEwVmz6GAe3I+d8qCvVm3qHexAeC0PAevFMSA08ZOtrbPBIjOz4shK8dmLxHPaTmKT3CBiElIy8q2wBG8KK4I4eGVMLeb1WtZmQ43rPrZxuU3i+qt8Cub/KFkmXTyY7MXCm5pnHVWSHlaKKkNqeJ5Jr/2J8iIscwgSWzSuDRwNW88DvWR4C0Nnyp8JK4ZCXscD1zYl8/U74MdslKYfWutg3fPZemUXc5skJHkbbnUWn2Deo4FnruOrDtFGwcdvabMyPWPthFvk5TKdJD2Xacfrwwh5jw6MtJuFWpTdHj6+w7B7luuNodUmPCBcHrOT68hOFhwF+SCZ8tD6YlF62hcs32wlfTgze0PPUIE59qLbvi3ie+61DEN81/eHY3pK5fjcW94GAsGCQt6y9yP7YBfzS2KPVehJe4J7m301KV2gzQTh/a89rvsH1HulrRJ1Wee0j7JHgQ1OXwyqllh8k4JnpczIxE32+qTFdaIsE9zRZ/Bg7MIZvwCFGKyRNQPIKgWTNTyQdxE8DJA8IpcQjy8lVZW1hdV9/DT+81DXskNU1I5YNfKOBs4T9qfyz+KCCDF4O3RGz9GAOJV2A6c4h1tBYQIFBJuCGeZz86RLbDKdLx1UmGb80zs2sCDwdjJPFOWYyrsg8rxzYUGloue72Lvo+/tnZVw5x7DL5gf2ZTZ8+V7kvm8te7rEoJuesfQQ6ELk+Skn71HubqTguoKWUfjX8r1AUKBQAPyYBNo1/YEJpMGtgfTEJtqr41Uiy7AAQvTG725fOUl6lc6Uzq8w14zl3ekdCnSSYCONsA0PW036ggmkJ9An6qXAP/djepv3I5JHGHzpD7wOAXV1TVhrUNNVLiOnYMsU3JiC7ZIF+3N/3b/rbzp90AepIR4+Fs5Fqjzii/AEFhFsSTfkKU0ThGSuqKhD4ccLP+V7DDwaguWG2VWTPT3Ngr2HyjxkJsuyMAMPoXNWgdntXx2lCohOLKp1P12JDdbIuRDDLyYljwmkJpB02efSFsP8JfNj0ni2QGKSRpiW18C2iMQEXrlTtjT7OY2OMNQEui0t35c1xi1NfVgi3QJl+9Cbg1RX8d16p6p7ublRwa/UDck/QujKj5vprq7DwPly/u0TB3OzkY9gaCmxyT+r/X4P1z4++8HzkhzDjpDJjuNVJz02eRHUdfzT69B+8BIcID/U80S0H60IhvGh6nknmgM1Z5WiY7riHm48LqCLzzlUjMX5/cuQnE8KEHRAUapy0Nh/YIzpKVzfu3rrKxc0TRlvjD2VChBrF5rCMrsrvsDoo7u++xkd0lsMt1icv5GQfUB60tSPeQ8V/sT0HXf+vfsdb/dIHQrc8tHvE85sGL94Hv1KaQ6k7qbwII77jGkI8NQlfyf28o2AP0Y6cN/ltvuxk1dBiFRwOBl16QXJgHbcy0LOn3iKa9EH5jRhaMIRqcssSIYjB8UDB1E+rxla8HrazdxbKyC2i7mvGQsNI9EXx7XNP3HP//ZHnvvpC2sWZ5m2sJ+PhTLOPKMKDlmlZrap9B5xHNwgCxIEEgQqHFgrXPTI43bkvAkcxQ1neoKagWaFrKa9GRhssH/IScv24Tx8oc2ALQiWXy0nEDb79qI1AzwW5nIUQcdlg6XoaX+euPZiSdh1qEWrd64Z+MxS2zYLQnsj7g2TlsWkiR6+QH6zb/9le+Fjg3YaK7hPsxkIGTebG/RhJslJMJYpO6QMqUNaP9fsK3B6iDSCuIh0giCRVhAk0guCBLsMSLDMCALbzH781e1FM8WcGyUCfNjthdBVe5ozln7t9oK8uZ6Hsbmvux5MYX6Rkk0aY85b5cDatTm6dywY0YIVQ4zmTjHnc9/9Nnef45rSk2sCjDpKUbYfb2IzGJXXHH4gojJZgw00wQFmhBGZBC9h8gRJpgcFW4HhNnnvrPdnxNOz2U506BtbH4PokFu2E+J8O3IWegLjshlkms9Um1lOuN8GcXqRITq8QDzb2vHiCWa7pd6FHMkNTgzxSsbzHGOBDTSn7kVC/cHDa2RxAxkWRzaBFqy3LCSR+Ed5nZvBafLSWaOXVOLSypYIBH0Rbd7pdmKfpCntZDGPdTvR9yTUfC/Si10dimQan944XGWBHzYwJ6VVLh+8/GSVScJPLXFSluDBNfEU25qiB8JplkiOb197PNKntc1T11t74bCeyaXmy8nAEBwNJ0+WDj3M588KdJXnXGwosgCTY6slrJdcxi48yDcMN5IVVd4ZUwouC+6tN87zqJHamRtY6NlKtEQZFOg9k42HZHY7nLDUyuOg5FVTD2mxD9SIkw47ORqyU56VswLkpX5r8hojKPnkdMZqu3U2lfr2oUqpQkPYVxjBZvp0dVhwi8jDfM/qB9jJYIlYMqcpJzVnuc3Nw8RjbGKE2BtfIUkYNTfRsxyf8ZN8beYQP20YYxBc4Evky9Aj3IIyAVkB4bBdH3fCg3wnXB09YkxCaJMdGYcWIJPo3FNUNjPkGTfLGOlyQ6BsoUvPrBAblJoYkoAcLxv1NFQKE7rWbfNqMoUk/RtsDw45EV8y4eQPibqoFpN0PCwIyqWrU9oM4AGdRig8iAbxEeJjOVMsHxAOgwnHPW7vUYq+myEisRBlpic3OAusKhBYognBlx7OjQvvI+NG8WtE7nbeWAflHAEDPJKkT+Ke3a8vtxkF0C24gOQkJc/fSAxbmrZS0ALN0XERb/f73mve4wgGu4WZxZfdekRKDwgvLdyCkx7g5rTSwC0kxjwc9xe0yTXtRqNVXHmQvEzYxIWLkZ4j4QHlAeEBahYsTOZimRl7HclXIGzByXEzKM0is6syNjY2NjExMfmmF2hqamZmZm7O6j2Og2vkc5n1zxl1ETjGdSP7M/TtE7zZ6+P+OMqzoPIRXygk7aL6AlcoIgHJhAH4uvx5kYPYRKYJkrwjs2adFLCes9uvIOiS6nYDuIt869Hwm8ZeR8ID7AFoDRd7RNvp6VqJeqBTvJu0MJ6wl1uXI2YGe+WxoaLvCHUwG/ws+eVr+zCnKiajDrxaiEaA03TaicAmxJXWvqGg2LlvbejetO6kALjkKpixoe1DPOeZ6pXB1WS0D9JvFl2DFarTqA+MVjOoS5TnXq5bDDMJwQfKj8DLKnIpvXW86Qxz7/s7oc9nnK+m6PBAuFMOKQFWjIL9OkECQ98758eUGsBciqB/yg315KbS1QdF3IVQjytl1vf1ALQdWz/DePv8jll4QIq12wVtfWEQaKEC7nrAvBB+2dtHuh5+SVAQgJhkaTKduK/HQVnCN4sLH1r83Rx6masaDYGZz4ULYI845QH2GkNxP9E2UrYL08Kf2CkVy+bbhX52S8a9JFL65rFMQEVjJpf1XUz3A6/jthJuofDuUi3crxdKZqbtlxjpumFtNsjcUTUBpjTbq7PjZaFRPJtwn7Qqo+2WeDuDKgEWwydCv3hvNLYXTKw9iPOhTcRsHXB+a4LamLUC1aEDY4Rnq5TuHlyVQdEy44FOvVI5oOzR9nSZerWyJq48wKTIqdcq8w03hK86Tb3eCKkzpGFrjVFduHuERxx5QHqAPcCdx630Hz3IAFZoHD9yyV67qGIAUiWsJ8HlFD1Qgrj6bePeOha5oXgoGUqHso6jpISipQg9mumNcAluYzERZxeehb6MJmaA28wMMF1i3Hw3dAAPkAF6tNE3iTJiuq43sk5FEIFb1J4zQHhW+79gYp4Q4UiYftovPJ7Q/aD3/+O2CB1AA3hFirLLHzqZY/tWrWLIpPUBp8eYSFCO7wThBWM/gbL4BHwFXOyUgaKG3tZgaanPtDTdaUQl6O4yPFOU5FYI2Viyz/Eeuj9NzKso/8z8XzL/6daBhqYO0Zg/9XOtFWPK8VDykvUtXpqcCgp0iEbPz4+kvYz2KOFdB1eWLsonXr0cMVZ9JCZmxLm2As3jUcqRby0GiiStpUk2mVf2qsU6hnb11UimtHhQl8bUXIPsjcPV1SYmRmgXYwCgNU3shb0OxZJ4LYZyL/c16aBjkny7T+sDLxbiBRoyY1SOjKw9iGc9sn1tzaRl7UHcnm23haOWm7UH7Ju8uvAAJWjtwQCLdw0yNGVn1bDQrdc6LCtZL1eascULSmoy9UprPOS9NUU5WF7WDBYoM5UHyEnOzNVFDCdeiRdTN6xtXC9hDRbjqVvUElfTPj9d6ym9qxeVG1Qic4tEzUNtSb1pb012yb88zq8cyVt7YNQdLSeEJYNrDxJG9+TBQ5TGtQcLFAiMQ07kcvVhlokVuUS8ZF2pjaiUAzFFqiCDliob95MNRZxLD9e2Z7pnoVoIqG289Zpp98JBbUvppW13GwB1jH1rjGAPNyVqa0e0sm3wDtTmhxbcHV0G1Nle+xgoA4LKRlxw02a2lR6tjQHMwBVIBdRmc5R76NoN1GbzarPpnoNAHdmCo3qsTUyZ1pGKFGiHhVqxHyx8zzqotqEAxWUyWunO2niuirsTZaYrte0VWA5kIQqW1kiP3Bp9cVFd0bSqa/X4cq9WB09Xp6wOaPRjAVVzm+Qy0zvuVXcfaEjxVHy938/H+kv+FEfWqwg/5VHpCkIIxPUBGPpBvP6V0ju2LuciItjJmgyoLV4tLJTekwegtlGoG8NtKwAaiUcUV9VIbEMSEquXH4z35hVVbm/P2IVKWCbMoVZW2mI6VEIFpdb3p+McPdS7sJuO5BbwMmoL23jRwZWwg065LWzjlVddcwZgC9t40bewj06wUPIMCOBA1teC3qE8a3znOIpxmNK8KLClAS5jmgewpgFK+1o2T8YiHtMaojy2NcBr0mzwtoOi7P/+LUAkKWr6bvPfiTEMVC+klv2mtB1RJX6J2HOb48FFIke9b8O3BxKeKHWkoLM6NQiCpWzBNFVT0d6zhsO3vTNBAx+tUEypyjTdFT+2A6eH14widi5jrI4ddRaN0sszqb61wOmR1YWW3LEdGK37IgGLTAJZGZa0UOBkMPdwpRgSS7qWyVOPNDKRFHtHyDz5ZIYIsR2w40+OSM1NmFgdbSyGze+VnUnIV1FM3DNkHtKvmkw4RancgK9WiESQJe2uKrurB7tsta1rKTlcUCtyMTIm1K0izGoHZpVPjAfYE2tZlziv3xUZLeCqDkPqe9tSmEiVrq11CBDu6+pbAFpBUxaIFYEukmgH2k0QGKNPCieqY3dLA9SSvU/P9gGoynimC84nDOxP/fmi/HGHOZ2TOjouWZr/GVr/eRr/P/1zzphj8OUMwZtMTZO20VqzA/y1rHt7gD8de0aYfQaayNCKoc5isiWDk9LKGcfMhnT0yqA26JtU2gKInuHgdcy4go9Dm0gAwYcezmYDKisB9Tw2pEPiJlbgA8UbOmsCMws6zcNJQ8vgpLvI0zwIiCubAEsLP80jOxcReSp4Mag9WNoQZOevuYFdTms6XXyqDtmnRkIYjxLhhlceY5T1pjMogMpx9/fsdKoCgKVzxnbUStyZY0j3q3VhP6EJRczD0yjD/LJaNayJgIcLkZiIapP/ahJCcsxAeuBWdQgymxSPAV+N9XxRcU8Xxj5EFPXgdczYgipQ6nhpXh7X95YpibrkeLpjHh+OLVjMvKRHDC3ky0R8A9imRB0DRwB8AEsl2cN86SaUiKFLwZ8nDP6AKGmufrRREcsKjxj2gOMB6LMEtgEUhT1GT8Q4rJ459SIZ7jjMOZJTQZHhhuAhZAjdMDbMEXfLTb/Uasn4yZ2nRRt3PeWIKELl8d2c2Hj32eArzVUp9Q9O9GsPX2L3sxgjCu3kqj5KwwLkZYO2VsORbqQy22XBdopbaj2kuXKTw/L8XsbuTmgx4phlWD3anaObsTS6PaiiXRtQo50GE5HDnoFkoc3CZwKmE45lrrk01ranvhTlbsWh3iAysuXgNLA1am5aGhLoVhErElRTJeCn0tijSTF3ReCn0XaVolyzBWZny4PyrRZedVqXlqervB2TRGtDgZtRKUZdOi0RXwCNkpu84WeRmalVw8jwh+ZNtg6uEk7ITwOBqAFUMlAK6nv1FkCjXRSd77EqZ1zNQjazRwCQLwtrFtY3XemMYzKzZoHHS1Fs6JxsrVmclbE5icS1jS9GdBM3PRMztbL4uFTKPy+bxeC3YngMkZImnlOnZ6PkXMKwvtSHfQ11rZ0OzXShsy6K17gQT4sdUgGUucEFEOmw1rCOUhC3vWd/8uwgGoaM0yqkzo6LhuqVjY+N0FV/hDQRWRAHcBKRNrM72mNwmFpZCzq0SjNhDyQydXhNq8S61rLxOVsQiQvxPSLggeBLrf37iMkIGHQYBkbCsQWRgsiaI9DSgiGYd7ArZPYdzMzAAzBNMcBUxVJjYi+7E83YffsfcZPhZcQ44d3FbFQT/k2LXc6KUeliaArTDgY0UJxZpz1KU3c7lxR08rjBLlLUmQc+CZOsJGLda446gMac2m/x21wLm4PISxS6V8HWsebQULK42Q98bWsO8ci72cCScr1rDl25AB45N381h368NqHmU1/NYTxEldya0etfc5hlZmgueLUm3h5opw9YUbCAT/U0M0sxm8NGR3e6ANA1pzkMCvPNvZBeh5pDPKpnr74OsjY1hzNHCAGiudar5mBKiLud44WpmdWgXnpTk+g4D0bGbJ3g7ly89aE4GNcY8CSsoAOXmmpioocJDTKQ7aS3NhQpWS8DuXHGOVwlxm2+d/zt6C95Dlww4fZN/1kiUjwVQfwQ8CTow4FH5Le2uL1VeEEmeTXv/WhYN4tTYLjVnBDCisZq6DlvU762ghSChDxZrDJxSOvdoFGXzwshzHNcjCkxG9RTWx1fljWPjWOUhddBcUHnjy+H5EEzOghbHxdjuYYV+XsaKfROA3M10HIVW3IMOLEYNb2ugByJhgbthEtl/FW221YlFh4ndl1ULK8QKSPe/MCpxbphpX1JEozJ5lDoFpXwcpu2JCYEgXTDX5Sd8UE5mUC2bDHmafwNaRVkF5rZgh9r1F2MohjCnsr6sKKXqC7nRikwg5QGe3mf6TpPnVKGD+SBMlAH2mznysGtIr6cZC5qjdcAED2OQTBNKIwrTrkxVnM5rOPbcCYDT9ENF84wA88UYpzSvW0TxSQh9DzNps3FcL5OfzOD0dGqKKzerAZx5QnAR4IOTtjFuRjzzELMZzd2tJg8xJlxVlR8httLqF+AnuPl+U1vLe5GkKWrLpZ9gw+/LBln5uIbe08qwYSMkzDma88H0xQcjlpD8vjltEQX8gm96sQAeX0/JKG0B9nnMfdDb+yv6fJpo6tmiyrSB/xCETi5kVPs4cmuIXDWJY0i2d4caDQQqz7FjECldeSJquUI3+O6hkElVGqM4js28txWvVPH4sTmy9KlnQE2D/cCh5bkPTnqsiMxfE+CKEFmGTMq0fAs1mdKOoRuGI9M+bTMa44pxHUic5EK0xZuvCr4a6kZBoYoHiduhJ5V3+vTVuHEJdzWi3zoqknmD1jB/Rg0AGqXIJkefFPRzsRXx1QEUdt2IE7qUIxyjopB8e8XAS8FJVJcqnvyyTykJYdirDdxg63YVY4OLW8TdlIKgoWbc6hW4SiJXfzy5SieB+lDXSmuoFc+WfkDXNqS2Eay2EjKGs4mkEVZ8JhtjM4Xbf4+xmyjRRcpCW+EG7ON0V5tzHQT4QwEAsDA5p9P0ipmtgVPApwxkiDGK+GW4hMns8HN8U+PUgVP+/56Y40puggzLDRDzzEEkgcInFumGdxa22Fg09rCasdSoGxGFEBeorJFhMUAs/amnVtBgYSqL1R3VUpYfVZyAAJ3y0KJlMRsdQJVF7IzCLwMQ3LEbl0cJqpIVTutFdrBvJYvXijd6uPijgjvjkyRs+huLna6vrPG4bxJMABJ3q4Mt2ySDp3HShETpfpZKgOR0VAgqWZSoE9yjTXTKZsNerxm3VgxVIx5yOtZeJ0otuB3Gi1LQjHeNlq4QyXGhH5nCnc5sU6ON6VoWdeq+UXFgSvVkhNgWIQfhCT1PVjmead0zl73Lm3TW3MJgbdmjYe3C86FpDLJptmEZLxapHuYJpkgIVtZDEIXyuCmKS2O0gfexFaDFBu0O6DDcqaJ4gU1GNt7xIF04fl0XJ9bLx7xaD1qDGncPbjwIxLpVR73kMsx1GlpUi5v10g30b4cisrQo0upNMHPy5q5vHDQI0xVtQPloiGszsY+M1UIzdkurAGLpBSvS8jSpSIrgq2Xxg7wQAeLEVwcLJ9T0BvK4Qymai4bn5WxOsK1OXFAagST9VLPByFJNlSUVrXteMfS4oAcsFtVNqFGYlZ3A4m3u3OkPvLH7eCNKtRjhRVPUOG5NbARFy6mOO1zciJF575NbyCzOEB6LqcUZOhOUCd0tM85E1I/WzUXdLZO6uYcGooebjz1Qc+ePdVZ7ncrkOsu5/ntUuL5VAGCWM1SkqUkhIfv1AumzhMdJuudwSNViBfQsemNL7wiLUOxGKMIPHRIcUG52CTYCqVOmOkodIOow5I1SlJEHVxnGizsr30hPABm6zko+bsg8ejkuYjBUh5mWnDwWt7XuI9ZnFq786pYEANgu1MhplXtVJ+TWfeSDb1QFgk9K4R0UMxXVwmP4pUxEUsrJUczewA9qnn7nmLCiTstgmanYMxrMl80tbT11IUAnWaVXJGndA/LXaElrDG5U28IllAxdmxrpkHWniY9YEKUk7JAo0JWuNVSTZDnVF1sTd6mHvaMk5JPg540ulJqYbGuKBB0bUGxSHuIGiwBQLn8nprXW4KlWihGeta46oFjWEokvljN/Iogal48TihaNhzzDuEoUMsMOmEodWX8ePKoOuPEgJnpDDRH+W1bgyU8bRSOjIpaQdhrhWaAG92LMILXpE+WMsdq1ipOKWzL0cdQkAUcvkCmND/rEoIr8EN0qifgev2ZmtzQyvilHp+7+5bchV9LlyJ0teIlfirS7S4h6jlt3LggBoq6dW9wicupWyQlZBOSfi/5aNnDixNZoWjwKxlKVhIq+1lnDVBt9cVMCwVzB6HV1E8DiiWA6PipNbvdKJcZWx8+YlBYf0/zgfUuAdpf1qJKsYk2YTzCQiO4l5VCRIJwM1qwZZA+HFajILqkNNy9kNqiI5QtqbTvWTUoZDWV5qOmLm5+HUQXyAc4now1hx3msYySSXUJWSMwvI7nCHREygIv0NKKonbTsYSTkjtpcPgh3U4oWcQtpyHit+xCV32CneLUBFjpOBYuhV5IlROvodxrX3EhxZ1nzisjpVgX87G/gSVT9+VdYRcidoE0dZwaAiqDcgB87M1FwioYjuB7yhWQwSt3gE0WumwiepmVuBgPlaGZjX4LYbS9EZwXhKF0IJZEFQrGbICIh+DhVB2OLdHeOUhNqbIM42Hs2Pgz0olP/B5hyTTUwJjCYnHcoYrSx0nyDYH1nGf02EGkJC7PEGmNEF2jmsMAOWJp2/MUf/HqKcOe66WyTX/JGH6MMhQAKbog9VqVguN4lvYQpCJqxsCsZ7D4gDoai3BsHblUFG44hy2AgAcCtSqjJFuOM3EGFESDllPMagXBcio4uZcGyW6Od/29iB7kap+kVW9Lw1EnFTQMdqRh0twdUboE4IPUVZq51t1HGqaF2mEMlbFyT+zScKqIZ7kJWpF3C96ryoN98zzMz+g5ZLngwOFpz3NCc/IuJhlbESHUYUz8ispBROUNP2UEVAPPuMGBXu48G9q43jwTV+utMl/z68UF3S7H0GuFet8rl6OFJ4qoYlWKyKniS78npMllnPrC86VYX2xFgZi5E9cFq3fEzkRQ+RJFN5RMd4B1J4dC0Fb5CbSSI8CLBlyw6+PM7EytFBseQktjK+k4sqyspW1sxyqEaV3ge05Pwnoy18A6eZdDohP4oL0KUHtTQWaR8NdS4DfPTpKGiOq91+aginBBO/PtCWOVES9nYaff7j0w0uAjH3yJ5Dhhmty7StMd4DNUEgPpOHwUnDyolOANlmVpxzlpQYxqLaqVGxuc3ekwlgZjwGXxYMN9+LRBQSPNAdQ9IaC0QTYR+s1ilk4p4mlK5scEabbNMzqK+uHu1EbCCeV1ooBg7/AKilh0VptsjIIbBV9+1lTtbeEdBniaKrcJ77Qzx8vCOzBkgl9JtKT1GS0tKbNakrLf1Ux0JpJR0oKZOzIFWtkFoEpRVHyfssCNoWOE/PsjdcoCjKGjBS6SKswPX61r9f9NRjkVhFhcGx+JhrkLZ7+G/M/z2xrKb0Oy1QNnpdk3bSi3SBV0N6iKZAF/Unzur3vetblD1PnBLaZCXAJi8q34tEH/Lcb0yZ0phm5xSxGf2up7XWM6f7MIoRUeedBHq8cNt2zPtG4bUdUnXO0tvYdUmo43AJfc2kDKYCl1uHfRM5oxmdpMZpTfGjgJVWvbdgC36ZZ09toFUfcALBQP2EqW47S2PLrPTU1nq8IbEv7Yp95CSIFMUorZovvtYG954LUAwAEjR09gpNj924Bgtzi2RuOPQn1jyAvo6XrJ6t/PGJzqGnO1jateMkDvoKa67Mfkr59/4AbZQarioU462Lx0bllfcPo8gdJzRbnbRNAevwrLaK+CJYzI8xx1KGw4l7/hlFsWYMov+N/W3+wj1k8ru5YQ7du3BPbPlaWzlEZRvLcUODP7q3n4DbxkdIWnSGZj5ayjWf6QWvFxNPSFhy0XGYiFjqYjRS5DpN0gsp67PsLDa8Ebypo3U7qbo9+iwgfyLT8Sl60irlUstYpsVjHLeljh2ByO7h5BI0uZDlwIHUkZ3O8kKcWHrsLXG9OtWEKiXLFQol1JgLaWCX60ChHw1VC0jrlAz3AgaaEdJv8ybQYAB8iptNoXlLpgrsU7nvNe7Xt9AvnGI1HltX813g65QLh18zqKtKecvgtnpD7oVKMVC3zIt4E1mb1BEKbUqbk/xlzjKWcBVcxjhB1LTNL07mK5vFVDq2Xn65fZPrB/2FkpNPoEMUOxhwRPsPsKKl/nw9b3pwXUpzAatJxC0TmToOUVRLaCtVawxLqBI+lIYRfF5S5z+f2/QW0WHfMKllYO7M/9df+uv5nqe2q09o3pNhebIyYfz7w3LSsoAqMVdAl+lH9DntRUYvu/BNYaL4W1jUtRNGVzlF//qDNSNCnuwtyNPCGMLy7fSuh6z8q+ilmTt3WHcGLTHOQpMMZtWxtSuCVTGfnUKuUFT8D5uck/CHlzTxgJomZOozSn+cuRFGxyLti4hI12KBXfRVUFNWHDRk4Sn/aQ7Luhjtfht/gB/n57rjy3TO/rZbYtm2UIRZhW5ytv0LUqeQrKR9edfrb/wuLRjmKbnrnZbyfgF5sMh54PQnDiyVfo02H6ZJcUpvIdcbbMc4QzLbxIK4Q8521eJI2YLz6TpE8b6XNE+oSQPvsjfc3ksI52SRx9xkbPjaIjRLixDsuiT5roMyTSKblplX/wJHpho5SjGuZ34TZ04F7MeUQmU1NTU7/dUuzY0dDQsGfPWJ2eWktcO1U5h43kMMmbNX5Lwmx0iHGaFfykAoG196L81uv0wwZCmXT+E1sOYOz2wsMoOkLQye1MGUHC5dlV9vQuifIdI7dDh87/rBZXRZz+DAOq4b1DTfIRtnVDsf+bmqY+Cpm5UemMdkh5TV2w15cmrNn9gl/CgwnXM1X50ugrXy3ZXIVwJM+MjWVsHUY7PaG0pTJ9yE5SVe+lqttUmsQ2pXPUS9eTw5n8ado6ldIcekFVe6/u82PDLkJGQv2IzXiY43EjOdU4howDOgFEBYh6OO/NLveYaa2iAuVEfprswEALLuEOYB+2s0o63uGpdKX00CN3tPR/B1DIuA/6wwbOGGMK/vryVEBT1rbIWNtpxcIOpCuDS8E1CbggibQZalPi9hIDEUwVvV0mKZyZZYoAWu0rD/tUPLe4lAIPU7cfPl6xBU9LKaOWMHIj8cCNF6ojVCz73PLHjOJC5I0aB9KZ0LZd/7XUEydUBtv5RRSm6wMkbvxrIuypfCQBX/vrY9jQ65dwoTV5lqybhOxYQ+b7vqhpBCDOdd8s1xiqG2Br/ZFd8B1QGINnAJYnwSx3+wi2uCOpDutHsvhAbAg24wmJwW+GIdkyJ9M5LS8wgN14c8br/Bllijuuf7ZQ8pFDLuLZ3tC3t+PgWm/Jec3yEczoWg91JQn5qdng6h2By8YQv77r0G+o4C2EyztDTfZUDWoQYOn6JWQaarNXGJ8d0ttclhzCeFN0R1Zui2Kx8PclyVaUxuPqWehy4P+worS7KiyFP+wAKt/D7BhTrXKYPCNlnaKwzr8cgo65FQ7fAbNhFyARQ3idNujF6ryEio6rfoYTHM8v1RaF91bYMvFkCWeFN4lREWKnZsTvQFT3zwNf8jcoOAtdtej3fz2PsQkOn5CnwVmu4GdXM7isqFVi1GBoGoE9wY54e32wI94+HsiUttkWl3ZxwHQ6SKsy65i62KkT9pdy105nTWr9QNB6kznYhK8igaTxRQS8AT4ObBlMZTdJWAqE0zJTd49g+EH643Myfrx4z+kpC9Ks7smUkFaDp4kGK755GZxCNBKccy7t6LqY6jilSQeWIQKMY+gVGV1Ema5AbYOiBEmR29mm5mLHI4dHF8Ft7nTAembhuQOhSJIoYcyIQto0U2waS7Aij3nGRytskbqHhQoOfJoXkrb0ZNuxPOpZ7WOgGOU504DXI4C1e8pLOdaION7b40LWck/kLBGCoylfvSNaGoh8ngvkzknWwY8oLdTKh62U1s0YR8iEQoBofanWaM2TDldURPHElb2IsJsGW51KC+QBX1uRNSLKxaFVqOqbTw6gHoH46fNgcTJKyOehK0oKtW/1hUJKzB6vLRXpSXNGNb0mp23dMWv4+EkiiaCpKLxkx2dEql040E0lgAr5bMjBINWcepby2Qk6oh1tQSGW7Q3rZIOLpyCg4wSmnfqUVumdjDCiEuJP8FztwYQm8ww5ZU6KHEAn9Twn6lly5XSI8yUBw3IbKjCK8uCdir9mNtBfgQeiYohymiLUuhieiNIcBSF4cSpaSnpGF2tiw/rcZkMRlS2/uTsza2rpoQM/lVLMUKgLjIQ0UHZVcigH8bQrIt1eWX80o8AoabyjV0gCn2Vkd9qj0HNaRe+7OSgWYUP7no+3eIkjwrVW4K51rnWEGwx0OEvrJasRECYrBRzUyq5MKE9wDWSb3B8JMDujNZ4g6by0SsPN3HHPEsMLx+u1IVXjlxW3pTpyPMWGil8me38cc6GIZ7ZRUx8q3i19jNzY68tN3upUAMXEC7INAm/zutpoouopX8ooa0pXJ74I1/362CsTzhRmy3MhLSpQX0FOwQDYt2VOpU+yHus96sl5etTg4jA2IQeNYcCZrl6BD9USirOWSW78zZK7UQynCDcy04iiMG8MWkusZR3VD48eLzJj9pEJixSfSihhdJT8Ghl8RvN2c6n5bfSxtdMEvnxdb8t/uMt1t374rSMv+W3QS7F8ysdnnAjQpbQhk0ppkCexRo8KjQyzY8M6EEy9t1YKspzq0cYjS7Fc802zSghnHUcRiZkDgJMm4hXsQ1RLY9SYDoFRYHshPXp7iBSAFmpbn7WiWN7elRKqcIq0CCbQeuduOhSuHMjgswId50xu0gwYL4JAtfyhlT7CYoRY6xrN1W37qH5k7PLmjfGYh3ocEINb/JKs2KzgXdLndIDpYSZSM2AUTzbUQWioCdUGOaOtCVydwoGlgjNGHaCINdKaxmzn6RHiJDjWWsfRI6TEJDWzZF1YLRg5Zk7oROb0+RTnHhQ+Dg6hHnhoDVstCZc2HrIsSd0uEKf55ZPrEjltfDjjdrVQbOFoVDbzdb2xOcbWoyx1kNfaZ6INyxHQcmup9UtLVAROiGAIsMR54RXKr23gwabUx7P7tLCuU437VK8zGl0TcipMTnLjYuvwVd/a8R2gJFUpLkEYFlR25Z15bR2hQSflgBxFvCC7F4bFTZY0BvSz91lQ9sozWGmZqhuaEylB7NEtNbwynqmfdt9P9mH8ynDE0tzsSjCgb8evKjsv561HJYpiO6//7M7O57SWFf8MyoZ/AaZOPoAvCIy4fA/RQzk3RYsBLvjH+PK2pbKDQoLekqBs+CxjCpnVzG0oXqiAcy6/OGZiW1ZTqa7gHdwYZ1wCTtzAxtiEEuloNxK1G1MCrvbpDWVZKFrka/iP9xBsdwDHk4i4KUTLUgBDLrW/3WmBib0a5qWrEN34SHRveaJ+OgoDln2+35MplbSpTAcjNghAuELhbqj/H5NKmQbuff7Eq+MM7jO1Npna73yTHNyLdWDfWlNET+gsvJEp7jdCEMWv/uKYtid30f4hgtubpcmsiB7gbBxQ+7dmYZCIqWxRHdrbLM5pOcUKrRvIW+TD8YZZ6UMdOX96WUb3fv3zrZlI1YqqObh698ZUY6+KVC8Lb5VyMMm9hSwr5Bt/orO2nBn2rkHOEVjFajjjtxk1qanIGksD9E118GSjgnbK26jqtT0KTALKwNJH3xzFBBvYVtG6ubhziZ3SGMU+chUThvyirTcdc1x/MADF2NMYRXeOsWgJnxHycgyB4DbQvXYYGupNGq9rDWpNpLdjg0HOCg17DMZnp3NThlEaHrBkmoa0QmNopEcjOYLkWKyfX0n+V/MAeybuZD89C9ZAsQIPXTiUE1mf5wYPRWCBw0WMIDFm4IcwU1pd1lnigMikdZZ4HzJpncH/rTRfyUIYtMzuQZMUAelX78j//VsoSV7tKDTeTICwbZK8ysrijUkSLW8TdNL0tsAT0MZ0q0KQADagyxrxPKd0Nz6OQOGi5wo7MesnRGSEJ3t5X7VDGe11QwjEGbOD7axK/jPJrLLecOIPOmx7tYf6GI6H08N1w5nNvmwcsAlPfs8HF2Zo8RLztZNVUHmOEDrCHid6XZA69Jj7kyc5nB6uG850el3seR5tcDy/LV3oXEpTEpkWz2tLxpIO/XgyRYa+wlh9vsUXKabjF8uialMXLsQAZVGSlj7gfc5H5aUYRgL+V5ibKk2hfZkQcbUIEU/EVz0FsCjHu6mQrobaTu8WgeEO3UjLinJHsZg3ti/F6/H99Xrho92Jbi+d5+lS01w+/ugNYgXnB7dIoL9x8yGYm7abNd3HmSW9woBHOK/yPrT7hqSAULnYKSeBO3Z7c8UB2rdDW/f9Z3DkjuyrRQ6x8EZQ2N3sU2TmVt6jisukslfRz6nl9c1+QOX2XsVvk80P8Hu7WczBxO6/rnARaesTXkaX1dzZmZ2ZiUJ5oQxO6tHAQIhrcrL7FO6s0F6tOLtvHAWNI+/8jpDuz/vb0XpdsTyPqeB9FBvKonUWuPXdrtQJcpHD4lfEIc+O9Bvtifb2WRcadCTP8PyGZMv6NugOBH1HOHWBjuQlrrPtD7NOpObKOlntB080FxdQx5p2RNlgibl4kNhgNUlOe6glC8P5PObguTHU8P9l0QEefjzra+hPRgbV8LvL1Bm4GP6kC7gPeATpgVwN2H4kWblnvIz9bWyMdhHj3zY29ygYTNPh1kN+rafm8qYBD0vleOezzhXZtOeKv/drX7nRlp/UhXojV9aY+MZ/wgDwXOn1msuud7HrC/oz+Mt/n597Aj5W+HUXo6DU6+fXdcHKZ4+KY8BezfqSkmq031jawX4FWc7p659szu3XTxnpbZWDnO8nObpFv4VcuC/9ynJyN339pddNAq7fGmvkeg5zZGVqTo4u7Pj/RkWz1CMw7CnMsK03v/0mxWaa26SWwgSvnP2O/xuXcKESMK+J327mDYZiM2PlpcGoRv9ayg8d+zDG4UI3aEdeaMDnfERkFHZ2+YNFp2H5NT74HDsh2Bs7BgtK6uIzZ1zv85cacQ/ZD7tVLgLjJvHd7XVTB+sJQx1SJLx3CxeKgTvho1vwjlLAk/DZLSyUADPh3q2XZ4zukHnXrxTuyArDwGjj46AWxhyQni7umgPuyNLOAgLeGE44C32IxWcOOh7Is7AU56CPsTQrD4qiiK01OWcsl5sSHc5D6smjzHQEJM+AotFYiK7DeXxAOv/ckXY9hqVqm1c1HAI/xX6fjL41Pgw8W0aGScO3n68/n//8n3wc9X+B3VS6zFvsJtHl9Vd233BqAZ1a9463Tw6ZhtWTeTrbDpUNDkcrnuf6qAkcx2M2wwsP9etBMBo3j6D/8VjN8MEj6D8eQSeP1XwFHLYvrUrLUFDjYf0zNkaOHoV4+P7gTEs2JfjgEbukmN0ywGl42P/cmKMstPbCI6wr+7hnns7GI6zffAEuffY8h4DmSQLpsw6iJxla4OLCwER9Llrc3sgL24qkcGlFTR9NjT42eAn1Dy5PIx0kRkPyspqReQn6kZegv3lZzfDFy2p+/sDFdqjSyR66U3ix/inG8irmA3jx/Wl/qBMa1cDLPj8blRNgcHDx4v2TWdpGmHWAl7BOPDoq56wRXsK6J3joBFRehwhNS0TaOhFdZNICJA6T++7jkl0vqzrbKTpz5ZWtFTRJ0cKkHhWg/k2nPoXQzwXQkG80YgF0F0BPvtEvkM05pWqIsqCXz/adVfuoTZzKZ1sT9wSbkHn5durEtKZN4ZTP+qwTlRnjkxVgfblg81hlRAVYb0Vu1cPvUCRkwHlxAfXRGaQXhur9RrDyplqmrGzsdp6xL/4talLv5V9rUu8P/qXeyb/U+/Ev9X7xL/U+/qXeH/1LvS//Uu/hX+odJYjwRkqYQvDsDLB5nk88qaHie3E3SWNBdU7I0XfWNc9P920OvG6K19CJMnpAU65HLF0i2uts9P+vh2RRyH9UZZEKsXWHq+RRL1oct4Q/1Wuufa2kRcZWe16gXO77H9wsdHyYOjugzH6O+FvbspLp8Gdz/0GaV66lM5S4gpXk6GdrbzpES6WhaoW6NPWrdTYT0kMMAVeDARwm4ltO4/sS8ryeKem/+i7SqurIP/HzV1aznQht3Gyke7GIH7uJXjqiTOZcNwUH48YteurH+LmwRI9uc2Z3QgzLdaGJP0iB7vz38+ktN1vnJHIrc5Hrp8bf8N0WyGGLcu0n+rnxL/yw1dNwBZtMuG618xvCT1ub03rLATX0SyOGd1siJp7RMkL6dSOFXwt31iniCcNF5TNkWQZktiy7v7F2NC4tEWvl7FnrEJ9Jy7t26psV3dnI4e+O/+0UxPjY9fbyg1pJMl9n87N8AtGC4i2hrUr2icX3iovGCaVE7BWGL5kXLXUBYcQsdnzyto0JmmO0tJxlq7xv13QqyV5jzahTzpMbgivX7bXwZY+82I5em5unV1HDpNiYw7apT9mgZkmxdVzUiddZgZIU+41nCHI2UaMkxY4UXgBc2x5KUuxyqFNySM9BSdoRHR0k2yHh2Vze8bJTpjMwFFqOfpjdPVhpcBQArzn4z+uI/pZQJNS5RCxfEg6ac78f1LHQ3n4EZvhif5Lg30Tejchk1rLBt9zyeyKvRmayrejGZ8uf2fbuuqaiNB9srf1FzbYNW9denQfDOvbYPH80ho3mFvBFtloTtyoIxAteGsuKmnP/Xsjb62XzASG+WvXjxK4E7JxJc8On+nliV6ZMZjt44VN9ndgT8ezB6tuDT/XbxN6jQApmMI5P9fs8Of7EGs6qXt8k5/cdo+UV6blep7wY5BitUWtPthfnZphjHD2D7VtIG2ixx8FWB03VN16+wnB8rbhY1z1V5eBM4DvmxYolYuxDkIJP3pZfSk43YluxLJW3ZR5uUwlXIGTOVnk7BOkIy7CskRf5pctSWk6YqGBS5J3XjDLbHqFiSZEljMY1lgSiJEXOXcTI5mcMJSmyoWmn78A2SlJk0mPduNAElKStpW1C6HiCdJOb3xyMtg3PJq/ka2PEYLQX4quPPoMqxgzG0SEi1dpNhYfmUu83ds60HalqzHEAdvwvH5LnXPU6KH5e/jdeeUj9uh2re3rvJc8l+1Ew2Ut2+PbzuPtKxe9jN3APW4WMzaNsss8O/33f4+M59uVQzkT54nHE4lPlKr/Fnn6ngQ9Xkpxcc+XZ59XWLvjCy6Eb46Tfb1ynX9se6MhYGLDwRbbS4B855tILL+fG9/tKP5yeWZiYlVcbfLXqp2ArGir4IXTAp/ol2CnHGU8d9MKn+jXYt9Oqzc4yC5/qW7DPXEz5+rDiU/2RtsrABoACK5h+v1vubYUKFUfDTPe7Na81VMm9bJjvfh87ds0ottQo13z/faUTqfc7VeZ2pLY+vlVeLL2jk9IkpviKcZ9v+P2AO0XS3rxoJkVv0fiE4z/nbVn2IA7wPu+hWjlbHZ85Vtj7PJY18iJr5+G2Hn6BCiZFjlskGmHUiIolRW6BWpanAYWSFNmqblhXjCNKUmSUaZFxHSWUpMjDd+55dUCCkrS18CHn0ONuN9aZ+P1326zA6Q9LyJnj++/2BvemyZJzDlO//9bD6NnyfVOTj3lfTl+3ryufVcjDcpqP52pnCv5dQck97WzF/9aEXN1z0a/TcrpoiM2+BNglRlz2GtCd8A+JW8p+4LWcnrSYnfiXcDtXxI+wT2/8aIpf8noFH7YJ7h9+aAv/8kNbSPnRpBDVjhOUk7JAeMEnfgn7svmlKb7i9QoyahPcxi/ago/8oi047DKSxI/a5RQlhCz4n0b5C+9j/iL1bNcimKBV7Frwev4nfwlNmb+E5s/8RZLe2i4nJR7zYp+aXhy8FboWWPaiISN63yG3/F+vO0jtcRHRxB62sRHyxcZ/fD9pSrS6cA5vb8a+yFeben+94MtBH2pRcfWY5vGrCmWlQhO/4Yaf0DJHFkVxr4a7IPZdzhbn33HQFYohwWpqrOdWX8fpyGTkY3OVl+84/EcXtReA1UyL4atV28J29VwNTGUPn2pf5OPXCYJ5Nj7VsbCjzht5JgCIT/Ve2HklajNC4PhUn3Xu3S37wdaxLb2AIHc8WqUHAEtVlBH9QCscB/tO2eBt0UH857U2DdjMchb4lolg+drjCYprPa8YWlQa1UqKXDo+pBUvHlpJafZolgPJXqhO0pPEJxP8dtNtNcnZroMtZOLTN1maF7tnjEBwJg9qGBSbW2/uC2wAVCwodmcrm/BhOChBsdmjdcAruVCCYqeKojaXlKAExQZNF/DU6YcStB28nT6uwk08m8s7Xra5EnbSi/YY+mF292BlZe05OQrgP6/jUWI1RUhbH+sjc/pUjrnPjXwQk/eCTj6IlhtWDl++M8AN2zp8XNGErzZ839ZfYxLlYB8rwb/qfNZrNvXy8MPL02nLB1cQaXQt9gm+zNjv22xbW8BccScjvshWbxNZEFM3mnNtfMXRj+8Le+OUetspFr5a9cfCzqGbe4JmGp/qz4X9iIliKhMdn+r7wr7GfmrEIwGf6q+FPVt1xSo4R3yq/63WYutFqofwPC6kr8/RtqNihR4xVIpytEdGpEuOQyVlOY4ia1UIVz3y2DK3DaQptAx6DTzUKiouFW1UMAo2OqKiPiStHbPlAfqctWs75vIc6UFVcrbruBAWltQOFjXyIpcTGJS5OqCCSZFlvYAwdCBRsaTI5EaGaRu+UJIiGwzTPnY2gJIUeboWuIw+b5SkyFGFGqCpJkrSUy+J+7wed85jEvrKHK23PoDtvWgbFTm6BKXL7HfpUZPj6LixJl49qcqN4j73U5G78pGLXnoeJO0N4z75+ds0A6UVRQsvZM/iM7zPwp1z1snWKmT8HP72u1BUEpkATPfcAsT//pX/rHN+9zI2qqAv3+VsSXK2HdSWNky2GH+11ZnIhNbVhbZX4n/Hhr/XoqbiF3hikfHVqnthT+4T7bXhC5/qWdhbg13IG6Pwqb/sXe71LAeKpvapfljYjsRGzqQj+JQ/Pn6grnaF75xEQ6bHvWUuHCCBg5jMFPfWIDLEsFEzmC3uR48slSWR9Fr2uPc9DOqcdbA898WhVlFf4N3XY9mrQdQrKm6v6EVcxt5oRsXo8OAKYSZAdaK2bU4jaeVMjprEbLdTWp5ePzoWV3mRh96I45odjAomRSacHuQk2lCxpMjo5WthCQejJEW+whsATycxSlJkbpGkV4HoKEmRO3dXxboYUZK2Vk3F3c9b7AYtE/feNg6VnQjFhjn23t6In/WKItSZunGWerqqLrguzO98/KXRyIUB4dQ95UBixMyJwYSd+i1kwfdkxbJ8CCtAb3TahKerIHYHp5B45YrkUPb0kg3tXw4lc9EevyD2+F6XCk1KNe0Q3P1Rk1JIB3/Up+zTQvijPqVkjP1Rn3JJJ5qUf11GI3/UpKTSjCmu69iicWonqlBaFvxRMn/GpqUoHbORP4rnaN4dxTM1ckf5dEVEWTvL+yUdrsB9UTS99mohLpyetBcjPTZnG7meHr/84/59S2IHi/mO+/aEkwDhtKFwaiDyogORkSuIpA2h8LhBmCAMqnRCqPILURIpKjyDIg6ICsegyAfCj5T19fQ6/GDozOezE+OXHdy/b0nsIE779kRS3jAmZQMyKUaQebmDzEgQZFKsKD0mSBOOUZUDpCoWSEVykIqsGBW5MSrihKwg3xiNyS7bnxljZzqenV5Pj4/79y2JHcRp355IigkzSYmCJilj1PhN0GRkDpqk1EGTkTNmQvKFGVXC1FQtaio+aBSxM6NIhBlFRswo0v7RBAjWh1/MdObx7Jwwbk+PJwHnb5dEB3Qw3RP5sfoSD01NFCZJGxcv2E/SboIORPRNugy6rrHS/itvZh7TCClN5FCsjdKsVYrIoVjzoFmr9JBDsZY5E1apIQdhjWJOtdJCPrwEeuSRfFswfNNrarPdIDoFObyNKJ4MdReO/dgye1mYTtrWtekBYwriw4MKU9s/EOUF//TbZcHS8UJywxF/wQTfl2cD4S+5WFOeGpKD1lMcWsZjWDM6U5Z9SPScusulhRIx7sZlvklje/QxAFI5sp5JmnqurQUQjaI3vj4SOLKydtZ24kqBYvXPI4uSxzzBywBKqd+PMrTePCNUh5L4r5MkszlMr+1qiqprZka1uC9rTdPaaWKcAeaWEl6LXFN3piprj27UaDZeF/hlN4twaZbbW9IVG42rqcbjEoCdaYqx5VwRKiuoxi8elPLhXtmPMGjBOvgmIIE7cp6a14ubxuEn0lZePNxz0iITAwKxz4ZdaeBjWeF4GU+fBMHYCwl4w7p3nvqHCXUTICdh1spePu0k+OMx/jKmieRzAzs1MMeWZW3x6LwcfMs5MIh9tLiA+g970N/mtQYBab0GKh37RLh1LfdHzAzUgPZ24jz+B2uM2uu8LwsWash5vxwq2juo8xQjWMSC+iMtUkHCSD0ELgI1IH0focN9UChB9wjVmPRtBg73SN974ODDli1CZxmug2YhKke6dwnPV554/8Za4DObsdbkHKQZi5zdNHPhczVzgS5WnQGkSComvbECF8FaoATdI9gqfWuhwz3Sdx863CP90L/UInTwUZVOIDSt3IUZxRuGZhe7xe0WfqPej0XdPTeFgoPd66vS/Sz5brPcQ+mYpLO0fkFryyHf+FUQk9U508DqHttFxcolfkFrk/oNkftn0nI3OdAzN+r+VLqhCJrlDbbbn4tXKTKu2JsqKgff3Fwm0aYr+OY5sjJdhR/04IhW10Nb3BENxyAnOvKMOoY6Dg0YD8LhgISoXMZwJlSdX39Xl2YRkA18eH4LhTn4AJxkPP34uwX5xcPNGr7PpS8pF/1uoJ6GUTPvmhdkxcqPJ4wWYomOIYUWLOMoBk2hs/nGzB/LQXmDwZN+TDNWG0OmHUsXYAT0g9MwiIPmNEs6hagN5NYchBWWnIsBLCNAcZBe+m6fGeY4v4NmNUuCxBzKM5NwcFmXJf2yDldY1XPQrW7JiFPlsapkB0MbVszzXZp4pA6mNS2ZTxiNXh+dg2UtS/rlhRXYPjPldqu/NfP1yttyX/ojsz1wvYLn8UhkmEvPb7EaUqHUMADmPJkssyZs1yIFL+fJvB8uisK2hW6WmWT2WJbm9XN6zcQ5TybL3ZupnoEpzHlSWW6i5eXS686cJ5XlTBUNR6QVcp5UlluQ6L0noprzpLLc20LNGsaLnCeW1YJdpSrCNOdJ5WcO2mdPfCn3OKSyHDyQy3qkvjlPKg/nAz4WQ7STuVy//FjZT6vFf0/oLG8/fDidWQPRuPwaXaHGUNDkDEeeX+0aeqPidugUXOAytAiqd3Ns4gS7oSDSXgEWb3A0FsRiSLBOdlJjQeTD7xmwObexIG6O6QCSaxoL4tsNTbsocmNBZI14qflaw1gQkx6TzpSzxoJo20fSkA7GWJBhTu2R1+nzsmWThBeeb5HmSughmOID68gaiGw6uoPHEYaCFrK0aXnNaOiNOrPHMV0ZaGgRVH1pz+FI8hkKIjynFw917RkLIoqEz+PJBHMhRNmd5niEsSD65aTjO/YyFsq7NZBBZzcWxJiUvmvQfcaCyIX6yNNxx1gQdcKd4tqEjAU5ECBHODrmxwxbfl1lH1zMJcT+Nkv2WJw/P/TLWzOFSOy6jXCTUCBrzPyCE5ZMtz0uBJNODZLJ06NMtrH8CsYKpl9+8clYZuUdCiZJVcAlk6d+oUN1Fz3DhMnpnV9wopnJsr1Tfa48vvmlp7WZLbdgPvhQARIvv8wkOtOluS7PPIiFMv+goUJH4qpPTd5M0mHmH2tUaLHlntibKWFTz/RDlMos9cYhn5qw83VmzD+d91oOmMTUzlWc2UstmbwRRoKK8vaBTFzYyeSNY8k9vOusyhh0/pDl3jzlSwsSzPljrclssWyorgLjM5HMXCJL3aRxQZP38oL7MmlB7uJl+61lUrBYdbUeJX+p75ft+nBofGJoz10SQIIPF5fSaY9wTAAJIEyXBXDEuGY+oeN1R3OlkVOxmPlk1nx4CW404VZsAkgo+3CuqbbCwwfJ5pdvuYUZmNf0MmWTy3xXtzkFEeqwzCez2MN9FZUu4b1MPPN5OD9cexiByMlmfqlXqVWA9+ULycy/Ho4bdGH8VCfJzOfhaXZo6gxKSWY+D98rhIcuiZVk5rPc2cL4mHFuzpPZ4uF6aAXar12Ty/xGD5d5lWop7JLZXMTsDlj/MrpZmtyzt/Zllq1/KFhBFIjaUOvXzE4qg0AwlE8Walxx233BhnauOcrvWbY+bUN71n8a5rXyEsnQthVPYkAp5LNn6jht2QJb0l0HjR2bZWEQ4AlbmToamxoSGORsNVOb1cPpRzQdK2Roq2rGkC7HnMUNvaqBh2ApprRjKs2I57M1mEhDqcZvhU29txyGgthBvQHJimlqjUaU2fENh6GhldDZ2dHnoQN7DbOB6ScBrqXqfrH73vIXWbb+NoCd9Mx+hlo/X8EckiMWQ/lkERuomL2nZ+qXt2UZWFQs7TZ2O9/ywc+GoKwMbVsxaqaw0LM+Y7/7lhznDBejZ2jPutSfmDCTvTG0WVvLTg8e14Gp1FP3aK5W9bWhraoZ5e6SuT039Komo9JJBUjNUKrRiQYXqZUzlGrcFF1DTFQNBbFoVK1ch8TUwdPIzs0gme1n6I0+wO5oBYXhxxB7LF9dH/DsJQR1brxw7fe2gzNkhzqhSIYuOzb4oU1xsZM5gKOHpt8CGMuGAz3UBjymk3xbQg91aveUmVWt8kNrNF09EmfCDtWNUUu3PnrFDvgdqdaPN+voAX9KxAD7JocecFtQ4SUmMtEDblh7ntTDYnbArQ3QnTrzYAfc9IU2pXUQdsBVySqRkqpkBxQ7HruopMzEgHl47meBXc0OOMF6PgZwhJ7GQJ2HsO4I9XDZoc5uS5xOuSp6qJN1oZsjzpcearZrDXHNxkUPtZ1eHz/Uc6CHRrP8/LwOlh5qs5sLsjHlzQ7V6YSxh19qsQN+rT6TXt189IAPaf1QEhOAHnC7hfJM49zoAfci3sutCnnsgMvqKwl0d0YPwHfN9srl2AGXTvT11qExPZBwRqAnswoxYG7JGwhKSGIHnAlboSPcXk9noM7WJpBEkkh6qJPmLQnLUhM/1GkqQZ6MeM0PNddC00FAAfFDcxNgzCRCyw91sjANX6ap8kNtdoCMraun6aG6JHATwhsNesAHilULhYvxQwOFl7Nb8x4/4NYIFc8oXfAD7lo7yWwiHz3gSt6+Jwt9Rg+4prSQrLqt9IBbFlk+yxJFDyiar1wOAoyYARN8G7oOrYwecHSZnIl3AXg2A3XmI0wVPX9GD3VGwABq0ZPihzoRoIyzkO78ULOqwiuNlix+aC7WRT4gjscPdaaA5nsthMgPtT2pM3wr94AfmqvggRQGbXrA34pyzeeMyw/4XTxcU5Qu/ICbXmb6rJaNH3BnSy6nz4vpARde7jPnYwB6wK3ooLF+84IecAt626eniukBxcKhIst0kBkw31ACHOsd0wNSTYAfMG/L+Kiiy+sXYXMJUaMD3C20ks5OdT7NyaY5R6KnOruNskMxAump5nXwJJejh/RUG+1KACdvBXqqsyIwXnrHM3qqjZy1be+9XXaqTtk0kvYGh53wkXbm9VCf0hM+TtiM2GsXesJNNuF71ElDT7hC9TNWDGh2wu3nWa16HslOuFiAT3H90NgJ1zLNV3XWmJ1QeAlmlizWEhMmH8LUaAd57IST+82arRa1pzFUp4Ih29zSmp3qxJ46gOmUR091wgZL9BwDpqea33M8A5qsoafaMJyWoCpA6anOmz6bakxReqrtmdrV47MzdqoO0S9C4NVLdsKfNWrYSCKgJ/yeSiKVd8r0hAs5+yANsx494dp1n5nt58dOuHUR46zXfeyEGzjQR8utx064OIOCbzWQ2AnFJAz4QMODmDA1r+OZYpqyE47ed1fmOpqezlCdIS8LXtD1o6c6JRWvna35+KlRfT7bAbTMTzUnIoO7PebxU21k8JZX2zP5qU4EM0VZwCQ/1eZl+zBeBhE9VWcPwRiyQY2e8EugJh9enPITftHzqE1PBH7CdQNMKGWa4ydc2KacCQpM9ITL6SnV4CZOT7jKs1aODiB6wrUnpNGwd0hPKOvxcqdnDJgJU17tm1daK/RE1G+ZqMKEPJuhOqmvgU48TuipzlwPuwsP9fipTjUpjSzTR/xUc44ooXNQAT/VJvrmQDvWgp/qfMmPxgJRjp9qEwPvASAqpKfq8mnZqvKO0RO+9Bjp2zBUfsJ/JwgNuZ3IT7gm+SjQgVz4ifhk3mA8EKQn3DOMrTXg9+gJt7vU8D2LXXrCRXE8orekj55QEjKhpGC1zIQJ94nWM6gQekKC5Hp88ghxfFTR5fULw72EqE6EBhQNBhS7qVOPWaG0iym9qZPi9UjW8Ft+0zJPlfRZbdCb2m6xyMmJielNnU7dShmrFnpTWxRPZb/1NnZTHecgDjPuCLvBP8fVeOmaTm/wL2V4QklD6Q2uMrZqvKCA3uDW8lxtkHixG9zTASiNx17sBlfdleDBKT12g0v0NdQoFGA3KFAm3tOticQG8yq9AskPjN3gCBiU+QWbeBpj6jx79uSKBJTd1KkOHhveUENv6kRVLcPqnaA3Ncu7fVAqBsdvWhOQV3nRmvSmzjxSzCixtvSmNtvoF1GoqOymugct6ZVucuwGH55V0LViKL3BB3GkHJ7toze4+yJwjctt6A2uU4YrgQGE3eDaCrrzyH6P3eD6czo+eGjCbnDHNxURGp6zG5QoQzPoEUFig5kRxa8C3YLd4DQszVtwHfF0xtTJh6vA2W2V3tRJYmFMpa+X39QZ7rLmK/2Q39TM8IfwntcbflPbvNouNdtAflNnFwhqco0Tv6ktV2JC4itcelMdbN4hpm4LeoMfHFsdodDjN/g6mmIBuT38Bhf7wbMzWBZ+Q1yHwXzHivQGt/HFPT/rSn5Dq85342AA9AZXGMrnp97Hb0ikkV9Vqxm1oVSYRVdDV3qDw4scFRG1w9MZ0+Y4C1rPgNGbOtHzrlLEaPhNnSAd0tEPePhNzRvRAWVBb/hNbeyvm2d6j/hNnfzObSWnkPhNbZPKb7eVh+lNdRjMIFSpi/QG/xpfggYiO79pIAo29QFr8BtcGLH2gFfQ/AZ3hlt6lK+W3uAu9qDFZlXSG9zKS1VSDk56g+vtViw6oENvUGgYLyVoI5kNZhq77O6DDn5DNNDloTZW42OKLhwWY7x+6YfQTyH2XrMwDRcbtyXX6KaB8tr3eelq9GMGxtOWVrwae7KkQKm5i1evHERIlXzziteY7FuXDGkoXo30urRAs18Ur7ETqO1L5ildZRl4z1X4dZYOu1hVuQfcp3jYiOk1sHswxcP0JnhrcLxbPEx2zAzQguelwwwGUBHDvFc6TG+Y54TnBKXDvNEJLD7bLB1CSL0ShJcLBcODbmViDdEpHUZeRLDamIguY9SIsXpP/YKldE2K42VKBVDxamx6SchcV1C8hmkT+slYafHquutK98JJLF6No82S6likxStt2NOVGb10lbVR+pCgrJYOG9OZa+RNbPGwOcNl8KE9Kh9o1SaflUXxMNUSloylHhSPUjkyMpO4S4fJdQFjzOdXOkxx9B7e1o3SIVhGiw9xzhYMD5zxEeSYTekwdEtIxtqz6HJGmQWjxlNLxatxNvEesW1m+WoEOS0EkHlavnotVI2yNYvKV9fpiDuf1V35arRNmgiQGVW+ugBJ5yzILcWrzIxrJ7vOsnjYK70ixdcvyoedNykYk2KrfJiuxZniDwHKhxkoQwY4lSwe5htEG6B5YsXDBNSQ3KjnKx7mDsJEEHFn8RDKEhfX+zWUDC/2k92EYXnFw9C9XWNx72FXM2psHL0TkSUpXo0hdhXYqOrlqzFExaSB73X5GibtxDM8qvLVtdU29noprXw1zuPWEZkYKV9d0oYBDYT4ytcY0js48QkXDztyXj/NBrzyYesex97Lx10+TDli8dxz1MqHCaR9L4BvtHiYOWuYXc+tiofJu7wnYB9C8TCNs1H4AiCLh/CayKWZvF/J8Go2ZKEOZYqHMdX63jxqwoLdVzmPZdcCDhxNREzX7nuovmen+WAXJ3LzRpdSrd3La/xDYDSw0jzxxMHhCZCmGqBKNXBYrwKFqAYO4FWg+tTAobp68Y3BSpMsF+aBEJ36539af1u24fyKXzfGiNz+87Y0BR64t1bEiL39l209cyqrC46JEXf7r5g+iVpdWdaadv4Kv/vh+gEIzk4akZ24QbYKAHMagOM0cA6tAqGbBs6WVSBe08B5sXrxNZ7g8/aZKKnCNJ33RI89imhUc60b4wjb8ChKo4UsxhG2bR0lDJTqGEfbZICri4aqxTH6AGRBJ019TtyMVgW4Hw0wPho4YlWBw1QVODZVgQZHA7SNnnmipy44E8RXAEYwjrHt+Nw1dmQZx9g3D4pNi7uNY+z267VaQwzjeJvCvJcL3aCO8Xtnae3eOPcHKi/hPYLIjKWJ98flHutheRPJsTr2HK6Xpd8+yHi4ysOyvTMAh+Xe7LwH2QdJsCfqH5e7wG3r7tdCb5szQ3Bc7sAWyK4yFRpmDI7LXYFtDWetnUnR4DCCX59yW5C1m6+mvQ3p22tbedjb3rMtNWRu721BGK5E9WEaottnW9W3La/etDjk8xcO2E5bSqq1E+MEe5mndsw3yDjBxr2AbK9xnnGyTfBAverZN8bKt/MXGSCvleG3UfKaGGWctGDBFfIyVo1T3JWgbSEmY+MUmQYwLRJI2TjdtjtZEHbBnoG6bcF6nzoPnYGKrZ0lWP1ehZFKfa9fqIu2GanUbQV5vTTPQMWOw8hZTrploGI/DpNk3idkoGJvMBvpjeYaqNQvBsFcQd04xS4k55ctDGWckmu4bHQPsnG6zeeLLvdQ7wzV18P4Rui3+tOfh+m39NOv/zy60iglZaFJCtOR9NZTiX3rWcTGTSpZHHHYOMywcWxhAyaK7ISrXojYVNm6+phUt3jaVzp5Vd7oeew1DTZqTD0+WNSmwabiMi0XMWqabd7gu5cvz7Vr1HLAgHUg8RsGLmIPThvBx+IB6i74f4Smg2GzA9CIcJPUpvCT1Lzwk9TS8JPU6PCT2/7w80WAzbNyYFZQFJuLU2LswGbusbM1YheS8p9g4zJSd5Xp6UJS/jNsOfnUzK02upCU/6JTAvGaTFa3gdCfSy0dltUuzFR3O2FZCLWjR1R/8K1fdfcdpeNyn/tM+y6Xc6S2nhG+LVdlAxos8KE27RbwMy7yEMeT/x/sVvdQzEvNZWXyfpBVRS5zudXfXEi4c5p1ud8fVaZfcj7FRGjj5AGWqaSEzbTkB4zKfMNBDdPgaMakE1yoxSQ4mWnrH8HxH3A0brRMNQulYdOPtumWRkfN7qiMmhdq5X2gUdl3umZbnvTUze+jcTGaL7RMNY2Uhs1F23Sr0THT0lMZNW/Uxi1EY9K00zXb/KGnbuZj4VJoFVqmmmZKw2aibbrpRcdMy4FKaZ+olfeNRmW/6ardCz1zyfHYcGlomWmZakVKw+aetumWnY6ZpqIyan5SG7cIjUkr0zXb4vTMJV0eg1OwJ1qmWo6Uhk1CW/V+01Gz71RK+0itvJVGZX/pmm11euaSz48DLgNaBlqq9o/SsAlpm/7AdNTsicqo6UCtvJnGpLnRNdu40DOXvD+OuIxo+dAy1bRRGjZ/aZtuVTpmmp5URo2N2rj5RWPScqerdhs9c8n6uMBlgZYzLVPNM6Vh00rbdEvSMdO4Uxk13aiNW5RGZT/oqt0veuaS/HHCacJutEw13ygNmzraqveZjpnmjrb7qnQfal+ZjbgIq3nRl0JvughfsnH982M/GyzshB375HUPodPtvuqiFbNZufAMSuPnIFALlw3s7MWL75GrN9p9wbtmxsrayR/jv3i76v8+qgBoS3tvXFqzt0RYc9mZX5rq7nk9XeNh5/LQ8MjN2+ZIc5SF5nWvLz/hqC+8JneJSH3htbhLUOoLr815G5e6iiM+NPX9k49OXZmsAaobJRAco/r2Nz5Mdd0SNlJ1FUN0sOr7Jx+vuvKcCQCArH7B78czFgAAtfqt/EmpwNWlYJ5kXd0sFELB9sky780aGLUSTsC6LplgI12Z96IN9MNxse5fMsGWqjLrvRtYnbcr2/a/ZxEAAJx1VUlMQ+vbF018TuuLNtQkS2tdJQVb2bqffHDrytiKb121A9Phun/P1iTXVUoQda77Ge+hrquW4Ztd9+98vutqqARryuuqcNiq1/3kA19XRjLs6z36FHvrAh5+5dNu8XyNDbFsfssUu//T5l/EKVuVcwO2urnX98DPx+Mw7Bu62GDJi1OVxea4voxnmzeqO13w4LOYOW463lv1itOOPgP002/58fZrZdzLD23Qw0IdpUlnaqGvh8IXdvpVEfyxV67dNeJxcYpuO5fbNiIc8jS+W+m4WEy1n0Cex0+3CpXExNwFeRnPVk21BFehL0dcF2dutQnixTmU6Ohf33EoWsVIjQmlxN4Rb+MvrZ6HsDb07CBu49c2JKiRdQl2m+P+fCde3+ElvvSTLqqada4P9cmbGZJjfyha/PYrMl6CKsdoYxdlVJ1xVk+OOM87jlShy91E+vkz+ThSneJS7a3txpHey0frGrz7gKR6AyHaFZINJNXiedDyyr2ApCrvLFtp4xWQVAM3PWoCD6AkCiVDRNYFJNWYe2/vxXUCSRXCeeu6CB+OVFF4at8+fAck00CZ3FPdBpKsZPNjCQgoMT9OJ9WKYql5MRMgUiq6STjiK4WRKtk1N7i9KRyrEm2BknvCcKxq9sLjFeApjvUI/g4N3SiALAz5KJ/zBJBVTSnpyTmvIdl09OEQV7gCWXWg7eWcqhKQVWc7xamzkoCsqq+hm6/7EZBVLTjfnMkw4FhVGw1PwrILx6o1tuFS8MJwrBplm7XZBw5l5k1nVaH3RZ6UGYiV3kPfgqSXAGNV5mNEMmtnnKimDgLIO4LGieplMBt0HDhO9HgtK4I9ZQSK6jRL1QrgLlBUB99VajwSB4pqW4cYTwsLUFQ75VoIqp8hxbTPQnX89oCiWkK9djEYAhTV5zxeq5QwOFGlrWjKDYuLE9V2YQHB4lucqJYgv3gUEoeUef4i00UV6U9bwNETJUbYSGLgCokT01BuJBw8wKlqEXRALQUDTlXpMfm+eCuAU72yyiM9MgigqsJY+ZtljoGqqEv0y7xuoKqi4Sa/xakCqmqkzbIm9i5QVbWsWVkR04GqqlUC7okpA1TV9PZ3FX5cOFV9c94Ar/gYp6qpYFBPJExwagumD1KuOIF6MIxvuqqa3R1G6h6DVMliMUPvoRtMVZ3LuKJJXcpcgmrIE8PLRPLKqF5E06Hw8qvMs6tLT2U+ujqqdNCtc50dq6OqtQly65tTHdUFUmFO99LqqJamSAyCKlZHtRnPQdU2ujqqgdmGUijO6qj66mEdwQypjG1Ovu4zHa+MqsKfickwZHVMhZSDe8y3Zc7Gr3/w4W3LOeAPdjSroQT34Jac4LgqW2OrY9Y3mlb0syyJA1acKyQeVfyvlqRm2lyoonS3X262/FaOdP8m/miNMcFaZWqsPMTiNMVOZqWn/TGjEf3461EA2iPC2Ixx6w2mxgQc/1IpM1QuMUsxSRWt3FQGWmWmLQnULeUmNac7cJOw27nJ2bQkk6EXj9DPUvjv/3MSLCChpK2GlOP9JwUtHxfnaLYL5opRDH0cb2C5RmFFzR6CTWNpGT7YFZyZ8YMWQZq+rIVRnvXATyOlYD0sfNzQFASiHiw69HbjMWmVip9fNjJvMjGVGcRYaOwIduONLjEGMLXgLXe+/ruRkTaWw7UO09r+7Qr+YWYqb22cn4j7CW9NkPLafBBydrKqpy3qn6xlUhifOYLbCZhoqWi3MhYRlaFDEcYPWdOhNZVo1NYOqeGTafA+haokRL1YUzOL9OhDoB1Sc25uSrgGqeIQ9ewuDrA6IZI0QyrfubcJttxWJRFmZFR3IoOOs8uY4VOXVaqR6S6ChAdpuYW5duN62DNXa6vjvDFgSEzzeZFBzY6UcPJaaqaZELTL3GvJ7NLUMTr1TKFzqNZOnpaHrhxO+P1quVQZLtJTrrWv0zJ+CUT7xxu7uvHi5PL4+B+f9kvMkV532HsZ5en3QRI6OC7S7i721A12X0bxwwAp0JK91Hg4Mf0kCah/ssskDcK+DJz4YYHUznsQ9HPuwfRjBdQ/2nVZtW6ITjjRwwSZzhOF5+sxtIx3QWifuXLFrEmfZBxVk/jcrJqveVZPQAbS/EUSOuBWKPfvXK7mJM79lwkuYBs9vFQZfHrgjVb/9J3YCPcAeYD4Wj7tG/T/25DwwQauap/zkRyjLE3gmpHX29LrZo52KSnnpupErhy8z3vLjYM/D8ip8Dthl0thlzv32Z+I3Deages9iykSYMSulL6PRG4bGHqNaa2AJu17mNw1ULWmVwW0rMtev4ncNL5qvhY7BeBrT+eF3yh9vv77UnNfT5agVdTB6Su5zyIidU4AZwb3kaDhYgblD4P5U99s1myZmamUNRVayWQMP9Ep+jcY3ZzWOrDkcljA+InD55rHqk8HFX168GlOpZ9GlpqubpyuzdwQFo42gjr7hmutS+JmnrEXH/mOOfqK8aQ60O7X7czAMxbKslTc/Dd2i/a/J35T5FEhT3wYg81hrGPDjfcUfSCbptmgT+ixNS+vb76RdD2Bc5WOdqjUlNrbnkLS/isOnAmJsvXduw0vfEI6jnk7P/NdgXHEw+hxbNVpNs5SY3MwZpi7fxh6joTHw+bpRqm/AUfVJx6KGp2UnWyXjwW+Ep6gnWtGAd/UgNt3Pltqb45JaQfllfHYBoKLUyr1gxZ8954KpMdLKeZsQ1kHGzIT2shEb91VFyEaHyVa8NKTN0IRXpxZ6XS64oocydGn8kYlOO4mNcjUO2In/Gx01cDUlCARN/6L0rTeg9CQccdR0jwUf32Xtr3OazHDjR4AwB3Mc3d+ftS98SJMQNe0DkdxrzWkoO2ccKTKWeOG8rIMRzsDFm2uwCsrJMVdRzVw8mNGknZIiO4OVhGQIh/wRdS4bAIp8vReL4DoHZAi8y0CUFHkBFLkRBq8jpwLIEV2SF6GtCEAKfJoT98AzDCQIs/JiNBu1+EocqNrYPELBBxFxtObr9KqFUex8fXpcnX4GaAL2Qm1vl6smzoAgDl3iwq7m1LfJhiO48oVMdRZ5cDxfsrTfueBOsc7A3cnAB4vGJLjxlLwCSdBQbL2Siqz64QEkCOrzNsEjVIBcuR7gm8Re8eAHPkFk72nJ4hAjgxusg+R0QDIkaugG3bvpQE5MpeLgWG9e0CObHYxL2B7EciJ3XAtzfUljiO/p477xvQKx7FLBzrBj7gM8IXsvNlfL9ZNHQDAnLulDWPY7dsenMQNgbBHinyKE1WdhTt/C1M42SWipxOOzBEpce0NLpiYriPFnANGTwniASWy9ayNEjkHUCJ37LNAi9AESmQ/fMdQZElAiWyLozIedRVQIusu1kdl4AWUyOKzzmGxq0CJLDnSqEy4gpPIs4uwqoOiOIksDuQt7q8aKKkt9LIGxM4UuUidS/HrxbqpAwCYc7eonOoYN0tROI2bgMggs5nCqSrtxyWC3No43RnsUtODxHyF1Ljlcn6Oz7WRqg13ZVubIRaokeEQl09rywE18hK3hXtpG1Ajc110ZZ+/BmrkbJpx8REToEbectpY1lCAauDHQuMpIkCNrNN0lqHvpeWefOK/4RdTyukW53GkaqsLGPeYtKxYn/SqaDXjEdWeYcX4CZJWxwMuXXq1aa4Xu65/0wcAcKJ57l7fj+rgqPWBoqxMXNx7E1HBNZV52neIZh/oSyqzMzzsl57JMlyhuOaabW/zOCqkzQQarPYwrU7kixqXcXad6kR+okSVJ6+yOpEjwkyvc92rExlFe6E441F1UqNzoqGrbHUiK2u64aKiqxN5wJkk33vr1U22buTRcitXEx8+fcfjpJewQiKc8pYfWS1/jV/DVyaSDBY+/bjMxWxpqa4Vu2J/4wQAcOp4Ps6XuFWXXjhG7kT9+Y0if/2aqPnTZdk5mUx4A+/hG82Cl3FuM61O5SxSPj2bo/bhLhjLy8Ehb8yTx3Fbaby3GudM1COe9vAfyPDa+xPGqNN10uPLBlSVx6NVm6MXtboNy469MrBvRC9O0QpUvvQYZG1bBJnx3Sq0FHgbGQzkMn66zcLogAOnkIfxbPUS0Ie81NTkx8Pe3u+0BrXYOl3j6J+eDlErncrFA6HFO+J5/OWJTZ7nRDvzDfEyfm0zTJShlSh85uP3Ac/zGvry7ux4SqsFtWiv3zhShfIhM9CrwJGq6C4ctTczjvRuzO1sBLmBpDqvlD0h4gGQVEeVuU8qUYGkessk2TH4HEiqUuwvd14LAkmV97t3F4/GgaQqpzybRbALSKpnzRkvCYdwpArXyZ/53DqOVF89jIrlw0LQl/bk2DAtbSIuDx7n/3M9vad1FcbguhuObdGy2OReOo5VzYrcI5bEcGz4FBJHlEmQbBpKVJMbZkBWzRo6cvXqArJqPUiJzKpEIKtOgCup2tsF8h69rnzgWFIAsur20yHSkVggqyL6YfqMkQHZFMrpVM4XOFZtz4c6QE6L43a6GV8FH8G6PHjcu0+jiKhFUnnjVsOJajpyYtEiC05Uo8+ndi8scKJnu0PHyHoHKKq6SCLurWcDRbVPgacp2QEppjXMi7abDBRVMvfwLLlAoKjCJmcsu3MDiuoA8kVQHhhSTAUUnR3sCCeq18a2jexBOFE9Z34OjDKFk3ZFYB4Eq4QuD+qB/xCq/db4QPpgcKpqg6u7yMqFU9UEt3vUUQBO9dCLfV5X6QFVtZi7z12VH1BVcRWgEz9+DlTVjA069KNcoD4W6xcVmcm2QFUNvW6iKz8Eqirsa+JlrWSgqrwyesJTD9lm7uRAdyOh141BxGEbCGtvja8pd+HWwTYexN6uTvA964DHdpnwvGgfTJVniezECd11Vraphmfi8rI9rYxqbCW4oxncyujZpvcet3trdWzjhlA6O1d1VPe9XKDeV1Id20piiOd2Vh1VzgxrOw/x6qiWKBUSg8FWZ/+J6A73oVVHtT1lHajLsbLTNdVaWJ0Er63KqOISwbiKaq5Mu+N5bastylEp8fd63+KsAFhi28JczjzzSu5KT3WUecY4oC+sn043jE0Pw/wJd2OcL5v7soXvX9cHBMuHuZyayQhQxOBD0yYTol4PRolK0ht5ViBAsxbGoJg6pzCg26oFZC6R6nkwl2v15p/PjpeLw+Kt3mK0WeKe0NsccochQ5JNcJYRlaD1Qs12YY2ujf1rqmu5WQv2PCIq1utl/rKXEfZ860zoq+fHzXN30bWPrcXCWEiuzKEyE9pfdb6skW35TZ8fzkHr+adrR4ma8VypkPxDhtofL/y5SqUw1elLPiU0EfSGYJo+wK8/rWio8weQy7cvm+6R9MqJ9NFrl69MgPLxfexuP3y+/56bx2ni5MicvPXo4hk0Slb2k5qfn2zqUZgj6gwt1lKirTkr7zeq30I3K+7X3sWIqSeqGUAnmqycWH9rYfv1V3r99VOhSWYBzIHlW8JT4J0b/eVPbFbGHz0KI2aGq9pz5nShn7ZrtNnm9ZdeZcRUj2Bkr9taSv3zQpCsbrP9/b1XGXGF2XJmQMbNTBL9n/QLfrJh4ZLKKbyTwP71YcUPX08gyBKC0NeHBYasu5W4ZgjyXhlWCjxRth3AIlSvDysr5bo0PcIIeH3YuNPbNjZgCUEgD0P8bPb2UmawnP8zOdhE/MwBDXNZcBKEWJzfSddhU6/HRbrqd5s5djnFOArju3SPGwa/llYRrv8/clpV+cmpKQwBUgJ8vjwwPGQQ4xKnLj/IYsnkf/tRoRcA9YJHvQCpFxzqhTkV6lIuDvaxKRhlfix9+ROMTGACTB4TZHKY5lR3FyjkaGGlhFiO3ztCj+i88wiGyuneSrdu7cP1OnYeYgtVoSmD77ROdW+ndsgmCYpSypM2g9qPdDKkYLzYc55UD6jwA0yYab5s8a9MkUUiPRnuikxFFHn8m+TJBr9KmL+Ka7C4GBa0GIAyebzA/eqaXLulkjrVdGF3Pihkj1xFjEGhknCBPEy+CHrM9AOcny9N9uBslym9YgHIBRWzF8O8H1NwzfHilRYWLIaUd9G7eGJmxhcIf9gv3iSL2PITgFPPQIA+mHmzZZ8Vshvr0EWgPXrE2Ju+jWyb4Y2JvSfdr8cH6iJV/PPS+7JvZvtNbp3fmczpAHVpB1IC3gYJupDQTxLOj4Nt6gB93J/H2MlVDATFAn4Cwmv1DfiaR/rMCKcFinvfMaCrB1FCu5GwrUbC9CToxsLyIDAS+EvCBUjol8XnIZ/LwRCYr/7zZRS16z9HGdogzJMD+eoAfUILuCEQMAl5kaA7Cnw+poTvYIF7EDILPASESIJ0LOAIQuJADxZQm5Q5wE0JqMWQ0DUJdaBQ3tbHAi4BoZLQCAndkjADB/1WApoxBOTPg3gV7dhI6E9jQc8ThI8FCoICRAGhgN03kSvMIghzs/nFTt5vjs+lpQbxi4G2eZscBfAUOUskPBIBgFWW/EOQrrzXZFA7VuZsJgGCsnjpZbQB4Hw+Jw2aQ0goFwmNGsMcZwh9clYC6uYggWcSCiBBBhJkJIEXEgok4dph4G9lMoFZtA9ChPhBAmVnR4JMLPSAQVQC+nSLgV5hTuFtyy18BoQThNlYQF84oIcW0ERnBwIOCfhjgcqgwEEQBPQURehj2EigloSLszBTQyG7+SLTZQJZEc+hbTef9eQ9Z18JBhrElsJ1w2zxbZfpGYBif0K/k9gTaF4NxMKCzGeHQkGhotAIdr9OT2LVtdGfWEPwRgW4EBj4l1e8zCNf3C5+po4PrXX48kadSMwgeABU1AVVQM+1UO08XrnnnzU5zqPSoeYgBMEbiatA6DdVuoCJR0eUsMp3I4eF5v5q4P3MepqMlRUHw7J+/hVi1UgXf7DJtRmW/4jIyz+anW+y/7DF+Zkvm8bU+ZcQ6JvrSss0UAQKk5+btXPyD1KwT+8Hxydve2UHpXtO+yefQ/8MQY5jx/BMiM0eaJJeUwP5ABbThOPTBzN8oRUr5rkNNcbgEWWAS3z6JUb19Wf9opKSyXvSydfkB8iKZzYJSRFZYr/8D1LHsfqHbyL1hWOG/dd/0f5Y+Q2JwzVCz7UTv+95XwvadAb/U4hIEasCAU0fcxypfou6r5HaUG2wjwV6CVu/Ucu/IgFGsf8iLZ0c0hCgEcX1cuuy+8bwO2TEYAIUSReNFXZQ4UIVjFcidaHaQZzDC8hhccjhtee81J5aD8xEw3XFwvDrROJP+hwCmAjZxot9el57ZRWKwK/g4KDSzkxzbp5Ev5VU20u4qaKfz4jGeG4bcksRZAFnYvG3FMw2ibwaiX9YeIeUlz3Ft0lDim2b1WpxLGm+bc+SybaJw6S4fk6zTMpcq0GjUfg0bxi/JWkyYE/FUknf6J5M6l5TUJsGSymyi/8cxG+Jmnx3PKtQ0Jx0uf8lsLWgTHveW4+65IvemFCPt8FTIa8LT4V8P3kq5M+Pp0J+mzwV8vjhuTDDm028qUcf55lQj7HjmVCPuuKZUI8b4PWNHynx5H5UfKjVY135s2/81I3H9qPjDZzfFn+q2N789DwV8rrxVHjc8g0uaxksD+Xv/dVf5S/AUyHfL54K+Tx4jeMHAW2joRtGCu3/FX+uS8YXh3yefDMq5OXLM6EefYKnQr4hnovtnQFnFTj5vHgq5HXnqZDnjmdCPfoOngn1GEeeC5+XrtC/PPc8FfI481TI88BzYYaYVcTkpeOpkNeDp0IeF54LM9RsoqYetcAzoR7jxjOhHrXIUyHfNU+FfB08FfLl5JlQjxvhqZDvlqdCfgaeCvl+80yoRzPyTKjH+eO1jZ9P/YJ2ut1ifmL2K5rpf3vz28dTIU8Bz4UZoE2wC2gGZBfIDNgusE8l98epP+xCFxt6A/QsZoY9Y/87sul/oHncxS7Y9Xvx8i9p4NyEdAzCL6Ft3oe2eb7sg/vj2bq4mOfw9uHNEewjmGM1+Ip/GRHHJuPiIT1uH3yfTeMN/zIrzk3Ix+RhBmUVykuQ3lsh/cX7ErrzBnSHe6ket7T9t/WoXHwyKiRLvlGeiu3t4Qdly8DJd8+XiapH3fBMqMc881TIF8BTIS8Dz4UZYlYRk+eFp0K+QJ4K+WvnqZDnladCvjFe2/i/B3RqOzYuNdZjyviHCnmZeCrke+C5MEPMKmLyn+apkKc7T4U8bzwT6tFneCbMgEYTWQZKnnK+VMhTwTOhHk3IM+E1oA9ykruMzwyHTRzq0UR84yJmwFaB2zz++MZFM4Mko2jUDMnUCf8C2w7NRsdCs7zM/M5FzFDsoly8M1S7qGZodtHM0O2ixwzWKqz8xflWRZOfiQ8XMUO2i2yGYhVFvmfep6Ft4KXDPNU6OooV8rPy2Dfw8nMeax8dV+D8JfhXFc6bbzsPKiDfCw99Ay+C6bH20RHw5mfjX/sGXkrVC+xzkyP/PUiFwAkEeuzE9b+v+0fwTzF4NteLH7/9Y/KZX5CL48sXm16ciOPl54YMARsRQ4K20P3ec5asIhevJ8mJOeQtZfd943kCDeRHXWkzNFSucikaWKfkNcO5rzQ9f+8V79JAG1AzCKZCFskYbK8GLZDuizux8/QSa4TsYQAW8vha4gHVjqufz+CvYbR8/vqsEw4ZGQcCjhe3RmyJb30U+Gfu2nLFLp+oS2O4R9eqqrGsLQDiQRf1y8HL/ak/PZb84M6ruirmfGAqFWETedQjrvL2kOD0kWSOIHg8ahXvU9SEYvHNjo80MLwaMB/NL0xT81cdc/h4rItA4xlLvt8uZPahlJnBcjmq1kqE5cIB1qeLzTKMpN780X0Q2EYuCuyajBd+ItKvNTWxKYe5vqf4hOu5iXycSEa8rZwtsr2L4EOVRyepXUSy0fJ5KNmmWcQ8EtFF0PbSaXQmxtiqKoF3u6aqi3uyc6syxlZxE52WfzHLjzOFt2DSNXC7iQnPT8qY8SeUzdMYsEUo3nhX+NyTRDTm3Jv9NwB9On8dr8LyWp6mDGFE3uob8Xi7/ICPWc9wMOPSe/F1P/x5i9yBgbYYsg/J8jh680f3QWDbyMcBZVtt64Hwxrz5w8cULgsUi2l1fkeedg1vE+RD+fT5g9es9IXLPJbLQ0ths9Q2MED6XQUfqn2fKZCv++HPM4GS9SU4fLrCNjAU+t780VHnExWvqYoiTMRgypijlRPhF3yz4eOknEZnYVOLBU0RJK/J4TsvyB292fGhFcjClnGz01Hd+ijLaxIsnhQi85pAhc3DimFTuE0SMS29+cMH8gVKqd6rdnraRohWcF5v/tgo2KXInfWyFTkcggQM4vdN4g6etXpxM4yExABsKaDFSLIUvtvrkfGgBr6gONyrxMU0WIv5f0TY6+iGTPuVw2NIwOox+FzpXDSqJGYn1qJkJbAPW8EzhqUf0xeztfd81iN01oOgc3evzO1g1r81c3jL50y82NgKlDF8HoUX9zPynczeHnewrJvj6GxvTZ3P0VDCoeBcC2AMLpulPescrsXZzdabXTwlzz9snTb+0Xa1iM8nii2rvrLkAw1X7E+Ckdj1X5nqQFA9Fua8pywj5sLxfcsaH//4z/XHbwr/9lEfviXNmvj8iJfRi2kxSqUSeQFSWkWhdE8S9NelrLBdDp7TQ8j3vHJqLCPhzIZ8S+Mf8UhxEobLwSDYy28PYtbgZ3xO5gf5Tw6v1sjBxZiAyOd3YuCdtJi+ANju8NyT8+5lhdC57jNAjiSmHF0BRg4r5BTBrXe6eKUK/8lhVDnXobsjEUwd3t8ULf/mcE8uy+R4pHgIw2eFGldko4eFYvOZIodk61m85bBHMdL0iW3ky8WzIdA2puVgPjvl81COR7fujzEoV0yhOsBEyLLpFFSKc7gsx+GW31w8l/9C8HwyCPELcC4InotYq2HiQCKpFJA9Ss2HoSSwwstRlLI03pxp1P3XyRqur0unOCgnl2En0+uxQPwFrRqxb247hc9lMK/oBFvLni5eqY4DFCmmpGLHeHoV00RGy4CvOdjXLH/EH+GDOPnr+nPJa79UpG+Wh4GlWVPav8RHLEXCp+zUdwMvVfjvHDdK7aejhS7MtUYLZdKHXA2Cz83GYJVRdqEwCEvAUa166r5trm/jbjyLHgQHBoGEJgxBBBNC2DdXw34nBtJ3CoVCi4ROvkWT4DgXYYO5fj05l0ZD0UiSLEWqtGTAGVCQHrJFRz9zmNdzOFPncJIfj/wBBEMwelz6O2mFJPAXEa5eSQ84UGihtyhtBxwR/urA9LmdNYbGcBT3AzfWM5TUJiYraPbdD6+V1FwIrUYGgi7R8ETrPMbqWS4N7WZf2DxtG6Tc4fe0kxU6jmE3C7x7ilg4ryB+W7upVtFx04xHPH1BuB1PQjCWzaA9jbav+nLrZxIEDXIamoKde4IqoNv4zkKHbpliKBEuex6/7As+PhvoDL4HH8cV7hY/h86JSC/Hzgy5liOz8doOjyImQJ91mXKd6QhhgAH6yHScWD0lPRCtrN9D8V2JfbCc+zodsOtp7Oi5Vw7CdCaWvF5yWhWRsxeEfwhidibOp2V1itJ1NLkPnQG5d0pjIBZU4B2tDTfxoC9l2X+UBoFyhUmOTNwR58XKuZ1uz6xtTq76od0J001yHkzFhKA+5iFjNIMuOfqDFvzj2o/mJjuF0FU0GdYSjhCsIuUy46xtTM6czsPhYUKQnaHaKkDWxYYQhx9KvOfgr6zlOBLp7cLlxCkoOnhB3S6qLHRsN6k75XKH6LGq/nG3lnv3JEhyV17UzXp0e6EzrMQql6bUY0PgGBYnSgjaPp481skV4p5NzD2bdu/GK+3c4FXWGw7iIV2Nz6PP1xO77hlPFkDx6PS4oR/OYr0R7eu8FHxJ2pKvIvOes7v03HywAkEhbtMzMeaJJIyyyQhcJlxkDW57Riw7ZW7/o0X7GUIXtHUMvJFevYpIh0ki6G6eC30b8zni1aa+3tX+xslsufZ8Lfz/Dl7W8snVfIvXtr8Y1OgAb11BQe2CHXoX3IU2Dat5RErMLamgOt754yFqXLLzFsFytY71KSCvFLfgJg3+9GHvAOeN7+uFrr3Om+lIwFjtqVYgaCXcpmwsldQ7vs1ys6NuazlNsIqedCT2pyy8/UQM9NcmnjPdsnkmoWxROStCD4r5eVzR5JS+YSz0L6e7vyl/J9GRDS+XSe36i3FIpJ0YVLFn1wIfO/ZEXtEYpXj0nh68L3s1S4sqImCjfMv7D9J+E0tkxtNTxceD8qZkOKl4qNv+9Wr2QWchSr08/4GssZlGcEX4R9j2W7+U2ZXz9Ec2IWh40zwz2L3kcfThgxFOokN3k1Qol2qq2x+1sAqLy4VK7CgFdkCa/vGJ85zJJ8xMxN8JfZBfBUnunpEXb80vZt8hcSKmQ35qntyKbMfRN3OY5WUn4/lFEcvF2QC+YGqyVAVNwZqUD7TEz6strIV+J/jUGcawi5tj2zdpBzH/5Ld5GLNALTu/bGRjNflOsS1pVwuUM6zj85JtlL8DoWfxgLSbSjqEy0W5+Y3ARrcb2X2sCUxemgg+u3qi59GpeWS78BaFNTn2+gZvPWACLA7L8wI0PPWG232UcTW283bcRhka4f7ez+V6nLbKbFWxGdr+bT4i/7yyoS2xOsWSpxtOQ0Al0fG5XOWU4X/gjdVwELKGVnO7HpTT/TGMJZMZr3N7Emp5F09huM4L3Uv6Q/VH6Fzy9GOD8F4SHZebVEF5o+cbSEQ5kSSCuskw9GaVNBkm6Dk62p7XXcd33WC9Eep8XqZ9FM0UysnCJYHNFFE7PatGsKodhKumb9VxsPoOpMIKMkk7Vj55aFsRymeuwvHdEcY08z5DeRUf3MklHRjHdVMHdS607+9KmfT1O3A6JUx258WZcWfwkRRn+J3wUeFHMHGCLfrBUpL327mdIuTOxPUfw9jPsiiKPZb+tibKczJtJ45FV3XsmorIzb2dzr2l3egpY9gIizQRPLz05ixI81HorJy582Eb5aUHPu5CLZrUI8yUbZSdg3+5YHuQDJonZQkKlgQ2T4basbNqoFsuYqGG4fX3PVnW7xfaehoEPAH6ePepD+L2CsPQtN3JrbZ5Z5L0+sBywjmcn2o5cJZqeoYEiuw0MqQ+oTzCECStHRxq2CcgLqBQskOY8+9x2e8TZtUKDeWobrt/Nru5ip4lCwtweNdnJ8r6e0BpvsPwsGWMzp8pK3rfQoYPxqDYERwrsnG5Cz74DjqQUhy68rr52s8deTDkR5y3fSYNMlSjZtIJJsAahFkcUv8c/PjpRjPbAM2n/hCvZa94wjWMyzxniCgUOl8lzWLSDKRxn+S9EN35uTRwqKmOB4mxrfEpCOpvvi8T2uZXShNh/DqvfV2nkI/zEveyoW2l3cR7vvNxIV1Zru1UraQBU544TfZ25E+9gbeSRFA3j5F+DF9JdYVKvFP4qt4TSax5w0yguslth5za9m4HdrOjYC1sk+Cc3pYTAoYdXnGf9LzUuucTofRVkee4UImtXTAlCIqIWbEz+YS7cYpSEIcBePTgvt/megScnztrLQZw7u4zT9N7gql/ak/QUzGRLVfExCjfq1vEQ7vZFi9K2yl2Jv/z8hgbCQmT0mUm4S3564q50mBnAKgV+nkmbV5Og6ldCNAkNrx+KUbod14K7mkr8A4gP8eaqJZugzbf1VSzXicBINm43FVovD/TAe8KCLq7GP1eYaKflFaqSWMLKH9Y+fYWworD3TlMkVDSERy/B3WgmwN3Rj+OYCnF+vjlEV3ugF3mfvi1iC+lyBzHX5nWxsgiA1sa8eXNa5BPxNFj63MGz/ss7bxFz1CFLBqJR+5PMUXlglrMeO+zTf6DCG2gejqm4HPj6F7E9J6TD4atzA2Z9RXlYCZCDECs6Aik7ewBNVWJYgBYdthoWErwIYBXYhhtGV0UPTvxTzX04WxFkhqFAoUa6UoWMnqz2l1wSfeQyoRk/Y/O1uPiQro2hd1pom5Hijvf25+MybMnUp3kPN0vWvFLcF8+v5ReqV/+E5PfdGFui7tdxv4iWdQrPsNhJJI3xxCITTffR2/NwTKnmtuOV2Pe3qKDL1ywPjoHPfiaNIi7slU10pV3T6q4+No+/D6w32SJwT3D+yjPkYOoV7O4nD6VXm+CXv5oiDsCyAUcUohEr3MjN1Le/ozeAOqhTo2enXBIXRiuPpho/sdIu3P3z+Y7Lyj5bcvjyL4REj/DWH1xWsPnNby+hdcKWlW3EigtaOkrwwQr2D5nW6cQ80YMdgahzOG2fYfoix2iV11CxHn/+dAkcFxmEWM6S81Jitz4RsN4XmXo4eSNzH6MMHXqVeL9opqXwbLq8lLqH10L9D/+vMHsFh6ojGQFv4P/mrz3knQ4ssoQyvuLH9/TkP5x87+xaOTFsH+qUdrL6WX+wvX5YLbFf27vcSlXwZX96pL6PAzTqSYQPGbi0zRNq8SFOGBt56S5rXmdQadrqTd+PppqenYeNfJmD6/SLJ57iEAbq0Zx9rbBIUo/qKEu43TK/iRu6IXIzj3r3u2FNNCz2AaHZeTCptCpR35OmnJ++xGvzUiJfzEX9l33ftzZ4INaYy+ib7EhaJ5nqbvqqQ6L88zjhYdpueKsx2EvyM+eGU1bNPu71dYgzt4x7PaXC9rjPQtxg6uaKO9E9nnczFK/+r0WOnnveWCdjA1+UKOyTergmX2G3WJynHtN53PXJtuZJ5dd8iXa78nVglPG/JWfqWposxDb/wA1zeUrOe1D9Vw2EhMYZ1YM9IbFVS+K3xlU1bLn9rU8r33crFZZtF3koTN0DuVneK0SkUl5+hV/sUBxRZIsmT8UNBexemFVqwaf6L9hm0vZqNfcmzTEFdOkrkYMZcIiJ/1Dw4Ry4TEJ8Xy9YwnkY+/iVj/D2tMJyZi/DflQVE9phhWSMbRdslgBrsjj3CGPnxeeG3eA24UkkO6N7l0iI96Ybhr9hcUvaObmiZG3CxoombTjkugAKnfeuFNvvLg3+s9z23CHYri6MyfWhM4y35Q8YnTNaltmPlHwxyNbYuBt7OLuu0ln670q/zjmx+gYCQfilWsPJpgr39kbtKnQhVKEZ/yjhT+sDotpCEnXm+J/scoRme2bpLG8ApId2QSi8Ms+BOjIdQjXcrAZUixH2A2ZxEaYEIw44KsvGYmLXNVBznWmT4nZSVt8HRdCLHKFi0V15utiAyjCVMkEJb4Wj+iIXG8nYYnLv52QiKCfFi0AQoTxMxmweWLEIYyi/E4fWvjlSQ8Qhb5JCFBCWFJJACFLOkRpJ7zOY2QgzKsUIBAm1qT//oDbSZZcmPR3o3fg/WCRTTtQVF0uAvtYwGuTGG3MlRSgD3ZcGsbHCndCwlK2vC4rPh+svBSLD5beRMS912MfzN5ZhIGUmuZHWY1XTNJe+u0AIDd1optcG3MPdmUeWQ82pue47avYrrLIGh5WsBO/GSXlGkuhbtQKXu5GaTDlWG3BynSSRb34ZJIoSNLhYJN6zn8X9oYqPk4IQ5WbfisOFC5tyYhMlTST3Ch2SsB9oxLfYTlMTlTgCdyOhW9e3ufoqq7h23HbHP5toPaaq/hbfD6A34GQ3iHboMO7PkkdHlpRqPyYY7w9ghQEAXhENYbKHhz2oSWM8EGcxsoWjSqX5linpliUzsMJ7NxXIS8Gj7D1+CFbR5hwOLTLswPbAWHTxwBb44KI6WPVxt0lEXAa8NHS2DF4hhlaoiEF2UIgUrX84Rj8duvKH6OdE4UGVuoKFJIKUSm28b6eIRSXGZfa9w2DUu6WMfQtbnAA+I+gscz35rf46+ete8lALIhncJ5hNITZ6lHR2jS9gGUnKDtNjVMtwugQwg+tCdgPDoQYDzLtKxgPCHe0eXlcn8CMNE+aijpdISGB8ZhL44NUezh9sARkNB6rCqRS9YBx/31kb9/xPVwphDseq9axOTzRQ4egitjzEWWv6qKE0EqiGpfuCYTamM57S8U7R9F9qOomja+i5GLpwU1JOcxXBpodbiEsQnoKpfXiE2m+xvpsKvu5ffAdWLjO7AEJ5q7bhNzUoCTa7DtYb+5BvN7gNO1VxhL0eZnl6/vEWnH4x05/g9QSEzLUgLG21R7IhwQW+rCsgyzG5w0NYiq4K+tJuW2ftcc/Nvsbq1vGJyQOEOvn1hRJQS3E4D0YiATEEwNuhZoQNz4MVmM9kV13wFYnnii5YlDad7hVNUO/FVd40MIFkps2zD6MIIzwFE3Ahv1DrL1NFoWFeDtAMVg4CIwMlmr9vgROZ61Bz3Gz7aiiCRfo3YaVc1zwnVaRHyYl2lgnqJsAEivRxnYTkFiJNrabgcRKtNHUpuZpLFKVfb3H8Lqm6LuNcKdye5N2yJeU+DcCtB1sJlyub56hROJBg00vlQMvJkuIIqTF7QqD15qnxBF9HoXtoFRe/TMegkgXIw4WmLdW3SACDchtfafitfMrOAoB64eWq0aQLLBuFcwXCzUMTotlRxSgMO9NI9zt7FMNuOd6kf+zASYnoOdqu7vQIrESbWy3AImVaGO7NZBYiTa22wCJlWhjuy2QWIk2ttsBiZVoY3lHB9dklGJfbtMF8kOBSVJ7szC18gThqNVOT7q1MG8tDj1xZcN+tYjPEtQKbAW8fix+ctUxJf3X2KnBJ0D9+LmPBs2Cjz/Ms76NLDFpQ65RY/GL4J33N7Yb6W30ToYPz8UT6K3AyA+8rcsQToglEhS0PR2zbraoYbavMGQqEBGo3B8AY9DPPFAQL+H6Os83ME8oR3mY7NGUPnH8zufn25SBzenY8w0XEINfp0aYFq1QyDbZzd9j1woLEBonEB55CACi6toVUtrRg54mavrHh/aaWXUGHH7BLoBMB/utFqpwb8t5N5oa+N8XEgdXFeHJQ5G3TVMxJuI3ACn5UhtBMBKZh2cU1isAPlozu+DViNeu4WcsOyoeBcVA3Px1pAXw4NKOWLfOldq6pi4PQleCSO/SA1FHkq+e5pIfxMu6qnXtlmGnEWPgyeR26hh5ewOXmK0JANQOGtgBozNxxGVjGYpFT37KfwJzvOUESorpc4Drrba52ZjtaV9Br9dLbtLFT/JRSSIUgV7AKvuZ9ISIHGlAw5xlb2ZBnDBlHMpCFzT+Ha93jWhdyOWp6nW4V1jvNbpNIL64rTEEejRDs0TCGxDtksb0QRLiLvoQyLvtPeMe1WUfU+mAhvTGLi6kF7sBucWenLEC21tPSWHkj9jhDhOhP8mqHmYf2gw+wnA4mBiUfTtNrh2Dw1K/1Ka7mjRG6bIeCYj7474webPtE/9JbcG3G05yBgzlzWcH8+FLvQU6aKw33kqjSTlM5lnXBgHx0NPE19ZPAMQtBB8HhY/lJxclAIQ4cqDClYRdp1ZPTHIpPeMOLEEUuW4ASytYlWZ2pBXQ454Bzr0ueJPEolKYKHiotnYXX3VhaHl+pEp53vC6ZhrI7zmAvV9btSY2Ut5Yc2CjWzYePfStYJSB6lPiHcDssU7YrPdrEbqK9QNSfNzehDbMUF/OXQYB78bmQxxgMYVgFQ1/CPqp7thwRLYhsKzZrBc0QKIPwsKQ8ZLZdwHywLQABOJQoLcYmbi3twDtUICgh/lbwNgzk+3DZmkI5HgjbdmxUTdmToGC8TIf8G5sM+IgEfYOLCcz2JviuoNNBsx5Tt/SKhEQX7p7v7ktSeuE2Ti5ASyafqvcPuA3LzoH2fC+85IRT2IzxHgMW5rvN8bwY4t/ACbnSfz6lK0JqUktXUGXbto9nKroKhrnkl8neDM++tx3ovG7z6mHTYVbkO5u5QyUqjGHFx+iii9+sGLc2S5ULNpPbfqpNcbgUtctgJbxOMR24PTE3a927ldxbALa4MSKEvxUXhW8Lc8xDqF8HLDPh5UUXRIJBcZci9Pdhd24RnzYHZIjSahTN1xfBuc9LbO6fiIDCdTCMoGXfOC3sVm4PL4CH4oZyEZX8hwg7uwIWVrEhse5FTdRKm0Om3ZQA/gyjZ+VwXY+ZxHtQynItUNtCtVSgGBqITilt3OVyRtTzvxWqO5JIPRdWy5gjvJrvm1LigUIPtGaPg27JEoajeLSL/ggwJVSCRgXfKiScacPBgCjtc2DSihShgdTXFrkBiw1M0Tk4wLTqReTFMpSY+G48+sOysCVDBLS0sU2fTsI2Q+pyg+a1DHG3Ax+mXCZ6g0UzMHEw2Xg8Pd7U7ytP4ClZ65gAA3FGR1z/xEwLV0dMCb8Nj7KN9jgHer8ywE4ZaXi4vmzTkJFQC13elpma7oDtEuUUPgOz8N1v+hQBf4e6ErA8yKNNloo7IZA6CO4Mna99C4MuCpfrGBjaKqEVdE80SHzAqb93I1QS51PQBRaJyNZFyRrmpBZE5KGl9PwdCsFocHwbO2//ar+QlqjbSIaAKWn64QHdjCtMPcmH2GoU2pwqqqfuSv7lL6rywXW/BhItdp96GQsexaJY6cjg4n04TO1g+bTNhz31eXdwcNSBqHCo1OGTMJjjkp5LrZOIqFWYHCBoxW+PpJY6VlWeIiAI3aR5gvrZVTPrtpMkdw3RvDSRgQgPTn0iHbx/vxwCtD8UsSqSj5TERDNlisDYwjXWncAiOeM2QdLOIqnMuOlG1BaB91fIWE1u6xiiELYNmyYCoKOC4vzAPO3CsJj6Pw8o2VZ1C/d5kPsiTB/2hlE1w2bHGpvxmhrrEMH+HaEm5uqHf7rojo4JL2A+rv2r278Rq4ZRBQ1qP9rvaJwTtkqPe1/virQzHmrHOkGRCsrQ/X7YZXMkhDOBN/At3WoZy4pG3rv1uXxtCa5pnzOTHMDIE9wWNXigyTIE+oWJTv3zNZyIt13hp6y1GA9XJ6avVzkUMMZg+bnu9m5xfXriDRm1awSpmltjp995rczYXBXMLydcQoP2RODKyAIdR/mq0Xr135QzzZFiSOv8r4m23sChFQcYq4tYrmkV655Jlhk4gh590bkhg4p4phwp34Jhsg1wKqIJIGu1HBt1++OGtXJ4tH87xUEHGsdfdBmJ6ItevfbGF8lh1bJUVV2QBVSBRaW3n+IGowCrubGBw0KDTJ0JgdbFwvAhqJam5VrMKmlGlPATLj1DqwuoEp/QH42LfxpAvEU4QENLr+6c/5eG9gd+ArbBbQ3yU8QXGivEIuLIEKqITdQEtQMrRwGsFlXXQk45/aIwkMd45D10Bho5IS1IXqp7Jy9h0+YV0Y4V/riYQ/O3r8//o7fn1O4+zvu2GAJw5YH963u6XcdZGZpV4KDXokezErMQCuhgVfCg6xEBrsSO7id72b791tI9GxyWctcFedDLbRSv2bUwhmUvguvPQHpSxSVPUll+KX2wdnQSeB1lc/IKzKZQaCR10xmEJTnDes90/FZuoqJDwFrdfe/xdajLRWjoMup4NQR8LDpYn3YXVZ4XXhdqevi+/3WZVHzMinCy21w8g4E0YOLi96Ya5bcGDuy9cg9Rwfzia9/WvnPxcpntQqSkITWfVlKveOB1ez6p+5XSe1HnlPAteVv2rRNf+LTHtdZhtsxKrT269+U24w40NgxILA9Y/Qt0GvBqV+qUsAixROaVIqRrfKlFnSkm1EOVnPgENCstZGMDw9IWV8GMX596VNLldMYMULBQCwf7SxBwHNoIjtQCAv5P+KGXBVabN12PyrUdLGuZ52bs9TNNvzaTgtnuR4i7gRue2psM1xTLh2OlH+yNnFnYyNj2ghTvR/KrRZxrG3Wx5raHa+e5k9GY6MYOhW9dgZIFAhiQGDFR7fqA7OUUfDxxZrZwpG3UNQuVkiu6mi23kFfCyP+KEL0H4Nre7DSYb/huPN3/71wLcr9ImZgIjtH0sDiXbCvFHEwsIf2tuZ3mW/hL6+HEJmXSNyyi+amPUYG9hB3O/EuPH+169xOx9rAzqWe0mv4ekYAgU/+drhyi5XA5uyWaTh6K/4eIwFMQDu4PZ/s256cGA0EiA5B1qcrn5i1OGMOaBm3xyzBhudrs52B/fFUALMAj3u2xU5gL7utin8ZDxLjUGG/xCsFs1ruB7bheuKv5KmY66QqOVk9IRBfr2HPRRQ7IKZGH8/P7gsUsVcGsMTlbjGvYmDvp1/B2351BFCvvOsvUdz3a3glx+Ih1f1qqc1ryT8BzqaW8J8i/5Jsa997V7ipP/ZW7NmQJuVS2bWb8503Vb3QafKhQFj6mXXag+Vcu9GgxYa2nnvLOv2P4iJGwsNffEsO4Av8Z45tF7XCXz+3YV5ham6UFrrEbyqQb+D9gGmv6Wp/64m1hzqfQYHtD61mSMlHKTIOT2Gk8PVRPMGf+VJOdBxV2hxZYCfaqWH49xLnyd/NSE/KL0MuX3/m51Kz1gn/ik+FYVka3EoqhgS6Ndt15VZc1dG1nDpDGZfrjrGUmyqe+65oOp/StO+68gj/k2XyCTVVnm8mf3aBXxJ67EOoGBhKo4vx0PDLrtbCzcXs5PK6lP2ppDXraaIcu3VDL/5kO/r9PBQUM9xX4D28lMmb7+y9yDTG7smcwuV0a2E1wgN+8ch4/VafKobenK/ytm3EiRa1/1PAcqM/x30iPcROEfD0DPuJfv5uzGy0YeknSjtzYIGiIEqrol8j0M8/wsIBdrIIo/7DofDg5ZVPNcnrmmXoI36Lh+SkWft02G9rokkGRsDGQcljqFG4DIQr7BYJwFL5+eKGNNa92i/B28IglLHwfjQxBRh3caLhwQsM1knadaJAM5Lzq3CleAZQLg4CylqpiXnFzti4r4yLlsQUF4rNeNmtF4rWu1e+318l/MaHOj4hSqxjNFWzENQ+/QXd7YafS7MSS7Ttz9HMzMyuX0Sic3nRK1v3/sHEdhSywx0pTdGhmL+yqJZ12YN9Vh7+d3iLoVKMPNN2NxDeruVxqctZE+3rGAvHnMgUZShIAz+ZbVnqC+WLjlLC6UEumcpJY8cKsXEclNZ8KTbSWMHYr1JjlwQ/HqwufGItD+A3lgr4LZ81PigyVzez31jq9K44keNbxJsydOVLpHrtE8Frn7OBNtX8AzTZgFDIMjbZFb61EfaWt/kxoc/axNwuEcr0COUADXwx6TosCETlZ34IfX3oOq0Lw+UAfHEyO4fLCa5UDvy9MCANdVeSRuinn8SdbPdGyocKglEb4Eo4tjltTY+tKfVGbem+GJh8s8ZVT1yip4kihBHlWSrTtS5NAV5oMnr8VbfHC8nsAOd/7DOjwBeFmVDQLPnMDfrVfWXoelKhBb1bylOGt1xXbT5lXq5EhNAYXYFCAwtHBTURxR43iReLCpS2nv1SZW7C7bVPWZKJ5ay20IvmDZKBVkfL7OKl4Zspqr5wfNgFHSDWAHwRCjQqOZsoE6BCbkA+j+YJ0pmrp2qSzZX/WnpZHHGhrCJDOPKr1On6Mnz4wi2kc2fY2Iq/j4bSETH9qjaxml9CKAcPv6xwax3ZKH044CDpwGsSRIVQoDGVaa3nxpsPBwshITOT07k+a7NBArYEYWKSkGekYwwlz92OO6hf0irm+i2rGIoVUqU+3SHc2Aec9WeGNw/B/nhRY8qhXg6/giBMR1V6W4gwNA7iI9NCnyKwL3nmlDBMRyhFw9UukDIAx61MwJuSMzarLHh1NkBRkYrU7SiWsn/Sbd+8sU2Sb4JFC7ejVylcxtp2iXN1qg+idMpqKE2OtFyH7JFt5pBwk/96sXjYU+agioIkohxOIHm0hVvIUuF30fM6genzEAviR4ft3njfyVNYleYA+2fNlpVwD0+zg90T8VR4xiGMs1FkFE+21WeSponnna6MbZYW6tEMtapW9znDhRsWKyNwbSKAwjdgyuZ22gGKNPgGVYipu3dJnFP4FqOHv1qGPVaEU2CDUz6OFjbHDAWlvGaHsnO6Sf+L/IaXKK3jC6FYkY5aparf5Q7GkJws5yqDCQEbTaToseaTHCnutiqe9TowFCLapMhlCx7heepazVYgMFpkZeVQpLcEmNY7ocfBJrI6jYIIV7KhbgUhrmDUvxcdQEwMB9N0w2KC+CwM2Ftkm6SyxRubvlFFEh/FE9MnEiHKY9yfYVNtDxdj8TvIftxCzkiDuJFRfwqeFJ3+CFDIUpzqpvTwq3nNZBYgJ3b5g4folhHLg1K9RSgiNVC62uHCS38H/tSd6HM4J7uDRvKC96zSmHWUtun3OVgugEw+xjRWJbQwp7HL1fqAYHJ+Z+w3lMeEwxOVJyRitEaMToI67Dyzi3nAhn5cRdus38JjF8z4uL7xSCEZQw+7oAenmzT9JQJbZUEbm+7oSAHpM5ED8fwNHErNBHVxpseh7v9ZYN2C/TELW+ZiMzIkcDMM89MuC/a6yyA/TtbIybAj8K7dPizVLsGHVjV+9HQMrI62sAJ13kgo763X+KWDody+WFsXT3Wdzr0tHDgAhw8AnG33Igzs2SeZm1S+jyreJzP8ftIru72nQa1HfJiDFrJ9ue1+4e/YBTzgfDBZ40/oc11/PzfizkocX9oD+iP0XDztoR1wPqyuz+Ud+tj/NKHxdQZvh8u4ko6uYovMdFqVVt+TtmV41y3hi0FNfD7UDiCbM6mPgIAKyg8wFUVNjSJjgRSZbhLrscjwPIgL5nP/+I6v20++xdjWCUNOyuG4wsNmiIyJ3fxBKaTHOwZ7i6GeN0lxwFBw5h0O6+KlIPA98DocOlauUCEhrTQCpLcYqK7Od/PPJhfsEjt/d9gT7gm7mB+C8neCrbqc78fuxvGj0CEL4VLgAEN6fXzz6TCM/x1intORbn2WZeLcHE0NTpHpvcjAH9yZ7Pshg54r/jPmYmB9DtBTl0VAlwMQttjGdvuLIWhroXblv41lUaNRumODXkcoh/YeY6vuJwUQepd++yj6K6vicNlWR8q22pm71fGxrQ6NbbUfd76BYWCKgelUkB3Q1577xhWnmNHPzaP20Gax/SV7jQczOJw2L5F1e4R+RkVba+jnU+4BZD/HKM9Uu0ZciH6uSTpgTiFNMMNiiCxKPkc5d0o+1anmt7nYc8D6luAg2E+j/jjfqWka6M11jnZzP2rgvvJ4x4TZMN3iZAHe2IsD9KaXjqJghVHB4dTrH5nWGlI6cA6eIUdwvPpkvDA2xE81gmAQa4gSNbz4l+IphijqSNEqA4CkDilpy1GjX6FiHAggTAg//+SiDqWY9VvOWh3J0Gay+5FNylLOo2sc+PHUU95OYeUMpE5Ux7YRjhSeiP9rKFZqA5Swx9OTev5HdMZKE/wNEyxDWwaxZixW9+le75X1dqKUeofX05ult1oWCGzOsaG1BcDXq+V50Apfu2coixLYIg1ROT44rYjL3YTDAxGrDB/u58rT9Q9TVD1T3r535HvhjaxTjXNOSsL1TZbXM7nOtAEwtqzs8M8W3LeEUU91yIbdb7KgqG8l8uCwzNZTsecsCflbZyr/0D3JVSRjOEPNwvLBxSsJzHdiEOsqkm7plrfpycf2FDBFBLxJxWVeEgbOeQksuChRk0L9MziF880SDZWTRCEO72/HVD17JAggM5NZieMmcqUNZ4LiE3If0x+1ErO1VgteZBQuBzP+a4YqYkLH9DMFGLTAV1x9FkaSu3Ovho6eVMDc9RK1baZhz5eoYxCrewPWxq4OKayOQXCDez5exsXDVpOWIkFIl3p9Fl9jJoWq4o8+P+htYoc8g9qRNNCXNiNVfN+OBAhMqHAov27nh5aomKOOAFAyJ5cRytgeiROL1FgEisYnT20kRDJp2EMCa7DwJTXL2Q9Sobqj8ul2mr7mOR83iBiylKCcu0mLB9C/ThXnGjc27zdooUVw4XheJ6Sa2YU1dM1CEQStn75I+mrPWUcf8EEDHumRb6EKfn38KlhuVNwu1kPSKlJLKsZ0AjUSjno8dXmk5P0spfbg1LFlVQADSbUeTY6+W1bwfPRXsMPPqvdgGqmzk4URJi7ve2AZD6MmTmrzF2loKSYcUhzHfnXTloTWgbIv70dkKxTtD51H/gRR9Wn9b4Q+Eqf9spAY/Ec1ZAqRoNPQQBvgI/eidiZBee6p0LlvHH8tp/wlmrUcLcM34zZiWGlUWn2goYwIUPKSD3RLvK0PBiN4JKafI1VG7oYWh601yQ06EejDt+ddRKYU6ozD1NGZ8iCvffbfCSYT6cAkAovMdDwxSiGggSYdiZY7cBrFYHqdoguOMcvj6FX203J5yt1ofS6C3y3u3bW9JduhrQPEaLKr3EZ3OaLqVKhFsj1rlaGVsTQjEw9ZSzb0RkLjYpRFjstxPpaser05+LrcJSAfvpb77S68zR5Y+T3SMgRaIyU+TpoWB7yFAAL6iiUN43e3KZ1ZVuN1R+8EqMi3RADrKWiet9eD9A6vECai/YAZtuBJ4tOHIw1wZg6m9LmsgBlvyZ5OTFJ4O/5NDW81JxNzqbSSOGSU905vBN7lQjzXkROy8y+JPXye5k2/FEcJlMKLKeVBeg/2grXQwSsIHB61nitRjUOJNu8i1at/Dj0HSSnMbzHYA88zdOVp4IdZhfsVjd4jpyPu7T2jrZM28Hq6O2HHM39bQunDNe6DBp9u/L1qSkHUMWNVvgtkJaA8m7wGY1bXU9174X0cI9gD52BUqTdRnFKF3vkkKehtcAX+OxNURQ0NvJ4+UlKqP+4Py+JNVUdVjdzwstJSP5cwB3zHHLTzmzjcqLZSuo+WAxvPQLPDZBz1TJjvWJ4rC0g/UwR5nOuN302Bljl8JTnh/bAdUbra0zMX3+xn8mGBW+ek3u6QYsaRlIxsdgIFEfaPJ3IomDZ0EIX2wwKeKvEcUS8Bly3gzPNrZBLGYprZ3adNCqLyaUIILG+8UYG4SL0aibBTkVBYJ7ZYoxh5WYQpVneyg472GaKNIo10XVCnQCr4V8fwAnV1YFrjD2ij6GF1StkCoG3OmpfEOeSS1FiG/B3QknWQ7YIlhFjazK/CZ4qYhJuixK/IBQQi0ToUko7ULtcghFHRyjbFP/9NASS6WtiCwlRloWp4NLrstd+t3uuAHq17ro/4Uks/0mYAHuUopxxTxqHXCo0vf5HMS6u9JqAHQ2h8Wb0Lp040plx3QRu0sZTBTkKG8VpklkvwB4g74RwsB+Xlu4c2cEGwVhfMh0v8BiTI4OazHXoc3k36LQzq5K8UsjV0mHi8aXJQz0TqIaVA64Ij128orlYTKWBKmwEWj7q+JtXSA6V0Xv5CDj/KTmWikPXESg5IvwOjA/Qi6s/Ih8aHh8asCut45247xD4k71CtphlirzK20dsmhYCSqPDUlfeB6A7vmI4QS/gDE7THB8Lhgq4LgdlCYovWoSA5ZgEg1AYgdc6yAt15njw8GeYNGDW0we5TeDhAhwOjSHgpcXpaFoURLWYEAwP8yhVbwlp+SvbFp7wVbYFx+MxJCj2gLiJ8hNdRtkh5va993QFq4Nz6dCTzI2tS31fF4wUJe/ftHumXMiRw4D8R5tmNHWEOr23GuhPJg2hH8ghVF1ElnjCZd8f16dR5unzl80RhlbGjsIaLyd+Gj177ni5lL9x8HW7tn7gAOnUAwKE0Qw0hjBmcHMMS564mrrvb3GRhdU2JkYuszpHB0dP9V01rm+iN/fu3Invefz0p5IEtQVnWQ0yG2ImyA6QiQPgJe4DxygLhhuHDJ2F1IAfy5WAqOUCkgwVpQz1u3hv4nVghWUPFDgjiCuuQjsk6ljLMk24MjBELYTLMW5bKK4GY4A4LZjTFj0bmMQWBJgCQxu37NUn0rGkdEJZsJ73nSNTVShfusi6krEIuBvmIxoPcTccWGPfA8UgxpMlhtf2HBcQTZEfae/aCDK0WpKljW/UGz9giDH5yjNIsYWiOUlqi7mb8IixWOY7/XARXqTz/oFBdLSiLYwNIXKMlfl9PQPAUuq8RnM0Dsv0ccdesdgA6JnZKecUvzaLxHp5DHH64IfDzJEV/EqQCQSEHwDSyo1ptnus6gnS10oW7rGoIVQCxzS+ESNXxOZruHbiJqp8ISQCvAKp5ZL8sYH6cc7wvDOdPX+Q5WOZDfH3bVyoKuO5V2ecgGjjmgWDKCGAe7T4+L1wTOOJBBRt5pRvgAAbo5nd9Bg9qZDqgWLYX+7wIaeCIB5VvZzmh2s6mQnA3oj61JnlZVp1I7Ub+4xvj8Tw1x6I2J49QPEK54/g2l3IjFHFwN7Ox94TmIO38inDFJugpentY2FYY2cK4YRyatsJkriehR5BmUX7cgGMeiCxPdKCb4dNtIFgS4IYUQjwrYgkjem/yEdaVmcNJskUZWevrBTdfmEsKIb65O4Upu6btiZ1hRMCSqfH5OZBqy4vC/iq4+VJTDCzuFYeGOqO+eIFNyU1zcg7kiqbxMGtUzpr4DNy1vVuYURUJAXmWOmtb4UnrfdtAFUc8kOsZxSpwK3gF8yqoCvAsnBqfGyGQKX6Dx3uoGIP0Hxl89mHyMacTAnCu5rrQmIfa9i0Rb5S3fQWu3sZcdmmo4p34zs7SoA6J0tx6qtOTkGSJExGT42DglliekOaSVNlEJTyf/dhdho6eNOb128XG9k422WpcFlpDm5P4Yqm6FEHe2QWDqj5iHh7khCndUba61eyEK91mxposoXmSUC71JuaisVWqQ/s8SuNd0DHrUqGTJJvbUrSPh3d3PEu3wEWrQbtJr+d7gTk3YkFCiYN5j8iIJLF7b4mT9/Lbx9fBNiSmcNfd7RhsRyNay7MFZ0X7+MPuYoRbGtNLqo2aKe7J7n8ZwZZII1rJszU0hVuFEVx3VVo5mTVS1I/HdnsLVZ0bUUqYDLwoBmrKzHh6jHAVOoY8ktrGkssEeT9XMvOtzzcQHQ2wiEsUxSpanFEnn37WQfpgt+2sLBqM6R3Nzet62xW+k9MOqexqaHFapkUQ054uU9seDud4vDSo1SbNFqnPHzRTHpTo8Y7XSwUPxHsIVnPwFitDuFEmVCG8hfdiKrFxRTjiQQUD6kWeFjCIb77INA+amFlILvBD1Wx34CYZIM5q7ccAqP7nS0zz0LBo79c8bt7mJx3hiAcV2eNGaJq4F2MmuGEkc0Fq9UrtbnhED2+Wo2DQgR9W7ktEA/D0bt5SJcsiFPMg2XHtzRLUKaxw/zoKJ7IyatXYaYdGDfb1PKPXy0MZzbwsT1GmTG2eelrwPCFMItWn3BdHFVjTGgjOrd3bpEkW4ZgHQqEdIHmr7ObGyqe2kvyNAg/xzgaUKy/No4MCf7oJGAIAYnjFZran+0H848MPEh6/FivNPXayWcXGO/Q6ktHMif5m9R9kAJQoTEhN8/B9NNo3vFV+c6X51NytnTvtYXh6fzDOPDarZ1dSgWph7DYlFYsmvMtL4qEBIQOgRmFCbJoHI8LxBaZxWx6AhBbhDi+6vcOLTfopRCCYmmcZNsUT2JjP+p3AMQ8qmC0yXRBE1toPiWPBwKU5IT4a6C96h78iN19qioHEQRlDBkCjQ19imod7Y0dql/R5CZXAUYXKN2ekwF35TFmpJWCgmMOVupoch2KFFyKuEfbFlNpAkvcA7Y+Dbo/nGo2bq58hlqZqkWUpBedbp2DjyuWPFZ7EeP2Q2lSr4Ng+cwL99uI1gvRHmhw+nC2gflpue9x/Vs9ULVELKuf2/5oNAJloNfuAbJGqecUh4vgC0zrvEX9o6CfTHnIiIIOkfM6K4MEe3BLtB+o+d/OfkKDI+YK0BSCUMaQFXa+1Fj22Txq4rccner1rd1zhuR1Sr8S/61b85MbnRggwqGZc+2qmkZKNssXSCZfihHhVzxEe2X6dKdiGzcL6+oEhH7ucgOOAJs2fokZMOApsu0nh/qClgG457N65YV6Ih+Eq45mxMvMpGVBaLBmoFBsqWL8y4ixgQG/+Cpo0D89cdPBGlFslsyMc8aDy7bgqtHP53NjYT2oT9CSU7dcp1A9qELhb+9TcuZ1iSm03zI5wxEPS9rD8QJGl2vrEh9HEiVQGXZuzbqpYaerHs1N3jG1t6pGdn8I1Y4mP+2HnUa61gPWLQhXhmMcfugsLR4HatRmmvyY0Qc+d2znvnbZsNL27YSzxscTOVVzW2FFhx1jm8ztZNweyzXySGwb5b6EpjqTcGc+efZhtLQi/9ulRw5ae6QY4gAG9+UlMmsfK7D3GBq+f0tkVYokwnks+rbwZLWX7FK3bBWiHtcDgTnBiw4lg+Cfssi3U17yn4RjKvShBwfwIxG6Vg+95sk3JzYOLJhzzsFDZ5RX7K3rz45lkgDijWCn7K3rzLykG64aRbYP9Fb35lxQDOShdygAob+pLTPPY9uVzaGizXxZfjkMH/pcGSJHYP2A3FgQMM1hxLxihJ8LXYzdfkEsKIWxTRUWuwyW/gPQl5vBBMGz1Gtzfw3sDyr0neex9P78rOIABu/mXNA81ctg0+PRIar4ol1SFwNqd0Rb+it18UUkGiIsKvVpf+TG5L4hIlQRnif8h0dO6gEQwWZCRDSfLnxqFEBlQWSNt2L/ubP+4TE5nslULdvHgsug0eBgR6fdTNsd3e3rQU+u2/HhEorINMx17JWD66keeIEX0oQrke6uO7mNMIfeq3ElNgGHKhIljqAjCqPZ8+H6coMnYcYHZlRWsjZa43UPXjBzB2SzypiIueNPuj2uGyQ8wtGkOPODSLSySJ26WseWbGcbrfD1Y52sYgC/HuuYbgoIJE4g5o0hFlEAyg0aHaWPu9HsPW/mNhN33uwJLOwXsoTkk/Vw2Iwz9HZMNTxkdZWOHMvttuMs6DVm78D9Z4F8Wg+C8GPJkYlPJh7YIloDVRYrfz8ME0j1845YrSPTh3iczN3ShGr2wWx2gJ6uVh1qOVn/s6RAgWKrZkD6crIUjBAK/ys/i0Y3fpAUks8Uk8x2NbUlqjLfi4FJOBhtccElXJkndbcfBAqi33LLpf6DwKMFlu9PVcO2qeTU6Ty9ZTalCMtIZsxFTn3DUB9OcaNnlBVim+MGNhNK+StnHK8EkzUIpPrpXwF26TNn9KS/YiRocYJlRwqg2rHeFTMYlH4DiCeCEz1MFfyso885DiDbZS9LzcJlahwZ6CfxlMcp5dpEl77cU8t4RaQY06sjF/06CMLC/Wpo/wM+ESuz/JT2k2nWNYJB6ihOnv0cVAA16eEwWA0aLORJchjUqcFWKE2oZvHQjk+blItPltJiLSoz/Nb7XnVLILm3yBJfZ8p8Utm5i7oLKcipDnnyMUMIFBykEiSUn8zHiK5yrwjIE8Rj9xMFh+brFtvIDqoPPpdO+ujbyj97rV4bQXtpHYGh+7riw6OXh1q+tl6UFq1yXPa/xO0nerl1NOxV5M5G7EhkYke9Qswwitx+y6sUCynTztAD7zIXHed2QRS0vg9lytmXvWsUKGWJnGigAU9xsws0JjsW1dK+BLfRl87rC+xojvNhMcDzM4BOIjcQZH2lCK88ObeyJTUK4SeRgrBezJEsFo7vsliC0gGlOPAxHqVfu5C8tlmErkgYfD2YUVLL9sSE9nJDohsiIo7NjYRQiCOhA4oP7vkYZlyrGPUXOO6ohZM6tnrsOd7aAYMIv3+660RJ8/fHO++3f1Y0K/4dNu6LapCSTPjhA8CPGQyZ8jeKbheQ/Oe/BtHAK9mT1GBsYGiNeW0QtYguwVAjqY5Te/Fy2ZLS6sCrUNnasBlQDdnmNIxpSmBCq4c9B+EWSAnQ/HqZj0rSuLlXlNWIx521wOhVrKUxAFFR+93AijT23kCuzX0Yj1TjEjsiZxaGOm0ksXf1i6GX4ZMotE66oCl33flXVoFkkEWUIFWdw0Xl9PdxgKMaPW9W3r5XhvNhLUNlGsbCpnw1M0zO5gTJ0qnb7eht/IGQrPtgpZhE/V06rQMvIardrcO59b9BeORJOUEOUtLK7HCreP68stkQZthKRvvQknsDccNrE7dmK4tIP+4VtVzHeAo1bBeI1sJ3GEcs7R3rAdV58U1lqoVZOHQg/V9/psGy+VA1afoSikcjVy6GOXtkXt3ClrrsuGPn7HpgMXK50dL+GOT5p6ND5HtpyQEfJh2bToY6590nFG1RKxfXQdvj8qxFi4Igbi4BUz6tyNl96ctehoh7Ou9uwIkm8UBv9meLMDIafRrHpBZLc4owmRlIsopR9qdhasc7fNBGPQ75yPikjmXc2pFJVqZ36Xg3+mq0UVk0mwtKewgfSLe9bzveVkou+TKmVtwXiqGPww0X95+/twvH65V/KefGUdICcd/zey8qqvKs3BzT9QfugKyu05/LV0PS6chrl6vSNq/JJW7uyUA0+my+GBF8vFePTAEO36mz6CMHaEqv7jsxfAT9oirFMdr3j1UBEVjfDONdhgR3QcnriDVmjEzqOyWvnEz5wR1H195B8khsY9CupToWS45Nc8UTlvFedpU2LASXZwKlHpuFZjQuRxzzmzOFP9hef1uvlCPx4XfpICE6l3NfSHFTJvFvFlphUmQZH9QjAtTxp/HDND46NKFtdwCZSWVWrpy3SMeEBx9h3aq/KeQJ9rkvmXIqphVYR6W80iHBRz/LIjaCB0cBB3Ox7zJ62SGcVZaIOrtOdM+taJmpa6Dp9l329+at6nY+jd8iMItEPD73IdQhX1w3qyKl4fribFwr9meaUkY+E7NIobNt8pjSJK8wWc4Zf8ejwhw59yDKBjDjnY3RwpstTBsWufQS/gGmRPdCIg0DFKncDr+uElMBS29/0kIHNccfL/iCrJ8UgvQbNdaIfNpXkCixQLzugfMtBkM9Ql/i5N4Z7+4m55MRlijDxKcbjkzDNa3Hv6PblwYlShwUx282wIb/iS3fufvjg1MVP4ovZpQdZvhf/jqTXlyvsd0/RwqFDp+uq09vqOgVQuY+2tE4oLLxaPzd/mWDCUEtlA5ZYk2Ld+Wb7zWHGp29dnoNsxD4bPgwkrewM3MblFIfpLzxWcl5hkxPfcSdM0HTiHb+/DE4zkbtyqedWgt95xZjU+RNTcZaHExKQt7Jpysblqt1RO67CHt9orUflLTc6yh53KzSJX6aujzr+XRIKfnqZXn759p0zwPtoRRuWps+vaEbPjPz4ZfW/rURFQuiPTtbN/CZdPJYW4f+hy/rdm3SmWJayqZzkrH8v7gNYSKf+TPZcUuoZ/nsugA1nBgfwV96g9VziItHho2cWyxH7DP+dcHP+dcuISopm++nvlMUyQ5HknscGx4xLPYXuEe7q9mEXgkQGhL9xKQ0/DoF9U+c9cVQM0B5+j7S/OijT37CjxnCxUklKEmIfOKzwn3o/VE1I1/lK1F5JIOa0fXMhxGgwjE52EaVq0NanQrWv8Ek39hIhWpOgeteK+q7dNWJonwrWtk01CkiEyUrC6tmuwgCEEK6BuBYsFyApRCmKiCxOGfOTm2v5daZqLzeSap9C73c+TGmtigtXmInffy3+Gzg3E5/DDh421Y08jfk1T1tdP2Xj+irMBAaAaebt/uZ9qFRh/jNeKEnpfynvvRsB5qc0ntYSEwJ57Rhei8WrwKl46Z39WSCY6LXfv6a5VfPFJbBjWtO347FBvW8BjeL7foU0eXLRB3QE/jzKG61mC7uUY4XevXL1vGtd47eHdNzm7qHM9eKz4MnRxB2W/2bSs/6LXny0mM11UPZV7R2nzfvsNoGedmuT5V55CQnpmopO1xjxv6vVE7XVhHSfLXk5oiqXk0xXwIj2cDksexSpVHjW/tmfO8nYvpU+WtO2QXqyTjTsrFQU+ya9wvI+LuTQoHWtaiOoPWmWVFC+sc/X3sdIes2JtLYfx8ZiRBk7oQ8U471bYSXFbpoKcqzUPzmy9eYhKFeYvRlhJWRoKlr30VCNxErYrKBbx+v9eZP03feJSWt6ud8hTa3cewYdgV2Dw2bdwmG9UkGORXmXZu7OrQatudzep3nR2RChLMmHRBe0CVbItR6DLWjZxGG9UtGJerB3kmbPWV4GrbxAv6UZOnf2TLEwuYOWqYfRSkXrfuP3ko9pM3V+UWhNz9c7anC1JnAAe1hHlbG274WYPoIeSfE3raSpu1JR7BjMd2vdsFIB+WfFi7yoEAdtdtOT6+vx6rBjlk9KP78RTxeepik595NLJ+z7fqc0pbE+E7q3bDLN3PcHlPYzXUI6hkdG7Vfru7ewq1JB9pD3JrPMwyWW073mzX7nLNl5m/V0zW0NUrKVEKupKFbU4PbwmhjCNCi2Dy7TdbJhqwJyraAX962E7RUUY710diVNjwqKbEbpXt5bTkIn35Mxc+29bfcD8feI0RCZtSeX0a23wXdsgXz4Owmo7P0IevuG438mzx359duFF16uCqtM09RerpemENCvZBszneZR+tlSQwOuvvFqSD0fxb+7nXlm2SzBVD9L6xzq3/LIq/DNr+rfJLYx222Gr7MDLefWNVRhNc6rQRVp/Xz0bGoL8+7m+Pp6wU/Nw7qUM1vVWNq0f1++pemEcyj5WbW8Qyll6nfsV2tP4/LvHGTv3Tu7MX9Bb2ldiC6tQfc/4rgnQBz/R+uZfwZd3uF497BAF82qyz2c7rbhivEs4+Fu9eYRQwa0PRZNniUZkfbtwlFVPaTsVsexHD7G4ybu93fS32W8e6tyzkaOYMtPt4q6ao5WKXoeaKUkLRdPH2yJH6p99fQn+zdemHgF4y522HudJKulkCVVZnSfwL+3Irls+tZ/pFdek5/ZE09acaD6kFbNvifbgzwOr0MNv1j6Zby6X/Dzy6iRtGwf8kI0t9yGJgLW3h1DsNsLLvOXMedzx+4O0H1lurADKq2qnYX7KUuhAk1VBOJWyFV8IGTKMPxiT0eV7NnJ+5pE+NIuZDkKjlVrenhKHBWD9NEhCPlA10rhsGvIQ2rwpaPhQRiemZC7R5X06btb/vMaSKOhN7uUoN8jj2EPdJtrH7j2/vFZFK9YWd1384rsBGj8934b9lsEtUZdLehLq7EPJSskLhVhf+OixEi7kP19G/j7IH87OXLDk7bs+XQR4VvdoHXbQUExfwSV8FpBKY6WDxLC2vw23Nl/szjl6A0/p/DP6sqjGXIP98Uu8G8DKFKSYqKPSvjGcbdUHb1gsKjkRbDRJvRyet1AgdOLJqb83xza0Yt0HykzWBDcXSM8JR0hwiwzi5bHeD3rLv/fAxFK4NLDFbt0JCJ92WKXPgXv+6X3Bpi/5Q8qf/WjG1mbP/lb/pzyVz1mWY2P7xLgw8g/p/xVj2bkbP5kZfmd01GTknQ4Ikxl9nwOc/j+1FTjtTqCyzQN8DPx87R1AtNTeG3A3W3pvsl8sKGw9b1pgvCq32Iexsq4cwgTVnTFIz/Cy/vcnhdZfcCn9AgVASdhr7gLffcjuJf8MFyrnrmvMS0RWlpEI0vhzV6jz4eQA3oAcwuFaQzn4JwbD1/uCFgHKNCGAcf1AvqnowMzs0SRg+HNsub1170lAbhMIcuIcC0C1Mj2lNkrlzMZtMPU6KXx+zaVUQgywRvl+kMR+p0juu2VLy66dtG7Pb7VWbx5AMPfaiX1X3qWtNCcRHYKvolIea7xEjCjC2cGJTBaLlRznbU5h0v/4Xa55z4etoLmN8lMrZlc8liLuKMdFU5PZ3t1M7wKJdIZROIBjlul4eNvz7xUKzzWjA5jNG9yyVOa/zACb2e+6PE8H4ZPuiyRMt3S8Y3NrQ/IeUmC7O4cvJlixeyW/SsYt1oz2ydsfZGzUasNbmYvzOwhcudaVaQEdatBNfOVeqP/Xy8mINmaZaaTtJtXqzNqOeWSlzLS3Gp9q3XC/KOPLxHdoX1rB9RIjdVO3ZNiy6WFWUnskiDs/EkJN3u9/bJdD2U3wavWI6iRbez17NHxYwiZFVMUlYxqJiEz+7De3ilkPUe41gHUSLGrHU300CB3HqtHguvWDaqZr6DZg+G2m0tSlIPDh5HEmz2+Pn9vBDC1fYB4BWBgY2gBc7g/cSbmfl8vGGvRI3ghwofz5XIOmeQo1SrENVOsaOaHnW8OSluq1CNJSbsU10ixsu55UzUvn1G+qpCoopTAZnpEeU9XPKOZOpJIUGXfLn3e6IAhx/VJ4Veyk1FkkjB7sDiY04S9abyP6nLP4SIwvVci6WGM6C2lXyxh56yn7I4vsRL/li2AgVr1OuEPP6OVkaStfzsfs2ZkMTGZCiz9sQJm5AapsSt3xXsfIt5YgHHK9WHsUosnn9tgKPYYZmEOXzgCMCujl2f8VSE6NiKZi09mIu1YaODr2hs+k10xhNpaqC0LaHoA6Q2SmHTBu32nuFYmkfSRcjCLQzpfUyTMN0OeG0kUbSWwmTeUweCNXgp+d/ONSUw9zCzM8rQcTQUPosEEbZvPIh5Czn3CvhXBNdNxV/nb+EPevJNbX7gIur0rei6xpR0zzk62zFj2iK9Q4ICaia/px+rXEz+pnevaS7LRZ5ODWRwoox0ps1D8wuceJjnqfczHLNpHJyu/4wGuVs+HLdSsDKjkac7Z+eGB2NPt+f2BSJVPt2Tlnl9ox+TXK+18by4sV6Bin9KrRQ5Gdcn9gbQDQBuL1Erjm0t1EoITJBaWJ99Izl6Df/eziFU2FPGcQFwza6FmDmm9d1dbRTcJi7MQ1vjwS/Qp5fkelx6aSVLmlxdgtYiVeG5agzHVjD65HraLPVISYj8Sjcl7Be3AtHO7h/EcvCJZRFfhPgAznXzS0xmpI3ZYg6b3utFHWCsXqSO21/sDnt58J9M70kScsIGU5sR/lZIVBwaLPHKcfLnOCJm5gWJmviKJsoeKhZm40WTu+bKHjwZadP8glJ5vfj+tVxuIp5GQAxWRNKDhL3cdmWopiaPkMP0d2HHtKJvzlgf1JtD0xL+6Pl/b7BP2PSIczOSQDoJ4xJ50xsT0WO5x6F++JANC2b+qVo4Vt0yARqV4yYnWCiJf0xuz0GubP4K50xiJQBMHMwG1Rujveqz6EzucuT58bbuPynGS4/jJ9Kd5GsItl3XGGbeSnMcvHCzvUb45zWR83cxfJOwjzFcEAjZOE4HJbyog80PgRBCdeURjTV2ZQxxU0Ejm4izMIuOnb8hvhLAdlfUpUpT6/EvdzQWwL6P/Wi07dxcmMklRj2IWZlJ9Qp11IbM83hWie0QyF2dhJmyX0hUHBZP1EKC/KtJ6D5BLfMGbzr/gP2CTx29TtqioNhhAGe4aH+5p2ioP3dWE57dgi1oCknmUb7wtUOn1CjZZ3ScLWQGrSdIALFa7IHIuBFXuqWebYLe4XR8WGwrwOgriCa9HQBJ5BOQg3wzUBZQW/DGSfy+H4H3FYVFxOKg3g+sM5PFjq55qacONQ1lGvOSrJ9H3EBh8vOZ0ek/r7WVfVbnQ4uzzfs4XG3/kcppYzV/ExDnBXMfJFsISfsen9svXLy7cb0wUaEwc0lnSJfyOp6xNbvA5FNLu3sRdceJucGa5r465HG98LK5xtuK0SpiB+LvWaUp8eA95nlJS8Oq1Cy75i7fA9HGMVW0PtF3O4OPJW9Xeq01um7v3oYDSj3NFXNncQOA/zV5vv/O+N+++9wAIwSgEjcHiCPJ3kl7wec+pGIbxFrQhpEd4HkI7+ZXHKRjlOC+62m3vacSs8ZwNLoFQ+Vb5s2XntBFLaz0TcZHLnQV0vhU+wMUmbihFnKZWWE+82NwgCjBB+sKNeRnVBtI54m5gVtw6itSkeqR5c2XRk9Q34URCPUaLBSnOuzu+S2aJz4Qz4QYzxLAVL95JmKYZp1rwFJtVuXJS7wTvblymO5VxJ+h24uTkLrQzhE1it8gWZHVnwQQLYfK7QM49EEQXhqDD4XMb2RT3jprLfj6QMyRv68FqXwIVAeQMNIbGzfMTFHfYiLjCm2LhistAwRW9F/6t7J6Yb+ISS2Let3MD4q63knD73YTZ7diTk9ZNCN3QLcqoNX6bMLfh0raJ/t/etnBF29ReMdihCNn+vV8rYSvsU7xmApNs7b7gMYK1sEtYNfeGL4ys9ghMYTS1M4GfW+3C6qRppegQpd0X9EuOVg5BiFbuIBK0UicXn90PdCs7W5TXhjPTELRm4bekwWhit6RdUA+MpsysuMw9YdFDpGWqruywSWUL2zOezBANkqy4fLvoojHQYyeBBG5MAY1FUoypcDGBFRMn/230msTEMcbY+WFl9wQNU7etuQ1BFPabvLaD/fIQlGBL1D17wAyL2wu8aEtAIjET4xZvd00dEpfLpRO5PBoZSyPRaDSk2e063IeM6qWRaDQSl0ZigWA8Ho2EBdJoQB4PS6ZhsTQajUZjEMQq2fM4XYJYJXsamksQ5rztaX82LkGU+eas/QG4BLFKvB5zSxCrJIRhtp5ZHPKKmMeNXlmQBxGJRZVavmHLfl7+g+K/j8Yw8MMXb4mQr8WXy1KNjBirhcm/mhc71o3/BABOxsPFspqp8PTyWqSyUvVEbsl1RWnScq1OHX3GijCVy60COUPCMvKrBDslf4OXAYrQaoBTVs92YTHHlkhZ26HLBKg+m5QvaO4wDAtQjqREWc8F0kPKnTIFCm5tnO9S5fSWpyUaFpduaof31ADbJFpJClK58nhNF/D5PU1ZUwPVfiWs/kg731aDDQ1x8cQMmB2qR72UwF1tgFIDO/8SeD+hD6VUP/CkBq4Nm8s8RiiyvImz/qmWY/xYIMfyf3uyuQ1x6UYY/m2tvtV7lBWO/20LxZxgEVvynzMLQxQJ5l8HaI8oJYR/W8F4jtJstrsoUnd5XPKV0YEV4fyH/LcE2xxJtoH7RIblatufhislcoElSlERUFoQyAsR+jkcAT9tqX3h6c2VV70A5Wh5z4U8fRNc7bwAA3qrMD6d1xmLbdk0b5pPcJvv8JShLbKIPP/AzbMzzA116hWlOzzNWp8gvkhVrzLgV8dmAcoxQh1bW9oE6c6MLadD59Lpky3seCYcyytjgqKz9Nw0TbBVFDmaYNO0QkSoawHMNA27g63sVOioabja14udgbvLc5ArCYhbwoLKNN2dOjGGU7tiMJI4keZU1hjfO5dOrprDqHLbvyXiqt0+/lDmJxFqDemLkDBN30xIouopyl5aQZBIXTkyl2booIqkSstamlEHTilp714O+xPlGsbk/8hfpxtqT2jHTowi9NeL1YbMCm0kMevvfF7Z1FZRxWBZp33zjv4nxhjDHS4wJakaF7e+y3s1PqWBnledpGZcyt1CuiT1zBhOmvFkjpS9fGMN/pX4yg4VfOu0O8foT2KpNyF7l5f0rtAy19lwlqghezbwTU8VX/J26JbhwqySI435mKZ3ViXSi37fXkxylM5Ret8RfYlzt2QGMWJ33J1mKdo5ho2IfSMTSQHaw2mj21eUTWDuJFnEtvgvyspDJNY2CyTWvC127vLa/Um0+vht+XibbN6CXRyywES5ngcgR6M7wwpzpciyeX7z6H3QX+V8uofLqjn+QEDw+7JA8XtbwkT+bhQcr2bTa/SNkY2LIwpdZJ+bfTTefO+x8TaL7Dzk7Ap6aDTf+2q0s6hP0Mvnb7470TKNWZgk0OuDZyFlNBnHwRqVvgTiULt69Qa5CEKiJiMSnynp3b2KLdmt6RnCMZIwNzO9y88ipCsMmfrwuk8nugSK8Ta5ezOh3pHQbybo3RUyfJtDwPcrPmSccfWfbcPmcHkCXpT4elml2K/WaHU2bNqybZcdu+1x3l77HJh36MixU06cdsZZ53zw0XuffPaVL77G+Ma3vsPiDAhDI2PSlIlpJzUm6ubaBL7Kbl22ZQGcyp9ep7xkLT87be9JwyxHojKyJDlJLuuE5fAJchIepa92/LKQlHp62FMSYClZR0rKS03pEwb3slPqnU+pXCAqsaFT8j12aeQBACCVpgr4ZNPSOABsdERuXXM+1D4qcpNAUntkAWCPBPqlk6246yJJih44KWo/CyqEmiQbKwxp18gbXUbQOOln++Swnt2H7n5+d2xbDqcjltQzMqZLQb1DHAM6oJteUjxkTVcd9IdEmuUKQ1obaW3XW4xaqgqtlaEXPwN3o0s8jHqUhU1Ki9zxkJWueMgeJckOi0RreeIFVwrKYShireTETUZb8bpFptQkOy4SreWJF9yZACpnB6wAIYulJ2404qrXJ1KkKNmgUMTWByy5ojDNAuYd1gOqc0QHNqlrZMxhltsLq2n8HQ9a762hUCqOLAGjsuUd2uOr86SGeBJYcqOCapiLUrFYzsSNxrbSbQk30uY2sg0KxdXLQ73ioBYHrlx6QKMR13Tb4ov08jb+HBeKuZtj38XdNQXc86vm+Juh8vh5dAeDgChdU/B1CWWLs8GgdV2Z6JIZqkaXWXFQi8M3uHtEEUoS2rpyuqlYThe7r+W0OukLnTXtNEeRaTqv5RRBGCFb7lehwI5mOZrsARvWk/rNTGtYe8e6PrZzUUeNktzxoNWuPOgPM6PaePCUM3Gjsa371rdYWi6t1rqe7MBD95g5jToXr+SARiOuetc0cB0Gb8jQjRjemnSkzRHHufFliFHkGqgsPZIFgto2zo0vI4wSl6SuKmy0KaNnrcMV9gIXKzQplnjyYixkWKD5gCWXGyTGzVu1yCxrq9VrvOFlglzYj9OpOKjhxJffioMaTnyr5XbY0FtpFu12nDOT5jbRCH+qqSYAZ0tAbiBdTuVNzxm9U8rb3EC2IF5ti5IGwX5Pl6tFobOIhgzGoRSGqoiPflI43SQ6yCQbtLy+edvHklPIkbop48RVL0WRh34KktLNcShld42lNf2+DjcmJTSX2DQTJdhc3DzFk1zq+USglK4/zabb7m0uMAZKKdBJWCKb50u4qpJ+p/xucQqIEmbecdXzpj/GGY6SZnLPk1u/ayPdJu5ZVHrrOT4DUiXNsZ5nGTb5y190lZZpFrSScaNn3/Q0U3qeRVcJG/qmuVGdzJVucp6YlW7iA/mkZVKFoITpXKrxUMLyuMRFNgm24JpuuPnutMkIZw1qq7bnQZc4mSYFK88F401C85rISCdJorP4r6aXE/Ca7SrPA1+TL3VATcI24t5ZW72Hq7xOx9kxL2OBJcGWOK2jaGkgSVg3LrWzScI8X+HGlLREkcSSUNqT+qL8yXJULwUqLJX353lqs7iUnNXaAg5QgABRscDy6L4W6TqgaXED08LNkxCFFxEqLbE0M6S5siox/dSKNYIZQ0Jild9mYivNGIvJ2ezed3/8oB+XOiAuYWu5/3Q1E4s+CculG/mIdWluu3vbx6OiPN1hvcQOoH2h+6WQr2f0kYyXo3X9r7mzHxR1+th9vzjqOkLmPZ/rUn3Zpo2ZFjTiaxF2Cxp/YyfnIGGCLbE9dJgwdu5aoJgka4xukTG5rpt9zv1S0k1ITZS0dlPx+UeB489/TZlIhTYk5K7Befynwe8Z606esD0Rv1hSREJpQQvuUngsTTLOMxYPZlq+BHnOa3yU3OReN07htGt9fR/1m257zFMY9m3400xLHI7JaxvrQmn6vMQA2poL9PDuqSSFqznMd4f8t3vr5LO7wSB36n7TT1Ps8/Uxxv75Ty5X4KRDGlQTluJO9aT5pXcyeDP6Mj156oqcHlTtRgfOxKEzp1Uei1GPn8u8f6wjVREIFpZYmAhgwOX+xoSh8GafJYy8fDcnBx9HFlQ+x7MdW5YgwZ5vwejZXQp2XpE+CJeq5gSNlxNnOxdhUtu5iSGNnUIs+bNT45+TyE6Lv6MYT9WOB4oKfdmBVGnbjVaym1cehNNf7RjJ1gE+RfsbQtOBKRi3pUHJeMwUDh/fmTXK/5XxLOlfamx++pVp/0LTaHe5PvihV/eBrVDOP8s+b1sTb/RNPeUAfEYauQtlqRxDaOQ4VlT955auzZSh2Zc4MI7jb0wR4IAOLGxfg6ZzaxasMojLL9WSfJCIPOTvr9gkhBCtHIN5mqqOr5D6TEzTv0dzKcBiPieInuCs+/44mraNcJ7O5XU0bYiFbRy2Vc86gccmrOfZ/y+WoF6CqebYCeP2u2hEqJUvmvvSNL9U6z7m2FPTg/7L7Lr3oOp6fPQMVutpPWtpGsbXaMFZ5XneRNyvPehldstWQkvq7Gk9rVbRsNn7xWiB8Nw2MfVXD3qZndyIeLq6WutpPalo2Oz9/EALhOdlExl/9KCX2WUuXDq7M6L1tEZLffTa+h3EjE0LxJN79jrAvP5PjuVeZ/X6HvpHl1dJvXCIVTticc/2FCtqabOpBLZck67IbGGHQnAotCj3irsOY8AC4XnahN9+6EEvszONKVIahGw9rdLS4YS3QdaCs8pz3UTVrz3oZXaBu7YDUqdbT+uio2FjoIFHIM/rBs3rLxAjmc+NdtMewCrZ0nrQ2YatQQYdQTxvm/T39x70MjvbJloAa7W0ntajlnoArcZ/eVEB2vg3+ZIBIAhoD94W/Ndv/U1LMJgehhEsNkkLZUZxcRNsIWEsgvQQBijaQxl+NCDZ337G75qBfEZn1Eti0AsPDmyzoUnXg0KTLJmb21me7//9+7Jzg/nonNQ7wbn+P5yl+CpA/jveMf7zWsDUzV3kz3wm7be9r5hBzTcgaj2c3CRbe6Vwm4bk13TUrv6X2sg9jrRNzKvV0lIEA7gcF+DlBJGJ3JvSX0rM8bSysVd7a+kdt0Xpvv0mGR1FfITLoBJeRJGZ4NKUeS9Hx22SkVZ61QliMI0MDf2k9U9LETjicgyJl7OFJnJvyvAydF4sHRy0NxX3cQsUlCG3ST51FGE2LkPceAlPaoJHU857KTq+Lhhon1ebI+scpjkUPpKFliL0yOUoJC+kiw0WH+uH5cGf8iDNBCY8Wvvoqr9kW00D3uOfYOECiishyk08EGF1i+aDzfeqlwzHiJYAO0tydBQRaj4aWM0FLMKJ360v87kYXQ+Vj5nim4gjF7FVQtpvEtRRROm5DLDnJezIiQfEnN+Oz4dkRLNedTroRdr5LvtJ61dNh323mQzJ6GUU0cE+IOun5dGf8iBN0cNOjNeoiqNkR0cR3Omj4TxdwJ2deKqD88H1NulAwL2Jsnea4KBl+Uzr6CiCW70c5+oC4vDEI4GcT47r5KK/92aoRfRauli2t7RQTQPC8R9nZZeAZTF7emL3XurpDTpul3Ro4N5UdzPtvCKN4jStm5KG4bLBL8o88BmZXD5x/2jUrt41b/kAZn5LIpnqRnss1nki/lPTYd9tHFvSK6ONxrOfuPQ5xf18z0dT9U3M5z3pybz8nBB/KGmo+oZsl8Kr641HS6B4ZJ8TXM9f+Yh8fiuhgIMlTKfPEInpKCIevhz88AICB8U9cNYfy0M69Hpvho4o6G2vI32l9a6jiAJ5GSDki9grFFyasrHsHO8/qTCrveoVcYJVBLPdJL3oKCJgXgaG+RKuDcUjrpzuul7S4Sl81XFJepbEpvZ0tXQUwUEvwwl9AeWIgkMv6TKzKNwHTFr8vv5LlevqZWLmvuMh2beOIlrqg1XKl6KRSVgUD1o4r44nywdW81sRAsryV6x1jkguOooQtJeh0V5OUKPgz0QPT9c3fS/83tzA7011veJxtrQPukd+UVGE4305Mu8FPD2KJ0RZny0PuahivpqbXblPgPnxNmwYqduD8ZnBK76cpkg4H4nTXZ/Hn/Twteqpip1ELWNekn5pKWI3Xw7j/HK+JsVjf5wXx9slHUHHN1Uv3Z0Evfc5TetVRxHP+uXQ1hdQVSnugllfLI+5mH++Ge4u0fGMZvSWFusoonxfBvj9EqYuxfPPOX8dt8dkwA9f9evc0muAWfwkBR0NW3p5Cha8mIwiujIFlyb1GHexeT6Isq95M0qPAbg4S5I6iqjvlwHAv4S4TXGNY/2zPCUjyPiqH5HCg2c04icpainC4V+OjP9SDjvhEJc1bOlPepCmmiCmOqrk6DHpPx1F3gCMRiEAAb+f4s6YcxzP//JRzn0TjYYu1/bY4zZJ6SjyJ0BGpYAigkMFlyYt6KAtz8mIT77qRq0hscH4+ElKWop0EJAzQ6Ccq1Hx7BjWsD2lQ4H6pvKKydMLG/B6tXQUWThQTsgBCWemgldT2mNBuuaWD//ym+GaGHoLMrvDJKCjSD4CGQ8JpMyfwnlbPJ+9tkD8vl4ONy3PpcnKHpL9KGnYGPocyq+CctJQxe69VLv+jmUkYap+a6VvHTZRENeJv5Q0DEgMeQ5BSzhwoSKaZGO9Wp5zIdh9FcwKCNzkBDtHS3QU+XdQTsUDARus4os5WMXymwrP5ptBjlQ3VZytp6RPOoqsQ5AREEHKfSvss/Hce22B+H29VBkrirIkNoyHZL86ijRMkDEyQUztK5yu4Lw7vp4wdpWvNj2qyhKubT6SpY4iNRVkLFUQcxsLi4z1y/LsT3mQavs23hDZrPFxQivp9rz3+kbXtwMOfgk3ye8jzTKas71EK9+ZC1/vzhzzPez4N7nAwPw/5C1t8xVM8Z8yzpXW/4Hqry6WqZXoUErbbmDlayTCod9fawSICzfR/1ApDSxjnUpTX7pfVvghN8rkWqbKybjZbgsvq4VJx4vxflTemTRkGevLmvrS/WElP5TPY8iWZGsy3m3vC98uTDo+GB8dP8Jz5Bip+hm6jLWeTX3p/rjSn1jGHeM6lIwP28fCy2ph0vHR+OzyicuYehwxbBHrrpv6sv53ruzgctUxO0MmjE/b58LLalmy3nfufe+13jv97DBGqoSGL2I9hFNf1v+rlTdD+grKMTu7y3Lhuqwqut5f3RTxDGb2K14D8ex018s4qrGwgAVG1CXS5KLX3IzbPlCNG6zYwUUbuIZVgScVveZoqEX2pXbuSGAJS4ysTyb112be9vVOHX/L2LJoA9fQNqqv0a24abHfOKqusIIVRtWnkvpbs47l0XGyApI+5ZhVA2hCq5pqb6v89zYwraI9U0ZXs9RzQs4JeV8g1wXyAfjq+c2Qj2WpZoVk3IGFWQAaViXdLF89elO5ZVoM/K4qLBCBiIL1wQSIJt4WzXjA4Ow6UrAFoKFVXtWIvqu8awvMyFWFBRKQUKg+lAC7Scfy2RnHLTOICjOzhtGEVkdVd/RD6cO8SJ1c1VQgAxmF68MJcJp8W4EocRnbiCzSAtDQKqzaee/7a2OyclpFRbA8sxpTORbb/5d+ECKLWA80op9b+8ddxBT+4R+pbal7OfGxLeXi0+zV1c/7YqO/BpuHP/5msN7i7Uq8VgIX3dP4fvdrrh3lbzHrL2lcxxuYu9FYcsIOwnJ/+3exhfZl6NRdf1ZLK2bsV8Sj8BtpGXN3VwFCFJeq+9t/JKgvJI97At3SBPsNMRX+IntF5s3D2AZEj7i//VeC+kKi09dt+8XSYq2eo78ZMp69Yn2+Su1gArOSuvdyv8GrP7wuTj8DMK0ZQF+xPh3kwlGas1XdP9xb56BN3/j/tduZS1WRXLpxdNcCIv4rrr8Q0+0Ru8sXTruoq3Bsu6/SoQyJspa3++r5oBf++E4YfTubfL30m3o8rOStaL/mwX357EZ/Pj8tFaKtVpvnWwyzzSwfVPL4MRwwG/cM5howKZejv+Pkpzpm7U6/XvKaTp5/lxFtuQC+q4ilpQGCSh4/yuF7bQzTEsxamJRrmg1OOaYc0L8wa2HkQv/CrIWRqb8H/PFJYwX/wXS5f1o/F/q7m3faHf4Mvchtm9b4LvwRt3f45zB1gKH6+Hj4pph1JT5WqdRMfxw5yNWaut5KZHFGP/RzoW91uh7FGf3QV9/hhZ8r6Ot+xO3Dcqfpp/vfEP166es/efruGr5NuyL69ZLXeNFXf1qC/oWR69/q7LriEdWvl37oJ8++u4Zv05Ymo7aD0Q/7wZ+W9NT32sj1b31iWLuDWQsjF/oXZi3MW31vm7nliUzinrxepfkuuQeMW1NFALfQdvljXTcAKtmLxRxLwh2umm6xryq2jAu83yNojPy1HvPP8tT6Oz8WK2+L4Zj5iXvslHhDU8Ulj4QYF1E9NY/5xKzdyqoMWcTlLYqJ8Sdb9ijrE9/wvJBRbicg/mjWKCF8R+DLKL1A7VN7w+dH2NBsmXzsFVmpoE2SYC/HsU6uc2puuY0uUBeLxcPcjYDh4QFZm2V2o+2YZb3NyVN7ww8rU2dC/X1FMLzSXPGO9E1aOJe2gLKtjHfLcu5oZ6rfmvnTDm5LKhhkmKOaK5x9iBmrtMk1jySRXoh0HV6gWYGUqwzSFehBvzubmk6C/BFGcFv68M8gZfI9iCkeGeUzaqB8oI1OoisdWUup0lOtWH0Umav1p32syz8wY3SDO6iPoXiuy9/W2NyG9YM7HmLCSdyHPNpst2laO1MAGlhp25JLS0GJvm1gaDVA97l7OG0LHW43FPYegY3ANU7pKSlA37xDxNDK56bXQ3n/lAPDwADSzelbvaLKpprfXkjBRzAto2FkiLRFuhLEoM80T7kcdzz24iRpzS397Ry3i8DMly0MqySdudV6qO/MFJL9JY+rcqRO72O6ZzsqoW20P+1wdkBKvd7dfYza2y3bf+Uqi3VgSW0HV5rLFRNgjHd4Wz5joeBL506QKeX8Bs9wWkOdvn5fvKUY5e94KtuMtGGLCVkogb3t4Ll/2xMnKGSX05//3b1H8apTJ8QLT6c4qFxKGEoYuDCc8zuepn+SvNQ/u1x37KfygnpKhhyTkhzmXvkLHB8NgMDverJ/3Aupnz4sXStAYr9/11Nm3jFdfDOqTFDCferxpQjMbnRFPKPXbTOnnr/1awEMFab01/mc946HsmtZ+MRthFLlpwR0R0XPJ+8O2O+WzmzvhMfJkoytZDqBBWgXamqOP29lBV9RqlysRIVzi/gkxsUGpNF3PPMIXb+SGqbqeDED2w54s9Zn8wWPkBQQ3r5m5TbfrBp2Y/cM+MwDVEdpKrHaaCLq9nBijn9KVkU0jxYUAIrSVEq1kerlxi3Reih9yZoEfmpQRVE5WYX7tdYUySjgx+p39JlKdcnriRavee6zWIkGkw1RoIhKEzHEaBNxKABA9UqML9oIsy0eOaWPmGC0EfQ0gaMp5U1RTcnEgjxNgF/qJaDRLJpTbFZKU2WEQFbOHf0rpNjxDQfIathNLHlncokUg7y0TcXlM7NMdhBAHgZcEGW11lf9brbEndY2PuG6CzMTKu67ntMJiexzHU/IPlKs8wYeaHl6wJ8F9+46g/GTlTbJ3pmc6OdwOJ8SjxJ2Rg6PPKNdPI8vH8c4nf40nVsqZ9IvMdnNF8AtJg5y2zw4feG8VOHaOmXyo3AuOSwX85bWYgHH02GLKQIpga0RnPUVL2tTopW5q/y5KrZHuyLQE/YdL5p16PT5gCCdzHwaFMdqGYyVs9BHdAql89flbJRs+9u/5EdpYmWCX33Xy3JHXuxYjAPE7+IpxIxaOq2InYdoMlXHbdo2Nl38ZmEcs84bt+VuWedF/HWlKqD27JYNC1YuTySlu5ZA7nplMB2lXEtQSEqljRD67RB8MyFHooDejtCShdhe7oSHIlXOv/qM2xGhuD7b4zGHOmkH7GfBwtPy1lWJ1zB8z9ew3mmbYTstN8s/R57q8oeuPkO5xT+ur6lm4mol0WXcUN6DeyVAxVLZ/Zxqo5rT8Ws4Laiv4K31OMdGJ+eyuwVw+P3tnfG5EZ/w3C7GHa7nfOYn6pTRurF2kI7XgFBvhW/f/5e3xnFWKGGrbLID6LT/WlJ/R1T//q/6jFlzLly6cu2WG7fdcdc9Dx49efbKi9feeOsdEEACBTRwgAEW+IALPDDABAts8IADLviBF3xQQAkV1NCBBlrogy704IATLrjhAw+88Adf+KEClV7xn7QY+qqAPN8gGvGOT/5B/gVNzAgyyYVNAE9r99CpLplgekzaG4w69aFam9ABNmh5BlJYIpHEpwyJ9D8s/j3NaWJ+fPyHQ5OQ+ENif1oqf3b9pElFTcOTFy1vPnzp6BkYmZhZWNnYZfRRvPnwpaNnyJnsjHwscfJvHOKEOIDRsDcBJ/oAvg/b+MM/UYRuVAKsJ2wKEQow6sI+KUUrgDMXFfQiF2DUo+ma4oKJG+n7jJwXJovGRzhi4vb6dT4iHcCxcm68Go0X/Rcdmzekb6NVfdFJQlgEBLkAovU9GVoNG5qBgYGBgYGBgcGBEyHArEHJsBKE4oZkKZnJeTzyoxTN65oo7tpKS/N++78uxH9Oa09qYy1yuDLUMEfCDbCdmf0QJUXmWsTRqGz19Ujf7436GA16qxoDgKopj7yd6b7eBQ1hI3wiTre+jL21Rmv7leLNN0D9yxlgr6byr3GEtsNLl88NRzlS33PuIF+ZZbZcBW5zoWmCTr77OhVUU0u9X56TliojyJWLdZOKw29851MB9oOZwSo14toLYL+YBaxT3Vn7A9gOs4JNahC1l8D2mA18pnpdewXsgNnhV2ytvQZ2xBxqttIRCsMlM8at5hWAfhWm0pYMw5Jzvnp83HjDuEY+KTF00UikivAcbPU3my6dUlAMJBJwyLDRgFxadAwZaJx4wY0ayIxFrJWcsMloG94lGrcI6ZLqsNTstBHMo2uaCuhYJzsV6T6M8DXXoV2Gaebnl9izHxqWvxs8GGiQwVKFSyLNyRBDG8aw/N3gEEDSM1sUDZRhMjpc3f65nGjVpLXA/8TSRW42GeGapjxZwXLh3fTPA3F0kRBNArZOU4PL/a+GVYCIhIzqV0ZJEW/5jjTPfZktK3I3FXOZaStRH7VOm7UtOkfdw16ROBGAR0Ex0usC8hhongCG1wLidYF5FIQngR3vUvf2bxCvrh90xuX8o7DUIg5CaiCbQTaGPAypgWwG2RTyEGK4NDuLvTVGrEcsOgx/a4x4GFGFmBGidQMji9YdG1m0bFCoxJILFCqx9AKFSsw0jjT2uwzXvp3GC5HFVLrOyTXC2JBdpOnqlj39n2xtw9vTtndkL+nzDl4+9Rpc2xZT8FJ6WHwiOUf81fRryG37OAZXjvQj1p5xpMdk4polc8aF3iJL13Z0h63IOrYx7so9cnBdhY/6mtzETsazvpBb0920MLVCSsImhKsSMUesA4CVYl5V3Ne407aY4U1PNBJFCQmpqiS2k3pKmpPru+GUUmspT0vzhF5aqpGm5FplWWZvJeTeDiEPt3y2dojX5TMWdBUpuqrDNbJEyrFKtFbWkSCWwqFMkwyLBuLONJFZkmONga6ucFN3kx7WGmh3oR3ZS/rYYGCqazqU02SGjQbG3dCJnCVzbDGw1e2e9Z7jC25eo8TbYkrckjQlcWYycjh5+nd3r3Hg7d3k+EMDWpTIGrXmKg2WjE4YU2Wo1nDRSMLYKuOammhnVslkwuxG5hRNYaJo2kBMm5k2t8683ly4IceO9VaH70fjgdSG5SnqlShZm7CukY3Xses15rctptLV1LvEGlXaXbQnYavK9oHtTvjbZn9tKr4v/yoB9lMz2iuQCe0jhVhVuKirSU2spMtrbazoWlLnCiaQoqExrTMkcsW+54XJa8Bsm3fX7FjUPJj641TXBCCg3rSudGzjaNtg/me12Ep8hLU807k63b1SqYPuGl4th5vQtqpLsl2X2bWcZ8I7kbQCm5gf/N2GRC1QcM20Gr8ZZlst/rsuYRse74ACTL1Y1a6APYVqQ2BbQu8i2MpbiJT3pnKK2Jqg2EucXnG63tQukzyepkuVULTc5tnhWzXZ2M2723KP58B31eTamnat2stiG1a3Zc0ulu3d0hGzS8cJusIp1VDIRaitHQqzUZfp0RCFWlqveYvb0hTFxLPhg6nqmu2o/2ZFfVE4bqKqFhpbK6FQIGAGWORvdzI8YYJcHEDSL4Czl054be9FGEy+95MVIIh04dm5BoMy1Lfn9YAo72/3/vq5I63tEbOd67worRkAwPnnT0e+vzsCDckggZzs5eqdsrkAbf/JlOmxEahk3kf3Dgk/I916tGJ7KoGGabhdS7tWbP+/9GncncgWamxN4z7g9/z8h1sA31ePo5O+GVmBgJhWYKxuyGJigbGThSzW1VX1hiymFhgTC4ydJIiGSkEEAAAAAAAAAABe2veAEEIImQAPQRYTDYypBcae7YsMMsEAWZUAWZMJcep8t/X05tR60RgJUFOHYW+wGXb3TgPEGe+LDbmLdU/Bt4q33K7tO2qVvhOyunsctcPNq+IMyq9javp0wrmjUimjsQijhXPkMimjvGFEuCE6ZTQ2cLt0Jjq3MsoPDAmNLMoov5CnK8z9VfSmcVGMFg4Rcb6WthgRLpFz/09oHMid0oWhSyvjyjL+xtxm3spdZc592Ve8t8tKabXaq9vm0KL8kTdYCJLcBEeehRsYjH3KORTO42drM0Iml13bCrl7wNriuRe6rbOvhaWAXts2hyGhSy0bZZReeKc7lKK+EnCMR/e1cMqoQEImNyPCDfHJ8N0TMFGokwRyA0IL2bUjs5xk4HP5iNYKGacIR1XdDnF0NWMofeQNbCNthl7ZldGCIeDYXU5T6S6rshEyIhTtBGbEinnLv/EV3FXCutG3UC2kzWFI6IrKRhnlF/J0QRnqlICjhu60cI5bJmXIDR3hHunO069pljqHZbFimDrQl7Wz6epeHKBwSjnTLcZFbo/WjAhXvKsZaEujnfJr7RwK50xhTtzETGTWebemE7hlTmdXtWWh98U/lF7mMjduY27/4OL6qjtKrKdrezfRgM54xXC6Qa3ynPEzkHiYGiASm45wzwvxCTgy4WbpyGPXsZVR8WBTtIWpvIIVkj4+3YINDqgGxNHUCWR3um6MLqcZ+HQVXVRIu6Ld5cRhrOxOm7og4JiqwCMXPaqFU25UjKm8xUjgfVpX0Xo4ULTGmHKHrvRH3mBhkL0Q2zbD2MBrbQsNAW9X1xibHt3COTllpQyRsRur23UvDYpYpMo/oFanHGI7p0nxwjrX1u3YJvV/n6bzhggvvkCM4nQyXrFpRb0ad5B0857kuqjHuMZmKOoc+pAYxTOiEDvXoFrGPza5SOIDuQQU23So/cgbyAPWXr1Y7Yr26CTbfR2dHPpOMR16ifZ0S56yaUezGndY2733tBHdxz281J59aSNvZHaXjeKuawEaeQly7aBs2X40eaLX+Xn4BaqHrwRqXGb/W9PtLtCbYMK+Ym2Dj/tz8l+Hc/g8r7REcSWwx3erBTovuzE5inYQssaBpVt/b8ItdnjPDk/bIXtzfTVqBGcsnpotmaDSzY2RYEoyV+H5eXssbl27Aa04GNHj7zx9acstrWANNGXVynrYmkmH0cPUbGb25TU2KxvMCZ+8HWS5smN+pkv5HnbAtoTTaoaKmADcr8B0emd35Nq36du/3aO15sEgNuwmwNw3FfZdOJ+XM8YAjB+mtRf+Ov4vF8Tn9sQcnR3PSVuofHXsaMYeyTlvp5YvhgcbQ03mUujU4Ca/eR0qNCImge0iveuMZhefoWVNrrp6Q+bqveJgYKOhcnWcZ5QQL1EtjG7liFOddjk/YNl+R8BWjy/gZ25yG8eH+eFcDq6irdfxnEdEpi1Yrn6tAzbdWlKH9+aOun6n7RwmHHJGNpTkEz+L7xBMCzOpgJjc0vM1MNZ8Ag5wJyWeF719jq0j6Owo0BYgL8vNDMiSihMT8dG1capqhjBxwr8e8pgKv1PCH82fhyfcN6f/c0uRWLmBIrTolrMdGY2gS7q4drH0gi6tmc+bUA26IINj5tHZeVleMjz+JeM6slpedru5Dr3oPVBDl3vnZcnFSxDipXg0JBXkZeeDd9GO2JV+xkF6h/f3K0yXmk9NlKNMvm5ywS8mFTrx6TAPfvftKSFde0ovIWGHXonrao/DFfi7iT0+Z5W9eTOhMmCxOVV5cEdtuLNV8jB33XL3yecRX9emM0fteF7Ycl76KGX2JY2rV/OZ9IJmxbdpv8RgxmG2ZIY0QW0zlipMp0ZCtlfQTKJHfhTpQhPTQvHOqHneGRphcZWa4VOeRC1iDNG75x58ARMomZjObRdoIhUzc2CStSyBXRiHqhO5BGZsVmtSndHGhFwLxCh1lMZN0ZQRr5DEdhDLM+HNeF9dAuMZbeWESNbGk42Xyx48BwbAK+uCDIwPxjPqZazFy9iIF8sFt/Gu5gW/eO2Qv707NS3DnpNTk9tme5VOnvQ8N9M2B7WuC+BzIruns4Wvn96mkxt/OMw5/l7f9mbp+zZsW8H65IIvjRdjBhWwHQsm/SB/h4TteIGyJc6jB5Z4jGEB9iTrnd3ZXVMV20d9VS1gx6e3LfK4DFxG9758VyUbd5ytL2GyJ5iXfiOCOAT3KBza9xbu2xkl+VYPUbPL6IoojmdiThIsU50+Zw8TyAF6xW3XjzjavoSuO+3vS+K6vcZ9PbQz4mmXmskaT4iNFztu7XuHH+hhDzlCrzh2KkTYLv19DU9Bd3bEaQutn5sM0fgsThcU1z08PNTcLoiP+XS2qB3PO1vcGic3fI2Flt35WwR6cGt83o4m86Cwj/paH87Yip5xqGk458egdwTY7uy8UJW7ID6fJz/Y2fEcsgV4cBGYC0e8tbzob6vXNyzjm4IOX3951jC/Kq4GIxIyNuw4cMql4Az443DZoJhc3mzReyL3mhY33KS4lMqkOBkAAQMoaICEDLDAnsDBISBEGlglzkN6YOIXtyLqNsT4bvG5piCM0UJMcvdwvCaE7LE68zbPRqJbE/W7IEPD1YiqxOGNGG+887jyGT0pbydxHgIvvz/wwGLpxoAQeDHxquOQgHgoY/mnk7obncXBy3qyuPVnlG1d7qu86HvRXLGfxE9GTv1mYBXXQINtZiMcuayp2OiJuNVsBaQI5swmNNNFPj5kjCzs8SCgh/lTujp6YEf49OG5iPjSEvOL92NeFAFD72FPGkno1zl3cwViadryOQ+Klzg3QnzbSIl0ZKTob3keJHyYseHjyZ2MgZCFnJyRgoKJByUzJTe+LELNKLwoqViI3BczhF1/K3+2qDizUlOzUZHSsYKh0tLQsBOzUeDjzZM/Dl60nNRk9GzYpdkhaem2XOfu8gLSWMCHNz0/Pgj2BTTcGdjBpdtP8cViXqjNvxXx80t5aWBipww9yjQ6hjeSvLHiIVp1jt6UB1Oz0KhxH+YGR10dzDihPgprfv0kAv4qXDkvk11KSR16/vZob26d+6a/XR2/O27YlnpUZsq+J91qdmfHyuPzhWVo7WWDGznwNdvG13SgtWXIETcNrwuXFtLuFSE7KwlF5Dv78YEqeXS5NhpdDboFF44Yip5qVPdFejckQboPZ1UnYMeny9fR5eaLnz1fVWfszpNvUYVdM5OuTub2Nx3TF9bFLh93oCFKV/vilsXAslZ18Xh7wyMPfqdvPhmfhnX7k/S9Kbl88r7NBFIvju7jZFJf8IOsaheSFpuOpqzn47VbS6rzvJ4M67a1wF4IVFedL6dxu90Xgs5jhDNDeTmeaSlxG7e05R5ak+3mFdWX/zBv/UEfYeF6ogdpiU2vHATOiFNkVnl7eK0chVdcQuOtkcBZWc34UufD3IRG7AXwQ0Z2X2dG64EthH6gyb9h/IglnUZ89+I9oje7T8WqccCOT4WP5qog44+rGsUdczvo1O6aoXJ1PV3afUnpB/IN1t3uEQm2ZcfM0/ZFb5/udcGdHYXYgs1lyHp5jDfr+xZnZgvljPvAhlSD6fVkG7PcnYa5a2as1mwBfq4Om36UDj5rlgzxstzFS+DiZenMgCwf8QKxfO7b0+L/d/RKdb+8x08przGclLD7nFK0SdLz1bb0qvp+Ok7dNs1E9+NAG/n87ttkYHnbZmH0K69gPDrOV5qVRY5ebSRmv3ZszIEf0YmSzeJzkTrTGb4RQoXsUVMxBaM69/DVGfYvCS2Mxyrv60nsJ/7vmGgtfbsMNccTfTqMe9W5zDikNedvRgVHeojV3K++pg+KCX89wXGmhfyKmO8tlYSN23corGzs/yd1ssgn1AF38I6BfSdu7Uy57VDf8YyzMpahWHWdHaJ1K3qUcXfvxFSoDqqZQA5YRP609nLONF/VkZXFHjTjTuhjHI1uW7mLG864Pht218/5stpyuU0puVpPebLg411Z3dL2kSpPZhgcHQrdAhr1kAw5M09WGv7itncNL/KGVBT/6EvrAK8cbrxEd1+/Kfp7T/d/hRuC76vtFDtZzwzyYf+ida95yU4q1B7mlqbLovBGZQObwnn+kY0L4gfsLE/Pss//SYCYibfl69L3LPGhbcBM5mPJfaPpbS51MJObY11d7jl2R2EF/rK4k2SxRRf4VTrIJaGbW51ETkV3ou93fL5ASj5jz2srol+PQolFL8/mq5Uhr0eVF+2LhXnHSXGCfJMIxuqlnhlmfpyLtgHMlebXqTQcAk1OKysTOM7eW4++vHl1ySIewIRuMX8vcd6i0GfvNcseKqz3c6Vq/tNqzPxlFYcxiurNpVPuJM6IxZucMwsv3kwwn7bb+jOJx4Lbc6INeX91R7veubTDHLvx84poyXzCxYdCDlqSDbuOHa/K2SzL4RQFV6rLLfHM0OFqAxFbPIfBK/r7TX19kqMDk9nKD6Cu/Gu1iyiMo9LSpodfY2Z+tqWZ+a00KE2U5tG1R/k2KdpYsLXIjMktfOJjCYPXUi7sg+YZ39fA9Olz0QIGraUNVH9dTqH0vr57P0+T27kkvzzfv+J1lGaBhnxzvXX9gzj1i4v03o/EgrGFxKPpfYEo/GwoMEUUy15XBjGcLd/MoTq0OA7Qck4K1hPGaW79rN5TnRW8Vp0VvI86K3idOit4gxoBb1J81gm8M6+jpB/cdZPLnKPxSqLipWPrvd/fN6Sxu0APfi3S8ZyoO04Mw8uUcuj5sXCWlISNDoZzeVlnBcTPIdkPk5mKJPyl4lKWNvxlYn//NLasS6nLTkR13+QHssz/5jAxz9wKiytkdYy6qjYVs8PVVbjnW4ow4jBhBLDWBNaawVoLWGsFa21IrX3SxDs3H1+Q5+ML0rlteg8VXsVQ4dUMB14DiuiEnB3m/AOrT7D6Aqt/YA0A1oBIDTRxbv/VvyXNKO3B3GeBqK/fQd1DawCqP4j+7QAUwfdBgm8N6qGgHgbq2UE9HNQjdPUcJqjfqXL3t+3OWO4zkC5599sc5YwTWkKWm7czjmmfdrd5b+nO7GMZi5NeMsYfnLe+pnm4HP+ExNTeH6mw7oXSHf9V5b+r/G+V31f5Y7W2/Fju9SrTHu1/87e/TPq9Ay0rDWXl4fe24Y3uHfbhE6/Fj2+bLIR/ZXr3bxK9g5+lIohfI77j/mZ6B5hLkhq74dwZeGrcqGsoI996ke3sFOArGyNb4ENlBqKoM+q6qsgP2/zt5Bvgq50iW+BDXQxEoVfUFdGRG6K5mcsE5tIpx544Jwa+RDuuqQaN3ITWzVQtMJdGM3ZFGxmkPDXmEolGbpXgZqYZmEu6GbvhvDHwVKtRl8lHbi/HZuIemEu8HrvhXBl4uv2oS2cjt41sMw8RzCVojV1xPhn4Wt7YtCN7pdyH0kmmwVuqukReWSXy3ffmbXZRmIuMSyTG+JbYVTCKrCTw6ir7TzvqdW42XJJdSRf7YHdXWUdmsqM+u0uHNoET8kHBi0jID4VaSEJGOOFS/QmDK0YHKAL71iN7N5I7RyTXQ1ucJnKzArbJgZAdcEw4CPmgMOhP0c9uhUXhWzwf1hDP9LoN7ryJtx1eMGMdM34Xvr28D2wQL+BzpXw23jzOE/X1NxtbWtcjeL6ozf1Gh25C+0/8tc55GT5xj2BMDZD+4RBK7aZ/OpRl7U3/clgAm/Rvjc3rQhPkBY/dg5KkAJuHPpoT+1HdWB6y2hxtuEB8vKzm331YLbRwYVH35UXlxUpCI6se6CYzlQWawSJ6YC+OvGxJCO55iTcx2iWJzxr2bEa25C9gEhorO3YLLZHLJ8yRVol2pDnWAdh8XUm/2xgxnuRX1KXiZAJWJqqFc3LumGn85PSRJhkzqQ6GkpfaFr6v0VqZgIXvi11G9iN8AiFpcjKCdzCULGbLZPR+pb1wZ6HcjDtO3D/pheRjGO4LvxrT7w2q5zlthRj/PphN28ifCYuH3K7ayWV0EFE4fOCXTW+Rb1HH6JuETwol0czf3UKo5DumpYAImfwpE9UieXLbJpYSPi2VxNSMejoYRuJ1lkunQWFS0iaqRb5Hbiutl7BptSSerNzxpecpEFpDbmDiWnri+9D309GaT7gYMR8zYwfDSMiqbJH8aVLXJqqFczHuCJF/8oxJtDrkLJXeSJpIZG/ASdrMBOQy0iuh/i2Jv+SgzkTpuieyjAjARM0iP8htmR1N2LxqEi9z3ImlV0LGig4ARc1CTZw7iruf1G7SZDMczQucsnxWY+Owd/MkbRYpkMsnYpMWCdwkvnJ3+C59p2acTMraRLXwwMhtp3gSPsucNKkZ7jsYbniX/VZJ79TTyrUwMwvnx7gjmPv5LESPrr6cidLhTZOJ7DWDsFnoNHLbPwsN/zwzTXYDwny7bP0Hz0XuPNlHPcnbJnS2PENBIzSgu+lW3rZO8qDmdPs42HBffsfAFJBL44AlP0Fw+67O4IncEaY2mRYlukZwF5auaRQRsyhlolqEQi6fclDa5SqUBqvh5LfCVfb91O1xMLFqE9VC55HLqaOET6Yo0R8KONOlr5LoYkQnIKJmUXFy+ZSO0ioXpDRZmR84aKDfSpSWx/pp3e3Xj9JmoWTGHSHen+SL0uQyGC7TT9l912Hqa2fX1IXNwkUiN47wjv+tX8BNsXRl8rH9gG+9Xlv7+KbHDxIlKyE20fMmXNvyW0E87r9b1GGr4ASpUR8B9mx6C3WRe1j+UWmVw1SiOyWc6ZuebD8r7vkZt5SJapE2cvmspdIqp6pE91M4+2484D6Z5EQdFFGzOC2Ry2lshM8hKk1ORsgOhpKVb5l+xKy7MgELpZPL5xiVNqlJJbridJZKb2/qHyVjmzJRLU5X5HKyGeETq0o0EblTS4vEnNFu7YXNIu2R204RI3xWWGkyG26eFkZLm5NQJ5OqMtHRREvuPa+Zv9Ubv1OXVnS4j9x2woDfvv6wdlnTE3iihBIqiJ434XbLuwL6+2OLOuQVVJA69BFgyaa3OJXIZSRF0ibhr0RLO2dz6ftLpSnREYSoWXgx5446e5NOWKJ7tpzxQ0rvLxk6A5Q1C5vj3J0D8/nzThjwOee7tdM+FY5M6ztAaxNldN6EzaMvDFT3s9ZyeTngvZee4DauzoM7Re7uBJPqWAgDAtxZWnYzapDIGMu1iWpRqchldGPCJWSW+A5AB5B+W2JaIyklZPZHm6gWaZDLZ16WFhmbJV4TdQY3RyypNaddukUjbRZOQW7bbMXSLtexELnBvtJYN4xrPyW+ilizyYLZi54tNExu21zI0iKPsjSZDUfmvqll4yxEPBn3KROdRfwx7ghTmsTM0qTSn7r5V7ZNHVtPuzizCfcW1Uwun/9Z2iSOlniJ7QB9GHUYkjNSZn+1iWpRMHL5dNDSJo20xI/Tc3csS9WWmxOdAInaJgr+aP4Rxc5mnpa4jdzJpVmalxB9ARa1twP78e5OHXBy689r9/upicfx7/SiJSOzwCzvDqr14ju94WGiVevthoeuosIZDC8znTrvMLz0FRXOxeC40av3ToNjqKhwrgbPnUGDdxk8l4oKZzSE3mP8z+DjtLKxDTzZUdVuhJsLJ6v40OrDt7bnqnch1l/12rc263vXENXCKOSKBEobPkkMwOSkEaddWFgLm4UbMu7PheZucrdQk43e9IVuI2pfPu1Ms0j3BlZyuw6WNvInMQATk8WMNNcVu40E1VVW3TOE6VfKtVogTSG11wUZ2SbU0GNoKJfWQcPqMEDNBhblRW738dLGMIkBmJaWQshsWZmomyhbqhb5a4yQGOJmSjloUWNBEzWLYiK362hkjyeiuGg6qjkACe6tunurDxDR+SYRzR8DEsBeA+z1SY8oW8ZIM0IggXxrkm99RiGKK2BF8DmRoINqO/D4IWoyklH1Dkgwod6Ekbb+LkTVPLwIPgcS3LzCm/s7gWloAiKahgAJHlTrg6rD8v7hJJDZaM5z7wAysk14SFICg7WbvgfZnKcicMktdCCRJqFBrASXzYFKfvQEQNmYxWkmt8NIW38VUTGJyCWfHxJQqoVSjepEFl6UlGp6gODj46mPIxJo7eXxuRDUfnSN9kDUigXBa0aC2qqrrT6aEB1uiGg6B8TcnlxBVPiJcmcGpidYiBJKqFX0vAl3SBtQ5XdcufTbJ1gJJVQU7S10Qa54Vx8DZFby5qfpA5CA37Xwu755RdSD4qSZLxRA+7g2ryHxOREpXrVwNsqONAszeZkVKRPVIlRyBcKAjYwSAzAxWcVIM25RyUjQQB0N1EeEaPP1qOkikACeGuCpT26Isr16zbgDCXivj3d/GZlFeHlp5geIeRG5TCJJapWBkqIVAmfPWLS+qOuH1C6sBUibhTLJFY7ddpjKNYjoM0eUUGK2oudNKF/iDw4y9Suj7RPzhGB24j0hQKoDqT55Itr2paQZD8SrqFj7rfCYEa3fSeaS14QEx1bpsTkc5XJBtB5GawSwCtHzJhy0VwoHk/qV67bw2UcAa5DtF0gum6yW2qW5pWiR5KyMxlRLusSKDLSsWaiQ3E4jyw1mkQGYjFggo2p7jDsSaFG5FjVajagUR4jgtSEB/2rhn8cD0Q7zrJo9kOBi9V1sOpjmgszku5gl1UBMj+TKoD7GkFmozkvTZyABfRXS5+9CdPxFRDO9QAKta9G6RnshaiWTInidSKB0LUrXZy5Efd0PmjsEEihXvXL1mQfRXeWX5k6AGHEyboQKwZZ7LuTWahr//ueRkVkQlXeJ6sV3LoaXjFWrNxtePhUVzmyI3Wr8On/tX4d/e09le6NHp/H9tos+hs/uc/3GrcXoSrHBPfs2T7vUiBThzhXGvSXipNh7zwO6pwGRgZ/JUJ3jJkS8GHvchR8ABnfJJgclI9nv4SX7ZfDwD+1tW5SbLsdleE8cKArbaOmA7QWbsVyuDotO/qBgIsKITj5nQcR94m/5rQdwKNh3pUIHnwu0UN/IbafUUD53ijWZKWKXbShP8SyI3Tvj2HyIahEyuRLPAeDPFUxMGWlGANS0Qn07GYbyKWisyUyRrCZDeYpnQdLsdn4iy8c2oc1Hz2j8Eq8xoDoZBhiz2dI4UuZnZ0RUi7KSK/D8AINOOS6yB2qyinxiT06K/GJPcoj3sWFWfqLzmd6qLNJt72+FaMtKy0mpAWW/NsC9N3eHzxOQY/A2TZNxT3KRZ+LMLSJ54kxiekrBTSnIGRH4phQkP5HQCm+QTSKTF0Y9HOABDdvlrbKNkl9ZaSzfuGzOfyvNCL4NDbhvG3Dizd3fsyzkikif48klUhpl7hbJjDJJKdswtyG03g5zdkvLo0eyOqTlSkCVJ8GSvkDlc7ZwYMYdEXqTksyaLdcfXFaVnOsk+FAiRyDvgxM9W6iVcUe42CRHs2Y3HH7rAMueOpx/GfcqE9XCfUZu2616b5mEzmia6ZPNag5SesmTDHw2Z4vTj9wOnzTCXy+YphLRXCFQAxf1TMY+a5frz6IFQI/rA1ZfKBZMJ1gRgMiaRYqRy+l9lE8ZaNFU3d+xsC655InJC0om3dpEtfBIciWeWMMfK5j4YqS5ABTE/YX3xWPSEVqzU7TqSTUKJn0Pqnt9Qo2COB1Of1gQncPpM6DBhSJ3JMJf8kX72H7At1zDr30/E+HbWR2BWCHK5mxMJZdRHCmTQ9Li2SrdlB8pT2ybVIM51GyIaqErxh2RcpPX0pqk9Bg95UXBJI1IpG9eWTPIyeUERNomtaY1SenN6aktCqa6T3TweRfE4C/4e9HwB/wFnwS08GjGHZPEXf5Pi+YvZ3vZtyvpm8k+qKOwWYRBrsQzffjLBfH0MXwy1JRG6AR41YcR1WaGkqatQAOc6sDJ31EQnjpw8ikK4uvv9bcXxOzv9enQt/Qz6sd406TLtegmhjNVtn068mNyeYcmahZRkHvAsxTcZANPmuDvLpgoMKKDTwVaeGnktlPFKJ+K1qKVH2dyLPCtzEIHYvsFQ9osakkun7fUWiU8tej6I+EZu1wweSBl9qFNVIs4k9s2R6u1SvFq0eznrI7G1EviTI3mQzCyZuESkdtO2aJ8YlFrUtObTCxzwaTPF50YJ3mJLLmSEyLfXElWeorhNTLMFRHPNTJMepHnyef9N5On1crCe8E7irli0Upo1f2LYBZpT7Z4NV2r1a/cLS5z9O0riUUugSXnRJrAEqS1gajv6Zm8qDKfz9bq7GV4Xv4PbYWFG6W7A9i+bQBR5t0a5esM4x6RxKIF6b1hMIAY8129+M5kCJQcOrxtenggpxlUOA9D6TXjf8a7DIVEUnLeht7tcVwLYegUFCqczbB6M57xEsPizFln43MNL+w98AzY/q0FfnOjVDla34YTvtm//xZmDAisfjr7Lua5i7qMK6ifXmMtftejtX0hfCezxbSi+JUz/fJEZbV+C7HJvty9mV8/ki2sIHDbUpnfQ+OUfcF7M7NOVKWwWsBtS1V+C3HKvq69mV83sqOwUsB9Swl+jwzH9dXtzcQa0YiSD5zxjRX4XY/M9aXsXW+3Gz/4xRMo6sai+x4brqvL2JuZdSL2kkIA94219s1xvPPp05sJNSD8Cmv827bUzvfQeF5fkt7MrA9VLaznb99SN99CcK+tRm9m14tGFdbzt2+nHe3Du3U6Rserh9y8+dCBwnb5x2++sRS+Vw15r/+hH/DSkzcTakB2FlLit2+pdW8hqtfXizfza0A5FVt/3/WrwQV+Dxz1K8u6u9p9SMtoxWLxjSXnzdGr84mwmwk1wMeLIG3v6gS0IB+ARLP6Eum+VncTjtFJTfCN5ds9JCJTV0E3E2pAyQqrx9u2VGj38IBDV/nczKwB56N4qvGuryot8AfFAYi+5rmZWSsKV870yxOVhdk9MCTRVz038+rDXy8pFW/fWJjdHKk4nyy5mVADUi4s+m7bWDLdGIE3nyS5mVUX2q+khLt9Y810czDefMLjZkINyO5Cku32LUXRLcTkqXLjZmqNqEthqXb7lqLoFuLzfGFxM79ulKKwULt9Sw10c/je8c4gJG4m1ICsFJZgt20pcu6hUXy+driZWSeqVuLhRrbVBc699YjI411GMtzMrA9xFBZdt2+pa+5ilJ8vF+76RHYjndqK5ecba5pbCPiTpcHN/LpRt8I66/YtVczN8YDH27n0t5lQA+JT6Nm6fEtZchfDAn21b9fnxxsd1E4WwDeWJLcVIPh8fO7Pv90HEJ7gpcY8dlo2hHerNBzg3CW8XcdLQGB0kit8Y3lxD/xesL52t5lXF1pUWPDcvqW8uIUgQV+c28yvAaev2JLnri/5F+QGSNSgr95t5tePrJZUPbdvLDTuelShr9htJtSAcyuhc27Zimri5vBCX6rb9QXZDVBiKxbVNlYT98hoQ1+o20ysEc1VIppYNxYTdy380Nfpdr3FbsIyW7FotqWWuNm7ULV6fPltk867ubmCxj3OsV3qzruJRM3TgOgQzly434JK4Wckab0GRI9w5SL9FlQGvyJZ6zUgBgSba+u3oO5wGylarwEvdmHIXLTfEuX+jbQwbfW0Hi914VO52Li3RIQUW4WxPwDM2iW7iaOF8UUq401PZMet5TbUn1+M5iqY/tyiCM6ffcE3vM0BdB/YZpgSHmAnRdepGUX6RKV1fHCpXEiboUN4gD0DtDtBI775ENUCIrndh7YZdgsPsNPienMzs5wPUT899uTJRLUZGsJDPM2dQCK4lw75mAUTye08vM3wITzATokZUeOePEPeNsGkRCm2zfBHeIibLj0myG1Zgbztu99H3pjPNWnEszmHurueAeBcknBORtKMiPrpNkryug4CNJSFB9hJ8SepGXHMh6j7mrrIOzQa0JASHmCnQCMZvVrMh6gWkMjtPgzQsCo8wE6L68NNeZ7jE/nlPOY02WrlH39IR/nRAaa00Y0mgL3BmEBDj/AAOwV6wEhX+hBFfo0Vnt4ezILhDlfD1l5XZvAtBO/V3hwG2ir5gTanK3fv+nXOyDaiRobZEJV+I+rJk4ioNGwVHuKZ8wQcQV11xnvyaxaQ+8vwKnik0IwWIoK87QvcR97B8Z4egSc0Beqn6PLa8RMQlN4KaqXII4VhpCu2jr8pSIi8J1/VgQqn1t0zQAePZBbkSQQPI7kSUWk5DWdvZ6ypYVF4gJ0CvWdk1DUfolpghtzug0wNl8ID7LQYX24LLR/9Gq+FA+ofoVY285NXUkhNV7GOn87QL3yXVqdY+FPSjZmuQwGw/BIcUm8JtdLJL8tTHIx05dTxU1SwqoFXZTWKyp8Uj8lr79lB3Og2H7jeXNCpYSQ8wE6BDjDayXWlfMyCQnI72tzqDWh0FnwLg8XVTg+7mRhjsOa7yJPALNiyw52BDwR11Q5+tgTfm0etjPFIgRjpyr3juwDZ8MisTtb4k+7que1nfcrHvtw6yOs25tTQJjzAToo/T82Icz5EtYCc3O6jTg3rwkM8naUJ3AhgcrENUJRMhZwafggPsOeA6WWoa66IWH4+hdHbQK2087NnisBIWZSOnytR9C+sVjZ4pIncCPCTNro3AohY2KlhWniAPQP0gqCu4kGx/P3IUHurqJUkjxQnI2UhO/6OG5R9S6tVrDxEmBEASxtNUYCT4bhYr4yfwE6AENTlreNvFkFIFTALxne4M3C2V5YH+Pvxce1ttRq55iltBaNfaMEjvzhD1beyWkXiIcKMAFsuZsEUcjsPRDWChAfYKTFf1Ljv/iZvm2Bq7zUW1QgmPMSNlsRSIwDKxfbx3N/T27k2HMh85up9/Ti3jfutWBLt39qlxlW8AuPP8IHikstqpn+wBQU+ew2jgMGKdf6uPgruggKjM1Rw3HJb7fSKp6DA6A0NBx55rG56w1tQYAyGDoVXXniOJJuxv0Ucx3V1hJtzHiEbhHLoO9p/eLDp7S/Hfz0yRsO7hagWRiW3+7DU6GFNkge4iUljcibw+RDVIiRy+Zyf2ypB6DYJzkLouE+4yclup5ms1xnuCNofKqfKdnnz+eMbcBZSUxzS00asIDAcPY5N1nUplxuFQ+twwCVPi4DFfZmFfsJk4aalpXFT3tiRbzYcfQ9Q4zl8HVwpF0NqQthzMQs3YdyfC41rUvduk1iv0yt+ufI4bA2/sTPIyCyUl1yBTe+dBdqoWbiJiUlyytYbP5Eh643ZWcD0Fjyd7+OkarrxZqCRy2WB3lYpozdawXDnngGcoaRe+LHfh0LeLKqJXKk3QKtHdx2wulVcEUE6OOWrWzNW7B4euUr3ZAgf4CYhvXHinr5d3ix0TO7h4avUTO6Sg01FZk6XXBoXG5LUJFiV7jUSPsStl36jGjUqiFzM4sTIldtY45OIgbVwhow0ReUlGL/ygUdvh50FTHuBm4Ym4qRrkLG2AScb7GR2FjDxgqfzQk7Kmho/KeHV22WTAvwK36VRnPY/h3zMQs1Nl2614ROwLfyp4dBv5tjLsYynxomMsVGbqBYnQ26H2yDcY1puO7jSFE67pXHyMYu0kiuxxb0nIUJv4SYmz8npxn7kZ7ngOYZ/DpsUWCr8Onzik9wurFblYxY1I7fzreGdxU9E4MJNSuWhprz7I79ox9HbsEkBR+GX8Gksp73bv/Ixi6aQ2/nG6XofzxUOvfPiTT6/cCjdyQEpL7NWv3Rk5WT8OR+iGuTkCmyybn+qwdYvh3a42ClnEI7Lr3KhT+VtUuBr4dfATuKjmHr5zrT8DIr66toIDjcHtt/OiQBXLmYQyO3+zfbqz7SXg1PZGnLKqw3N5f8ADWuP1QgOnYM9kSZHgJCLWYSPXIm35avH3+Tm4E50kyPAnYtZ5A+5cpvM2+N8PepAnkSkqJxhjC4/w+LoziYFDIWfT9NYTro2BeryE1qAfHjkmBSELfzsmciTI8CTi1l4N3LFNm63T3aLYPV7FtpTVA5HvC5/lzTG3qJNCdNR+E4HIqe9wcjHLKIkt20iGm6XyIabPHsUryT25eKNp20jN5pNIcqahYuTK7cZvj3Kx+44MCdxU1TWKnqXvwGFOVW2swDaC9xZkHoo6nprrFlkQG5n3VmAMgVuGvI3J9UEjrxZFBS5B+c/4TaZVLjJeLj5XtCVvfz8lovlLq/MSZuFd+fcUWe7SxbDTTqGnR0M7yccemukkwlGm4BF9SO3+00PHlD7R9M5uNMKbmYT8yHqJqqQILxzWUyNsHU3+Xk6tOrWbNbD8HD/unuu8t0s1/mWNckDwsXX2Lj2enJrDYiwXxtA3PNu3bRYo7/cc8t14/jvfhHvkQ0g+rxbL74zGjwFu3ZvNXh+FRXO3ZB79fif8c7p+YHEmb7CeRlat+uPawEMjZxcubMaZm/CM15smFRUqozjGl7Qu+MZ0PfGbuFFvzUOt+BHqPnF80Jt/5Pa2x7jqBw1Dz2wPiqXYoAbNXenLw43N0ksVpScaECIFTVQ+4RHT7CetC9uVlqccFpz/UxiP2APdnaKcV3iz9hx7p9WA2//vaB506XZuksltOZWUBuIfbH+4lxzh8QZ68leZziuw61vrHs8oPv1z4WLrSQ9lQf+XpuoAwpo7q7fy6zgJdG4IRolUiPNkcRlpMld4pE4ckHinjiSSOKX+nJaIkx9yYXALSok8Hlzu0XC3Y7bycHZSNDbrS01IbXfwZe4WRgfuXzM7ghUb1Fk/QXKFkpEqZjgtIlqcSJy5QJc090vRZZHkvjmKDklCqPIXRLRKJKbRJ3Uzm2cl8ijGnb/RBuIfCgIJG5GFB0Si7HkXonMWJKPRHs4+21rjwfQIpd95ErTzOTO7sc924CTbu4Og3kP166jRtdlMpEHK1iZqAPS0tx9hO0uuL9KVol7YolaiSIhciQtbBitGT5IpH4alBJvP40Wid3YcyDxZ+xJLxE6oTOPuyU2K0R6b4gN0I/m7vB1n+ZQYjEeySixREouSjSRkrQSXc7lHnbarJxLYonKqXKbROtUSSmxJVouSdSJlqQSS6TkVolzpCQLOwXvTcCb2yXYm4A3ySWO3MhtEn1uJF+JxmlyUuLrNMkqkSVY7pLoEiwpJZIcCQqJLkeiiJ1CXfDbzNtklu8yLdnab8Y0y3KFzYN4rk3UAa69ufuLmVxOv25RiTa3J0+JKZdyXOLIpWRhD/TRuh2/OVRBI9H7j2hnD9jUsKso0eXuV3Uq0RqnpJNo/CZoJRa/ia56VU92WBblGTwkRi+LaonGb9Yz9rWuSuQBk0QSfcDnXokq4JMbGkBc826NzDG6yz1W6obx3/0C3iMbQLR5t15852pw5GzavMXg+FZUODdD4sxXX++Ynh5ImEGF8zTUXjv+Z7yfoZKRKXMWw+iOOK5FMAxKSpXObvh6NzyDbf/WohBJKFT8DqlXcjrulbrlxeS5Zxkn8jcLfvFuhGuK/DftAN286fors6elb/CIMxvnjNCcLP5i5LK/5Dd0R2Tzh2e1AXfupT1AqGAvCN8kTCKbYHjf9u1wDd7dqQNv5CP45tmhc2UEurc8KNIfMJMQXPn32O42sKOjRtwItzvgJwfNEbiS9U/1/fDl0BD312o0egb3/j/0zr9F4QfFy4q26xjcR9vNoculX3C5eRH5jx4f9PXQB0ybxvKXBe3OwtJ5N4JCpXdHlGsKeGrGPY9bfAxiJ4vuJrezru5CC4Cozt2+M2KKYBCh6p1V6EsJny+qwFWJ9CUHM3ds4GhHvbpxt2ILQs38VznhYFRY7Vr1/CcKF35W/PzhpaHeiRf2JtSLILcu/VroyYrw2wRh0T3kdncTvOftBujN8vqtZL7PMgmTklcwkl+LtFAO3o1vljvfXbYl6kUXRIZH8XCwsiVNwI6t2Fbt0DL/Rbg4HC7vla5/4rDz80dvsarxYLuZfjfu7F7VLqYgDmzFhvi3GV4rxZ+LUV3dPp4PE7fZYSZAr1lpSzzxuKvWtQRQiHrIFlCfOL5R+Y/3rlo/CKIedqVNL8CNyn+5qyLAH+o6vtqegFQ2Kv8B/y8C1LCq6bdSdI3ArxZAQ13D70Pt7xFLA5jqtzPthhMjNZmdzEQKUHpusFNgsW4FtPq1yK8eexNb8X0gdVwmzw4Un/geA4rlC2CfEu/oMpy/1zYFSgIu4Kst1z85MrnJFfg5B1/1pMerudVlm/+bXksC5gY7ID82+Woe/wnXkvKXTZZraK9/vZkCVH8JzKYnoU15OmvzOWDC06jTLe2rCS9vBzx583Peho564rPC8ZYZz8Xg3bbcTg+wte/5SzDf10hjktwunROgQTV5Ay3p8Bs/VMjKWuz+R+4C/Bl2OH9czQjKXVgaU8013GHCupoHx/OXzGwyjMjsZOIwGNpzg6Yg/7r1fQA8+7XIt0PY+e3nvA1d9I31KxSyhBDHPKc/ULL99v2W/GUDE7kmfSbJ7eqzPfreJmc8Yh0uFa7nWqv5ZwAjSI/YEYbj7x3RuQvH9KbvvQi77SmGLcFYfwHPJgt+8mZTvgv6zoPcbjrrMfUjqOIf4wdjxk44tyt7i5LHEscTFA9tJr+qWrcIW5GtvuKv4YJMPjSceEQzeTj0QottgNy/ID4cw1KLRzWTZ843Bw31FXQoFvGoZnLT9V7BRlA+jgy9Jx7VTP65ZhXkgfBwCBgwHtVMnjknDiqaxzfRbcSjmslL13z9bXvlPAZFGvC7gaSP6mdGl4tdJT9W7c42v06EGdyhs/jaPYmsI71hJfwGKQXjMj8x8V+07tEqFV8y8V9A6JSG7Zj4r03olQ4pm/jPTxiUAeSd+C8oXJSJI5z4LyxclYXdn/gvIozKh5uf9i8kI8IzreZ5i3wvVW2g7nCEI8BUM7kwSvyDQE0G4Mok6Q8CLRmQkVnyHwR6MhATN9n+IDCSgTFzl/0PAjMZODcecvxBYCWD4M5Tzs/llzdvJdPlYwu/DY/VvhVUrP7PrdGVXbeqm9PnUwbA0T1e/P/doK6FvZUYVkB48X8gCMkQgRAk/IEgJkMK2RFun6+F8ikBn/HMWK///aE+dPvhVL+llKP4vcyWb+Cl/3XXX33JOZxQbZy8s70Pv52apRz46G5yLjlixZKx+1P+t/1E+DtYCSNh+4CfbNHi9zILHfD8J17J7w7uf/Z+HptaxyXPSL/rJv3r9dsYY2vHywnJdiPj8ZdZlb8nzcS5eOHx9560YZsqAhDPYKO7aNNiefyFfRWwRJNFeFj/aD3qHDraVBHAPX22wCQAIRkrEZfUi13GaKmuf2239ot8Z4RMwbtyy6cAUI2lkSdrcogcE8gUcWy/2CzFgcUDcy8YzwP1FEr9ig9/vMj9STdE6St/daDUL4ZKCZgjfitmuA6omlaB9xTS/ihUY6nsLGi/FsApeXJSBhqw7N9nXICmD2AtwkHhV3hZV4wCR585D+E3IhO3CCa16oFMdSSb7JaVSeuqDUK5TlFtqeGg9EBsLSx9OyuQY9c3FKlqzaqhO7cA3ddYUKvas3oBf10GzPqrPDCykJVSOkhRgegG4ucl2IOn9gfX0gtH3K1gXYx6dAPVwtBlJrrRtYrxZ1Oc9X2poU1d/ab7ZnJBU7w0G5LDQP4aD5nG/OZaW+AZu5cga4LShlgrWDrQHe2ta5pfVXs7c/knlqq8aW5VGYW/jy+1u7V/aR1mkvLbq38AMPu7edM/2mDifgJznFG5coDnS6JOOMxNcv4Hc+6jOf3pCqYNii9zG2O5NHrA3IYN9EBAvBagYQc3qCpq6P0CKY3Q8VhsuB4m+brJI+oY8Qx8B5LJqun2LCdrS6ginFFZvTiyxci/+V6P0RG96fzUcqCsEukrpHHReYucuqDTInurnLowRfG2clqKV0fVm9NSKFq9OZXLDH5N49bqRJAFrB2M2o+9rGuNXKMyCfWv8jgLKCdCXP6drDcH3bmow2D/yJBQJ5uorUP6QHridHOJYi3WF3V3LEr8gnhyKqlflExOzepDS2V1vx589p3O8qKirHcJ86LTUNQrtOrTHxAmqX6SmqWZ5l9XGMr43u2y1pSc3+TsXqhmgsyJqRT7CoWqE+gEZf2F5I+tzZol5ZrudUbdiYMTLy1FhVXmMnpR6Rr5792KuCVYX9rMRu7k4tsMjh+zSbzM0HibzZaXfRZv20SdSK30y92hOfRP/yt1b9txRv/qPK30XDhKUMNeFwseo7rIbVkm+iHhtYyaW0aXXv+3QnDUnuX7GZiy/pzQQoVD7DXPCbrIu4lIzi2WWvF8guw0EnUiWSzTSD9hAg05fxeXAone2HFMUV3E0aZZPbRcXuvLqIWELGg5B6f6GM/RXc/ByB0yBXcZpBPSaU4fLokuC+tG3YQ1oi9O56T+hWQyW7L+5axUnuvWNMCyvmQj+29+XONymjZwNWCNgfWgBEv1k1wdqo42dgZmjZz/iitLAq/Z9yDWIr0hyRBdOIlZPbQcVyzesM5qgcBe+MKnHisK1/uyaapZt2eoGnFZUNKf65n36C/+b1+Rzq4S6qYT+h3CYGBdKIGpHhK/ljj95K6IpnlUOwMWP3ayfhYtpTya2pCNiCt281yYUshS2nm/DeQcmMKlukkpjdjUhtl3Z9makotVVGyzL317WNtT1YKW4d41a9VE/PVW1kqz8wE6UBykRjQX6QOpidPNJYo5WF/U2TEo8RviibmkflMyMTerDy0tm9Zjzzqd8xHSt/O93JUjdLAsLmGMFUg/4eaCRTl/FbcFXSH2V4tuUSPxl/Ai/ih1KIlSFmUdSlojMn8XeVXqM3Mn15vDFJ6xIirNXALDoWnQyKvz1uUwwuqiKbmg1VBt2fzI+ucyhzbvB2x9mDE5YKOX+LvEk2oWtEUTumykD2wtipsOTUQPTmsL2uIIX67IPxAGT1HcdUgieuO0pqAXWnUsS7Yc2QaORybf/Nvzt8tSAjxwtuccRkGBiwFbRHWS+LbE6cMlEKubVqVKGxZFzOzKNsys3xkT4nLneEMPoGsqil09r//2+936zOgDjwOuMVh9aLyshrrZBMH6ogQX9W4D+eAXdVqsldb1wsu73/xev92Z9/fpjH42NcGguojhbz/NslcFqIeNX+uQfsItCDk/i4untVhvtMUwQXThBKZ6SIJl9ZOuKoXZXNgPF/Ucf22mDv8T3gN4gc2h4kpvVHKvW9NSN9+PP95pedeTRlJ+iYh/p+EnwTBwMVUD5eqOQfu/ynu16WRPQ/V0YZnhdHKObRbWB6Ugqps4xgyrL625XbNAfQCukads89tM1/SvXSX7fLt4sp34w1wU/Ah/8t6a66Irobov3qk/8WS825EhC/d1dn9elebK6EkxDkaPIn9ZOEAFi+iLuSqJHzFy2uDl2zn9uZ61Jf6Ki62Grs7zk19g2DMNZhXSB9IQp5tzjGWsL+ri2JL4G+JJdEn9Tckkull9aM0GMAVsFlKu2uWjPP9IklEjsLOnF+yJpC0H9vUcsHUxBQVODR06sKDA6aEzVFDgaOvx9IICJ0NnvaqgwLmRRSVsRj23khc33HqXN9z13AY9BkCpcwwotV4VOO8nJPlXCTOB630bkKhX522btYht6uP9DyQ7cvV7/949jy7YNN7mKhAuhfQBZ3G6OSWXg/VFyqFiT5KegGoP34saMIgSPog2YDDruSbWXazNDfZ/DfwmY+Lk9q9zYvm+6GG7WDCsn2gShNTPImmQ1Zs+j/9WM5j55SrD7tV/HYrosPDDQLo3I8+S53k3F+kLG4416+T8gtwQlePEflE0abXEr5mZkojqJtvEe1h9ac3ST70zs1ByZVQfc/7/nQciuAS69phoF6HOgvQGZS6wnh+B1kFsN2I9KJUl+on7Fk5WS/1VpBN6l6y/Wrqh4pQCNyOq/tD7P1m6dnb1a1sxDNUc0hTSF9I7OX8gd7uUOVgnSq+pPiSZTLG6aenGg3rwLCSUqmXib77238HQ76fTVBMN/YlvHbq5GwQHPwRzeWu6VqVF9WHTFGsPf/PANbjaUSsZniP098gOaYFg3ShJqL4k/sYEOf9A7jZTrE5a3nBzgdbH2NGZkarMc8FzVCX0j2T7jsFMIj2QxnL6yYUuzBL7t5ArTRK98VI8XeqwklRW1mGlNfLMuaIhOvbH67rVtUH3cutmrWsbrrNVZqp1h+l/31qPdC35hwfNefZ0opps4fO/8iBFL9Otfe/WA+vXpsssPjenn9xBCkyL/VX5SSfupE9UH9KJ3C/rL9O2QbOCOlkTpGamV5jNwtVVUMo+BAXk2g0wU26qb4hmHdIbUhlOF+dqa7Ee1MkyRvQTT6Qh9XdJJtKU9XfT5zlVs5jRVas2GxXklpZ3ypzxXTe7XSDNQvpCeifnH8jdbsoE1omStVlEH5xMJqhukixmsfrSmhiorr1V9tYuhNHHv/JgztxK20F988NwDO702nS7fF5qgoH1QQlEdRPlzJHzH+RuccXqpOWk8uIN3LLvdiedZsWWJmdlvaL5wNPwM27O6dwfHYcboi9O6YoqxXc8wDNoJdLdD5Vfe3ve3ecNlHITfXCaIobrz8BCuVwpL67Zeu/sroLd3gMj6Un8PBTLwluQ6MaqQPYtOGikmJmiCl3dWSyseKKkYh4+3eO98YTbE/lV4MQNfT2uwYQhh2pjgwM3XKu8H0674ULS9Ll7ePWxgUEbjGQSXBt1WRBqlnWwFNdap9ChZLWaSZ3g1HXK9SyNJD+rUk6FtalLwFTCpJlJlDgJs8mlwa402Z2etNhOJ73syyBTHGY6MxxlnElmOZdFtrjMNneyypqb7GaPh1zlyOvc5MRzLrnFXcFNd8BJhwoBne7QHwYxKFoIy4I4xWFnck5BOMWxZrIoaKc4zkyWBHaKY2ayVnBOcwIwVRGjpiYS5SjRUhcjLppxx0Mrdhx640shVSymunldvq6p5SAKxNH/ykP1avy+V/HEoLI0S/mbhxrN1SLxem7V71gp4t1Xmw9ue2j4LCJ/IISmyBk4nZxrW8L6oE7kRqIbu8YS1Ze4nhVZf0NaIeMLK3BnnZ6P5Wtriy4Lb7Jfd5cKRdFDLbm8Q/rANgIhuvE2kSUkrx4ybcrb2SugsXOdqyWfvHf0qcpWwt2rGzD/+dupGw2F/inZAUMMrDdKMFQXaWdnVrcuxE64ibzJngufY2mhf1Z22BymNXL+hdzttqzGOlGKTfUhyWQNq5tWbwZVif6AVldlaR+/vWEP/yBIiXLKHbZI+JP+tjDf92pfgPHo7jvuinW2bti4OEzclqKZs++tiBxOiK4SZNbn+Y9t1iKiX+TpA+TarDo7rxZFujsgbGqQZxJKMkQXdjeJ0izzYGWGVttarC+Krrq0ID2CyXxp+FMgMco6/3GDUFyZqIk+uKEsLDzy0I+YM4uqy9gcmfbKe9KaLsyp4YKZi/QTJiHI+VVcGiR6Y9cxQ3WReF9aezv8TRflV6KtxH3AT6KrLesKBfujA1m/Id3r2kbtLzDV7YGE3MnbMeUp929X1XNH3A/FJeGfzJtmw9wDXmH6Mi33/8p37SKr3ZjdVAPjt1KQ/TD/ysNoomtRQfbz6+Eqs4Evesb1eoVCzthY5K8R2tQahXufYtJJ7Cf6YpcLCWbxs0biCCDbuNqah1OlwN/FQ382dt3i0+VvHmbNvzFv5BjKK8ypV4mm2EoDGX09aJRtSTJivwTRcuBUnyHmj1K940pIJqPthkmLnC6uQ7sa60EpLtFPfMAFSf1bkmFLsijr35ZWy1Hv+jaU29HsSbOUtR/qM3ZEf31oliVMMnox3ij0X8kOO2JaQnpDisPp4pLZGqwHJVtLRL/IhyzGS9SAIsoki2gDilmpMihWoz/gJ4UqssRSZp/4kzq0pfVyCUOaPGpEZsAMG12RvU1yfdWPNzNdiTfKArEO6YQkzenDKbIW60ZKrCP6YuWslfoFiUdlHauTvuwA2ryR+Paiosu7JBISV6BeVcKsNpDpedNvMgJKBra+wlKgskfbXwSeBekneIwLrO/QFeg6iMmYxO/GrmMV1UU6sRtZPbRmGavAfcDX9YJ5fKxgQOYcsb8g+l5xdQAnbpVxFFg9pAYE60JLqXm/j+J8P01HW5HD4fMjw4rQXyu7pw7tIuxZRP5A8KQuUBO9BoYHSbtR7M+IJhIR3dg1Vqi+xPWsk/U3pBU3LFXgPqBVhchk1CbDnMZJTnaK07rchrnr+j8h0K8tiZ9WRA+/RpTQP5TtO41mEekDqYjTzbnGKqwvcj2LEv9CHLplFdVJXNsiqw+tSkGUcDMavJYZOVkAk64GPrtxFXeLGSWGvVEX73ZBv0rodz04KlBauPx7gLmH9hesvzeDcxqHkiYX6QsqUNv43qpxiJDx528sFU5SW0D/KlAExmxHzfKIw+J/j+GWFZj26rpXjc9zNbnY/lHFONTGClAHrRBhfYqkTooEjkWlrf9nvfCfVReLm9s4lKCMFC9I3kilWusTR8pCDWCmLipd/dPuwqedoWaReYxDNdQgiQ6KVNv6RKgfqgVGOiql/qNd+NGEBpE+zxRdJuY1DkWobjxv1XgChNTI+oRJVWoCjLNUI+r9y8X+xRcJKWrSZdZ8jUMVFJHac1I1uqU01idEaqVkYKRQqep/Kxf+VoS0Ez+WIqGSj3Y37w7KUi7jUCTsxK6Ux/oTaSKVsoFPR0Yp1AKdpcBiylJ4W2mpDJ0G0VU2AzOunbrsN3kkH+l/Pnar23Fe+01cm//U0fDxtRUK9ul5ZD8YmNiK85xjjwLH5qnBeObW+1wvgxorSPWztwFTgXTTj0+uNMMB5lq9Dj/Z93c578o+BszmuLXkwZYR3UmFgVTBfWNbLVVaPXoqAjkgG3bJisojmzx5njg54Hj2weJzQNkfxsEQcHyx2bwhGE891m8OtCN7HdoGHupMffL0BQHe2KMvscLMiz8Cof6Qtbqbe3aF+cZahPdOQckr6NiqRgyUlYzNHj08mWaMpZnVODBYLNgy47DhyBYfF1ImIV3FgZYRNzeMbLB44MqMwwuvEUZbHAr3zYz34nSpGDM0ecHuyYai/ZXEZ8qHBXS/AkWGI34liem30kMZoEEjs/tT96yWGXsebgPPrCJOudmyYLRRZNx58SZTBmiMseKRxvmSFqF7GDIeMer8UanrZymnIHb/GAvvAlZ0fUQku58ItZbI3J1FGmGK82nzWHw6coljd4S19KFWrbr1JI+yfrUAqiaHFm5V5S57uW4S9FiWkoVFA7KTXt0BqlvvlTOJNAfqH+pz63Ucn46W+0vRyHb652vy0j73JVfvoOe5qNbrajqOodF+MgPNRX0uN33d0JMA0ILzicZBj2jurohuO79dEPulbcPdpmVP0e3hPV9AsG3VMR/IUug6pKS2zVs7NM7bwTiXATsihoHfsap3DqVaaEbKYaHL9XjZZ/fXrsOQ2slv7arxvh2MZ9NSqAAvqKA7lupYM9IVC+/zxUv/5zoKUqv81o6N7+1gPBuXwgV4QUU7Y6UI1oxMxcL7X43l1hFIrfNbus5GIGxBNi5VCtDWkDNWisWakVux8H5YY4t1NKQ2+S3dZCMqbEFvXKotQFsiZ6wUyZqRV7Hw/li87VNdx0BqN7+lUzaCYQtm41JdAdoyOWOl2KwZGxUL71vF257MdSyk9vJbOvMRnagbseiKhQK0Fe+MleKwZu13wcuK+XtS546WgxsFlPUF6HXJUr++Vs6AQAk3dU+VQCD64K3Z/jcF+t9salCL+lAX9ZBAEimkkYMMssiHXOShA53oQjf6oAe96A990Q8TmMQUpjEHM5jFfJiLedhw1z1sYgvb2IMd7GI/7MU+XOASV7jGHdzgFvfhLu4RQSRRRBOHGGKJj7jEI4NMssgmDznkkh95yUcFlVRRTR1qqKU+oICmLnCoRweddNFNH3ropT/60o8VrGQVq1mHNaxlfazLekwwyRTTzGGGWeZjLvPYwU52sZt92MNe9se+7McJTnKK05zDGc5yPs7lPG5wk1vc5h7ucJf7cS/38YKXvOI17/CGt7yPd3lPCCGFElo4wggrfMIVHjTQiiGmWGKLRxxxxU+84pNCSqmklo400kqfdKUnh5xywVdu+cgjr/zJV36qUKWqVK06qlGt6lNd1VNCSaWUVo4yyiqfcpWnDnWqS93qox71qj/1VT9NaFJTmtYczcAJl2Y1n+Zqnja0qS3NhJwKvk3Bm/B8Hr++ybrLlUPI1yTQOVZfKbI8Xn5F9uqRwzpoH+uqYdaSQLOPDT7EQlA2v5uSp5w+xez1t57g6BNqndOGBINiVdvJTeBUfaP4DQLWZB+8JTnyNpP8UQk/8tx2FwT9dwNrVBNy47z/Z6aXEK6NECyKELv4QfyxfgqDGxTOahDOZxDOZBCvEEE4DUG43kB0poFOD2aiFogqKhD0QHPoXl+KAfEnEmq4UECfW3QrqVBh8n/CYf+BCrXvO7I/OKQ/caX7gUX7sfNCNyPQDxGXH9x7Hy7UfRYWFMA+9JRFxTHwCU9fVDq4Pcyw9uDW9QCg9UTnqYeITU9igZAK48wTDDAP7CRPbBF5YMl4cGl4gkXhgfHgCXeCB3d8J9zrHZjTnXA2d3DldiJStgPztYMztRPOzQ6uwI4yW68DGK0Tbq4OTqEOD3g60LttvyJ3dPh90RkrdQ9z+P3JgW3J4bccB3Yah99FHNg8HH5kcGBAcPjFvoE1vmHl7wZn64amyQ1/IKrye25DctkmbXtt6A7Z0BGx6SrBhIJNfPprcJlr6BrX+OPfk1GyBpaxBperJs1gWMXVqKEHxirRYRpWbmnoVtJ0x1n9aMIVo4GhoeEVhYaVERoyHTTQeOY8s/exeQYXcyYTzWbygWZGSPzLWKAHV1Ju58/V2BOzT+dZxr2U936asJfhJqCYd5RPmVl296lIznUnFLlN2XE0gOZCzrrbz6D4OSNzD9IacwJqYk4mPszdLC/M70hQmOMv/bQfB9jnN9v5tN+eZix+7MMOc5cgDHM1t2cPY1ceL/RIeSJpAqI/QQYACU1OAE9JQ0aUkoZlPIWRhI41tIjgoSf/ehFJqYLliZQqWJxEoXLliRQjSZ5ImWLFSBIjSapgMZLESBIjSYwkeSLliZQmUIwkWeLESBIoU6pgMZLkiZQnUp5IqYLFSJInUqpgMZKkCZQqWKpgMZKkCRQnUZxEBWsWrFmwZsGaBWsWrBk4c55IP6uowIiYqMCAkLDAQFh4kDBIiJiouDBIMEjoAKnAMEgwSDBIxPUxSIiYeJB4iDBIaHgwSJioqMAwSIiYeJCImLjIMEiImKjAMEh4iKjAqMBAUHiIgJCAkAQ1BTUFNQU1BTUFNam5US4AuCVwEGKN72GF72GN/2GF/2GNebi2fWge9qF9WEwfMO5I91Xu025tn3ZrPC2GJ8ztztvX6TvbON/Zxt07//ve/T+h2zAUD7gCAhB0YAEEHKJMcXUDggQhhsSQGBJDYkgMiSEx5Ik8kSfyRJ7IE3kiTySKRJEoEkX1dZpLvJ0COwV2C6w4Dw/4f/+bAE+b9xwwB1P8KzB35Heey3/P2riQOH7RGAaU2eaAtqL8XGBJFXrytfhZBc8NzB9hRZ+8EJP5tq4VbsKu8gMCCfdPeHkqX0ry8m19pgEyWZVwINqAtIJavpEiGV+e6V1b2968NAA25yPH27wIHtSFyIayW+mM/gBBZ5h/NwAbuk2zbVgoEG1AWFk0L7U8eIOo3a5BpJRVtRtAGwqmzLY3BIJoAUIH4XztlJZ1r2IWcGakHaPzvjPPz655gXUXWeVcls4rFy5MXDg1GDZeTgySKn7nt6/3dP2EoX5rKpAwgTzvuf0ZOVjYneMk3VBKu5vS84f3nhv2DR8GyodUnh/6+KGz1LHO8v2eWngmgegChEn6+QavhYhDXhgvc6pZGIg+g/KQIfS1R6PhumkovD21wZkAogsQJ3PoD16L/tbPMTp4U31c5W080dfe6fFWzxOHQ4gqQQKIFiB1qtE3Txnq1i8YKZNZ0v3ij4tC/rS9Ki72G+ZWdjwjd2FQlhFMv70+rw1IhoKW2QYNAUQ3IJzIpq/tqls2IBuKe2W8BBBGWnANXIId5u1QpGxAZegB5s0lxEDRRoTJiPqngpWJbEAxmgzOcE+IoerpYF0DcoOiGxFOQNVroZNigxo3HNS64au6+6WhMGsL/BpmeCJP1G8YeaD5v7SjuP4omt2rJuHHkXZjsG4CWb+wfnvZ3jvzZPc/7Lqpq9TmdL0SSfg14Bh6YLOeeIdPXJ6m0p0A9qfgUa9rva55XBsXh6HoINLNFvsT8Z0Y4+wsxFlbBY07ksOCfPO2PgvL0IOaN0sFQNFGhElNeyUl1VZtdMbhWdcwYGVrz5QyjGP7p5IWKqs+Pl56ZhpEDBRtRJgotz+NrL5XB1JDZZ6wncKqTy6oPbuczRd/5VLtsNVn6VoM3LenMhFRtJHdGf3ZPt9bq71MnUpfAt0fZv73s/U8kzthh1v35ry3lRpWXW0ZTmZ63lxiGChaiNRJeD90kh0k/SVQOzvSCo4Fci8A5Va+3p8ojT5Uf6hooiRv807JY7AmSvmsLuPppK1t1XTS3YQMGMjtQoRM/Pt7yp1t6psx+3rE2uavuSbz0k+5zCr29Fm7zgfOvNYKRJC7ChEypPCPqlrTp886ZXxP1dR1azqVTlcZgaIDKIPsw9coPhB5Kj6Kp+KjuBTDk5S0SXd4M04uNkpXaZbu2JNaagqtXByUqTgs02UmjdQUXbmyKFtxWbbjTlqRmSjQsp/63jm7527TPVi29jw4r178+nrw6IjDlZW8UHmdI/j1OsV7apdnnNzTnxGo0LX2Nn/wG+kM7tlblaGHMW+urpAomoiwww0/PMs910rRc//oTsPD11Ma2d+qicbWbSaUHjSm3UTMSPiKvGq2fnbRgd7lPLxXhh6mWQ8zn4WihUgdEflvmfmRFGT/2QNl5+a852P70KPzVUCncZ5m3qz4+qDw5jJsxjlqjYo4Na8OqDakIAt6+GUvnXVG56VXUO3rKUtFw5uaN6ejZtpO29bbm6PWGT+x9y4/iISIsfwpbGVnIQMHoNuGbc9BouhFhJeR+Y1cItTsHcvQw2XW35W/RdFBhBtk+fUuLWTqTw7SeQYNUgwUTUTYCZh/2FHT4uHzcUsZpWC+0hER5sDVonJTxcJQ9AHaRrjmt+J+VUhVd3lUQOlW4aX+enk9e9powVBSr4XJ8XyRxW5h2TikjVUsspozoZa21N+cRXHHTHEYil5EeNGkP60XFVjNg1zd7JboXVWBBOTGeavGmU5CPLfzLp0iyW0e0wA4tcRD7sUGiO6bhbNGouEiaYHClUKRGRyJsgzycw3AZ6g71ALdExNv1biPClKsuaf4vS8pNhhrlincPpO/GmqMCks6nrAwX6u3tVDjItpR0FxvSwJVncV2NOK8S3RPfUh6NFYpt0c2KZW22nkMyeUx/e7bWiURyTpQ7Sy+BHDNb7R6Heg3snwJmG+lslrVoIKGGm9cA7wBq/xkYUKsCMD1RN4UnnfVguA5OajiBwVIT8mB7aEcOJ6WA+UZOdA+adRazmYGmLHTl3hD7mZ5oIDDKnBFtaFQi4OXD+ONFdYnykamAB/iUHNYpsHLgiW6dIKNmI2FyQVb1ng4cGTC5oaSBS8PtOjSBd4jI6wOwy6Feiitk2pObcKuLHY199UmbGaxF3LhzCvyGLQvjWzgqrwpPC/dhvGyNVfXwTXtwfZEX1ap9pm9ehonTu7UwJxjureidef4fKjc2Ones63IO3B32MtYmhA90smdy+uRdms9TT2RebwZXe9GM2yjEnTg1ANdRWphOXV8230LYzh7SVSRGtieVDW28aJI9ck42pYKjfutGudygKly9dXqqk9XnIIlGe3lGmsVVvVkvE+WqhrPWzXukqRJ2G0gTpCo/UVzgoJXA+rxdwAP72+kD3XWinGq8ljcZUq14bepgxslG69Rky7/Or2FJ6cbG4Eiamz1nM/w2/ceuB5Hd4nzXaMzCVwtyTW62Gfrew/f+wVWa8hNNuzVGH8qOT2AiLCDJ6kGZPB6K6MGPu8eUY9seTTs0mgUBvi0vXok0dhoxNCgEV598mcg46cd2f0awmeQVSd4xt4dQTNqAfokzBheNZjIKrJjRAj1yZehVFoiq1eoDMlwcUT3piXJcJrE0JDrbwcFGJPWjxtrkFtPYt9OCS2NzBN9Mb6nipE8yk6Z2nglFo5xTYpq6uuCB6mF+EDgGG0MAgLvzT6V8AL+gL/VRkL186Bc1C70USTxXzfJ5vYYWZtCgUBtEBC4y8nL2iiqYVGtuQNxRfI0VXIQ4E8+GWuFW95KyaNMdR3b0BNtCJxxnW3DkkMiwoRA/gwhIMY2RDV6u6GaKfgHnHu2iCeC9QCMCMYAEMEx6HyIKT7hB8xKgfsAfohbhng94CMLD2oP6E6sIqP/VX6KSfEBebffqTb1S0zdhUCAH7yiD1wCQjnuD4urTOsKbYvV/CsXvgdpAHGlLYZRTMw7FegrbTGNYmLerkBiqb8MiGbA54K6oHc6XCKQ4ffdhpduJ892gi0MQYxMu2SALW2xqGJj32YAb6lAWR8lJChiX9YUyF52H0PG8eW8J5LV8j5wq4iKPkYskROOBHCh4qk7WmqupkBkwG11U0ogFEgSb5hHNPsdZ9vZS+p3S/2HBzVuqv5R984l5enb4cikrYytDeuY4xLtmo8+2Bl+vVHNwjKzsM3sO8b7WMOTcjoOlq+eJ//qH6U3vH3ADG+A5QlgEEHi0Q+twYHdcBK/vmmj070Ye+BmZr2zZkd6GyHtaJr/ZfL2lWo3vAM9tMCL/X4sJb/pZ9+KDJ/Fo2cGn2fj9NkOxPIvt7Y2I+laSp9Nz7um8GnOwooeCLxYNkPv2kyfzdD69uBTCU2ZtNjL7YyLro+vmD1wM51SDFtzzVH5elaBF1tnm5n3rcnwJ7NF2bcLn/Dj4VoFXm6XXNR9y+mzOLum8WkOy0YmCLzczri49W7kHrgZr/I3t7YqoRVYFHuxuZlUD50Yf21i8e2hwF+huOCOib24QRHs/BEqmxl07ZDhsxW+O1AfVJL+cN7U+ndEVdjUtUnZ6KSIPeRNI+gdiD21yRdb92plO7YGm6JWZXUgbv2FCmMUKU6ood3gv1rZwa29UPpYHRhLk3NYiYxlndY6hfO4ni24F1uJTeHROF4ew58QYy89NrGj7skG1+U9i8wNQSyJ/fClSBmxl3ECOcz3mMUJdXZM3Vnk5U0cuVXatMnPeMMVPh9Id3n4rDdwlI20vfG7Uu50GnJKRx1A+BUbUozaP+HXbUhvD8LG+QRPqiGizth7cH3GboQtuNfP0sxL3c6v47nMjpnvL9LoEzoZrQ/hs8durTu+W5vt7Cz2Yb4pK222B+CuLIUitiJgqzGZk8mh1X8BdiTjqUxfU+6o7Oirwe3aP8TaXlqrorDnrZBXpVUo3PPHdKQct1ZD1SDVnkO+AnyFLonD9TH8K6bp7h3+d8vKbKJr9Z8DO5L+VKavbuzIZkp5gx1Nvm9syVa3436jDG2qrI7FfS0Z60i93NqrTAbbVv+5uG/IK09l+ipjazCbAOVfbB0mQ3HwkwIvlmS+Ul9XLrWW8ieWZDxM+K3+nbAkPU19eWDJRkd5iKXJ3xtis/jFrcWQUWfNEfe5JHRivS/ubymn7sixH7z7clxuCYaQGGVOudNfrFEYcpdfKl8/lqt/ZyzJlJTpS4klGwPlEZajMKbPHV1pu4QGE4KqpDiXtkARurgkU/FquvovxJLMSJm+3rEk/Yu+mliSfrl3Xf0Xcal0qa85lmQI6KuFpSkYP7drdXNsDTa5R5XRocAL0LEXKcZd9wsNZ79rb9GF4b4LCUWNIxY49pBLuTFe/oX/RbGy+z9e/QdiqfY7i3V5iSUZqjJ9eXEJZY+ZaXV77uQYulVZHR93KTqm6aOLE+qMTP1dPcYb9nKfTkL4Y6USt/ZiEqkHy5G7ZuFn7S7Bl0vIp5WyWNoSQkpxqZx+0Vf/PrivRSo3ZfqHx5INifI7lylad3K3d9+6tbnTYGjTZisttxZjDlmOPY88nG0/1/jKXyxNzqft0XFcc1iS1ViSQbkNYP27YEfSR2X6UmFH1ivKY+xocp//BLaymluDIa/KSkTuQ3HMICWxrHP9KnMWdjqRYG5LjhSJV3aYsIdcKvDhihL+u5JQ3RzAzexFv0NAnJmo8LvNf4gZ+J10YcsI17eC+whdaZXpC4UdWVcpT7AjGaOvFda3B3Yk/Z76QmNHNmDKb9w6DE2nM2xsLfZuSkacsWjcO3YgfFLvpwkJDnj43QqAhVCPZ5GNarMNL+645rBN1nKfWaZy3endXtUXEXOP0JO2fGKPthyRzdxqnJKjnP6J7paJuc06ckm8srsAv2WHMsPlNfzG/UOGBw81qojbwm+FPCrHGFacQMpEqcGdSyuZ9y7Wfyy3qVdKZfqqYEc2Coo78IQZWm7M2L6Ei556NW1Y4oBDjxPIYaq7NfyXibN7ms/hyo7dmEtTYDlcXsInBuitDZ9kNNvluv5zY6+ka8r0VcVe2Vwo77l9vDL7/GPtSsjtu5KndgTkrl0pUA+TW4fJDTk/ZP06uFSy1I+KS+1OeUnlhThNL5Csf1cqL8ThTX2pcVzzuld5wqXSu8Nk/VtiScac+kfAkvWC8pxLSPsFZf3n4VZfaOnRV427mBhDlA/cf3X1anw5KzP/Ffv/yf1oflT58d61165D9nSRb2r43hokKAmihIqimHubPOSp/KppkhJcV9kwtMWd+CiDgNRwHn5OjkamDWXWBc1ZQ1J4sbS7uH/ygugXhOMEefHO/gSx5WaSeEFouFdeLGFnbCT1ilgKHopVG94zfVNDBy+WfZ4f9uHqXn5+Dh5XPkgoRJu6KIOAzmYH/KwbjVYZTvqRQarhURteNAcNkbxY6jm/25EVvfx/j4b4+oKlGnXyzFEZBGyG2+F3hkPEGXOQ+p5YGi6yVBve4KaGN7zYrXN/Xkd99fJNTTfslhG3P0kiSVBZ7oYX+pwxN6lfhkXuIftqQ5Lgo2GGF3xyf45jUnv5pqYTe2DE7TVJJAliwwV4sVidUZoE9Ss1YME7SVNtSoOos0p6SkuYZ87sB08IQzjRniT4aOeOlFh6YoXM6pc9BJtyDqpO4EZjMKgjmcOYILynEV9Qj82y6t+Zv9DozRIsq19B1J1dMZdpJi7Qs28wmuUzcH6B2SzR0vkV5m53ds1c5pn4wI75EIyWDdj5icbbLMmOayUU81/na30qcKsvoN6HPuCz/iu8XxwiQ3V80pbNEsYvwWLG1wzY02L/GcyP3+5IPlSjyTtbYT8uti4klfx0mkQeoQiVWftxnT8zdsYIPDiXDzYzVMeZW9xpIu6yG33FyCenGVLmZVLdndIjRl818tFshpS579f7LJPoGX3NyGe/GVLmQQCCQUMQo68b+XA5Q8p8YaMAESPdaBpGPr3O8Mq4HOoSzsQomEY+Hs+MrlcAmPF/8n9zkCMi1s4/ttla8N8cJADIoDOZq3rPfb6BN9uJ7yoCO93V7zZn+0qAspnA+TpwvNM39vn6VsVDBlMvYaP2fZrqVnQ2U080VY3ofpFr7IQbU5QBXZIkIW4HSDzkhlSN2UBn4FxGx55IWyhA0pDNHsCDxWXskWvNVtuGe8xlsPubfvvDV+3aj+/ZMlQ8Bo11Pm2uzHWWy2WkmbTeRFBBgRoaaJk7PE4YfBJESJChggI1C1U0EGWQeDnnH4wa+kf+8SupdLuSv3d113Rt9AaKUDjg3hgb39nBe979Du3VPGPgarmaNFtoQPwQw93iRGrr9/MhXD+vvL7ujM7PT+xH09aoxMaqGTJdk3zJ8yFGY41Mutk+nBGpM/9HST/7D5e2Cy9H5UNBBuQW51lbj9+eShdjGHiIok5bPA6RWAyLcideh0h8bkPjulKbDpG8GSOSxHaI5GGs5KQuOMDIVe6iqO/E4xCJxbAoEq9DJD13oElJHTpE8maMSKPYbgOUXxCK9AWXSe4F9FBaqLhDmOTtuXidE0fYrj6vPD7+PT3gCOXm6YPvAhpUzQZrRGz2EVIxAi+InbX5uKpIi7N3AelVazHuWdfcbLAARJXF1wUMUj1TBeMQicVzceq39f26Le7WK1mKO0TyZoxIuShpnJmxGcYy7l0R8F8NMDP5IP61QjEziZlzeHTJMDOTeNyUDz0aM0aum8eCtTrO152DsHk1ta9mnRl6OBqv/DeVh6+3SPZI+m+kjffxNHEyNoCKb7fIpsEtGlAyUytAIV7VN3p2y9h3Ocfe3YfQrDbLNjVnJV1eK6ZW1j3ip7W4apJ2mefox0c63hOTlblH/HQWV03SrmdovYJtrx3TK/sCXhNXTdJuZhh5zlbIk2eH8JNxut8GfX9cm6NePZ4t2LndJbQHKDMgbFpNMtfjhdqCtnWNPX1gSd0QboFs96nTHjqPA/9t+X/x+i5cOwVAq8riEFuwg5gi4YRccDYWdQAndqmp5sL20+2W/5DhLSBg79moJ2bNkjhIP+fEVw+ZfpmIMEOTRWsyyjarS8PJAqe4OXZUtVujksontgOMoszCFYeDmYwBQhatGxhZ9Hf+cZ+nQG289WPfPelOzP/15AjjTp5OB+/bV8c6DYzKVu06NdI5SWEGFCpbeTymjpLHz5IFO1jbuo6UpVBNZMeQE5YpFCgLctJBxsOVBdLjpgMPtx7Az28vYuxjnXt78Lhz5TLo52/pFXw6cQn6jekYtjZUXi2VTpYsoB6GOuxOjbreY9CC5XqKb4io0YSJYQsO5pjdzhQywTtdepkXYcXNBYe6No7veKhS7ctCqLQHpwTFjxMcQiSoBNwP1i84fOWkG3qoUddzdXDfoJZD2a+FRAYcAAxpaMM80t3Fhbcz036ylidecrnGcteTZ3kBorYMkvp7osaElnv8Op0ypmXrsGwFS6zHMysmtNLjt9dTwWrFOixHwRJe5rsnfiQDR5b/C1aSra5gH+y40lRbY8q9rHf81Nod/1gZWD1fGxzSN2jfNsONLuMK333xgOauvGnsqgESrAEp8Kfv2mg794dHuLFhjf4LGB4DbxNmzqxz7Me+frp5vqejt+n8dLn55rp9unsGntF/abyALD/uHKtYD8MG+fezAQB2YHYTEtmGfs50YCvjrVVkBk0y+datp9rE4vi/YGgY8xeMTfo/bF8wsiUA4PmCLs3wBQPy3F4w/IfVC7oinxc0gOUFTTzHv45aeQdQvKARLisIN3EXrNeonMRTPRVPzdTcdabFudVN4K6cxFP9QHFka+MccnHffYIKpmwV+pCrxZGtzSOI+/O6FczKVaTVzFprSHOT68wL9XWOXDGTahalei7qOZTa81DPC3PbN4N2Jk3VbFquQ6+GW1CHl3E7xxBUsoTVXMKaB3sdVtxv98gMqUqWVDWXpIZbUocX81/dPQmmdBVbuhZHpjaPbNx3nGwFU6aKLVuLI1ObRzbuz3gNh13lhz5ci+AheqPaxEXf6iK4KqPY1bHYNbG56ix79g1pAAupdCeE5wJl2glcC0b/It2og4qL6CF05U4l8Mr173ENARfUs8raDFsHUZASqiA1rAI0sDNlRmYzbA6iIGVL0IVowRSGLXtyyV7ZV4gCsjAVdCFaMEXBPpmxsyH7XGqIv7uxJf/u1mb9/Z2lrioh5+/vLOxtJ2DZDbR7BZIoCyVRF5VIU/SjvphvPse3j/yiviuQRHm5qLNp0WTDtphoibW4bIoWCxVFfUXl0BSdW3IWbi7LuwI5lIWKoi6qaJqrWmpmjNRK3YKlgFxwVNALhhbMgoVtPRnSK30LjqLFnjKpe5VF0+soWXNWG2nresik7CmL+oIqEsxaZEKpLPCeHEMWWIE64DaMBOvCSUz1okqs5vTmkgzTl3V2HFvATBAzhxJq5lLDmrkwcnrkyBk5O3LtHMTMoYSaudSdspoPebuW50l3SQMkUBakoqZVCMa6M6VHeq2vIAVlISrqwrQKd2Krc8kaW5tj6yiKUFIVRU2rCIxN55IZm82xuRZanNVULc8aWq2MGtl91DOqZe9R36yhaHFWU7U8a2j1s08P2nlm1MnZeW7WUWTOOqoiEXJ72YmQu3fv9VGQsq+kvgvS6udRX36vf8EVQ+e3rx7ry+9dYYo+U/WVQ92uyd1PjEQfYwb3MXb0WFwbk7fN2UPV9uSdjUiFKezIKdzEUxBJaipJVBdN0VYdgUhSU0miu3iiN/kIShJZS1KqY02pTXUKIomsJSnpmCnZmiMQVWQqTOkuPbE39RGUJDIVpkyXmTib5hREkppKErfLTtmtewSiikwF2XvX9+9mjssFUxGUJLKWpKAjpmATTkEkqakgZ+loK5uKqCJTYYq6aKI26QhKElkLchZRB3uEuPApm1xbsU2BBaG/LOxbFRvsJnRd0FToDJw+nOtawPqJQ4MNpNMCV7pKgatdK16ByW3S+zJwWGBa5M+K+uciecLLglpD0eNUVeup0vHcNVbLztw9VsueuXestn2XocWlhqrluVZOHU3mGjl9NDPXyNmjuaWW4gIiQT9tFW03Q53YDtA7gWI3aNvLpig4pSplM1e///5dJaSSiEQSVC54a6K30yKhklCgEC8L6vXnDBX0nJWoAfkqluJo8/lWEqtxCRSZlFRZ0JYVJRnLjpIcy420PIrClC21PHZJ1a4cdO5W75qD7iftHT2LbumF2F1Dn3WU23oypFf5ECgLUBGbqsNK4GF15L+oIcSCt3VSe9Sex7LrqDNPye6jnnkie4/6ljFFi8sU1NF4Hsupo8k8kdM3zDT14fTRep6RW0ebeVZuH+3Ms3L3aG+ZoWhxmWX6P3PL5VXBveqV92rgXu0/3+jzczvNfX7u5rka8xxlRqFMCS+oLIks6CyJWbCZFlegEGWhTEkvrCzJ3MXeOR9dn3Alb9migFw2UFKet6VKKvNGqqVm3pJaqVu2KVq8TPOOtBdn3JXuxTPuSu8tvmWPogAlVaYs26osWbHVGbLG1mbaOooClFRZMj5JmcSkTcZkVQ4BkahICJsiCu7CGchooLYTW1eh6EZZGTx68bi3wxxYwAWP98aV56iCqflzeU5VMDqX5/QoM7pZriu4Ny6+c8UJraCdnh2Cq7JPewNFUxejBDRA2/je1PNweIAAkPpz3AJUkoIixnOhwpvqfRqsRz8JIFlJduVq6mL7RzWzQ22sFeqgFSKST1HqpKiIY+lQbFaghzfFSTGzQ3UctXY/xTEscR4ZlThGWzhGJe4uWaPqGk1xjEqcJ0YljtEWjnGJgyxxl6VRvkghIEt4hiwBOQXPUEncVdQoXaQQUEl4BZUEVCkwVeKY2sAxKXF3hRqlazTFMSlxXu5KR/wes0hH7aA7qXFi86TWUvukrlM7311OAWyleQCURuwDcSTm2xKbOx+Y70qs7mnG0IypGUsztmZcmnEUn8+14vO5UfzK3D6ZO80AmgE1PcUGFBcgK0voJcwSdgWn5cGhlifHWl45kVpir3CklrgrPC0PDrU8OdZKVi7nqVfq2tMO/lXGOFxJlrK4HHXnlmIaSymHe7PS8zntGIeTlK5dpsHSdlYiuweMPWzsYXONTcnYlMz19gc9K/3Lnv1Zz/5pzwZmusYxU+OYrXHMTnE9uBpngkGNY7iDY7rGMVPjmK1xzE5xPbgaZ4JBjWO4h2O6xjFT45itccxOcT24GmeCYY1juIdjusYxU+OYLXE9uCmuB1fjTDCscQz3cMzUOGZqHLMlrgc3xfXgapwJhjWO4R4OGg1oNKCVaMKFaMJpmICoASkHaDSg0YBWogkXA4KGCYgakLbRoxtMnjJZQUBAsViB/xxWQJE71/xV4CN7FTCyT4ICbxU4hWPapEZBMQ7awFiD3HgEGGKt280bMw5tkEez5c+3CVgCdWxM7NTlef/qk+1Mc5j0x7GgbOTs2yEbUba7tg/wfvATQTel7NcG9P5l+3V9JbExQGoGJPnJ/vB6igJlJ2c52f6131tHk69JK0aBf+H8EHnHx1oLK0PZWmFA2WbRFSiECGXTZfwjXFs/6IL3kZ9AY0dQZWxczzyOgaXD2IF6i9391E9LdLHpcoutcxaLXVYBxY5vsRn6IZ7YH2q5qRXb9Gu+rcZR64+Uiirwm6+yKx1E1TfuoXr/dj+h9Tjkn8YbFZlL3xEgh75WXp9qFPPwgl7Cx5HJ6/uvy6+XnOe+w0uJ5PWlqbFP8lNlCEZPjCEYPw2GYPSkF4LxU1wIRk9oIRg/buszepTWZ/yOxApG7wCsYPy0E4LRk0wIxk8pIRgdgYS4vPdd/46TZ8cUuCfJuFj1gngsbNPbPne/apKMGFUP0G1hn6/2MQ/ISTJisLxA58I6u8djSseTZCRQegDXwj5v42NwrZNkjNt5gB4L+whaj2n0TpIRf+gBpRf2SfIe462dJOPtzwOyFvah1B5DhZ4k47/TAwIV9gFAHzMonyTjfNYDel3Yp0d+TO53kou+RC+oX1+bu+8xie9JMpZavSDOhXWC3se4pSfJmPf0wK9zYR+c9DEu6UkyVjs9gFthH3z0MXnXSTIK7zwgngv7xFyPIZ1OktHx5gH0WtgHanqMO3SSjOg0D6iisI8q9JhE6yQZOXUeULGwT5H1GN/sJBnPex7gh8I+atljMtGTZFRteoCsCuuMoc+9mZokI5zUA9K2sM8t+5jg8iQZ+5QeEHxhn7byMY38STKKjz2gN4V1dvjnohtNklHB6AF5FPYRCh9D9J4kYyvVA3wrrMPvPvfUZ5KM2j0PSKfCPprZY5Tmk2SUxnpB0MI6FPNjLtGTZMRpekA8FdZ5Qp8b7zZJxga3F0gt7Avzdkorf5KMqmMv8LWwzh3/GOr3JBmHqR6gh8I+nu9juNWTZJR7egDOhXUo1edesE2SUWntBXgu7CvGdgrBf5KM4GUP0F1hH2f/MVPmSTLaKT2Ax8I+HeZjbtWTZMR4egAuhX0C1cdofyfJyDz0gH4trEP5PdflbZKMTG4v4FLY9+3tlGDxJBltjR7QL4V99sTHVMInyVhS9YL4XFinCX68GBKQZNTNe4EvhX139U4XCAGSjFFvL+htYd8yuJ+3M97fkId9X5jlanzfeP63xGkhvj8e9sV/37HwOqvvfWrfvZf8NbRR7kQmSSNdERESEZJz6hs136OdsnhZaZ8j9J03o490Zf4VWZu5BBA1yTSVkmycfBNXqiT7LKqb5fT3e98UGZPMU7u80IfvJjDJfl4jBumftLYTzgkKOkPI4E9+pKqaZJDB5ZXOI63B8jnVO7dnrdlSV9gkR+K/pyz3kHkEU1GuJIMFNr4LzDbxWkOFtJ58atpdYFNjUTLJfVR6qiJN08SI1dTUMsmQ+0t6R+4o9eqYZAL7DkcNr25Jdt1uHFe8JNNZ5HkO4X8UMMkuQDyPNUqpJOMsP9x/USvJ7uWE8sFDq5NkZw0ugpEoyc6l13HMsVok2b+QJI49Tnok+xe/wzEnZEayf8EqvL9IWZHsOOVoEUpbJK8izzFTGP9RWtTLQzKUOA1Prdm5fYh63P/s9zr44DS7bh9ixydpotcm/Wb87TmTmXHw/hn0ulohua6kc8Lq8sSGKUht5ibtJDcvnjQ1YNkkps0K0UPOrGDA5v38ZbsudryTNA9vW/tKYVIhue8NSPEWnNh2EHpWVgfJoAEusTDTzKi+VWkEdFRATLM9wCvznqDXFS31jzw5xqEgEybJgmGafhf/t1MrimRpDn+mIyuSxZZs6dC1RbLsbet/K52ISNaKJiuMOaf6NI2Tudo1MLmsyQ9MVWQmc2nJkgvICXblqwh2yJYMyPHeHdzKWKuEy023RECGWEq901w23ToBmWi/h076O8lGvs64oPuPm1Tp/OeK1f05t5tTrKHViyaRurFt+XlT6fa1xIdbhInt9KGhe7DHVL4QH4N2I6JIYMgl164PVNZ7djKssNByP9Re8kXSFcmazLLcD6lLQaRXugr5eD3zgaXKn/jsBl9NRY4ec8WGCSUs9yTri9ok1x6NbLyEXF2mTaZXJgLmyv4sXAUbojBauRxtTwjOJUoiGRZddXvMTVcVJFyY8zk9ic7Sycb9dm98zh/jnJnhgnpQ5hxPj5OlDffqGOfsrBFvEpMLsloLBpf1bYM7plYjjsG1yY3OBTuDh/qVweP/4Ppk6Obzw2u90utom/nxWBe4O8u393p2B+2MiVjyCbXU4XfgzSszBZgj29R4eHfbfKHBs2cJGic4ghGs4KPELXgOqqJypVS5oTufGZaPK68Qw2BMCovmMKz5PE1HFyg9nU5QNMeMYZqV/rjyru4T/l7DJ5MyJdOmV+bIjMz649YZp3P1CjtLxJoSFp6TdZQ/3+NoIbq8zjLhqpWNx4evrzoPpIVQUeuEHgckxKLD88TCYsEJsDgNQkIej/VwEfxq0zEZr9gVsUd1RXhLgkG+YpkRr+hW7Iv5vFc0nzyJ6GfN4BjOesVvgZH1yH3F6pHMimCNnxwnBhndb87wROGugPafAICGRch9UK6u2vsd+uktwP9l1FhEGINAuNQetaFwsT1sg+1ie9gG28X2sA22K6SekBpldG18yLrQhIDQDYAsutmtGyxZdE03sLLomm4QZtE13YDNomu6wZ1F13QDQYuuNeQVAFWQf8HahsucFz7m/tZwtEikzmIxyhN89pJtH0SOL1/k3iiBFstVHOFjIl/a/T9KIX8J4pjOCXX0rIHLYn8e32qz6kdFpPmynVI7jNmyO+1JPFqUTSp/qV7nb5K3F5VwX95o2O7NuMVyZly2myNwURY2qK9qtOBr2z7b8QVdX9kjA5dGvcPJQDW4jPSxKZyI/1fR+qQzbjI1qkz3mQy3yJMBClFsefpSRq4pZW1ChyCWTtBkalbZ7joZb9EnAxSi2Or0S5lyrVKuTdQhaPVHclcE5L+2n97nkW0xBiob436nuAr88T/M5XS/Oe9Up4HfjWD/Uvv4sUnG9h6sj4SLMsyl0dlgiEaNB076s6k5G+SCRC2OUd11ZjNqt74HgEqkqbcA48XZTO94iGpwBali14nTAQpRbOcE2vzFXPYH98XRkJ9kzP6PfYsxUJmpdTwbeOr87te2K6S7VFxs7KZRzKje8YGQbHIaGNlm3bGRRcuOjUosXnGhgtWoh+8eV1yoYBp5ePc8ICgwrfwAlG9YteQz3rWgt/fqiP0g0t+y/eDv9gRYLkalt3NiZdajNuvbHbvngFwxUYsjabsldD5o9c7rYb8NMLroRFyIto5HBhKt0zOFNJMrFWAXLQmNML7zLtIo+QbgXqFkVzWlu3/pUfLZJPc5ZF6MRTyKWQe3xpMBClFsPKf9Spivlyi9GDuj1LR1HQAqkbs1ZxedEytjj3Kq3pE+AFQ2LrqdEytTHlUp1K6lDuSaeKK1JWbL+S4CxReOviSsjohnDpCg0dGW7BRqyxh/wOvExs64KqM09/3Q8EDfB7ag42ug6m7ZrHsK2gSYYE4KIhgv9WHTmA4GQwtKWiOFESywoeGd5ZsjVU6aLQfCGjB6En1Zg6OJaBQz2rE353bocC8KWYx6+WV2MxAmmJOSxwu4ow3jDDDmJtQm8K9qI45x5cHp3ZDhi7bG1rXLZU9u2+IOCDefADowvRs0MDUZ2+SdtJzlmgOiTtniRlpiuXBA1KkVu6x+rUfjwMRlHqM0ivEM+RhdUL+YBdu9eotXOVfPloiMfjyGjoz9KKO3103lStc+nXmuew4gyUgX3/kThgQ413Mp9lF8CBfA0hv+FeTdYu4dHmHJ0NmeqVxGOU/4iC1vm7zOYPIhoP+h/fSjlUnKDzff3VIZUvlZIcpPnDl+csKHJDmxQ5J+0PqOhVV90VnPR2M6rwhB17vkYMynDWBehIJ5pJst8D+ZtXZBlmdTziNCU8sjcghd3iUarrxrbwAAVOMbfwKA2Bxp0BcAUOGnylCybqk7AHrgY1qOCPOoP7Rtx/Qb7dDR1oEAFPNGI18B4N+Ja6MMzDIYV+Lwpbo7tWxESCKX5YqSoGvMLmbOuaG8yNiTOG4aFYvIpYllxybWPETHOEw1bW7lMXmDPjUIDQ2jiYzHT3GLDE9802oGzJrmogu6HLXiExldyy2wCW0/ZOGOJgV3kT30ISNI91HgCXpGX6X56L0IvIbegG8DdXTfCRygo90rTTrMzkBtOm8gZkV4zb+Zas9uXacBNxSIoJhhMlSc1kpZlXm9VrAJHnGr/9IWhjWvpcowG5wAQLBBBgSCCCdiItqoExBRpJOAhMNxXCiMJCIohiM4ikdiAnElh7PUCxngH5xi+2m8HvbybVR7FT+hSADxTyiRNmxNef+oakalSHWCmkbUtqOuSJAgbERUS1wilSCpIl1JpkQ2Qa6KRpZmiVaCdoqu+XR+i+65Oi6CQ0kTmjGCwYxmCMMYxVBGMoRhrGIpK1nCMlaxlJUsYRknua1iiTBcQ40iiAu9VAwdQwM2ipMEIWNUmNYswsTYZk47cUviJSQ0kthYUjvJ/bmfUv1cBgvDP5GJkbBSVlF2Qq4qOX8sdyB4UXuIN+YLF2QxoVKVykVVnXvldqoUVZ1QTSPVzlXdUXO6vIAKYVFhQlEjxUtUiA5qhSguxddOKhduQJtSgqojLNxyy616Yt+YutMKim657S4sKt7gUG96cZtU55otKIQI2I7WweTgAgfclLET2ls35g8JbrqV5A3B7IKWLphGA93ANLCHEb1fvInVGSS45ba7UCqClMZh+Pm9neY27NbPQNwdof1RVnJ90I+b6bkpBE8lnpH2rIwns7CoJSCnUBVRU05yhGOc5ignOcT1xObISilJnZAmJW1Ruhl1valP1XJ4cJ1WSCySWs3Tbp2unHc5YMwMaJPk99tvkhZ0JmQllU2YsAOd/OVflnUeKYtriYYsPeqqLfBe1ey79CSpqlzMW1ucrLFiY93G6wFKhzW1EFhnw9P9Ul1Zr14MMDVR64VCW52MN+vjQOTSTIsHNZ3s7Kg5BEouZFo8qOmkd1N7FJxI1Hqh4DbP4Le1dxQGIlEbCgV3PJnb7J0ORCpuVDSGJpPMjsohUBqEzQuFtjxf0pUv7okAO/1CdhQLbsOksGmcDYxY3KxwJg1ma0jp666ZiHlSjrCmU9OmdRyMXD6z4jE0mrR33T6GuyU897v/Tp/5XVmqqz1CFgvH12iytePqGDADCWaFIzadAdlcjsNBJmxHseDGM7B3ZF+LJjGOpB5MFhX3kQ1O4+x5cyQeSAq1gSwyZA+bxt1PeyQouo8Va7bGhe2HcWPGKBjWCmEm7UWr3/uYLOHZmA508qv/6eykENbMvL1PraPNioOBg48EJcywa3USkpvXMe8vEOc1fGDkNa8BQNMV5D9d+LdjBmvj+rYOzpR/AOi8FhfjvO5U4T9qpAXolIPevHY3SX95OH7B/e7+fJ3WvR5WqoDn1ezZ7/bwnUX253d7+M7mwIRebSMGt+3PvugLLXpF2A9MmcjRq+njE6JXcwURDHte6YznNUqBjr79hyjBdQ7w5zWM47yOODOqec0X1uvCTkFwClONc8MJz2s33Fr4QM9ryljn1b3UjXqkJZEbueJHDgWvLkykQIgvLv/V0+DLvbH4NJSqtuD8s6sMlOUVJyevSHl1zpKivBrYvNWdSOjeBC8URbKY/oIjCTLXZbheZ7wrEIruEUWM6sIvMQXIXlLmoppyJpPSS50El5dQdbl7PERuEG1EkQV9LTLURZH30f0JH71eslh8KAvFCrdqoEzCGcDYzhyQZaeUetOY7/30gKsNiC5oqdohK2PLTLrslmyCt7oCMItEQJawWelXxCWmtGJot47/NsUm6KrFp0XCKFPu/H6WRYBYo7wp1yvl7QVaBQAA9Hrtv5OnbeAAgG29di+CeT6PyZl7lOPFYo8lRpX/uL0mk3ndthBjnIYYM4Qb4x43rPiG6zT5B3bYaEgjgH4XpJo8NinbmDYYZHfs4OQGpZtg5AYhX2VK8P+6WvswJ1Lryz0kEMkVAjXkOil6l7GBwfXS2S0xkxufItKbAlz58ycZ5TOpUO5JqfmXpmOYVVyIZ3nr3qpaND0ZA9K25kTO+OAN8g97jfZtX5ueN/7SSenLa89g9NOxTv9ro5cHI+skMgSzeA0+eycngiy8Bp9QW/lNei19aCUpMbXiTh4t/fHIT4Jn6QMrS0mYNXYqT0USzRRBHtsPPHjHj8guxNGXJCUFFj/iRQDHOknolkBe1WdDZhLgih/xIqC6rix0KwAydY49jB+v1gCBDiZ9BeTL/NApcXB+k49KH1wZeyZn8PkbP685Fl8fWkl7PmeuchU+H2uAcQbzsQJy/v1owRvRk2U1QBaDaV8B+e1+AIVDMLxnd9YAzwumYwXkcvvRQ3f82LUGeJCrr08e4XHt+Z66/TTI1T/n7GTJf7Ezlv2zlU0pq/upFbCmkjIoSC53+DmYP4z3vfPmU+ctnWMlViaQn3wrBklsJxdSGOzRJIzyitdpWR6gr+IlAmCBc7kPxXvwF0uVKiGYBZMRCcJYJd1RFvpsECie0VG1nwtzTYEkuWmWq7OgQ0tqKOF8y9XRergXs9SbT+Ug8M0e2VBFzFydyxzyPse/hH04POYKrEeIA1lI6vYdUkKZOcIx2NAkzwQcvrIDIubqaT9dv1gdyEJSv52BTNISp6GcOXkVjz0bwSvX2rc1mx0htb9t2e6IU/s5N3yhOSZ9IHvAjJB1XO3bitEyx4P/0dow1RSIHLa/MtcMSDlS+59g1XiSFmn4ixmWWgGwITut7N771r8C0wOYcmV9IAuht+Dj4cq3CZuuYJQruwNZQMpeQ12hRd7IYm6l8E6cNgrkVTwzFXAjuNIOkEkuWCjGobJwwOMKSZg69xcMYTzLFdLQYTWQ5cg2zzkDAZTOBii/NmxKiJlKHk0ooTteKXl29bqDvzhlJ2fL9fhC8Z+DD9vbaFoewN++Q1Z9J5edG4NFTreheNSE26Jn9/JdwIRhHVceiAo+kpUJTwftxE0KS2ShUrjsTz6MbFT9TVBrh1d+836H/6YHwgntDXsHUkvCSUuhbBLqIJrSLM7V2TxMcy6bA1kuXn2wvS4Lqg/w6R2xoC4S+4mPB9Y87PRXbiJ933vOH9x4i0jfn3leLlV4lsZF4YPawjzJa+IngXr2A86D2sbqX0EY2qOv3AXnVbwqpTglZ1gK7GTrY85TMKrS7fvaovgqXiudlDFB9FK80aCs362gZL4M32sT5aCXUQ4OcIe86acTrF4DQz045apc3niCmQbQYbUmvl4zcpK3ibUEmknNak2M6w7IjtR+UUs2QJt4qZuTWdu2aHw5eFtMkpPpS2y8uL2JfeYG0W+nS9OdlzoIzJWz5d/wtE06tYE5VZA8690WvSd4Gw3x9C1ywP6Cchk4qhkc7h6bRKf/TTCR7ehtkuHbJEUL7xe/TNWaM9nx7945BWhE8t18oPBsz3xsoiOoekqT4Uyw9Tr3cB/MHGUbNnAWeTu27zh3GO07mR3JKpU0ogkOIy2/1Zy+mL8/S3YqpV4GOrB+M3VG48ixkXwiDbmSUxInXp8dROx5araVhDB9k78934T6BnR7NX/j+KXAkesvx6nn8HGe7zkNkVzf1JnH56jiMjFLch0m9k4265y+aeE5f101jrmLKrl+TxsPQEuup7qJl1xdt1cJdz/scw9jcp1oWumMWfKh2KY32oFOzjuM5amPklLfcYHd7gLBXNniy4jnlMDKeFKXUjHiTJ4YJwlKtGO/d9ukQwHSKkauEXoseHxlrNzJAL3WTSHSLwuzbOIrfiFZYSo8U020fzJmsz6W/Fh6WJpc+WiyOcY/riCXnoJm9gIFn8kmvuIfVgzLjzfLrYJ7qEW2Uf7HZ8rgsrdbrn2qnEG+hLmiZSy/H33fHzEKWGP5/ej7/ohRWDbYE4AXITbF+HLWNs3OdPmsogDg53eYy3u+AQC4QblOlMntAodPzBcQ8Efmg/zjcq0AVxsND9VFWlkyaAdtwe+tULjxuzgUTQSuW+Wud31xW2Gd6B002SghaIOugfjL43hYwOE1oboUK/nEVXKyUFrxSKroKqftc6PZiGjsGiEvWo2o5bbpMkSsCFR6s8mWIakCQlXzLZ83Sbi4UDH+Qs9NKACgFlFd4z7haxP024MCQBWiMmLSiofyrsI7pgV6qxFVWTXMLfEnPbLwdbWpTasaYBnBqZGvANQSMpVdqFsKqF9kGbW/JcyFro7ARag9mQwXLohtiiVHUfbFINQkOywSrZUZNtudc0FlKM2OWkxmIJwEbXNLfzbzAzSuiHES1TMcmxdLgtM8wnC8iZl2S9rE5XXGupkbYZSHhhGMXu0jBVfRWNJlUuWqRKtZDamN1RkDGZLIFYdTOiHpWMaY1TnSMDVr6S3Rl2BQxbCCUSXjP2aqjprpCZmOzRhn5RxZuJZDq9vfTesAm2+v3eYdtVPfzey7E9zzHfSRnFxn45W+kGvXTfhW3SUEVAmsFFQSnBCqSkhW6JIwCWFTws0X8Wwx98+bc1O+6Tdnhw24uDsfP93PPXgdvupQXNERNIpARSkRmamUQtVSQ7RMpwxqSovYzKWcYPUSa8q4ma4lda7AGhqiaCxTJImlwxmdJblYw900tmSbdLk67u7/pscm2iumbnO2LJZkYTxobBPPq+9EXrBoxdUXLFpx9Y0XgOhiOq07906MOq0jOpduWHc8KlY4hfQ0n9X22pKTl5SzdoaKhhNGNTKiCquNWW3ilulcQRVqqVHbM1ab92ULVKry2Gor+QtqNGhDzqZs5seLJba4QuKWPXmFusp1Fzy0aZcXcFVHgiToezC66o4HB5WqfDay5Yk8Lc/Is+ua+4vAQU3/ISfgZvEBk58usNSQYZ2ne1C39BAv8+kCLcoSKbMqWcmqr6RBQsOURmWN91Bv6eGOG+6zVEu5SdQYdMdKQ7UtnXLch2dSWM4mKu7UNiSr1QY6CJeBD/KbAw26VqI35kpMMf2GXz3WkIQNRo1Dy+Vt0ZieO2jZPvZT7Ww3zw/lSOwGCpZnZ5fLirOkr+I+/azWXWu64+GGo8YrRarppFbcS+EipyCxW3Ehb/01Pxf5501almRWPNKAN/RCsU3oTif/P9DLPjZ88t4f70tQBJWgGCpBCVRpVQHT46PvoB8Z3vIN7vvi/XoUIe1RjLRHCdKCk3oq/4bykJexT+zBtRsZGTthufSIybjffxsaNCzz9+Czzbd1PUEvxqMRdxze4klzHmgOQBHAPJBzV02QIRx4ruCfkcS+Be7jzCNNMvHgYg/2ho+Urmu61t2B9KYgS9UdSLtApbkD6c1CFoo7UHcXqB8jclwRdcMOVE+i634dqG9Ium7XgexXBN2tA+maqJt1IF+3zAMADlgYCalYXmDAtvHX9P7fnqMlxnpY+yPUp6W6H3U3dEi1lzBrYSkb2v746NqlgPvopE/7Oxzy1Sbevdzq3mAvIb1bTJg9aeiFV/e71QjeFW55F7ktIi6gdGxXfa1eKtNd2RM2jeRCw0t+dsmxWSQ/MlA7dbhMY8AALm6qKrz//JXVbW6JLM9gZwSfxiw8eC6foZrkNIiTKSRSjfAQE8L4SwBANpSTeqyy9+I7/ED7UVCk/3abm9zfx3s+hqB8Avr8xas5ToM4mUIi1WhdK49UFwIA2VBO/jZ4Mytx7OafVQL//Sw3s7+S+3wMhS+SJIzj1BynQZtMIZNqFEiBGjt8CoBsKKuhhwfGSlVyiQI8ROm/rPemeE0BUppDYgDU7nm8NdPJEFYnP5Ep0MpEbnLJ6+UAQKPoTpmefNMuHmVY4D8re4U3//28twUumQJUnQNnLcvjKzXHafCWZqYQqctqVMHxznN3AIIos5mKPLnJg8lTEoMPKS0D/LdK4OSu/EQ+hjyrX7W/fVxznAZtMoVMqpEvR0BfHjMAZEM5+YsXpWD0+m6VYyXw372BM7sIH/kYukX1PHlcUXOcBmsyhVCqkaQqAdbjEQBkQ1kFPnKOJZjYV9ICFVH6r8fECU6O7ZTmUGgWDMSRaM10MoTVyU9kCrQy9W105HuMBkCj6E6ZnoNC24eDeeZSt8Wb/45znNt1kkl7DnUnSL63+q6mORDWzwwiVJo16Rlb5xu6IwDPbKgrV7PV0EFFu/vKs+D05r/+RSc33r8/kJcKYpd2AKBToETlmjkFcTQa2igool0cFcC92Sjuf4ZzwsXZR4U/HPUEjeu/NGFnOBLEU8O1RKULkjJVKzqGLuZHNo1c265Um9XZqgFoGd0p52Gp3qJ9B2zDl9wP//U7O8WZSZ6PWjKo2CJThRsdQ/iRTWpbvcvApXxwAEB3Mpxqoe/JntfLeIU5/puvebbz5DwNXnnkdrMmOfDkCy126Vyn5ivhHvlTAul4AOxv0nkuMCqreLTbqFeFTBb/veK4PIQHd3pSf+rAtOXQ/SJmfmS0qdTDHix4qhJakA5+J0PvQsg7zjNqc38p/4V0Nt+r5ZYnAnXmVNzOHuRIrNDyl45zUvewKopsamIhCZ/fyfAt9r1cXpx55z5hcJaj2yZG+zVn+LnIHuxJuC4B8m+CPKZuog891HN3CjDyZEo2QwXqP9hfq0D7A3NTc1Qe8VeF8QDu5esScLSezD23GJ/8TPMycAxLleYR3poOYPopg7/B6+b/bDlGzwja9lW4LgHPGgg20+Ho+i7Uc/cc9kVXQNtxe/UsLfFfy9ITvUCZKfu6ckXiIyd1L0ZovcvGN7Ve5zxzVFV7MSGInN8p8FXP6aY+T7m9KxHmq9x/XexObrASpZ0rRciTVc7AvIygNSyYzVRv5XqQExXeCQnAsdnYrxVfqTImLy3Rxwexnl39Fx/fFOcqf7q3yhShh/FFluUIbWbN/Kafq55cleTSVWUA9mZ3fv+2kX6yeL64Utvd5b9lDWc7q/3T7I2HXEHXMqzShVa8c6rT95UI1cE23UERovi1O79u/NQ9hitRnTjTm5TwX6DNU5tkT2n0quHeEamv9lVS0MIWTGjauY1dqKjcaDUA+UI7TTu87McDHb11K3Os5lf//bU9w6EQldKtHzzBlqIpg6FBm3fJsGL9W8762oWrAgBIGN2p4tWkBZ5KNF+O3CkPKfvvX+nJ3RYjp3zrRdXQQ32dhTFBS1cwnqnb+sUdyHMz+hqAZqGdgl0dlGZ0t5DdrWqyP/xtxDy5mWWVaq0Ro1DbqsJuAUFLVTCYSc0qssRlLhEHoFNoJ+dAsWCfOd77o2Ux/Jf9+NQGTFbatYJEBnBkhd/mBS1bwZwmFQ0OApoEv2AA7oV2MpSjBMwyRfhTM2/3r+W/kBhoOsS10tKVR1EUT6hLL1log+smOn1eCcP8iBhqnsNwPb/T/MNnZXw3fnWvGlAEZnpBONBrvnal++uTVHE7FUdKttCnA3aZTvvXy3d3hReYLwCcECA7v9i/FrBlPArEejGfEjoT8F8M77ObVWDp9AaSVq0dV4d5QUtaMKd5VLQsj8Z6RI8BiBfaeYwiyOAtFcgPjdrWn8p/4T5QcSqNpZJrTLFAFMQUSIzQjtaMb5q65h31I8rHsw1A3ehOga+a1Xto7o3PPVo0X+X++wR9cmPILO1cKahe8iMccM8IWsCC2Uz1Vq4VfU10Ib0A7Art9OrZ8ya81kZ++a8+wwT/fbM+s7GKlo9KAeGvl7XsTUY0yWxCqVzS8qyTpZAAAO1kVGvEzMmuf9OcG/dz+S97AiqOj7V0bRU5jN2wMJmXG7R5NfOa/q1q9QaV762MAbAxutPJw5tCuKoknrORTRj/JbdB4bu26rR2tcl7W6w+FpcstMmlE51er34EpRVcFTMArhfpNP9qgOAp2UhNI9rN5xzAf3UIUG02waXMa4dTLek0hi4saGcLhjT9XMuw+NqU2fQB0DC0U7knMN2CN0f7XQw37Zfy3/YLNBz2caneBgKLM4qwbkKDbs2wpoLrEImKGV3Sc/jN71TxKOQwQ/mDqq35tfw3SwEV5x1d6rdOiO0pekIkBQWtXM2AJnXr5L2k8Qp4ADTL7mSwOo6ERAynb1X2X7kKFBxYd2naaoHgOdrAuMoK+tDMaFK9ViG651mGAzjQnawGiWOOGA9v9uKJmdd/t2pQbfro5aOaQDJYYIOkpgZtYsG0poOrm0oabyG5JwAnQzttPLr9smZ4J39zmlsm5b/SKyh6h8+dSq4fpTCevMpL0UG7WDay6eV6hlumBrumEYKQ+Z1yHrITqwAnUFFbqOW/lUCoOen8UtG1RHMY8GF2vQChRS0b3KS2UQpBv4NbgqBrfidrurqHJkDUty/fQuL2X20flBtrgWnnCuJdj0ytHScvmmLOnHJ/cwPPo5nDCj0iAB6Gdrp3uEpt+g4zeVoLOhrXf4vaUHLADx5LT0FRlD0c0Sm0kTVTm15ucXkW3uzhEQA/ozstPfKykIETidnaP5X/Wouh7JAwTHPXF4Rk2DDOUaLQAndOctq83rXx9ItcDAEgdY9Ow7+sLqTV9+m5f8+/TPkv1B6KjpHEFHtl4QNjfNdUFST00zbA6fNKhyPwypQFHognv1Pjq6GCTsJHjjsbFhWF7r8eiWg2TxhT3vWFIA4OsxwcH/RhGNtUdsGLQowkjARwZENFfdb2ZYAKYYQXB0pF/JfuEeVGeGM+6os2bMo9QZv4oBGMbVLvQsv3cKjTAZANZVRbTaNXu78yc0O39DchEkXHN2Qqu7JkPZrsMzMNEvppG+CUd6W71YdFCnIB4snv1Pgzezi6NAQz1b/lP1/5rx/2id4ooqfE64pX32AZ7lWM0O+y8c33OociEDOS+wbCO7/z/aVdCoL2ytH+F/6blf/a0qLmiLdMk1eaywr2ttGkPHkqnZ/jpPJ5sFm2bMZBcDu/k+GyJ5vB4Bo3zurO+K/ILuqOyczUfMVpTy70BWmOFlr10pFO4zdAgtVqi1wCsL5Hp/xXb6MGcyeP5GaEXetkwH95zM/xBo89Hd9Ysmrq0LkhQYZe5yc3VV7pXj8p3zsYBaBvdKexzx7jEEuCkjLRPl1c7b9wgag2xEFTy/Vi2klYiQAsJm4G5scz3Vu/zAmvHggVAtBsNPZX7XrWopAqWjyst3DEf33xz/eW3j0t3FSKYScuLDFLaC87ZzhVXWUymfLeIxaDKG/tzp8gdYTAHFuesddm/6n0F5sbfe+I4NPwjSco6TTUaelCO9851Undcc/aa7BhBn0WYN3JaoI3ybfm2aMN1eR8wH/NLlFtmqemzuuFqSqV3+G9mLipmh/P9HL9innM/nRLC4Bzs7E/IOzMawOC/tJv9uStHv7rsIBmt87yadoKEqj3wlptMC9uyuXnNKlo40/rKQYEA3BvNJWT+7lhlvcw5T9hLir4r9ECyt0i0KdvK8UMUkgOOHNG3BzLz2ZSuZoz3Ia6LgB4NRvK2WfUWgDLbSaQrBT+KwCMatN3Nh1bQY44cqof+ubFzbf8nCYVbYpfTGK1NQD3ZlM5dzM+vrxy+uckLob/HlOj3I2ffRq4mtDyagS+xkqNm4f5aU2qG0kEzWQsIAAbZ0MZOjTevmWf/I7/2/Gn8l+qXbQb6rcp3dYw/ZD8VDnC4eZWfiiTWmVJj+5puwMAhWZD2TPxKXo4rtWlofVfC5CUmdalt/zzX9RaPS5KAbvHc0ODdq1nWFO51Qyr60iwCYtFHOzYqeKDdvaqdi3x5y3boBwB9l97fpy8QdP7daWxOmxAQ7Xi+Bba8vP3qeCN3m/V6pVlDfJcYC1y+jCDnV87sKcYuL1b8czy38GYFOUR/9w+7MWN+s1IaGaUR/xz9bCbo/GUGPqztznlcfw5Fwitdi+W6bRkeWD4b+VDzt3wEv660lgdQLWO3x7tFvpt/j4VfDZJtZL7wOo1hlwtwgR2shuFxx5o68Ar/6W2SKHz1lv/8/c/dcDzDzRdrPM4JOhTA9Fw5vdwbxccwEomU4dobMdOtd68lW+1V7ysl4ArHmH1X5F6nLiJdvx1hO4d/5e/rQZIhS/qqQv7G7nfqtE+fXqJSue1iPgnr/Nb7/cq96TZvGAv/62gSaETztv+/U9fTG8Se95E8SuJoKBPAkQDmr+kV9Ny2zTL4iwWEbdjp2Zv3vrA2mXGjeDVBTcl1n93GHLRKb18+IfKi+hIY/5aklgFnPlOB0vCCq3xqWSSHvCG7reqNDxNI5fAbIvECXPZ8tD+bs7hxSJIJGb+Al5MoZj2tj/+43djaTb3Jsf66oUzoSMOUSfOHwra/CjSpfgICv5jFrIdjsO1n1q7sJ1ELG56gO7trwW8nLo5kJ9vxleryWuvt6vuB4aOHOavj7y5+626wehqNJfH2CKByQS2HH+xWxfOi7DrwzN/xVymUNR8y5993EWVWX83AigW4UjoAETUgTMX400PfMlxTibwH2eR7fNDCsu09tLxStKskbjyF+hfzh7VXH8jblpFPHFQiBcGDR0rzF/3eFP3W1XjA8TwsvGNLRKJzGDLHzH0fctWNTLrYjlNQz1ci33Qcm27zsh/Cn1/4sv1aT/qnWWLOx0wAeNgp1Sc+Cbwdy2umfZDZATzF25/LuQqQO7U/uC4Vy2p9GoCZ4g1dAg5F2599f1ubWOPY4YUj7JFQr/ZaFfP1wuJ0Pe2+pG6XTKUAq0IV0RRlPe995rvtpO9+HiTuZ6pxBnXOshk9pkvHCp3qG+D2E1yJ7zXP4goZnn5H61b18mucKVfdSepE9H7BXuNPRIeEUKiu1aCMyJ5Dfx62FNPFosRvbpOnReNee40x0RDKVmVkJG1vXs0ZrrbvMK+6i4SpVw93Zdqj8RHpI/YvZXhvEgCHP/goJ7oC9LVuy0wdIg0z53m2FHfxsOPB6sVsQhmuh0H7iTpbpg2ommzR7JHNB+RmSsEQKY0D7STGH2K8GrPedGY505zXKhvtj0R8dWYYxFMdPvkCg6RSHe9oFBd7Rpi/LieS4HoafV9x/2pIyJVf3D1wEFp3fB0fU1nJM80DrX9RNYg/A3iq1vHCvONg7bo2qLjkJbXftTmAfGf2iFs9phIdu7dtzHyyKbrZlqZZmFMdWrUxLjfg+T++ZRPbNPsogp/0Veb9qotBHhdMEpn3i25/Qnx3pyYv9KuzRzwCm+U2DnLG+dCR8xf3thmDnitPkrslqFAY6GZmOavKW0zB73qIiX2StQ8edt7Zf5C3jZzwOtnUmK3hDM02yt9af7q6TZzwCuhUmK3vD7wM6WKZ/6S9TZz8Gva0l/IKwB2Dg2nFu5vQC0bLsAzdMkNZtGT14xcosneQxP2jDYFpEJMcitMl7xvdQpWvWbPU+8Bg/7qXmqc69IDEjEUVIadguUegxx7hTRICzyRrpwZE08khpSo2fnzOE/zPK/mhcXwd0J1+Mk77eQuWOixsg/rwtk2wVO2QDxIovWAJVcU5AJELY4uYBRx5UsYqETqDQZJtJ54yRULcgGiFkcWMIq48iUCVCIne+l90FCzZS8+nXYtSJOcFTPqW++G+RGhBN9ZneD24ZxSngsKEyCZzVB4kmluMBfTbkbXX6S2bJQbDpJoZ+IlN+pQvwJELY5TwCi21RUbRVzlqsQ6WTpBoxHldBy0rlsljFfFRG0eoJta8COa3txtccTeZtz4MsYwl5Og0dikOw5a7aqFfhWi2HxiIcNM98el1w1SKchp//j4ACHDTPfRoddtpLogG/0j8MRChmnsj6TXHaSmIBv9o3afbX/tfyengFFsu7gbe3CUzLjRiNINglY4j4kyZTJ9quxEKDoraLeDRkuDx9gpo7UBQc8OjbTHWL431HADNMJ6VBVtWw04MkvqPE219p0gYqPYdhFXE+QCRC2Oolv6dncL3wkErXZ1AxSi2No4BYzi2s8Xnkm0nGN+mq6YiUh5RAnXqG7ZvdairTbicC61RBBg2nVSH7zEZV+MHGnTOFx9Do71cm/4ChO6EUp4LfzkoMiRGiIt3knNR7nAc1P43DfmjNrQIW9ZH/iV5kZkS4J7ht+D9nJy2OxObBt8QJXF+ZfDrfxuhIXYBLzAbM7z5QcGZYDiqvnZpbXjeeAizF5ALNpKTxI9ZUulgWSqjIPeJ0t3ctkWTFHQb49ZN/lyfJ64JRaNtukcqRlxpEQlvweRM4+l6DG5TRf+9TY/EnKNRMp87/tjpcbvR4pffDVNRPl4FSyRq1C2XAIri09SuarrQ0eH9s852/PGlFeNk1Y5N4O3qW9CRg1UeGhXj1lOxsCU+KX8eN9Z/h/fDU4mlpdUyXDozib1CD56Czs0drcNt7VxWa+fTZ0fHPi/wrs8R7FbJp6iD9vOnW8TSdv4BNnSqk/lL6X51TNWj/jQiniZHn6OI6KolLyIdQ/M/T6hgpT2FNQRA/VGThXS9W8Ks8tTUTIqk157VTF0lNxKh7G3OqZvQlgL4fV8lwFDR6dHqASvdM74xqmZKOZa+8e9qEzEj/o65ELCXvxVqZamRKxs9AW5t0923rtxSRnc1o1WTBTYtX1T6aZ6zC2wvX1H6aX6AgPHFDNUpWnwl456Sn8ToLfUdVhKZY6PPatDjbquX9EBLnkLVKqtjosU73ZACy7tUIosPpMXj1hil6LLd2aws0MtlS6yD84MSu8iQRLsPnBpWCxVqq3OyGTIh/KhfCgf9T6qvx4EGi7ULO96iFy8JV+cOwBUkLH//MZBnK/GXz0aN1QtZJiw74DeulBbkKHfIb6VUCzI0D5jy9y39a+UhBrSbasJV7kzDdBn+YsDSW4QP+M9Nrvd12B2G+KxGRppgt0LuxMPE/szsUY8/Ji8nbdbhGs+fc+dprLDnMF3l07m7pJb85ziWs/svYRq2a+SulAnv3LUSZE4DcOW5BUiK0SSEmWnqvmCdvMcqlW7zfnRxz+S33d/JL/Mvi/78edT8vuYpTPJ5BOQRN+s3sB8n7XT9+f/4Y6v+rjmiRWAm5pP3ulZKiPKhTjcdq84CgH7fZzg9+my+j4K5fsofe9zJasG0PY+sRzVwD8xX+9LhqX3yQC9Lz4173MMXgGi8j6Oxfso/+4TuHdffMDd5wrtjBrV7iucru8su49T6z59Pt3HQXSfEZaioP8HLmwyDlH3URbdZww893HE3EeAch8nx30MEvfFpMF9574z6u1rgZluH8S2fYzP9mEU2xeHs/ZhntrHYWkfJ6F9HHP2YYbZhwFlX158VxTZBwqfjNM/4jmJ7IPIsU+PJ/ZZAYZ9iCcgaLfRK4wAju/P8gK/Pv+fUL6++Xle3/zwrm9JUNe3fFufgpXP9aGUwzSxNU2h8ajsID3c6ysHKwdvwlWuT6Fffd8T72NBe3qpsTEXPo7NhY8Xmw+/x7qzFRtb1tbyhLYCS/VZbwhNaHsAVV/7oVTl6zUCJsTHO30r0xaC00cbuhJ4YYupniHxfPfifDZ9uXwqZB649zW1F+JusTc7mdXbdzlPt7IANAatcnNGwsAWANAUhtBTQer6/JIe06HUsQe8pl20izCJyb3PG7Yzp4zlv7V9jTTIdnsC+9rqPqU3e1xB3YdQZg9ro/vGWUfAnQ9oAwAA2PO/pwUCAAKBgKB2V11PSZeO9FplHqICI2KiAgNCwgIDYeFBwiAhYqLiwiDBIKEDpALDIMEgwSAR18cgIWLiQeIhwiCh4cEgYaKiAsMgIWLiQSJi4iLDICFiogLDIOEhogKjAgNB4SECQgJCEtQU1BTUFNQU1BTUpOb2544U/Hw8X4abQ1xIwtlDu9Sb51u/a/Essh7YRCMYu1cVNUFxExiZIk8fQyKx/fK59DvrjsRHhGWV7ZPg8A72ABaikRPafvA07LbmPA7GhbUq6Zri8NsWdpprfkZu++FzkaAu4oSptLjqnKG/zYFvd5UrQBLP9WNnYdUBRBcYKHbVud5/m4lObECtcTHi9ZMXs2/e8HNZdL0qKlzjcOZW9RekzEF++7HoTTGe0SDGYmCVpf1xuJ+Rejlx30HhfvQs0LfjXF6IG2IVJktyOCOTptPU04BxPxZ59mFoQOECPla2CYcjrKEiUOkcJLkfPI25IPPXoYVQWZ2DMriJxGX0Zn3iZZf94rXAxmWtuyDOrILsNg7fOxoXXExd59wPRV4+LLjtzOKfVZIyyCHcAzJQivaQ0f1S5K8jVV1At8i0SqoPuXmMQuSdxm1j6v6BOSEqLs5FOJW18t11HHYWg94nWS36up89l6PcI3jz1lC2CktwOZz5DpYRaTXEdj+WOqta0fJSam4VNyVzWF8U+YxDp2Hvfi5yP6av3hLqUXAVFglzOBug83r26XPi/VjkmOA1TXFEhlxFXawcnm3hB+ulsry8H4jS1j0axret8Fz5BEgOo+ZwuNXjU5De7iQ+Hj4+GKhOXblWMg4tF8DYXB4iXu/3vlLj2VPcn0GiXQURoxzisgmH6SfT1L1fPIsTdyRYq8cEXh2zmrgZAPAZGnu3oXg/dRIkWCmw8MyYvIpKjDmMdbQRlCVLgr4/5Mue+JZt8dl6dWrA4dBjJy7kGUlie79zCn6oER0xYPS9SmqMOYRy41nPPJF0+f1S5OCmOvVGpsG+Mol3HF46+LI1sYYRfz94IpAxGM5QObBf+QpdDjttM6N1Lzjw38+eSxPv3SQ9YmnsAKikt5pDeEidRTYnJQT0Sx8AN5eeBR2gbKsoh7dGg44OpBUU6Adf+TSGNfA9fMyAymrvOdwS4GlL+zQJgn70LCInwnFkqnQCZWtaObwvac0zQcTNgn7wNLbKfae5LyUDZeIvOdx8JMiRn/HpBv3oy5/Mm2slmRYPVBZ80KHksFAdnLegIfRbkWtkFQITIkMJyjf0coTPXIhzz4ZP6Acvo9GIuqPIUQUVhK9z6MfE+FU+ttAW+t1zOdh7wUxGojCosAGlw7nZ4RmuNkE09GORs0DhLAIj8A3qGOPJzQDGM5u5AQB08FMnoVsyWBSJlHhQaeNNNweMGyA9rUoAoh8/F6s43sp3sjqESvoVOvw7A6cP9gLdiH74XAD86LwqcUEJ5XqhOWyxpxMR5fYpE/1M7HZnWpcfj9MT6pw7yy0BAA7j0ZcYhZ+6iBANOZxE4inUOV2Ym0OUscjzsESxwo+dBacGaSW8ZsRCnYuPuTnEFJVWps+4Fv5mUQVl8XhbmbpQSepKh0Ab7eax1gmC0WxCgLvzCtGTT8fw704InrFb6VImuxnNXfUPepNbCxjU8HdnBKhovOSyS9RGcwjI8OXCXnQZHP7ehIDnDpO+OtQ5mkMgd8pT+ICL7fB3VwR1PavBg+6gR3MIliZfXY6BSR/+7obgChH6VrjOAGkOzSoSz3UXGg6i+jTtbnKD16oNp7aGyOd/+fTmPlQByA3xZMeoEZheDoWnC21WANWMwvV2SR9MlIk4gjug1kAur66kHCJOQsbv3kNczmGUqcq5oCpHYldp245S5aJ6a+56ihwQuLZZ71ER7XeQrsB6VSNx53YG0dPkAoO59mAy54pwYYtaOu4ZzKoJJ8gBAR5w42RZjDx/ZzZou349EbG4VWj9HYk4RJUEz12bIK7VYTjqKuzTUySCwxkVespUKHIwDlR5aKvqAEuQ1nnLUvSiKg+t9uDmNUrpnOQtyIFWX0YWrBGHkuSkiyFIkEUvk+p3XIiR5KIscjK4VeDa2O0t2aBwPqK7xLbIbGehvrJF7hy9gQ5wq57rSWMHsEFwzgLEkLDKA+42toTAFC5PfVACU/Dte0HiGF3nqcZHgVAkwZU3LxB1h+HobjMD0uRQvIKPMdd7o4DIlmDXUqZQqyAFOhfuF1HZ/EQAajW6bjmv57DKg1OIBg/oVA1g1tPcSUcvBUkv1kSpXUdZQC5K6fxWDGgAemk8v/cQAPUGQvhULQtTORK9xtjnmEeL8AN6JygPJXa9MjIqoEv04BZbIE8gqiQG0h0MopdGlMvLxJWOIdag0wonz4LPJiAg6iSq7+Ew4nowjHDe2XG9SzAUhtByXIA8GROGGsGpXMfzcmScrvNypdmHWI1JqN7wKmI1pjG0PFCgipEIzr3eBJWN5bBU6sYGuWsznH1jg+D8zoFPdS5cQygpXe7VKhuE5zKFtR1zWdd3nPfsqB6LwBx6Jmg9yuSULB1A6yYXg1hOQej4FvbuTMByej9ReMdaJUOwLcyD0VJFEejWpqfIAQcD4elpZxFzE3xaKzWHmLNe1roaRuGkKq8I9CwxRQdTDXqA0nGz7AwAKIETeM3ggKo5zKPaeA6gBeOkAFkHQQufG85+LxBVcpDO5ohZ0KU8TFArTxNotTp5p72FKImbh5ebgJI4oWh65Kjqw4jZyum5hzzRI5pCdQ9ZqtzyzBqzUHJYUSxLcLpZ0Lo0AjxBJigt4ASvaCyDq4pL0KRJ+NsmGWjSNJjORgedPJMJXlBBpw4mQm1TP1UOQhnkpJ9WFv0YpkY/dShl6P70qxpLb/ZTdXhy58Hmmgqv7uH3HoQE4BPlIGTXnviELJICItbG6hx68RGABb6V47xnToyhqZOwU1x3aMXDsMducaSfKhJ5icT6lQ+Fzrj1GJza9S7SJoJTOw9ywAJ0atcFxsiDrvzgchSIEeDWYEZZCaYBbsHLiao37LDpZOIZKKvYZLmE1qmTjYlcp666jY1pOU+8Ujhbk7g27x47W1M6l0LIxzamcZ0OtYI2JnNuZhyM8OQOK3o0EV7VIZl8d3exlfkOxGeT2NTOjQHzHJlWEhAM0o1Mk4bk3rCBU+Xg6Ha92NZBFj1YFKqdPAWvk8vUTieJHYS3Ck/s+rm+VoEnd654Wam6KRIo5V0NzVZICt4rII5O5VoDbqrR1fZudHVe+l0swygsfY8bWJ2B4Ot7KoFNnslEWzRik+ViqPqy0ZUeusAJ0R64xeNcW1BToSmSiMd0pshWQRo9i5mErziGhLAxX3yyLGABlBGaNol9iuyGbO1LQ9DzloGVDIVWz0IBmDKatMSn+NSuBzZ4CJ/auctd8kITJxGhaZrIVl0aCT6YDk6ViZyuBIArGct7fkanNiZ1zdz6mm2s7ODEuLjd2okpoJ+fqHbyJOZyYNLOxEwG2ZrbznRz4VOcM3SCTIYGxA2dXi5Jz5MPmZ5v140gRyb1PniDGbotfymUdyqbduokmhdlV79aY+CX3birn04WfVpVo5+YQ59Oxml31RuFHR3cGbil44TpEoHQPWdeF4AuDxg6kRNB5NpCV3WYvXBMDXS6Tmx7vBXcInFjgyNw6AQnsykehq70MH5x3I/RiZ303Gk8dGWHORRt5UInc6KNLNfolG5YfK7GPZMm2je79dwzeay2Jda0b5J/ERifmI8n8uPb8n4fP7Z2v48fW+v7eNXaiv81qPLes/8QN9g1Wy0T+h7fXn3299tG8y0Cz5nq+1ocgu9h9mKHL1KcX4b1zQbjodaQ8XCPNDwbq+87g/n//hc0m4ixWuzDS8jTP26zif8FLayZhdth99L09Pcq6/kIeI3rBZyPP0n7Pk8WueL4sNC7w9jQUzU0oTpoQOS56g1tX+dZhFufqr+J1sutXeLWR/vXom2t3QjyaP0v5bQf8lYdH4Ex32vo1aSmq8Sh0KtJrZMTqdz6Vv9NtAFDDH5ufZW/Fq3CT6+B9zo/fsxzcQdf5shacnywvmkcX+rIqpdZXM/j8YY1fDweal0Zh7nXY+PXesTW+vVobe9QvHu38cT/iuavmWpSA2fMqUcGCcucLMy9yrHldOzLus5EIzszM278b1z7c6yLEmDQyncwDzgfivn9GOX7RYPfj0++XzTYf2zy/Vz3X30ou9sXSnqudCVBSV2SlQQlceloBhD5hRADYkAMiAExIAbEgBjwBJ7AE3gCT+AJPIEnEAWiQBSIgvo4zZxiTjG3GLQX3liV+Km/ygg/PlvPyyYAPphdR7rTXoK7Y5HvXa0aRBu6UttulegqROxrBEIbI0sNrf08jyazg2Oy+NfVci25lgQl15L2gD8wIMvWOxYgA50v6E/7Gl7u0lcFtvgLQnMg2ZxsTqVTE/qCX/4Fv/TyV6IXhs38A3/kQLI5/UVyINmcbE4OJJuT6tzHXJMC4MNdvv+WxbzbA+CFhFj8D2j1KOpZKM+4n0VP3QQDuGBsI8+2WDzsqPlhWb9HHxwxBNYM2vjSsEhNoVoBBWuk7JUWBQy5FVEwRa/Fj1kOL3nzSVUtuKrmhCZCRlT/5b92Qooa4ZyJJuySLlTZWlVdTgUsNwFyqzHVNdBU17as8i0mLonQ/25NoVbP67wj94MjnB5Or7tNfT9S7JsP7BFeUKcuZlWZsZGTsA8+rDqWqqNvpeoq7mDvaPLgOM7pRcwAsPAN4qrJbFY2yKgMZVxT8QfbxnKeOk0NVwsiWgkIa7p1iZZ8B4bcykDYO9h58LE4d5vuIbhu2+xBTB+VgrDyTzWm3Q12b5FAU0vPCCt4AarU10YUqa6uu8GNDCcm9fSQsKbHdd44kMKkpj4S1vQqVzgXAa96ej9p7Zve5ItrDlzi6Sdh+QHKlHSpSrOwz49+17VZLNRQSMlMsnGQTf+vboS6VeWdrUo1GJqUXO2qCgqpyqyUZhqzSsiliZLJlQ2tx9ysjElHB1pcG/16r+nuQVtUwRfdhb7ezIRq4EAOLgvALCVrTqKyJPirQRolKbIpXuDn8kFJi4TasSEWF3olBs/IGryS/LdswifpOKNPUv+WBnOSM5MhuUxpyuNqki2ElVh0hlNFFg2TbEx1BVVFmvhKslDOja55sb4ctiyKPT+07Kp6mJovvNZJOxmJjiImdWmTJJ/ZNM3pNvXo3mFrs4gyEgSf7NyV/kzS6AJJXCQjmZ8NOs4t6hpOtiC3JOh4av2nnMrkQ/IhiMVBQ1wTB7PfxnmjJOfB9FrHDtOqILxW0fSU5PlImUZdDwG3lABDK9OWQFBDBySQoQEt5DgJHlY5kuFnH9QtrYfcWtoTZ1lReDryCGj2m32nZcoybcO7Tbmh7cnOpqK+JNZcqrXHUkP11dabxLgkEeD1BypvjUp6kqneptXW7p5StvaWlNbTZgvPa7I0NDht5IpEaHC6TE1zptxRnPE6s60+LAsTUnW/Iv2/O9yn89SbfL56XHZtgXUGc3eWnMzBqlmf9e3d6UxcK4Rl7dRn3relee9P7FN2wmE17/nGL//a48zJR7FH23l3NnwY7UjQ66myYvtRJX/3csdZSy2sGrmmRKkJrd7eo/0oyn2Q9hQvqUQHFstXKmqqkogFcOYMG4qv2DtR14Pztalme+quvrA15e0hq/n/8R50ex54gbr+lCpW0aOAp8MeK6s+Qg6f1ZlWBKxmDUsss7J9n7n6/ItU9OV677UYcmTWqKp7Q0wFjiXiuP745pA69hTts7uzb/+udm5G9c3oPr9rou8epYE43PzdWSNehz9y1ojXPg67v3uAf8pjnNrD8U0awwRmI2W5IYfjrLmEroMeQ8j2vJSoiD0b/wNK0PHM9ExBVRo1hjFOpp7iVqTZrhPHfkWEqDwqVKcx+KDt1O+HsKWfnB6enlpHvZF3ef7o6sHbbbFLzLLHyLW7v46xG0f3MXaL+xi7w32sA3BwWAEqhxUgOqwAtcMK0AzNOm6HbRegkwZuSSuE4/BlAzT/RvFKrTRL40TSgd0b4iD5J8gwUUTrWp+WmsABztLw9buxBEVE3Gy0osHiQicyDiWNEC0+blBZBulTPIgi4uZF7VqQltqQFGmh2Fc8JE5C1KraBEbWX6Y9GMQpQ0JeHvK1nKerjziUPMpTw15JP21XyWGiZtpWtQn3ILb0HDnaPDfEmVpZ3Pil9jvEas7WJh8P+QTPI3l5QuDaARtE7sHC/JDzHrqK1ozEMZC6LnnS8JB5Ks8YGRaL5E6qGmZy8JDrYgwu6xOrycdluGqkddH8yeLQ8nq6/OH92/h5rIUobNWjDv6k0ZS6sjJyY5DjMhm6pqzK1ryVNVPlBGsYebWp8kQU7BhYzdBnyq68sivPUNEFlhjtzWq6qr0VhouoqWTQXkR+xMourhGwOeRQcPWtzHtPiBzyjf08qKpya61kc3HI0Yu8x1NzZ46nz14hccjZ7K+BD67uK+8BkY3662ZwOORpNlA4ZIXr21+0eVAZxHzKz9PN2swr9MR3Q4dKRgL2hnwR7Fc+uW2v+aar7ip67h7XU0Wf1/VT0efUBN+SZYzYwMzuXaiT3/qYvIVngbfAmVU57zmyoV3XZLsO0AuxgDZxZd1IljIKhlkOpd2oc23yvfom/o6ePVT7yrSz9y6vJTtUNaHMq3sb8RucilqzddU3zk2vJd4kdbnGyLqOM6hI8tv0VHbpPbcZ0SqNb4Vhe3ovYwSbdd7YNdPCVF5gOryTtltr4tgYYsakydT/ms9eNZMpNdNvupphUj3LHl9TFWX75+uWX4rQN+vMPyMN+9CFz+6Tjx3/fSFbHOzyHhBS+UTLGTGBmeKCxkLUUzxHN8V7TROWdZlhlpotMhvNrIneNVIi9u8KvA1J5JuZZj5gKH7HDUazj7rECcaVcmFLUnINstreM/uSXKcp1uT+TM7hYl9v55mR/TK9f6hxr95DR6HQ96+zr59njNuT9dg1ZSea1VuDZhDOXPYgYU3Dq8db0tfb42t8nLgziWInHjGBriYZwsTJY5CeNVHiPlKPdLXQiDQj3nFBTDz6+Qid+PlqsxvRt43u6vK5uaAT2Tjc0R1hdP56tMR12Pq/y3hjetfnO2/M3VKS3cUpFOBAxFOaWWDgXmFGmPTHQSx1iz5MD7HYT2P/KRfY88Ahn4MDCgR61AoIeoQAoD88pZnXsjPLz4mU0Ev0HfhshUk9moTwOil36RE6ptlcZ+gllU+Br4UbHuJBWmTj8H+2SAtbo2eO+c1JPdmMSnpvhVotOAdGdDCICRb56feSVOtDsg6y6ebuld0jC8TKlcVKgr58MGpG7y9Spo1kMKqlrDMY7aTMGHwar16i/Ote7t+qUc/dj5frLFr9JpUge334cnM+9XCApbdXvt49mVX7eOEKKk1cY+B7R2ovHuVH96KZZ7UvxHIwgeJpSPxwlt9w/o8LpmHO6y2+R5Zsc3a7kJ8VAamBMH6YR3qZbKrZaJr1QUX9iZ+Gejv1M/r19saImhMbh5J7ftd75beZeasvxHIwUX/a55/+OS3n+R5ZrXdv6onuACmBwO/rrvy0Z/aEvhDLwUS9CPJP7Z3uEK9HNo9NKyPmHpAiCOz+5MpPe2bA5QuxHEzUiyD/tO1pCdj3yBYS8FTc0wekCAKbXSvx054uyKHETjK+HEzUiyANc7TH+/5xZM+C6D15CQWkBAK/c87y28wawRdiOZioF0H+RRmmtW7fI8tiGzLJ5wGkBAKfPyrx056Zm/ZCLAcT9SLIv5DGtDrue2SzaNks9FiA6CGwu8ytbNrZ/r0XYjmYqBdBGuZoj2//emTBVqskbV8AKYLA5syy/IbtGnshloOJeimAwX73YxXp9yhjgvm7AIeCUwmESd5jIYLv4vILLn3sdpqNeqWg3PktrlHV0vf4p9sxvHfJAK0eFJN7MMmo7Goi0byufgMuwUQAOFTQ9W0f4GIIudDaOG0Q5hVCDfiVSl68RzpzoYgIF+GBWaB208dd6+iKC8LUA4BpApDL1ZlkpO6K9S8bqZGaH6KLy8W9renFc0YXhy7srqiJjKxJRnRnr6r1Ei2eDoCISii8naXEB55evkTrhZPK9Wdl4IwdV9ZIb2m0gEuqoPUeaS/FVNJXrZjq0VApiZOMhb0LoXqpJsaM2lsf/cSXHc5ivE1c9YjyEiQH/EolFN5mS5ngI8JDTGD8CNnVh6haxMHrVZxjM4g24JgUoVbGyNs3Rr1kFQNGaF77paYTnj4rC3tlqOrxMAnNkwyHqxuCegkmhoras8bDe9TRryj/zIaoHguTxNZqQfj7fKeXbmLkswYrm8AP/V+gXgrJHbZ6VEwe/iTjclccbNNIcYvzA1yX6u2/rcl2TQ7LyRPkZpi5ZNBWynLlZylt5bWYbrLFU1u7jz4e2lBdCdb5A3XYboC5rBlKytHfKyzNBBkjR4xGv7TXBlbFMNSUAbHVo8prJR7wK2VoVEY4+YSMJ3zEWzbSGJgOIph77OuTzcXLJordAqwLTCrtvZUhM7ZxSC+dxWgBl1Q86z3SE/Uydd+0Y6pHQ2XnUTIWxvbk6KWXGC1qLxrtSN9Wk3VuG2EqR8OdY2+VbRsa8KKRjsAsADW0KpazY9S+nniOCyht8DGJMq6M1J2wl0QjFVIzA1xxgSK4A9V7Un1ctbhNETN5xZSQpb8lGnqJMoaNAI0eP9Pj0D+7M1yHRlaOicsyc2VQdrP7QSNBgSkgZNGvL7V1ibd3tjuPGqMJOiqPnlJi8rezQCN5gWGj9tpv9ny3f/tNSlVzxuaDikhbqLRo/G3bz0hRYOSovfVx/2D/AwwZXj4fdC64mKxWV0dnK0vi89JWjB+QAqVv4dbQoF6FnEKJrx4ZlaZTyejsZrR5XuLCU0DgRo99oaJJiI5uSoGhtMLHnf+HlcHa00DuvKSHJ4Ja9NHbRzcAsurpAFIzjEwevqtF5m+FdF6ai5EjRlcfMmsDGji9CfHeYqtHxaQSVjIu25p8nJG6wFwAO1iYNm4lI1BXvsi+SE0wcjkpr4zX7vb1ZiRDZkqAJ1rr5dllWk0w+9wGsiNYMmG30jP8y2LGgdm8FIqnAyCimgVxWzkRiEdtG4TWDGdeOBmBXyljx7uIGhuaiPCRYswCIUt96K99xPKDuo0UA1kPL6+kj8CvlGGinfBs3QLPWP8y85JWjBm1tz5EdeQ1me45LVgDq4dEZRRYUiLhtGGbOTWZl7TwdABEVHE2bitvJX2gc7rRWuHkzsbQKsHtb1teXsrE80Jt0sdT69loW2rwU8FshpbJOH5lBO+GAW8ZKZWZGwKLq2fEncgq4Tm+KwPuCZnJ0bJkML1dqMpKjzFgiOa1X6I73WfYXcNZhKocD5ej/8pw3BNjdjISGTM9xBbXaZHbUvB2vSbmALojaC650ZLx9LYSJi9NxoARmryu1PN0n8gjOcJRVA54iJxRS4ZjE0sR8tJPjBy1q4+nFkC+XMccDYytHhWVSATLuGxlkT9eiorxo3bTR28NPkDoy0Kv8NUjozKjLRkdb+Pn8ZJSDBi1136p6HRXxpvwAClU5XjYoyHYPI79S4/EvJ7q60ZJC3Vb4hYSLY1kFkaJAoG6QOQOS2HTuDYvMRIbik+PiHFp4lzI7Jdz02hpA5UCkXd8EJu9BV5KJBbYMB6aci5k+WknjMEMqBSIvAO12Owt8EIiscCG8djUcyFHvUmWHl4EKgUi74g5NnsLvIxILK914zubdi6EspX3djQsoFIgso/kY7OJ2Vc+GEtc9GDMl1nwRxyyl+CsyfK8U74iIxbrKJ8ChUCdV+cStiI1RqEUY4StoSnekVk3+Ku1CD+IX1n2Ej7XAqmJRwKtCD0czqzkqphNNfg1Tvl8Bbtc1pTv7vO/Nn73g/WV9TjhcyGHpDCmrJewDxI3+3zPLp9t+IvW8t2LOhYbAIWzbi/jXIjGru4b6KvZB4qbmbN/8bfwVyHmu2+xsgGikOvOspwLmcGbkhEjlX2QuOlisMcf2V/JxhvsGmtTz7qOVXydgOLvct23rOdKutPBree1FH+oxOkbOpbK/krXfNUNajiGb7G2AdbGcy4NyXnZ7rRnrL17LmUT539SEiT+zCVPYfrTnWd9HfbpEPaC9Hz3/E1X+lUxpkZgFhcVOOH5Z6QrF9nwce5b9bQkOR/yyQinJbExcbFy2o9izmDnGyjZbyER+Siou3Yi/jSJu9so8A8L+O1uw1/ox0kc8acJrXIv9DOO3AGL6k2AKxqkT8FvZwJrt2jgT5MmbKRQDgv8dgJkd9QY0m7f8v8MpWQbsBLRsHAh3BnHUgdOeIJ1wcUyCMsgOMWpU4N0qo5OcerUID2ELv5Hvkrrcama8gQVaB/TmSDAv6j2r7Wm7BuEuCDFuWqJfypdQmBZAigTnbAXc/iXWl2TzLrt10ekj0hmpY9I7qQzga4baECnSSOeTzbwsNAIA4vc+NOkEQYuGmFYpWUvlF4ogBtIFtqOB42IwMNCIwysUNSWS/yEqEMjInfTC6WfSxZGWzZSGuqNDQGI3l4owrR5UcoAYDp9y1gI4El1MVQdUHPVmZDrb41DK7sSYzr1UN3Fzu9ecKOdYSymmgDLriXJA9Cw1bVuLhMfaLJrRapARww8shvXQIKaBTy5ZRQzN/tJdJy1xSUOngnLOVJiHewZHJ85ZpqH7NnKSeHuWYKXVlpVJTsZXaAjqL6mIXqzq1wlSL0uxyIvuzIl0KmzHniPPUgniN81dhI2zsaVbNbYKcxa1ARhduVoLUxBW3bVnqNJOIQrub5m8bFmQhhxN6lIskMoXvv2rztqqpT1MthVHLlWrxkqV9jGTwzjxS4mx2awulPTRKsazmIbK9qN8/2JkWs9afRBt+MXTHKb3+p+9iT2+dffca3V6eP6TfsgNl8AOfMnlJ+/r3hW70cJ+3lQVlXnImVvqCUiO/FMXuhqt1oTswfdQgYY1e5KBF2+YXrZpZceswUdDZjatUYJFizERpl2a1iZEmjGtoRwH6SZM6BLtVnRB1+34xGXAWzLrDI4DwKaFp2BOV0hQru25CMsMj9rKys1Xl+P1mje2wKsxnifKs4d8+1vfu+RIuCgkfi9LMoV3rP2OC9a9DZe/Ihk7Ybe0XA9IYuMUUJ2K1xDJutTcz4X077FFoDKi2Jg4Ba+wZh2a4wSetgmHpy0m8u+snIdSh9zWwwCwtWZmE+YEg0U7a5zJRqwShVMaDefF0lYJw/8sxsPIrClHtKza1GixBWomVgCcslk688O1m3O6SGzb4ZM3w4p8IXf/7Tps4uf8hvzUmS+pqqQ78hj+Cy4vb/r6eCx35v3sl5lQCxOu5vfv3lP4Nq7bYNExa7Yn8Hpl9nbAd9v/vuI+a/wp3qa7acGylR+Nvn6e57gzOF2+12v305iNdfet8L2CLNEcG/M52Ljub8/Mgx0fpmigVq7tuVLBNbJA1/tWiXTgO0L7jnUchS5o1CP201SU6cKxFo0uF3a06P9gXkiTbxHalW9p/S/KKyRq91cdYJwtQobhGo3X0ME1sRBonZrWpkSbGdxiNNunu7CWgpgXQQWrqp6LYnsj7XefyG38F+hSBu/shBKcGgWuMJFlSJyrAIZNtZwBIVhAObe12DBY5wyc8KfDfMaTDXnC/dVAJYsj2yOsS4WEITdFUphJyrNmRDDENeldA0J7FpWPAWONvavm1DBB5qQ9LGYvGC+rhVlC7t1Q/+lI+zVogtcDyzKHLqd5gJ9q5qhrrgr7vgPotacNm8mE6FF0OuwJkj4PIyRRqy/uA1aeCflmpK4xELzdfN91w6+omk1/q1rQyEGnHRCunVtKiSBThfzDrewFrrWLYh9gl3azL/550zKor9UJAFM0BBsL5PMfrZOtHJWr6PO9/EN8/fn/p1E79NNmz/Pfuu/q4Sy9O3O6YmuyEmfrS9TNxaawtGhUutyzc7mHLNOLGxeNz+VypwJDqnr1hKVDGzwZa6nqm2S2LLWKPzEh64et1yKln9xrSMt9R+bmM26yEVXN5bL0U2DNpGHLvRqTg1uHarR+VhNqYmc1jNsLz21OF+qlVrLLbtR2/fusO2fOqijPNmzurr1oq7PbwKUv/uzwATQPNx/SvlhSjMEgImsGKBP0E09le5CCrB096UiZwgi40IYDwkiX4fgAbSiFTmpioRT636Du+cgCSit2+OD5Bc6gUVSoupXy/4cdn81czWV/L/xbMimbMm27JEd2ZX9ZK/skwu5lCu5ljtyI7dyn9yVe4pQpKIUrTiKUaziU1zF0wqt1Cqt1jpao7Van9bVespQprJkQtnKoxzlKj/lVT7tZoQ5Aj/439/5BXaeZ0Ov1IV28j9X7xRveQCVuTE6tkLTS4Dhjkm1CreOnzyk3la51HObpJFr3ft4sS3fYuNbihvcUnhJ3Mk2EK1b9P3+/9WxpfclwPpn/PkzmyEh8KzLla0lt2pKApSqZVuEI+vawo511dWkJVaNlrq4sC626UqwHVeCbbcSbK+VYButBNtlJdgWK8H2V0mwzVWSgAkpFYzP6sbFZHXNqCLLYPVjaULlWNI80lxu6Emlg+zqJw6gkDLbrAQjuPrxUVt9rGMssV6xDNYllm2Z/rC8IQI7SMMrkYmbXG1YcquqpCaBSl19fWHJdYQl1guWXBdY6kMOpJrqoLIn39CRCmTSp0zGtVM+ylj/KN/KkKHuhL3iTh/WEUl9Z51Ajw/eSgR4Gz3BeTXzW0QjopWjlSjSQdqitADg9FHfQ2Ebl1qGEFp/aPqiaBh2OxVqWn7f+ElDn6VJgQLt1COJBoVw+cagKCMzJR9BmSpB4RyUAiZ9VEMMHSkc8kVD0DrqghHKZEKp47ARhCH7DstUU0STpUgc9BkTWT5lNVSKFPiWwggTE0YUDy1lMPHRbWoXpBNQWS/C6yfX9PPQSR0zHOlw9MIQenkkifIosH28gT8VhVyWwh99ObW4rEKbquKUGzmhdBW7yn5e2WNYNLKEQa97XSXEoeK7XfYRtlNHDr2RlBmA6aN8QzVsGkWosgMi48LSRyGjweQ62ZtUBaWPlrxjwk/zM/wsP8cv+CW/4tf8Fr/ht/kdfpffYx6ij8qT/hx9pb/or5U3ylvl3YkO7Xqxl3p5/+X8l9A1R6WOOQD1KR3XTfEtYdyVvYPQR3kDrnBbEUeMcGRVijpXKichiD0bKJkeHkvjDHY+WiZbG+RqTCMbSPHiKpKb0Qyq5pBQ62wxVmjKfsI8VRQlN4l1UgyX4C1tJCRiIEDkPWymlh563XW24NvaR6QIeXK0AdNTaOLPW00A6jyqwUUpxWtgawjKrGk7nZ2GhiJUKqAd8f2cXXAs79chZx1r2BEI0elO4Sjc6SgYSdlvPvJywutpV4SpcNUmqPgMlNOrm6nUjnh8DR8lB8oJuNNHGI+yT2jxPwEvZ7Udbfj3VLL4VdqnbvGLiWFeUXwFjkMbv5i/UGwMQt3safRGLdSNHo/yeLZlhXGQXE4VPjuVMeNRZ7wNf97ehFct5T/KLToQ1vLvOGDk0VCx6i+nD1/RuNoD/MW50jXWbNSOlnao3LIyefW2ahGeWSupBjuTgDj+UJkuS94qyhhlkSu+MFXwN905IxCRd8Cw6IRF/8DYWOSxyqGkAOxStfTNUjOSqnUcxlVeOQCczemmiac6a33JmxUyNlgUz4GimDAejIR5wVgXaeUP5526HCrgVEehiN1jfHLycB+HQ266+2T7cWCnDVbYmMCR4823ztnQRJ+6pVvN8h7KdWjFe9gZHEjjqT+Lk69ZiNLek8PDeaS3F3ioYgZi032MOT1+nI9zedyVOpCc8S3QO7ov7nBVnCElbFsCjAVRnIWA2CLRdqHc0lQCAmzSkMYdQUI4K4Th6YrnQGssne/ZYYQAZ9Cr4jHsfATl65/A0QuJ5fekPlhGih4Ym1BTHigCLVXvbvCH1Jq1oVc5afATVh41VyG0/N4k6gCULQ7ApKd+3r2juQLKNsdPYxdyy+9Joh3QKwaAWU8tvXtH0wG9UgAWlv7UujjVgt7w7ui2MmFjqkO57fNFJjFp/L5u8Yl9OnwOymJwum0op8EtXzmWfI3irsqmyjbURMZZg+IrsKeHJJ6cn2y9fSAeHxzMv622MjonlEADEwmhHXWEQ+2AXkEGlHPRAIHT1SeUqo3o4fJkgCamg6DHgVok3o003ZqFUaHie15Ofb6lwTZp/Mq6yB3TfXhPrXz0LlorUcJU0pYSM2Cmly5+M1jgHvg62oYOmEoplQPKd+U/rk5+h3KYM38YN+gVP4HjkO8XdSGVwdbRfemijP8PJXTAJRxZPJxPhoGCtxDgaogqD22lqLVl9KnG0NV390qY6ui2YJXtwUoUgElauopzQzkcdXTnCBSfJO3Xqj5/xztLnhYoXqXLKG0tzITiwhAwes6j4JbaRw+8TCvWz4V9qYgeGGP1BZQTGwhXre7eca668yM3d8Xl4PMGKuc39D4cVCqHwgbkeMW2QsFzfi8M8QEulbLREu4crQlbtRZdtasZyqFtZa11dS4YwsfRmlXjNE4zacMqSjEHPKtS6nskpbj6+1H3toPvN65zb19cL8OYz/fiPk1UxfHOcvGVmRkivIGdnPdaYVApxmA3uWDxYETrTt96R1hKPabCDaPmwmFUUd+dhGvAzFBvIDwxdAoUx/U//cEzHGNzdQWP/1yj+bFngKN7krFzTxwv98Qxck8YF/c8yR8wCOzJOqbg4QEMrk/AzVFJApqjcgQuRxUZoBytsUDJ0Skv+ZKg/V/UrgGyGUErUTxwtOEaAGQbgmopXDfKDsWN0iC30ektuXSgVpaOKVWmG6iOTJEd6XGSmoJji+quhB2rr8BoUUBr9icK3FfwY9IV3qdZz+wnjKJZLJrJnOXMdFo6y13OwT1oqz1+5lCxKpb7qoG4hrL+1LTc2woLCExzwZhQQzRtUb3GFN4Jd1zeZrGg850YJymS2STVHB8AAB/17GACiVqzGhzU0wEDUIGDVOQQlThMZY5QhaNU5ViaJXpcj+Q577e3XqGv+9N9J4aAAQQFhQaFhoMECImGh4IDAAAEBQaHgQIFBgcIAAAPEA8QDxAAgIUGBIWFBgCAD5EPEQsMBQYEhYQFBAUHiA+RD5GEhYGCBogGiIGCgwQFhgcJBwgAgIUGBYaDRFZYVlhWWFZYVlhWmJ0eBQYBAgSFhYaFhoOEhoeCQ58ABAUGh4ECB0ifAA8QDxAPUJ+AhQYEhYVGn4APkQ8RCwwFBgcIBIWEBQQFB4iFhg+RD5GEhYGCBogGCAaHgYKDBAUGCAkHSJ+AhQYFhoNEVlhWWFZYUVRRVFEUHR4EhYCBjA0EhYyNhYaDhIaHhEWfAAQFBoeBgosMB0ifAI5PH0GfAI9QnwAGh4QFBIWDRJ8AhoeHSJ+AhAUHCAABBIWEBQQFBwgAAQSFh4iFhogJBwgHSJ+Ag4SDhIOEhEVWWFZYVlhWWFZYVtg69gFiwiIDYsIi40GiAgNi4kABYoLi4kDhQMEi40DhQOFA4UABYgJiwiHiQIHh4UAhgsIi40ABYgJiAmLCIuNAAWLCIuNAwSHCIsMi40DBIeJB4kFSFFUUVRRVFFUUVRQlhgZiwiJDgsIiI2LiIiOBAWLiQEGCwgLjQOFAwSPEIuNA4UDhQFEH4EBBggJiAkLiQMEB4kCBwsIi40BBggJiQoICQ+NAQYLCIuNAAULCIsMiI2EBQiJiImJSFFUUVRRVFFUUVRTFBmeiouIiY2OhQYICQ8MBYqJCgcEC4yJDgUGBIWQkY0OBQYFBgWGgQIFhomKiImJCgeEhQoGBwiJjQ4FhomKiYqIiY0OBYaIiY0OBQYIiYyNjQ4GBw2OgQIJCgkKCkhWWFZYVlhWWFZYVRocnYECBYaHhIKHhIWCg4NAnAEGBwWGhIWDAAdIngOPTR9AnAEDQJyBhAUHhINEngOHRJyBhwQECQABBIWEBQcEBAkAAQeEhgsDAAcIB4iDRJ+AgYaDgIOEgkRWWFZYVlhWWFZYVto59vFxH5e8RmD/DM+7lCufP+Iw7hNNhb22Bf9Bru+QZeX8c7c7uURI3Ye0bcDWn8nMBLnpF8i0nFfiA5KA7p4bZVtjbJW3zF+oi75yW1UlX43CNoxowif1kUXKHfnGT538kHEf1e5RWLeyODv9ixKiLgtMgMY4YR4wjxhHjiHHEOJ4cT44nx5PjyfHkeHI8OaIcUY4oR5Qz/0kNVpQKpAK5wL0BrJZVBLCKK9QAiQBqaKvxm0qZC0nMpnlydrh8D/z7awT0y/kivMULhJpu6kJ+WJz1cw7KfwVOO8wBwg5VP3Xk9QV/HYqAesDNXS2mj9t2VtTZ5uDNqBbViYaoOkA3EFLVIXqQkHYbBko7zHam7vKvQ+DHy1cDugBPTwsM7fC4E8T0xjxHaKR2VE7MLnb1P7gamAYuA/s6DOqqAX0comardrLnoCBUjehEglQ1qhsNryOAxeH1lV/E17O+fgi4XHrv49cHWD/nrg/OXR/zwaub/hGIe9XxJaj9B9MXG38EnOyD0/aj6y+f56eeuoF8jWYkoKvHuV6+Oc74xBsk6/BThBebInftzccs97t0Ozb4Bo44B484eGZNZIuSyCFIYXowv27hIH2gKTZIsH7Ouyhc7NJlF5WrXaNFBUMdFgk0OhSEbRiOQgkBNgJEoY8JaEjfmW5JcvphUYQQZJNUkIRp3XRQCTF6mKAWZvVhy7fazmuyKB3URjYZRheyY3mrqsnGbAXbsdrUNDkx2m66NZcoRtdUMJkSua12kwdsd1UBnu50xo1v7yj/occvKcb/Pu2qbvjyU3Z0s5Ciw83qWK4asqugmIpZ3VTF1PSVeZdNxWEMa4d/SECr2qAdkjWI083VULQe2rOrYfRhPLfarH7orAbecxjAtQawW0BE+13tQJDTTT45Tm8uZFZD6UuF3GphewBPNMmPeAxS06Aeg86ZrLZOt3SAPQPMmKVB6QdFLBB7yYyUE8DsNWZsTUn06/A4keF3x13+bmi851BnRfcPEccbdWzYd8H5E7lquRxO5T7/wfWNQelDBSyjn8snCxD5dNKJxUNNN2rD6K5Q8UjTA9loaGFMXEZfZrLDDy0vrRMuYi6CsOkDPAjMYUVsBqQesrbm9OEm2/lS+kE7E2BbhKfT1kA8hNQn1EPombKzTITbNYKArQW264RIHWQBY3C6uM0WpHp+fvMv5AyC1psOGEZfJuBQu4AuXSyRpWaM2WUssmqdwpasDITVm61v2NJlnYB2HRmKdZqckMB2RNdoOqCY1ZB6yIBmVkvWOLS+dI33qQnFOkfqBKNbK4ALtqH1omsMfUMjCNk90NbeVgXYfUQBYkD2kAoQo5vZXMKcHi6gWX3Y6ZbIuWaL1cEGct2gW1etNtb302Cot1g97OYWQ+hDBCylHxRxQOwjM530iTqvu0PuCDs8rrFB5lFp9caCDXiEwFhyixkxOF1cgWfxqdCLKgi03nTOOrrYRqrOAdWZmIp1S8pE2JEiD5fs68tlmsxI4tip8z0zjuTl+m2zj1/0QO1eh/krBdkitIDUM7oZz6qa1cOWNNIhNDXfriYf1MiYGstv/HfOP8Xt50JfXdt/ZgOsEDY3oG2Cp1p+DU/jCA8Llc9LW/tv7BAawm7u1g6wPUA37/rjURh53hIFzzC7yJXrCOZjNcIhzFiPwnmrxejD1LGsfuicgNAQdgtbn4AdAd3i1hdop8ATEyPM6c1NMUeQ0peq42C7AS/RNIjdQpZoBxVqd6FzOoSG8OCptg8ovv3rMk+Mjj3PDo/8cLn87gpuMag9QLsNH5nn0wfCH38L4DHA5vnxj4AeA2J6ecDpw23eVVP6QacuFg/bS7jrCrHXjG+xetiJG3oQ3pl3Xvt3y67j7gJ7fkH2AdrBkdHF1GBWL7YgwIPwE339+n+RQseb+bfDtffSoTvz3V8OMLxylGyKRtj/mDntHThNnriM8/5B6JzwdrEHqS/YoGH1Q5ciSAdhN/KVkwA2BXSjXzkLaLPAE5nVEsXpzU0xR5DSl6rjYFuADfE8zOGbMfW1S8hBhY7VH3MUxEEYo37t9R9jZWdpfawOqR+4MwOzTS5I1aZ0U7UVo4cJ6uqw+rDlCzcIt/pevZVuhX7Kb/PBrUM53Dxz1ceNOydgVwEzKn5QelMBw+jLbLw/AbCYHWAxIauLHawJ3vB4Is0gQIJmECFRM2iQpj1I0El7kKGz9qBAF+1Bha6nZj6w/H6m31tLP/P7j2WjuuEHHvzalG64CMAAjMpFAzbVIoESKKsWBVRUiwqqqkVULfJJ6kUAB/UigqN60cBNvUjgpF5kcNZaFKiitahQ9VS3GgaocKthhIq3GjZIu2WYIOmWYYbkW4YFUm4ZVkh9QaDp9i01/Qj5H2zSgN6JHVqBY1B6UQFh9GaUqxZmD7CIIauLHXoHumH4SIIeA4ZPhWD4SMIeA4dPhc7xu5KO9m5SPiumhvkIZu8tOhxyNHS+BB3t3VSdz0qpYT6CzvZeKvmslEo+Qo72Xir5rJRKPtDhsnS9zgc64BgOHfY+3w8UcAAWsGADrGAFGkAFKvBALnJRBkpRilDUgVrUIgyCEg7CEpZskJWsRIOoRGUezGUuy2ApSxnKOljLWgVDQRUOhVVYZUNZlVXRUFShCg/hCldkiFSkAhUdotVaDUNDNQ6N1VhtQ1u1VdMwVEM1PAzXcI0MIzVSAzWnz29v9Se2e9PB89urNw6f314+dbs3nT2/vfpy+t/p6Pnd1SfpTcfP764+RW86eX539Wn1JijoAC1oAQZAAQdgAQs2wIpWpIFUpCIP5CIXZaAUpQQlHaQlXfVb2Lr62yz/4B8qGASrfpR/MjDOzfO6GqIx00yaRHOEbBvaiQu2HXqYlUc8jHj7SsPqh84p5B4IjWJTA9olcE45CK0XXRa+1V56XIG0Hv6rzcecmowD4fbapgHYdcCMIAZkh1SAGN3MVEVU0jIBOw1EZVoWZmexBXODhOwGFNcUROwWEtcWYvViy0OXbqPnQd2xfbOGTRv0aEfrZu164FbCjmB7RPubPqbXOtPpOjnG69yMno4e4bvjD3jWIks/CB++GfFdbB+kHffeOlXfUAgnz7GJEtS0PvTY1bcFr5GXcx4U5bD3Dql6LINVReoi6zCnF7aLC6037TtVMvoym291rX+Pam+ApBLm5gejINZhn76+uajUTe9p14iNZvVseGWsljKwsjAbh9nEN3XVJvmPvzLcLyOdER+UAW0WuAgTjdab/ot5WsV7oX+F8P93fkatPUqJD1I2TyRGiHJkANsNRHlkQNsLRvlkMLuARRVlILsERZVlYLMqVQ+5XRC9EhPOMrL6suWXEh+MTDFRiQxgp4GojAxoZpMmvJiY2UhMyFlDdgvaYRs2uxJDbhdE78SQoHonyi8lPmgPRD6lbyC5QNEjjWjXT86UbIe9maRyfSPbcW9mEiUbhNMPMxaCkL2kFAnRuumsxUQ8Fgla1GPRsx2m7M9ete8ihzvMkX34stTxdOIZ2Y57c5WqRwbR2TkwwkEGRutL+56oz3I4SqqehHN03VsoUeKU+ODOULIhG4EMjGjMxCZKLghkEolJWKp9b+5IyQFsGujIkgPaDNiRLQczOUnlO8dHC+15iwjAppjKMCuPeAiB8pcLNZWkks6HDxqaB2ev9blORt/862BrDHgY8HVrCvQw6GtlfH3mIeZI6Uv53pA7fg6HWXnEo5B6CtUrVWftsDQ8q+fnqgcfdafEd8qXqmqmVZo3aA1koGqct/23eP0SMZ4yUIf8lNe59jLCYt2EQq+qIvJ3MIwXrYEIJDpvSjtTtzOxM219pgdoYc7Owt7Szup21na2rG+eJ6AmGoAW7uwcbudo5/T4z+8fAWRdBe/GzL5uA1D9G5o+vQOq8FHMPjx51ByXJ7pd2kNYPOinDsuoZcz4I9nNeCJbrQ8quxlQ7GZAbTcDGrsZwB69ZkDntjocGJq1zmKmPeK45ZY0QT0O+x9uNZc2lbre943P7kWbMM0TO+TGVOlQJ6JIIb7O+I1d+QZVEBwOiqjxcFGLFh+jziYWWH9BHlqRsFl0ogqIooSCWnj4EINWQyfldN1FaDC9oYENIpo6wQaKfCFU0JLNBHnKFOHIz6QLHu5mwMuyIQXvebkyZaBzDLYpNSz5Kq0QkK1mXpQK18NU9vKggj6Kl8WEj9rDvl6CzKXg29D7AHdIthN2rRd/jHo/cZx1H5JLRYOpK0a0PfjgV7C3hQ4iMb+uE+X7HIKPepbwr2d5hHGpFIr9tYx2KC71fpL4msqcRHZ9IDv2aByntn5LN8635tC6+Y0KC6jFpI5nFJ4r682A4+ZQgepI594MY1e97f7IHRcrfzYAIs/aY3Ja4YAFXHBWB5DZEur3AA5+xezMfNvAPdhqFjL93jbA4/K2ZQ/GtWMP0swObNv14MoiksCPJq4XB48ELisSCVxJBBKY//gj0A/cERhC3N29tjgj0GkTfG4KVF+rEpN1VidXnr0SVsokAnkX77ED8PIKd4QeBUWavrrd0DU6TQ5slNJ2T+6ZZ9CFVk2k6VqqNH1KtdYg7qvrjFUY623nCBYEN5AgOLzNlVfc2/Qsxn9VEdkNDo/zg3TwnvfxfLAe6nYCwQdbRXcSO8r2lxRkNGe8pArcI1UGW2d1DWogO9idqO1bg2E8ht5Jx8QhKg2/pVmu2gqzOI6OUH99aPMsjjXAoFgUg7h9ApI0Rwc1+s7YMxWDf1eBKAkTQHy893W/6895fmlPsHEHAWgSAUln9ZsC/+8fHGzeQN8S4X307SskC63X8OEp0h18gr5A7QgSJOgp+lqFzyos1VN0VWmFT5EgQYIYt0CgmsIyE4duXDpNOIBIYZsui/B+A1XJQmoKf8TClKYgPonXsa+A3e8aPZrEBy5xipIhgwnqLH8Q0Oj/K5Hyq0wJ8nqL0A2BpgLnFAaBA1vBY3OUg/wXfNwUOARyEhEM1ETk0r9AjVfpT/UEhLvIAjGGhRFUy7x0VUCXwrRJghYJcROM9F0ge7KA2FaxXgIAWwUFBeCGa6n8oKwOiXI8y0smqIJMqtYgjUkKJFOn7RBwXNapOUCFVQwCVU2u/BrTVgViLNbPXriyUY3EFoWJToNQcNRjjyW9dif7p17ZLl3kOptoMzAUWN1MuOfUs4sCNLgSFI+K+LQvYRewgnA8B/H/gNMlNazmIB+I7SrjVTVAgA+7g9KjYiUPQvwbTnzDKv6s9mhxc6wQ4A7ep4YYK9Eg4xDaQdtYrHLboFW80OScmU9xFYtPEhA24yo+AUSs43jNt7pDrMGg99lS5hXWoNYiSt3EFIIlrYGaLgDOq5pYEoCU17cY78TjUKo7PECfUFPq0qXPV8aWp0/oiev4S9sSqRTssHmf+FVXFO78pMQSc6kEbxNmMvDyKd4mGJdqckpWicoI/4jL9JgDfAlAHFijOszSxg85gbXt3X3zHGf3jnrN9pPmRzeS5kmlLanyomCl9rFLLcs49MHYXbpBqnWouzS/6218ogVoq7qBcgWnEaG/s8sFKh6nrvTFm+JKF0oZJNo6i6ENbwfq5dMOXfjgPwLjVD6M//IubvAY4FhHGIf4rmG6ulF2ftZHwUzypTwU/o1hDi8eT0F9ow8Pyfrdu4PWxN45gPGeO/QIUkw9lyCO8cA//E5VOQfQeUKm81x8N5auAltvVMXWOYCvh6AOZKqz+BrP3lITndaV2uW32y6L2OC+vwRjQImx82Tx4ODGZhOLUzIRfq3l/Fd/0PQFnLqTygtpWRGUUM6WIWsFrXajv99hSjU+uvIHgqIYzH5/DmYhXJxplysTyfrO6bH3uEu8xE1G1Ef34QrBNHVYmyQlpiqJXBYYEk0NydXpoXrC6hnQvh1MRahxcQOaH1hqCKYs7GVZXUW7WUDi8ku67mNJYAgsNQRTuPt7h8mrW+b0LG/kSe3PZYEx0dSYXFksqWYojVK1bfhWepsv0cHQkcww82Sh/OKWRPUyxlO9lcVNCFADS9VgyrR8RNQkh3aT6a18nCSUDhZAZ5x8JGc8kzH+HHzENFew7WMyFcbnyiwSdjAG5eyjiGbxWdqCibLOsSgKq9/f+WYbWAIdyTR85smMLrWe9rSRUYjR19kyZd0fLIAF6+yjOOcz+3wuRbW90OkwLBCr74ecPn0FFkRW0FALIB9GpuUMsIpXpJTS6innGF6BmhVRVM2Hkelec9lLBzqA5fIxT/peRAwsVW0xS2yREiuzE4+DVjF+nx+024HU5DRZev0a/Gre/F3zqVV+RD0GmANLzcGU5WoQr6BJnhGruHhtDfjSgdTkNFna+zqX8JJYYpKzabRE2ud70UPOcUx30UvmSm6LfdnK3XfvbfXpy8mS8GAM/MlHcPQ20/fqkNg2yGjbvq3EepUiGAPKjJ0oi3tNs2GSCUnJFgjSA1cuC4yJpsbkymJpdiLa5mdxxOii44QDfbAMgnDyUVzBmZn8pO2Ot3Zqz+MbZc6J/GdpsqTa7FpiAIlj0/m2WP3hptUN6BLMdBuqzFWP6Nm3uo+L1e9em1AGDxZCcM4/iu3ALLQsj7pVoBxQWlE0qEI1wUwNqk7LujHHDFwED4atvLd7ATWgTO1EmZZobcTHgUTq7KzuumWqmTu69rfNlDZXPAnMnm57Ic27+S02elRNUVz4V6Y6rGfetSxG2vZC+JrLuk9koSUlGyzuVqVdpMwbUMlvj9CKo8kjqglmalB1+rZ22doZXtfn2TxTepa4WRToEsx0G6rMlWyQCNYeahUrfFjOHR8H3YDnu8nwRj/k50ckvcLPkA1xpZtALAl1gWW6YMpcyZVaENxPsljpT85j4kJdwhVuMqKvN2ulB8bb572HKfpbGu/LAa13ILeBofLmXvUA6nESmJBmOjerBUNHMsPMk4Wq2VKQxZN6bLP6jOXELDEwO/7so9jMzU6URYUgl+BgrfZWn3OzaFA7kqkzT6YHgyvUddfNkUtrsPnCh27nHclU5+m0+oaDJD45uM1j9fwRvRRAswNLjcGUxdJtiVuMI+XEKk9OMnuHzV/0XJI8v80ev0o6UoGYk5Ji9X6de1KA2pFMnXkyLd94QNKk27W5t/qLviKgBpaqwRToen+Lze+srv6xsqZKXNsvYbPbBnrpOnf1GBtd7/INdX8FfsEuIv/NFW8+yG5a9Mq3b8ZamvVi0jsZGBe9Q6lx8UCy+FfI17GFo2Evg+FbuG91bm772gaRD3SjzvIVa6xLvtlTm4mcsk8GavaIpWo+jEz/Cm9ynnnYghZAFvPw0QdcydLV2T1kTKy+xbsUggXsQGrZOk1WrKWJYymLkArkeb4lP9JAiZay8GHMNlkkVq8nOnCDObDUHExZ/mv4OIxALdhmek6ZkKrvmLdvg9jHZA9kxu3lMs4+46OII/6bsdmVbuKmkwIsczwn1JDB1c2PG34cbAaTJdhCdwmiU0BNue1rq+I515+xbpPNcnwivfVivOE6O+VsrFuQh0Aja41u7/YN0g4TtHLUruH+9g8ShH6T+mdnot9+2ALvsofvvW9TNkkW+6KH6v0hdU3KopTLmK++4O4SfvCwZM+3hpd51chhxfrE5ZVgONyXTEo8si45dqrELldSgBBrZDtgciiLHLpsfxgU//Jb+ql+uxz3S9bf3omwOBqSN6BL3cdEeU3TWUTxeRZg55lMF6PXJAfB9w5u1QjqWvoJjbpuLhOWrJfQgkZDG4sbat+kdtIHWiko6VJ9zC/GpbC16qnRSgXlN2VedOaMXszdx0ApDaZ0DaLSLHzdu4fB9LS0dsmOSpkBIVpAvmUjQsFSLOEmVOMpZw47FmAz1PXAZZtyCf01daR/8UBfHt8uZac0I1X5tmB+7dUf/251/jHlj3XSgOhS7F92WKrvZKFLkROhVun6ezJW/J66EtudL1dmi0mCQLMbsi7U4vALhvUSKjy4LI2wxXGJQXo5fJhVsLxIpZgaIDiNv/kfeMSUZYtu75QAam3VIYX/jetrhZ2y0dKnY+XbvT8+f2766dEVHQ/tagisdQ5+rA4He6VKIKz1JhW9CVpxpEA5Rw2ZaP68QRyUQ5ExtlTYwsw+1XhdIYzYw4RPGZa58crwWs+6UOZ8mMlvwbT//0WUmFnPtJ40w25w3CrZfAJpChTB0APFosJIosRP6XcdBkH+TP6HYp+/Avjp/oEnzj3xoz/uDbUGY9cb1qAQB4Z6plVqgJjqVP7+v+kZuEbGy5dPpyp+8U9HW/maeGLVMMIw3zWamkCXAaz9G21q3VIWsWvl4W1/dmgBY4o3yS6TaCjEAyXN1m10GVBrbYyHy4Cp1Xi831Go5S1gEL7rBNUCwVCJJEJOWBPaTpkpFyucyERhVPmwZpQChusKiqUbCnabM7QaNcvmIP/IJYfgv694oUPKMBMTK+pHJyWzPQTElvDpLvoMrNGXB0oibAVdGbksuuvnReHEJJ6jyJhEUs/EdvF9ZT7EqzRP8hrQ275bDhfscfeVe/DQIOWJBZ83Hh4vwoPAyEg0o+F4DlbcHpe0oBzoh5O0MxAbS4YMGjTc0+93WLDQyXLK8TzOk13BO0eBVz9mdZmiF+6vUHvYPSpaNcoO0svJrP4CzzmZOdrStcDKaG1jMlts6VrDymhtYzJbbOnawMpobWMyW2zp2sLKaG1jMlts6drBymhNsTT6kn2DPne8CFp/T/cwY0Bn1HtfY7ePBksxsbsn/fuzwysCEKAxVw489JbaWForSdnZt/m0+qumGVeSN6HrkGfBCHwdvh27Co886wX9UT9QcYE68SrJfZ/1ZX1He8RSe+f5VOpwQZmdgZV4W+/ssbG5FhRqQyw210ChNsRic20o1IZYbK4DhdoQi811oVAbYrG5HhSe7lLgl6al4BXT9RIp6tXN1MvlaQN5IRBdXmKMoTHHGoNEDBu7yOtnIWxpWBnaLfn9OSOnUl/e15IxOL5EOZUBfof99JrdM7chzGkq7jm2tgm3kdM4WnmFQqU15PDZzCCg5XmGO3CPpRk4Myp1dlwJcWZGJRin3ldRaG0S9PNQ8AQUZnZNest2X8XEhdMh29qky9wEOeM7pQ2lwBMTrWW+/2QMu+MrJI/NXoMk8j5+PWGIV8Bis6CQd6I8C7e/IMyyMjpcRgHwZo/NKAbe9f9PtoX8Oj95pCKAZpQJHychkI7yXJ63UWaz8kOgqabseJCrr0oCNJls5kjm1QXEt5cHT2rOgoN8CU+qfHq/rUh45DE8qpoBn/zatcNXl1QKiYe0+3Lx8FndtJX7jjbKgjpOmfAQOl/oKyMU6Ir/DfZOFZcTb63mEuChes1a1R1krpmIsS/KbzeBa7b7Lq75ejGGbc2uaC/DfbYqbS6qPU+rxWtiANZ31m/n/Io7K2PQjnKIrXg+Rd9A7JzL0zGpU25Rq7JHm3IQIQUvFxRscUBv6g2dWR5O2O5Kt8glRj7W8RAT2Ou8oYgmuxBeVsc9puLibVBNtkdFUWX1hBXvvEtRyQGFRY2uai62/r2E/IAmiSsUSFvR9CgC7ETSsxPwD68V8zjreLBOwAF1oLrKR6DjGGBb6LxlnYGVdAep9/DwYyJoPWapzu0i/UEdEV/ouJqoPlctvPSrVtf7B72BXVFh2iDRdvuJp+6AJUPHNaaV1jGQ2GaNS4oynfUF0a4WHTNXNMJagi5FTkG1y+RvsFiTuWWunSE88kLnK1CG/7RsSVhp/kBpmcHBs3Aps1A1p+xsSfv+ts6TBIkH2vTPcDdWnPJ0CDj+oGVq1s5pn1HCm3feqdOHbhVHNLxSs2vFADxrG7hb7neN5oEbk12fJfPeftvhZVmuQ9SWyMs+RG/xvFxd3uEa3oMY2tOIeH/4QGcUwmEqikToaCaGjeW8KSwCDKIQDlNRJEJHMzFsLOdNYzFgEIVwmIoiETqaiWFjOW8WlgIMohAOU1EkQkczMWws581gCWAQhXCYiiIROpqJYWM5bzaWBgyiEA5TUSRCRzMxbCznzcEygEEUwmEqikToaCaGjeW8uVgWMIhCOExFkQgdzcSwsZw3D8sBBlEIh6koEqGjmRg2ljMy/ouCVt2veZmL+DuMZuzW1IZO3U3As6bwClzWlPvE2SRfaQVXM1BELq+q+PSRpBsCh6t03r1cymFhMIX8/CtekWPGX3OlkYOopadmdwC6DXPvsEu2ARMmdIyM1685X+dj7baI/XRkp0Nn07E6TXJVlRfxVKYk15AhDJg2c7b6HDKtw464TJ+LfiaP2EW6Bge3/4a9Gj0Kg/BS8q8dB/azW601K/f8deRHoJIGT6UMmeXLwpHCJTClYIWOZbx42CyPmCbLS13KIfK+gsaoMLDvcTNjWsyLr8vDV6fGUyRWVrAgUclZc663+L3Gwh0gyGAoEXu/VDM8ilFsdMwNKN1Sj6YJ0qvuQG/EzP3uDCeL4/aQ1rUZ7P385gAj40QjWEkHFAbOsguWpkWHnWmsiIhQ0fLcBGdYCcQlAR06amPxJbNoeSIVi0wVgU0V1ZxMC7tbHUPsibaaJgxhY5qjMEptm21y1l/AVySj5QehEVLCYJNwbSamES6kn0bLcxGcyQJxWUAnq+0wpvZGy5OpKGSqCGyq0ZnkI+Ir0tHyBAoISRVApRKdZBplQ84fOzCeRlvuGoYwGmI5Xm2boRsMN2pqqrtA8yqwJxdIQ+g57dscS894aDzs2A47tv4GsnqHNDLbdno6W/PtrNZ+T8Vxlic5lBqHIdyKNYzN0E5oZ11jgqoKPazHEZakIcXxj8CKY7pZjJ+XW91BJyRdVw1m9vH0zaOHd9q6iKhu1TlpCEertwxj2MkqRqllzyUmH5eQsCgtPwgOcRIICwK26cht0H6KXZVYY5BSlqfKOraL/Id8jVYas/YVhYwVgY01OqN1d7IH6HZpB1Z48nqEoGBSCiXrYeqL4NLyg9AIJWGwIpzDRG5mvmAvjeBRwUgSBEsV1kzWA1c15RFoHP13l8fY+Mep4x9y24vJINPyhCoKoVIRWKqxzcFRAomZ/dEB24ARCoJQeQNrZ3k+2s/B89wCQlIFUKnEZjIe2251B6YQMK6eDA0Do8hoTWO30hbZAuuhGU8xm4YEz58VC57xZvA9AE9w/yN4QH4TGCZ6uhN2MNRbjyrm09ADjDHujPEHVBMs2oxl/YtjkuK0/GYb4pHNZVDU0WSIbB895Bod6TJB3KgQGmEjDFaEaxbTw8Ot7oCDwVV7pzGkGg7lHDXPcojljZWY6veAnhKaWvU0hmHLKx7LTbNNeuqIYz7lLg5XGCaV5am0ik6KiEzFBmMPdROciQJxZQBsZeu1bT/H7kguICRUABVKbIa2E/opXegARDYrB16QlTF7GaY11eVX3mk+PhlgcPR6rNnqLjTf06ZLC7KJhNtKa/R+P9Ppzq3uQldG6olDJcHApDVth4iqWkzjXuDKBGeiQFgZAGOXVZfsTnUH5A1NXZIaEprdpbDQNNsMXvdMW93FIehZSZVasKyXWB98HP628vH6OPxrvvjPV4LXVV+i4f9pj0ZnMeX2JrRLcsUSi51mF/ti76CZrm1IMDA87Leb/rhudVcn4wOdmyrRRevZDOr+Zz8Hr4IVEJIrgMoltrPtqKiqTpE9tCIxmhrCQeawWYaas+mF7VW/D9TOwRfmozO0/A6e8LHsaQhHTt/QxoHiu4eYw/p7kETxtrmW0dhF36JclB34popRDQnNXrZYaJqN3VW2aBZMD/MICTDVEJpOd2FuDq1Bk7HpVexLQdXyfDdghJ8gFKkKC+2zLxF+9iM2knz82iRb9aZpWUL2KaEQUivbZvpdPy+UQNFbQqGX61iFx/gr4Wj629cfihq1F6emD1Ro1z+7aLzMqqIxragK4o/k+qum4zbg7fJ+67qvdWJr2ueHqq7/ZTe+PH72bdBczpoviOkF2mvPMiHdU/vbNj9GW92sALHCFSGWm2akNp3U+B/JACgTXUcSWax+VDwMBByeVmsSztfNj88GQAVs0YmbdiCo2x+9I+P896KMmxWDEGfCiJkiydFs1fyVT67Ut+REQZtX9efkfshPftpR1HhcRx69CKaLhPF7UNlfhbgWZhv3NSFNnpsdcRx/WSyU6e/NfESKRjs+sHiMB8WAtgz1ApsPMYottRmLpUjTie/DhCnCNfKIM0v+kWXXmkq9xQF5fZCHuvOOIRfyE1mi/csGACIncoU9kMcFBOz3tT/OkRqo7QF3A8wi0j9M0tO13aP22yOUZtvIhs2Sr1DKe++b9iiQRgoeb37ChZnc8pSS25lIdChhkfw4TK4HGgSgXvaxYYEinuLxvqSa4UptHZVag1t5Ci2lto5KrcGtOoWWUltHxQ0EH5WrZxATWwU3hD3CC1pCIB7/VdYOAhVSaz5f5+NY+znR0m65+PawYbCn5TMBKZVslfwZbIsXPJEJ2ilfCTT76YOrlWYKmL8YR3oZWAVfuHc8rOJwx3s/q6HxC+IBVgnMI7m0WvY1s/mp0iqtVnBLMiU+MOzONe1qccXSXaeJhYhAhMBDT8OSTtQj65hZ21xoly901Ie3fOvwcqneVl8O7VSPFpOs0GWIN7DG4yLiDHntlYAXkhAPSzansbp1GXTtjW0g5TcqGHM2iBDuUl4UTcg0/rreaIBRS9fn8jytk7xkK1fZiPTf4g7ZxdCD+DvqSxEzJzaBWge7CgrnpgRA9FeXMuFgsh3bi0EEnWqC+oI1Va3zjAXOV0H8i8wG9p7LQq5WbXbeRrVvmu6vh5dUrtLO3RAaollo3rUVlfm+RYtAxF8ldKjfF8wD35LJIfBEpg3sBSTNaUy21AuU+uSQgiAethtEM7LQgVw41xoq/1JbOhnE6pwYBhLFGuL6hgpQDGrnQepB6kFKrIkcBfC8QCL4hC+NuMjtKPmN5a89K0F0/CqZ2ZpM3X2izPNMlvU6pVnAty6a6gyCiDx0hzBIaILi1B2ttASFp8Rh4e0UFoimHSjmG3RJK0omHIpmE9W4zB9XZz7OEq0CZdaVH2aZ1oYy687HVeGrI5my0lZKclMlp1+8HRqc5lV04gvqzH+1C9+ernwm3fgzNJ+WCVaYsy5eK90dl6+PyhRCe1hIm1sTzU056mjcJrmycAAn6wqi0ZykAaSY7S6rzFUQm09GowzLYTNtZtWiRXym6spb6MYLy7WYzqzCFtXxWql7LqtsCR3vj2OZQt4zyZe6Ld9PrOzC9d2VH8Uj0w5uD53xG6vw5Vm8V+qeyyotyCI7tDgtRZ24fhtP83r43A5laD/YEtTSfqzWHqyNmx6jz1/HW0pSy2yCI390Qhede1L0Nsd2AlRfqG9vKq4uP7uSq9b64aVRjDn0qfJ1/RA2GJL7be3EbTBZKGsY0LbiTTWfudCzx1lV3sCxynFMwU80f+pUhKgbNcrvvCPLL+nbwqsBKEMBV1rlnUoULT/qimJSkUOGrMNqbsdSSPyZrq1lDxNkbdeNUrtkaKuBTCkBoFbEgB6tNgGSSytLgI2y2pOa3GRHpMw6Q9SqOU1ENtNliGuySg0WxEcldmVGowXWq4j8Qh72IF9WwuT9Fy/rc/Ua0caOewWQWIk2NlcCiZVoY3MVkFiJNjZXA4mVaGNzLSCxktONj7VUHENsPXdCLyuc25e5mXq5vPDR8zSJGhmQlyBCa1fgQAtolKA9MZIPaKr06ASup1bBWjYDpWwxncn2BKfYP7a8V+q5s9T8cA9iCBbTcGwm2dje6SWwExv7Hj7gFDYzJGzGK9gMAIhpf7UnBNEf84kUHz6qHfPp9Hm2fO2oM4nxIRC9Fp9Zxs6l44k4XBPUt1bCb/q11WY5agj4eSbiOEbFpbMdZL6F7d7BgLPdo/ERHwkc3Dpyx4cDjNl+CtPnYXrubKJ2289if2i8n8N+6NEWx0HzofUtDlRD5+nfFurANb9uFcGNs2UBn3VmsP4MtgMy6KHTgAxbo1mZ2WE2JWhblL0+ltjythR+/xTHfVUdvjKT1agWXqsLSc6WxYSOs6XqFx/IIwgr2E6N1JSJLegZqZgW9Fke73jZjSvz2Gzw1WwvUb2ksM76JBZKmx57sj6Jkbrptz+rE1ibbRRTnQ54lcKtwy/u+KshS2W4tavoGhv9dupQ24hR35x+sBv3qeJfaOBLCGsZ4aXNWkZp3ZyWnbo/TdVvf/oe9FTssoVbpP/BILWZ7Xwpe3hAzuIdgDOzBViE+xFz1sAH/SKAON5yR0ZLxbJjGKqHjJm7xMnT9DgGHbHY6+ewHlBzpLfOP3HThp2g/1udt/V6jkf0mQ1x8laS2+2H3I6eZae+MXjQFtz2SXCRQ59tXcKs/KUQTdNrZU8RGGCL9mewHXAg9H/otI0DYdgazZYeZckTCS9NC6OIpd8xjzoVjgxYzIZgv6fK8ixixeM71Lr8/EPRHn2/U6JTGxjMBm4rdoTcsROio2LZbyeM/NAM+lBI+BnV6tfivC1ot85M2Z/Gst/eMKShyxb2hwFvM9u5Sv5t3eRmhhLamA2BVp3HQcKDsz0nsOmxJ4wTMkqRl810X42O0GVYhfljXvcA/xk1O3scgCezRcdwKDCVZMrpIRES66BTJrAOBrzTgn5U1RkAR22Ge9kM87I5X4lEyM5qVizw1gLQsgERlb2EsJbYLm3WEpd1s/Jtniwtm9bMZzKMTTnjKngLT/8ry6wdXUfp5+d7E4ZDFvGpbIkrJbs7N96x+2eEhDJlxWnOkwOYqHtxrnjhbmxQ22/XlZhkGw+pTo34BnxkK/dPgQj2eJhwRTZ/eACJNmpnNhZwqnwkAREv/uhCDRBkOz7zgGyT3SV5lYhegSFpvznZerWBnigJ5JOZiHmO5I9ZgQNKWbwUCHnwMD/qnCDTFU3sNydGORlatY9Rm34pn3h+mTkp+6RNUT1oom7kWeBAMZnxslquSP9enBFaVmnN3Ac3HzHmqhpGyqoPLXPsXqezO/y+bkLyxWJWoLP4bp3TL3bz/4R4RBx8Ng1RHiA66j7U7LC/laZGDNbPdD/8SakYZlb0P+h5jOh/0rJs6H/Wnrjo71828D9cWVyDv4F7TV+9/x7o3x3tr3++k/PnLC6GtbHt40+SoOaHjTWaOBsGo5XwhKSTMwHsSUhFJ6hPmU7Z+mugHqKT9/f8HyyzH8QKBoKVG27kroQ7JJ2cAWBPQCo6QH3KcDxUUCQgaMoTFenDAo250SYmkurgAZtKOSugfRVS2RUKo6y233DxjbFB5b/3IP8tAjBEsDCr3CrhCWNqORuB9zQiFd2I60HZ9K5s+K7kOUfEXZmkQ785UJpc9x23btXCK6CVMwHuTEiFJ5TGmU7qmr8jVwpIchCSWN3eE63/aBFulfAFaOUNgDsDUuEBpVGGXXnTnJ4ZI34g1D1iPEyypTy2ids7KuEa0MobAHcGpMIDSqMMvZeX2ShjCEQjc7dhjzoeKnibzzfay5ZfvDZP5XkugHZ7GbtObbWEy4Sz2hSgFIWYyk94a2gyn9/wJiKeyB4vDyBpFm8CIO0qcC7jSvyW9Myv5WG/vOzhvIjSKJ9nPu/rT2zxHGbC0Jt4EWTqNrHqGbE/ZNcpszmFAvZ4htJSye6RL5LSR87qzSkVABmqct6yfPnFHrDqYlfO8UZ9+A9a26KGZMxw5HRC+fS++Jf/rH0dOUkjqK0qsTGQIL1pS8jLvbtEI3DHdMp7diP2GbGyg+si4U5fkflPgZvcrL/X+cYQpovMPvLxg8Y61UeexBuxQ+RW1jJegJ2KLyLX/ZLrRC5vWImfFXs6EiefhCIWhgQkCCvxK5V7DqjdJVRiyZAQCZKZCh7mDLKcdUVVGXpFDKL6WyYSz7Nm1DG+VgXZVcSZJKPglDWDMsxDAHY+d7RdifXxPT4TUGQ6nBX/RrwnUbvEGDeUjE7JUeTqn26oJebads7qMdq7wC1jZWf8+XUURMXggAThrNRyfeZWs6nUayuJIlFlcIgEyXFjLXopcUnK9bT12XNS/+d1F3Pq34i3GrXfjlEzOhWrwqm6qiXm0rWR4a5nUHzdEgVRMTggQVgbWYXCsGQ3kSgSVQaHSJAcMwmlrJfmefJkOa42fxl1TziFI06GCcbvxpgNU3HUWHWP6J7v2lrWQuAbZmkbAEskRMYwgATVWsiVwHQ5wNYSSSLLMBAJ6pNZHMjE3jqNSy/wT99NovZ5+HDEqg+hYXQ5NxU7hVR3B5s6uzpquL7u/5Aae77uNnEQF8MDEoZ1j9SS0lR3lzgSV4aHSJDMLJJBrt1NwEksiNMYDHF4etkH7LiEeIljZp8p1iqD9TVKOwU3uRI5q/lefcbtJuj0H5NbaoqPTKC4ajzIfCCco3HtJ1PyHcrlEUfVLcHcL2If8RO/4zSWeRxmj3b7Jr5hLktrj7M5TRbqabKtlDzwyBVImWYaHm+CpsahszDkNH6HnORyyGHno8xrsQg1rUFCvZVspexKFsgZ5u5RAVGBBHYXHHb0O5/aQCuPQ+R1hqSI0Q0AcjoAwAWbHkVRGn1bz274WuoWtI0thgIT5KzkOEReo28qYgsA+QLAJQcURRnuy8jjZ2XvpATJm89TmYlyODRW2lE1sdlHWpguE3JLLyjYNelFeTkrwI7boPmKJQrXVI40XMwzL5CAztkA5LrPAYgu4/OCVXkclZ56By1BiILBAAnCyjxz65FLJJwESRQZDCJBsjJfk2Wnw5RagjSKDgaVIJ35OhsBIoYlnYElZ6DSr71C3/cqTTyhN66LzRkEzuUQEl/yVL4ojXPHCdvpXH6z9EYETtDcxA1ctwfFrkdEot6DRtfT9osK8b+pP+JpsfS23EJEBxsa+Z5z1Ls0cE3PtzBfnXLd6zeEf8SVsfJqba3iCrsHIAIGAiQIK2MeUQ3mPaMSIBFkIIgEyelP3mQgB9Twv89skcLOpgPrbw6ReMwNTYyOAJTTGYAuekINZVHWMwsRRU7OC+Jm7hO9nQvPvm+zWurPKXZ5TBdrllBvlq2UnWWBnHmulDalUiDxH2uhqqHJKGNdDpHXHzYVMXoCQC4fALhk66MoSrufdQ+gSM0zVliZB+ems8PYWBFHEPOlWQRHX4oLH2Zy6JxCpqkDw3RORN7+YFwXWxY4V5b4krMojTL3MkGgRYzuEsn+mWuczheaS5HY/EkPm+mB8Zgd2IJNDp0pzT0XQMsOdeW63IiJyQIqIJ2IvGYf18VmeoFzmV/iS3YBURqlG8xdO1J3cnnBveb5dsthjbY/lyKv8Vs1bHZPEJfJAS3Y2qkgzgH7Me64lPjZLoLvSNc4C0uSDpHY3NDEmIHyZaCLziiLMz9IMvRN1PvXAcqTx4qOwNizc8jEVh9pYbN4QnisnZAlW7oth3PO9bRpr8KUx2D/93H+NxCr6152sYO/Eht87LizNqsLmMf0Al60/VEY6d78+6ZyO+q2Q5GkWLrGKQRauuaN2OiNEDZztwCPoROwZBM3bCiNe/qsIiqcooP77wPhbmG50EkiC50Sic2vqGR0hgMPXKnFlZtUtSkdozevC2UJOYdIWgqdiWs8J45STewA0MRod6Cc1ge6aB9AWfQ3V66H/Z8dJfpUKCy77XLmnGFZJ95yZaIgIR2JEuno2sjbH4y0sPUDCeHx/4Qs2ffbcki3lXl+nieAQUjcEUG0zkJHrdOpp3XnMQc7hH56NUYH0dtwOozeZsEOBGpvHWXT67u37jz1SJFk2rrGqeTbuhR53aJVw+YHCeIyPKDlWnpTYcrUJ6W82HZdkzwnH2mSlPdWh0hsbmhizEA5M9BFZ5RFmWfOTNZYOCFKJ/LVtS86CbAOkdgBoIkxAOUMQBcdUBZp+CFA26u2wTZ4V+RcHyGC71yHGzdv3d2IUyOEKb02AAsvJhqz1YrSjmfS3XtGdzdKxNkd0a+KCX1MqUW5UspVT+ggrtQrycfYlH2FSGafXWOBVucC2qVI3P8mPWw2B8aTgS14OA2dKeteCj+HEnwTiyTv1zVOp/vXpUhs7qSHLQDjCcAWHKAzZ5g314bhESz5Oczb0ASECF2HyGvwTUWMFUCuCuCSKxRFWfXe/vY956g1io17Ydc4nblhlyKx+ZMetgSMJwFbcILOlGmlTW/lpgDJ9l3ghUs8GRYiQTJffoKyT6Bz/Pepoj3Cf+xbu4N/fgXD3e2OGsY8MEiK2KoJcR5tMblAM85+/rQAsXsesaA0sp9fbUdr3su4NpQF1n+MCOS69/q5TuSq1wYqZBUxIaO4RShiYUhAgnASTZeh4SfPMOgGKnhoKr8kCzR+3t3dP79ijCDPppR5vCDVqcrYQerHOY44a9mT6TgAc7S9Tsy8o7X3XjhHF7IN/0hD5uqPOvSO5jyDiDUMY+9tNbM+EwdxMTwggdiGlDWCLeazzxmnY2Vl7vGzdcofvOP1I51SjW8K+Tam4qDkqgeci0aQzB3YQwfmuvWObO8kH8mNd+Dmvd2x+3viaZCkh23B4f7pYpJAMcp8Vnny5t3Z8yJNK0mrd7RmvZSrbwfU25sj173/RvfxT070EhbB7LkjLZJvhHfgMhliKuGJyNuXj+ticweBczUSX/It0qI0ztVB+tb6qVPwaZGfWnyNTIF36JfvXRti+4+0qMesZVKL0qBnvJ1GnFaivWR8Ym55L9LWngF7Ajpr5LrX6DLeeiWdOIaTN3PIAYIQBYMBEoTeMYnkgBI4Ish+eHjyMwXxiAfsQhmrO3yV+ONf4djMI+gCfx6ZS7Upq8tlfiFmLJ55PtAdqQyP1hP25Bo1SLx3DCFz7UcU8hp1Mb5Y9/BeRSYbwx0mBmJiaECCMFPZjmcLuguFg6B0uJJZgZcS8chk8ntz+fB70W9Z1ltmjoTokjjTTaF6Kk1QUNXwEHmNnBSxGhogj7EBLtrgKIrS6L0R7aLTL5JFshl2HBw1POLhvDgFeJvRE3AqTsh1H6SLLuOy/8qZh91Q1lleEoQoGAyQ/Yb+wbzddnRvSi48R9ZJfYZRec3UxA2fw7t3DNL3U0VWTA3/I94fG/iH/R1R7urE9Jd8XA26Oo/m8nWeKXT3fy5JXUOBc9Fn7Y12+5LvcoA3ta2k586usvN31kr3J+dfwY6Izc6fKyiZMSfRCnJW3uFK2srL07vylrYHex60zLI89VGeB4/C6peAVs3R4EWxujpZuOdXg885E3Ai0xY1tR1mkx3tS6Ly5RmqDeVUAGV1wkric/zCD8lOF3kPccbHzhvqhNZ2/0zPEAYZ0l9IQaoQWntlumjdxCQ8hl82GggaI+MDKQ6IjBogqHKh7exC/oqFyG7p+0/zvhtvF7MXeeNKrXlIyy/TxvAEPxwEwVJCYdZmX81bfEJYWv8mo/qrEd4KglDKZ8o6Vib0jVkdqBkMz7jRE1Sw6uQ8RPM2+5qipxglnIV5J/fmDwCPLIRn5ugJ4mP5afXg1yRVCMjKZpvSp83Dzu+pFCDWHr8Hv7KpYONGBs10fAOVSEHjRGTD03GngX64kYtKjzs/93+J7XY/xERbqgkdafJPoa4/zDqHkpLCPKjUiW8dDr72f5sI1R/Wqz/pLAO3l0uF42wqL0uj9B2RSbtsQV4YGqi+ZCC2ETSNYS4nkLNURmOfxeaOmM4KcMAHP+qxaMCr4LWpGhBh8TLD7EnzBpq5vPN8CJrt4a2/sMyqIFP+PAfeatBjM/3BsubYPkQQYy4YjnOqA9/1+ZDw+O8Jh6e85rCU85aiM1HAp+UhcPmUFyRqfcEUjzLJTD4wa+FW/YukwkwpA95JfANhKsicsNKJFNGFTOWGrqApLew7uTdmRitgLSho9JAt8m2txtrkYvVjXZMZzL/RfX11v7MXC331/S616M4DP/FMV9eiLigCFJ4/oGcD+0hmAtHS5p40b7C4CpjlCn1FVykFJGIqPYZ1B4kXe+2P7usLrMCooaXtcmit0Eq/o3mDa0VWHDbCOwziZN1fFR6CyPqJ57tOqDcvBjJKmp+Igs4EIo/NmxIlUwle5w0jFY4uF6Lp9g1WohN4SVjoW2GNbQhAP5USw+vtk+T6pwKx39DDXFcn+yEqWmmBU0lorew7ujewYylYqTDzp6vm5E3+R0qmmWLVXEaBno1ynCxborZVmu+6ICrHpyW3LPLR6P2kV4mAWg0EK1UH7BdCr76ShalArOPzEO5lSoQJm1khaw/yJNUy9sWF7BNku6P3VxsPBw/zk16HG2s1Dtc/8bqMS25Pmjd4XDH8y3uacjtz4QVe/GjBkR39fNoNDIRbTAWW45OUK0a0P1NZUJWI1orfUd6grWzS++U9/bk78IYK0GzrKkV4V6kkGJ4h58KzgcTm7dPuIbylVCCM9sDNrUl8g8tt7oQNeueCLpxl7Y1QF3P+7571HtHb4hv+4NYKpINiHR2woBTGWKuz9cD109Xysv16IRlDuiQtMyz1jia5WRWyQ+6JD5u38g3ffE4zV/Q20ZKTCkAnI6v7318BKZCNOtfXO/nqtO9lveYm4f8r2nn15Yd245QG2V71m+3uSjfsbshDovC/PlyLTXqfZ4pLhxQOTCSsVdrODsvQd4h9kzb+6UXig98hKTuza3O/1bxhFVVu1rFbLuY3/dX1pYQzHuXdXyoIGl8ScT/CN3oJiPON+WfJlkMKRXMb6klutjiizDDpkpRdsblsYCekrv8bAFRuEr/nS9T+3ZT2SZrYsvp0eUOWd8Lck/fBVegXGEUCe1XpzS8SJ58qWFc2f+njtUHMOQ43wAixR4OGb7ItleRMYAMWlKJiLmagoOhLsalEsny6e8g9waeEwPqBAXhFUbErNgIhuhWnn+iB4GdNwYc/BKzcRlqQ/mXrXJMMrA56TanGGkLQ3hVjE231Z8x9ioF6NUT6XQSySTHmaMxvg12ra8MxOanhgvgtkirC4nn6n1J2KLZX/YY4G5Th3YLTUn798Fu4ADqF5wdZUw0uMPEOupXzt4aaZqiOYa+wvUY17BJJvXS/0A25hlcbw/ATNtfKW1ScoMvqrvGwyk/uz2q041VeY3MNFGpDLDbXhkJtiMXmOlCoDbHYXBcKtSEWm+tBoTbEYse9BRRqQyw2V0KhNsRicxUUakMsNldDoTbEYnMtKNSGWGyugUJtiMXm2lCozWkdW/pS4R+y2wXD6wKd/GdKcrlQNjXEcfp8ESUgzhXcGmKYFHQRNWKBjPvYPdCbZ275abBJ/He3VxvBshuA+XqvwHyqEdAD6fVeEw4PtcP00zXYRPa0os2Qbr0Wa0lU0Kemb0Tx6rXYBmJEsi06UcgP4/8f+p05wVtdFB6tfwmCJ2KEBSLitwsRsbwu+uk2RsCj90zj/EnGNiEGq17hbTfCW1+yea4joFFjU4QEHGTvCJIkw45C6WhdZrTJHuFD9lxEyN5xMEZoNb5DKK+wNr5gBJ4DJxIFwvGZWF+OEYwrSRTQDoZwv6Q8Rd5HCVcEr3u2M+hAs9Ws8JT29N7CaKnQ6wr2/vDjFPO7NNpPdkWgZ1FIWDE+3OfU13KZ41jtwwKYiIVlfnafDH+sU6BgXZlyhm4aQoVvPjlEGFy59Qd8gxziN5nuV4kRJXv8HPGQyLrAsp2hY8XEIqvHhfq6ihHn6O8i96I12QBp634La8jCzMXPdF0mXS31jCy6obuu3vgrVmH7p2VzeYLhpHPAf+OQvrH8vzifEWBmD0ToHj//0+f8fwL/73HBgPVsWAHV7IHm6c8o2jpjlffOYLUcAWv2PoJCu/rMAXNrzVgqbVYBcGjdY87z1/px0qwAuhALtwtHqx/i5zireFYATLfXGHHMfi6cf4FeFOnB1vabDCjZAxj7x+lzb1nFp/8VJaEDyCMiFm0Trmz1B8Eo+btjFgyHq199UqzUSVsPhfU6LgzH3qIbuiudsWV/wJfnn/15+5nZnQ8Z6Va304VQd427fZpiH/3ZrPoX+vs+OyxwyLkJKro3ebQNERMNe/yUHUPWxS51uasdGyn7GWGERzsAE0o6gaBK1bYTCJwsHi3SBEpK0rtKghKBdSeEqRoLkBNqCO0vlgiRrqfLFaCqqC5NsiiBSUF7FEk7ZVhAe6xIK7BATiAAQ1laKzhAQVAgeh8KfavR4/7G1fH3NTz7mmW/9OumybumpnJhHxiST6sCH3dmFEfn6gyMBmjydskD3/Fy72D7cG6NQ+n9ne19IpA3Sl714y6FeFvpqMvLvNku9KyUl3izTeiu+HGxGQ6dFf+GKj1WpdLssKl7VNxZvLUr68hchIxIIlNhqEaiXxJMyi4Z+oCnEDoyf/4vj7kt9e2RRe1zw6YjG08ETv2kwvN6fSzY6g03N9lUJJznNiWQS91oFF5XUNBN4PuPNQH/1sCCQwfLK5JyL1FG/V86AYCIoS7LHxbevwCVj/lO+WRY1S3E8I0Lleu63SEBF9H0NQ42xWDhrHiZLiIJ9PMz5RRvGUfxnB58gWkZ5e9rotDj/JZXeD0fUODYt+3Wuc7A3ShodKm2UE0SY7kogMrRKnpOBQ7p7Z0PB8e1se1XiQCRC4sIwrOhkhNB0Fg4J1FxRdc8WbbqI59EAaIcHUVPRYFj8Zxnbfd7BbWC6mwhLw7h5XAvfsoLHfXn9CqlSFSsYGvD8y/1FV8NRZH4qI9jzgkccudk3gc0IUPHVljnVRQgydFJ9JwKHNL7e3LE0rUuAftldidyYRErXXjW8ErOBEFDYVI8ExsvaccNvZMfU1UE6JC0EvnKLCCXLT6SJ4FXBHQTkRVCH++PzSomoiQcJlscageTSwKH0o9eeTEBZEvp0fPmlwpdwOYKZw0t1EQSMpRmCw3vZNDxA2neZAeMdYhbWLnPku8kcERna8fxtE+Gg6g2EshiwFnsXBY4lPvdo/1MiMwVqtRcUEzCiCaxXr0tV+5nLaCalFFJv8Q8x2YujHw3/XCd+pqbfpmu5dnyv+YRFEvbnZ19qqNwoEourMMcoPSCPPQzI1xCv1IMCZ1KMhnlgRm6W+iYD4tROJEkJU0yTZ7NJbAalVNJMws1R9+P07mobx8kFJzBQ8HvHQp4lxB9vG3O2S9SBRWbUCJJ9LcvBFe2+BZUbUqppNEEmZ0mOztdwlYzAxkfMsc5u7vK49tZj2/JojzE5rlghfkGMQlzk27JmshgLlVZWwxqUuZdes8yrN313tZ0Fa26BgsFb5xw2detAHfS5IiOXQtsPhJcTMK8S+/JKYIdbRVvl+BqUuZD+viyFT2MRQVud2EJQD9oMAkEQ0FNH9AT3qJDflZfuG9RDaC4I9NVLCM6iIOKnywUeuRl8tKVuxcc32q1DjgxYCd2zgkccpM693STDaxs0n3cfxsN4AnzW7ztPKl7iZ9HFT+TsFL8IJSQV30f81Hb1wNBeDRUbiIIGguTVE66uubiY3AfBbXtPuFFYH0lp7ywMX/ONC21JgDd3C+rl3/P5th1j2auLDZ6ZR6q1D4NQGEJj7rKzThBQ45SdGnBMMupdpqJiUUIkSS6b+jOKcntIJhalFBJo8tsTnJ2srFgZjHCJPuq1rQ7bEK8/foRfd+PBR13BrA6JI1SMXbh21cB7rtH+9L/aQGEXojobQLuE7vu1qJlsbAY8rwlaeukNEAZtqSRrt2u0nlWZ/Kqt7GnQuwsAouYhCmpktc7x8diIkAsalKmtWZ/E7UOLIimruX6+Po2neqIbFnbKYBe5t+jm39TJuKe6xM80kd/ma6DgDOkrbhe6O3R0dtF8mBR3Uq20H7BUIhcWIDtFc5aXaiJJGQozTFDe52wdVY7itHg9YcCr8eA16cEr6ecwHCfXsvLmr2g/WO6oQNWG9J2tufH9vEucEgn2e7Ktq0yMv9hn95qk+n4t5DC5msu8uimr5wS0NmD+22jUJeKZnMyN/FlUY17s/TxzbZvPOAta0s74m5uB3WbItqHSRVCCmAv+OG9jgAAmC48anTlZoKgoTCJbZcRumfa6u7j76YO+0gQBw9DfualhYfiBXePbfILgBbzpXcgcmEBrsJZV6hxJ2TMTUoNgI5Y1ip9XGw4BAGghsOqBhDKBYFjz+opGFZ7cQFL+thQxwMgvAisr+SMFza6uifCISgFgpE+3r6/h02BvavCmnp0v7iVFRZ75k49On1KGnRWaReo4RKAF2LAWexcFjiUZ5fTEWOg4u0Tx85wKdgFHhROqjLmDXb8QPq4fdfhjACDhUe1cjMqaEgn9Xw9LbTDl/Rx3c4ASoDtDnU7u+jH9vMlcEgnv+3T/qgjaYfVxb2MAAXkCmdzoSaykKE8SWD6ETlJlPQRfxolClAxYBU7pQLHdJKCKg5WjoHhvcijxsEivCi0Fz3phQ5u3BegIV00y1r0OSgP3A7+CMLr2cXzx5uI5bbL74yWQl3QQdHPIQqtfqBDrkC6eNMoYoiKg6v4KRU8rpMbVw1rk1dU9XfxZ8ZFA5IhwcksIPXS4oOH/Jsx5rm6UvaC5VlDwBFZFDqLnsxCx/IkzVLYo0dI0scXDId+A6w3HNYP+Rlv4SE/u6WrS8CJTu/eOuOlcBd8UHzO1yhrNI9E8j/HxrFjwSLNlnAaoKjyKqkjgBJeBNZXcsoLG/NzDbKgFttspnYny5FOJL9tTPo/Zbmbb1fZhqLPxi0RbtNr7edxdzhqmFmmCEXii1ELSBel8KHiBE2C8UqPUoEO01nxCSaSRLcqpisJCHIfipnFCNMsIzQE8XgmWz5Xoe2n0U80uu1XHNlNzxHMLU645F/mgUAihVh2GkU8cNlgXGhADQXVAT2jFp3fl148dyUzosLNiNPIXvTtwLFbfqh9V1vrIyFJDDiJnUkCB9Ns+6rFOCzFZW6HsiTpRg5K7s/VSDkUl5T5TA66m4X5RuY1F+QzNU0PH1abaMByIotCZ9GTWehYnvUhDIXdx3ub3KUsSzqSg5IplgMUuot3jJO9YL0PhnkHgqGgYUBPBIsOhcnpB8Vbg8oPIV08DYZ3B9RQUB3QE2rRsc18rpqa++k7SbIZSh4IIrBhQ04FYUNhlt0awXkLUJnanSxHOpFxxFXXJf2cnrBFJAmW0bhi1IEgxbHVNadIH0MCQiZF2gFMfeVXH4TFR/ieAw5VydnrSDGaQFG6Eze6mGHvogcbuRywOGn+YKUDXlv+5Ww/cQIxY/wr+tb8e7+0qAnc7oHX/uE03/mOOvfOyRud6mIOfiDc/MCDJnPeUb984J0Db+8786W/yAKELabwB8bVlvyNWH+N72+QipAKGACCcR4gxFp3myJIL661ZmqA+kQIMC5ANTfAU0t5AnE3ljoY4FbUrWEq8vEJfVo93GGzDNgSK9zv942w1nNjHf0AgMnEIjF8b6seGBTZ7dgetlpKYBAUbtF22iQsl6qMFhbw9uaOH9zTFxIwuL1B8lo7r+4YMbMEpvePqHEMre4rMaP8mG5SrOh8bTOzmYkSBSqkLGcjTuANdwtA/TQwbPWfqKGQFbfmui2V9JfRHQN6TUtoiyepLmUdWHdumg78aZ0BIrH5x0CJw3sLFPSq0IKfEMTZikI6hs4P4MB6FR4IE/NNeMEu0jOCGlDc11O6Bns2TTapH8GMmukWcJ8g6kwWXUtzLsK5Bh+5ek/cNJEHweJxljUBJpimQSV5JeA0ztgfYbNKlJz9B+rLCOtr7sPRvVxQOpDazwiRSK4Pq8Z1/7b+qhsdalas6D8IjLjC/cUCYFX8ocvaiSNlub2HeFjBF+8jlSvd3BlCfga5lZm9fT1cZMWIm6fmA4klksxArcv+63JTctaCCAYzcckThz1X814FMLRg1gxZbNh+QQ1u7N0XH2DaYt+wDA9ZsUvTJRYtzzSdp/WNtM+P38HVDSpgMJOTweDTt8rMF2TrbgSxl71+WzdQpwRBlsj7LDF/RGACeo0BdiWWbT4klLyRUlApebGo700ygw6syRWndLDksptQurT+3g8hV1DWvqsOg5MVPBZVhzIK1mIhJr+xfKigrjwhqXbGjH4biABovKBsCQzeCK5yfEqL/GHpCsgjgYETzx/o2SrHonjD7vzzh7YsyB9xQCACaVdjrUYK0BbKq8ZCUbKj5AJRSnY5NHiEYAIckJIqmYCXQimJ9T4RIMABCWjAAh6IQBIWXOb9A/DEUPLkCHjgQQtiegYXNXGL8tlM0HPBzT4N/j/qmhDhL0/qw4UjKbILrmHf/qcp5CE9FXj8nsBHRmjArQQfyEAFOnBuNxZbPjiT/nvVsvRIaGNrn115eyIsrazt2NjaZ5deq7C0srZjY2ufXXqNYWllbcfG1j679FqHpZW1HRtb++zSaxOWVtZ2bGzts0uvKSwRXlvmSvLf9oKShKlAcvUv6TCvuYWjatZ/JwHCkvu30OtJZG/dVuFRqjMEvCwNrULcsdPIdWALa07DN8PMqK+BhxqvCH4Ir4FDuDVMX5WJ6Ck0w/qRojXfSWsmLNTOnCY0e4wr9x/+KY8X/vQ++MIPCSSRQho5yCCLfBYPucjDBjaxhW3swQ52sR/2Yh8ucGm7cIVrRSD8V507uMEt7sNd3COCSKKIVgbCf+QWeCCUmtz32ZvWyX+6uXv4dBZURFJz0ss2rX3bqi5IX1Iez27VUnZh2L04j12RFaOYxCxuw12hGDTbxRHIi+yoRIhQAWGbDhHUXg2+rRuAhHy14HB3YEwgXy2VT4lSBWXFl3XEw0v9yZCYO+63rV/8G5CtRloSgvqqPD5B5hd08omOnnyQD5iIvHbux37cyGd2T//qfhENGh78sT28lsNJ8SlDuoWjwVAodypSt3K1WCr1biVig1EQgripTNvG0+FotHu1kZusipLk7df9bxKdj5zH+qccfI05HL3ZswJz9vJsefstP7vy/meiUwOhvUiKY7ZF87/UxaS9pBSXqSjgj6ClsguqSEhF7updTr85xD/tFXaZrQQEtQqiUuctcqdN/YwnP//SsHgET9oMsVA0Gk2nI5FIIJDuUCtVq9V2u1KpFAptBgxCUZSmEQQBAHrDbDSdTtfryWQyGKwdNElVVdtWFEWw/UTF+tV57uSoQUcrcW8YObTE7xqedU133Y8z8WchP81f/1++lfqDvd4us3XbWJ6NRdk4zybl3qJKxsbkrSAX2ZiyyfnkQVEihEOhYDBUuUqFcqlULJaQURBgCAJBaPKUCePRaDgcKasoyJIkWnyxHFPnVz9fXFPfxZho+KO1lYXd4PQJP//Xi9n+NvZex1UuPVZc3DHtCwOhYMNCqUgIQODCwWhoKFhsvmJFrZDDjXOrxWqbzYVr5uluvWuXhZ8SzD6WnRL3x3nEif6COd/8bAoThFeMSDCYo1pm/Z5BYTD/mNsNBz4Mxr+W+ExHh/rqs/tAUV9fNfOP2Kx69K/TwcdgHt+6L2i2zhsmDbkpi0w5X4QUbnWVw98uU2FLX0yRS5PJ5CJTJlPKJw+wgs0IoXDiUCgYDFWuUqFUblwqFYslZBQECCaGIBCEJk+ZMBovHo2Gw5GyioIkG0uSKEpPfsoTHj1+8aNHDx8+OvmUE46OLz46OrxyBv2Xmvtk1I7h+Mc2d57ypUTb7EpO8V/uZtkYeZHjv2HOb98/r2T7y4XtTdnHg/xX0YBwGL/abr2k4MBhboIAeD+ocJjF7bHXgPALCyMOYwmNWuK7t/7vU3wG2PvDGj47Xytn55uzDvbW7LNP3pp8dtNtkqJECAbD4WD1SlUqFIvlchEdCQUBBGEYnD5pyoThcDweqiupKIiibPGlbyZMzB2skXCKxh9CNsQ5/lCynXtvhhnfrB125EPs0cA74pv0qrjVivCKR+tEvgRj4XA4EAiFQpFAl2KtXC4XCqVSqVJgATEYhgEAgiAE2DKcjcfjwWA0Gk0GLqImy7IgSJJkO9rytUkCNuZiruuVpQMDpr+ioJmSjTGy8TnK3H1mq4gjHXWRifp7Hk5UyM7B/zoRAH4uCFb70PPSIP+/CRT+LcfqrvL/iw/oAUcQ+lEA2lEbyc+KAL6d/5MFL5KubZEYhlwL//xzvK5lA/VYXqqIdGDii2fdaA3xG8Eh8A/fF/Iac2FQnNIHahlvlxfMOVpL3BdFOPUiXyvYEIFt9yIQhM/dRkW7J5eBBHsuZHkIETXUO88vJ6TIvvQI8wyPiq+AkFxKt8tZsVI7j57d8w8jVkoyzDBQi8+12WeJegCh51ECgK65PZCP4sZcjZsoa6Y+DoT3DtOoSFPYKOJ32M/JUdqKTh/adMPtxlhD7IbtN5bfjVldQ5/O9PqhB6S3nyZd50hwpzpCe2OGq0TQHaHtukO9gL4x1ilHWIvuTF/Mb8zce23TUmiqLlOeNzXrMwnUceDbS/s/HPnWpzioEE5oP/ZNG9u0rbMZW88N/zHEd0wbNs2Z2Cn9HeOObahuSfAYV2v6jUZUeEwXOCrM3od1o1nxmP/QkQAdbjymC322RyK+MYEmj+kmW++OvdO6cnV3pnqTAnEe08OC4bdVfSY3B35sgPuZOD8LB9uGw9oZRFQC8w9mtGNVHh+mH43wToZFT44l0nhh7p81q4dgXpj5oBVxCv4G7Dd6L4tHQyWtadtVx66VH+vvn3+rYZOX1LRc0d8HQIWsYFlt4ODp5beUjpX+9v36q3PSYEU1+BPYmyHDMunAwQ+/h2+s9PRquOhmYFtRDf4ENr7IsIyNcPDD3wL7ls5qAtDI6SuqwZ/AriIZltUXDn74PfNjpd88HGxpKV1RDf4EtmzJsEzCcPTD71Mgq3xW73qEfvaKavAn8BNB2yx7MRz88NvgyEo/VxkLyNVwRTX4E/hJDjGWTSAOfvh9R2SlzwkZaFKNtKIa/An4f+e5aXZ0KVxCbd/zT1bOatm2JtLAq/gfwM5bb+AoQi9GWfpfhse16UEfWeHe9MoL3m3/+w7pJ7//W0d91NpYEqSWVUmhDv3q1j0y4up+KogVXfh3lVK6b22RpEk2qh7Uqdb2vR1leRkzS+/ZVtrnnBU3SiQWm2GZTTkB4yrLY9bT1FJn7W9tZRbEMn+Bd0FO/CyIM0If5tj6na/4UWS923dMa77hGUIi/0+9BEpwyn9np41bxW/6XWIT+BX/I04AFQkVIVh3/mTKwe/t44/naf8PwGLjX79+X/7616d3df37eJdf8p4gCfdabQrQAJ1PC/2yge+c3+1+Mgbl0sU43XJsT7r2oJulKfL8uZ7jH5eB7bryHXnNX/6w9uXfYQYwgAEMMCg1uJd5B2V+eyflnZR3Uk4u3PHfMGYqj81nhggyHk72T2si4+X/Q6gl9Af/8k5wn8vLtpsDIyzt7eSefF7KiZcAqdggJfsUalovIk/wS+/1pJVJo8rVcWycQo7z4zZAanFIB32qsVP30Kf2pc/Z9KxdhCOqxZA2LjsP3gGkWoqU61O9L9oIntVwrRgxQp4yjWVU9XG0LZUAMVWeg1bEcKRcn1qd8kb8TwTr3NKoTjsrlyYk66LKQvV8/Tj1hhc7En7LVw7/ncvF32+70ttjdSepJtl19V53+6ZoIiWnpJ8+RZiHdvgz9l+n98tp13r7HqpSy2Nla5mz4BWASoBJL33KcKTmUD+nnf2xK71FiMo2Qh8n2nv1PQJIJTb5Mn3u60R1fO95tXb4s/b51geYDWfhRYhOJ2iAz3bhwCsA1cqTcn2qtIUa0afz33aVL0/aWDeqOuyZ89XPSsjxGiA1EKWDPtWYXX7o8/rS3TftyxjhqD+65tmwp/LgHUCqVEonfcpwNelQ3w7P/t6u1KLKsYa71pgYLf7jN+6Jj5lfoFqoKDRnDPHeFl9c8ZkLtiSudabocOYWZsRTAFV6lR76VONZ4yF+Kdrs0/1aLUISL7xt4OLl6+8VgCrvSjd9CjI3A/Fn8d/68fklv1r7GaYnVnR2WZop8RAgRZKlXJ8y7XpI/Ol96fLypF2Wo6plRPBamQmLHr8BUgBbSvb5/PuslOn2NeJ+tYsrfvjh0u1HmLfozkbp1MSfx6AVkXMp2efz73dVpmfciPwJZo2VRijT309oayxT/izUztePExdSyV6ef9/BGp0HR/zHGpbWUA657PM22fT4s1A7Xz9ON5BawegyzwYx/6vz7D2/WouqVpx1860DQQ48BEhdiemiT0UGfx/el71f+v3b8rRohGUODlIjURoWPANQwY/poE91jqgh3rd/nP3c9tduhGPVLmqBY1KMeAmQIi3TRZ+0Bsoc/vS1X+rm99tPe4XAmk+5uRKw9Cy7PaqZUImcKdenPJ+LEf2z3Yuv/pkLtlnVu7eEYk/E5sRbYAO1vq+vdTT7mzwlJfumlvhf+vHxb39Puos8Qp3Y022RATep3wZAK4pXU7TP51ufJTV78pbon6w+1Q1SCumD1gsAVXBSLfRPCzhBzSmfjTL7ZxH9DdnFmz1er30LY6FHeNWZxCR5CpCqddNFnyrM8z70mX3xG+1S7V+Qa87hcdYjJV5/C1UTqSI4HfSpylwmxPtmRLORXaxFlceH4KsBlg0PFrrm68dM4IUeR6VP5Ij4rT1nXz5zwfYjJGtyyZbPeQ477gKkXud00Kcqw6wQ77Pq2Z1drEWVXwZEwju7kwcLXfP146QNl1QdKXbMH+ob5Nm5X6pFmJ4WmgGEgnLgFUAq3E7ZPp9v66CUbJxi4n7x4FWfv49Xb99CuvpW5Q82ZhJqh/rZisLxlO3z+R4nSrmOPCb+p6dPdIc0QlrfecaLgkIm1EL8tICT8+oS1/N8Ex7lVynz2RD1K/fO/mUXa9/C110VZYTWixPvAFKZfIr2KcnaTUSfzU+8bvW2m7Gj2rHPatZDDCHCRQCVkZ8v2efzDcSU8v03Tvy3OR//7M9bG0LC1H9ExGjVBZR+2wCtSA3Ql+zz+W56Sv1GLif+p6cVI42qV5+8k6Axi9LHUD7xcWJA9ShIo48rif1m69J1njMpgVT7BgRXU1EebjwGUHURKt4nrSOWhz+L7Ze6Hbef9gdB/f7O+L8gUzeX3BsA1XahHvoU4eAJ4n9We5Fow+PVUf0pk55npw6uvw1NE6q1Qx31Kd5814TPb2y348yzhsuQcA3w2dmw3EGZ5wCppkTd9CnP7IdE/Qrts7fH67X4S7Yb2syxJXI8BUgpLCrXpxy/yRD1ex2f/bFrzR5rWqxqy5WUVt4zgNQooy76FGQc7MGnKbjle+azxrqOsPRLzyfbc5tl9wZAFeKoiz5lWN2AqN+/xazer/QeYRlYxyP3q8dL7xFACvVRgT6fbPOr/BpkagTiT9pZu1/pPUIXV9HbAGloHHgEkDqK9EX6lGm4buL/Pb4r/j094WQHebNyLUlA3wuAEK9BK+KY9EX61Ompb+LP6FWe0zj6Ac3JoeAkxELhxMeC592Sp6TTNuHEP1Z5Seuh0wqa4MyQIsRC4cTHgpfdOrak0xnjxD9Wuabt0OPB5Z0dlE2IhcKJjwXX3eLEpNP85MQ/VnlN+6GzAII3HEkTYqFw4mPB627FadLpb3PiH6u8pXnoTeDhe4dJEmKhcOJjwdtuGXHS5wc0wieuBpV0Mo72m3JK3qy78/HuO6WBSueAFNl36qJPic5CJP4a2iaQG9U+ogLZZ6QcUePDRQDtFqiBivSTZnuYE3/1bJN4TO9aN5/qBcYI5PgMsA0gNXjdhZLm2zTir5ttDEvncGwEd9l+exsHrgFoX0kNThKjhDt7n/DZDJcCKSPjGTe6SFVbpxBuIgdgyWvQSq9Qzvmg0+b9xJ/763wlUdW3Y+1O2y5lyUeAHgu+sOI1JcfXFcRfHluCLJMjYea8VLn7rbknAF4aWy8QDyo5VrEg/srCEliShqg7aCjpnLkr7w5opruxJoXSUFUYvSV5RsNjivyWOECGekhYzNffG4AvJ6wcdLVKssntib+WsDlYOlf1gJOkcLIDMS4DbPdwDV4oraR5WI/4iwgbw1I5HKPAxzD5SXHgGsC3ddfgNexKjpc9iL96sASWsOHJWUNxdnTgwrsDmmmqr0lhDdBpnF3iLxtsEpa91a67Oo5vxygbHgJ8yWDdQPmx5Lmbk/irrxojy+Yw9bupMu7UKTrcA800W9iksThEm46h+MuumoMld1XnW3C2v740apwG0P4ZG4DkasFLruL32Pvw//bdn4FA8yu3H2FeoRlLsBE2dd6CVnrPdBYAWKyTPgeFE//TyRqWRJjT2WmJj66ZOs8AfqxgqZbWGp30WXCc+McantQwz6dmtLOxO3WeAfxY4BgN7JLntlTiL6pqjCzZq1o+dcYIBtL1dwzgC6rqAjrlpcv/dMRfTdUIlrRhoYwjUqdGBjwC+EqqOoByfEl0IS/xl1E1BUvicLxpDxJAPQ4bLgJ0064NXua/mL0PQYrqp3qBpWxYVl2tOw3q/JbcFYDtmLbBqSuYVi+yE3/hVNPI30Croo1wGJre4cNXAG14twHIYxigxCaVdggq6uKOTvsYwa7evgX61aDec5bw6T1opXVoZwGQlTXpddlQ8T81rfWZUKiHHD00Xcn5dB7YgHPTnDSOyXTqN/HXRzUJe/II4yfB8EDb+RDkJkB3RN3gBY1MkoHviL8wqhSWzWFJiqg1wJmx9i6BZlrTbtJau+T4GJj4s3f+3X7YzzDNRQVS7WRJh3sA2zx4g1f/Mmn2WiX++r7GyF+lKxizCBhkpXDgGgB3Md7ghdlMq+n8ib+wr2lYRoek64hSqckRZnwF2CbUG7yynklzoSvxV/Q1hmVzOFbb3oGeK5gDpwC+mq9uIHpoolwzSOylfCXI8zZK3znzKYigrr9LAN2kfYNXnzRJTgsn/hT+16hez20vnUlY8pHFaphlwIiPANo4w7MA0FrGBPsgq6j/sL4F+Hjx2fdwt6wh6Sy3h0vPQSvdUjwLAC1hTKy3tor+yWglSiLcD0Z86Sbnw6WXAD9OJIA0sCHqUOP3SvDwP46Rv55j8JzaAEzV+HANQBv0cKBazibR1+DEXn3aGFkiV7v/JqSHHusmwTWArzztN4DitgFCsxv1iv5+5oqXz2ddlSphWtXEG8qoD5vfJkAr7cg8CwAoUEyzo/mK/8loxXsS4TibT90B+hQ2LfRPUCy443X6TYr5iIn+RuoyPdvF2rfQ5AGbHFyWMg+uAWgDQc9ZIdiQKUVfJd00Hv748koTauZFNeLFU4CvkK44pDBOjVmSiL08uhfkr2QQhOILyelgy+0KQLev5eAVSE6TTUKJvy66BI9+eJX/T3gkfJPV2rsEoDXRdQQpmJPtUrfiL4huFpbg4XoJ4Cq5xpsuhwG+GLpuIPJzQq08UeyV0E0if9l5kGip+nbAIcZNAO3jzcFJM50sG/0Sfwl0I1j+VrWuiifaPWVW3S2A7qvOwYtlnRbHUhF/7XMvsOwMS4bvnJw9b1lyLwC+7rkuoFF2crw0SPxFzyWwDK19fRsqfxZVy24hZzbTWKCTdpGut02PTweJvtq5BJatoRuP2c5+hFnr7w5At3vo7NfuO4m2+ir+31y+4udh21qi8mbVTeU3rTWbC49BKx0HPqtAo/m8ij+RV3lJ4tB3wmq9HaLJhYW6iY8FL7s1NU+jRbuKf6xyS+qhv5MhZ8/e/biwUDfxseC2Tx/1FDpc7Piz+B/k7/FL0t6iza7IR20xER6DRj6TnLccGo1LdvQZvMpT0g+ZLxEY5RlziLAQN/Gx6GmPdvFJ9KPZ8Y9VnpM85IrOzUBBoERYiJv4WPC8W4n6tLkPnfC5KkFk+4yevRZolzerXO3c1V+H4NAxIEQv/H4LwCnRDiTFX5DcFIe/Pxz1d5HgAgdhwzmAL0euJNXdT7OrAYu/Grk5Wm5XucMj0IOZgBtvAb4YuW4o2H+qfHdVFLmO7tDYecaIyBImWcj7DI2zqHIWNNMVs4PXXEBpFj0o/nr8xrT0rnIFhNquHAoObNDO1qMbymGgMCM/Ff+z7isutm1jYgnT3DWkCRcSsOQoaKW1bGe/kAnubvwiFWgNw+J/Cvh34ffPaZeeRVh8lZN9TvbhymPQSvPVz/kpx+izxF+dX0JL6FCcLlxEuKh8zR0B+KMXSgUhtXdoSdNImN1yRGgEcJ7+Am3lHQH4owNKNaEQQxgUf8L+q/j0eN4v9f49HJvmvCOjcjEDngFoN+jP+SjZsZTFX6HfHC2hq1r2YgRp1ghinAX4owNKoqE0A2MU/xjTUrnKfrbUWz5zOLBBO1uPTqhWh9QG5yVNI6ElbHjaSsC9selq4R0B+GPEFNdAndbPKv6YYn4HXOuiAFrdPMyGhwB/dEeNR9RkmaXiz+5LLx/bho+WME5yqjf6xmLHRwBt5orphpKcKM+9PcVfjOKY+T1HlLbpNvFgUjocA/hjxDQXp2ijtBZ/zDC/JampkB0+U5ymxl2AP3qiFi7KtRR08f+29RWfb085+l9C9jyd6fhIJoPeg1b69YDOR+lmri7SG/pLcX/aIQ9T1fStWS/fXxgy5T+ANkXHlKPENQr0eWBRvxxx9vJ4vfndfUVjCLeF0/DhK0D2tMf0RY1y1Gss7OK/+Vn0/nj1FqHb89Vc0LPWOPQetNJBDXQ+ynNCU/EXUjlmlvFVHYdfzeh+s9ffMYA/+qBeQCox5E3xp+6/Ss+30y7WRmhK+rTqFG/mwTUAbT4I6oAP/I7uKBXJ+yfiw8f9Wu1bOOJ4CPus1ufr7xWwpAWtJV5cIyXaWqz4qwCdoqVwOPontAXCewkbzgH8UZxKKMlsvFtSVAHoCy1dw9CmY01fFqzl9gLgq/8sRwGa1GphyeIf08zfZraiar33XSTEh5cAf5SkglBKts988b/U7YqP561FtLrFv8kBtWdXJW3fBkAjilH5jw1PRkPJEkeWg3sffB7Nqish2BUHZRqhtuaOgEYaR3xwIl0p0/OExV8G5yQtbavaoWg+ezOUCQcBvt7NHiitlpKs0VH85W6mtKwNyWBndGfF4tI7A/DVbnZDjbuUZwSz4h9j5vkbpVtNfFctEjocA/jjN6cOYe7t6T39mmW8waJ+JaLZf/nV2o/Q5JMl3WZmACU+AstrzPLi5SRTmvmmir+E0zEtkcNx6EB0YZI3B04B/NEDlT5Trktpi7+K04QblgyZiOyImjeMh9hxFOArOe2Aiq0pzapWxT/GtISuch+Aeca6H+bABu1sPbqhmG7SW22lNI2UlrdhWnemkePZ2evvDMAfvzlVjXNviw7q1y8ruBb1O1eZ/dv25MaEZt+tXa+66GLGU2BJjlllvFJ1SnMhV/EX0TimpXM4VtYZvOvZCRw4BfCFM3ZDEfEUZvTEov4zleau2yaxmDBFnu1qXEQmxUNgqQ1bYLziezLb25sUlc31QsvcsNSftlJidHjJvQD40rk6otB+6jHGWHG/FdLsP7tYi3BFHW2/yTxEhmsA2o8v1A0fZDuEwPgL65qlZXuY6rVk3mf2vGQ5DPBldXVDdQuVabLU4h+TtJQPU1+9WAUGfYhxEOCPctQkUVkGqCr+MaLlb1XnL8pgeHLaqjsE8EdxqsQos//USVFJXS+0zAxDGR0kJ2yfsdxeAHw5XeUpzqNyrJBR/LV0JcxfhzgQsM/pyL16zR0B+EK6RkwfzvJA7bGM0hQJLVVDF5c/XsrDcNbfEYA/vjxFq/T+ZVsxSjn9Gk/8OWu/zme+/9zvI3x5o8WsXQi++K4AaAfr0CqU6En74n/T5CU/2x7fmTfr+vFj0i0ZXHgMWulFHlqFGp1bX/yJvMpbEoeumt6zxAaFCwt1Ex8L3nZr+6lGf9MX/1jlM61HLj0Wi8T0cGGhbuJjwedunUbV6Hb64h+r/EvaoYdl2iE1prmwUDfxseDfbs1N1eh9+uIfq/wm/dDpWVH7g2LmwkLdxMeC3936qSrRCfXFPz7JLyZ56C/RKC17zuTCQvC0gK/rq2jhqghrABZbMWhyFHDVGNzrZsN5s9YMsfCzzodmr4AR5iWASxarPNMEJP4Jso2ehKDt/SNdKHIF7qoiZM6Gb6CphoogvKC0KjNQSIoqs2ty3v4J0bihBq3PX7HjAOCprKv4FABXfkPLo4a8/sjbbG4WGyNh6FwvmwVx4BNoqgspCC/GrqpsnJGiCuqamrd/QlRopkRaG5EYBwBHDV2lp2a+8lqDGvmz+Iqvy8OuQzEM59aKlrxVuOZ+gJba8oLwIgVLbABr5E/TJQ/5RmAwPDsZ1D1F/ay8H6CVFsgguCrEijNyTFL/+9wCfbzw2/dQ9BMVN9+4erhxE7TSlBmEEvNYaUbsSf4cv+Khtrc0e9XcXdR7348ReHEVtNJSGwQXY1l+awSkhoz+yM+Hra3yYij6JazqgDUPBz6Bhjqbg/DCOMvuNHCkvlNe8PizC75FaNpf5/meM3jHwvsBWukiD0IpEa0UU2Mkf8J+5Ntsb4MEqxlZcIuCVxcHroFW+vuDUCpRK8fOI8mfvwuuW3s+wGp+MxxdZsFxItwDTbVgCOGlvFaM9yaS+nfkFlzsom/fQ9THEqWu82Sw4RZopY1DCKWuttpc/ZT8aX3FvG1vkiar2cshCNMVghhfQSOf60U815RnGqzkT/Krnu/bW6nHatYuMMBt6sCOu6CVdiohlNLhKnObU/Ln+Apfj9uux2pub7c8P5uVrDgKWmmEE0KpVK4YM3gk9Q32gge76FtUk7LGzBD2Xn63QCvteEJw4dDld1pD8iftFe8/t0u+/QhF2VJ57z4eXn5/QCvNkEJw7dZV5M6YpH7J3ImX7f24YijOlJCGJ12LDd9AK42qQmBl3eXzWjoSZC26qVUo38ZYhuCp7YzRWuSr7QNopRdYCKVgvMp8T5XUr8a2wLa2L481vZ2YbSBAdPgIWuncFsIqTi+fW7ZRWa0fH+btn+qnJ+UIXbVjmf8XAIryPkpNQe8V5Z6gpL5fXfCQXfb9ezX7EaBGNJskwj3QTtvCEF51ffkNIZHUrx154tnYRmFGYzZULantvPS+gKY6RYbweverxgY2Sf2KZwsudtG3byH6arVkbR0QOvwCrTTvDKFECFiUS5GS+v5hweNWezJhLWdlWzEuCSI8AfhjwSNUKYL5XQ6TGlJ42e1x2+cYii/gCasCOBz4BFppcxuCq3awOCOrJfXLxhb444Xfv0fimS8JIwzixk3QSm/iEFxshenNW5MqnkcveLpf8y2qm9bkFPTdnhxY0E98LHvCC98wv9lDkvoFFAvyz6/4FiGa03LPdy+J1t8X0Epf7hBKcoi1GUcuqV/7ccG/zZ0QYzUrpRaXc2kz4iVo5VO4hHCdKFZimp6kvolY8Hy/5ltUdxSpAuecb3NgQT/xseQZr9nFihxyldQvbjvxaXsbgRmiMUFMB3DzceIbaKXbgAilqMba3GGY/Ml9xdy29wiP1Zw7m1K1rT1ifAWtfJaqEKyJx3xmj0iCBEZ3lhDlOwXNENQFQ8V2mmO1fQBNfSKwEK89yBotApnUf3Lagvncpd++h6i7T3vyBAqp8hY01VVFhJeQZFFmNEvqW+oFz/ll376H6D1Lo4zjW7y4B1ppfCNC6XyyCvcIJfUbyi34vV3yLaq5mYOIEy171f0BrbQdEoGlVpnPRxxJkZ3YFkWifK/VGYK5dujZr0v5avsAWunsJEJL2jK7kWSS+s+nXPD0swu+RRjyXhCUSrbPmvsB2uuiJXrUEGZIURnEpqFJ/mRd8Py4IZSMGp6zgjRbrL8foJXPoBoitp2P/AZcNg3JesW/2difPr45bwoghLfzeXCStbc0BY8S8+S3W7OJOFa5fIhDKorl2LM3Vt5C5LRAryJiK/vIb65nE3Gs8vChHnJTmjFn/fSsvIWgiY8FD/tU7lmWW8WOf6zy+KEdsv15vjdeiPLKWwia+FjwuE+YoFW5juz4xyf5zg/9kL0YQAR0u668hchpgV7F/VoSrco9Zsd/fJK/+pCHHO6e77389qy8hcppgV/F/fIfTWztlSNISNYdCuRvNneFkG9W7J4JbFCMD85AlgAhlv5HZ57yrHqammp+mFL+tyaFSFTbC9zbltjxARDVANGJNHRapq91U1M9EJPKcz9EU5DkIw8l2PIFENUH0YH0kFqW9TdTU7UQI+UZH476mFWCQPCQ4gDgKB+iE+lWtUK37KaoUiImld/XROhUfzaC006UH4CotIjykh5rKebfS02FRiTKsjsU+4YcQq1qQoJPoK1GByO8DlxLcX1faqpDIlGWxSFaoY6nH3IGFT6BVjpOjGCifC3PYsfJn9f/DqQ4n/rLR1NNf5DuWVmL+HEXtNJgn3R2KfW2c2qqx2NaeeaHYtXrdEbZRFy5A4jq8yglxcxWa5zt1FSrx5zyJ4BatuamXDpsPLkEiGr36EBqqC3Lkq6pqZKPkfJMD8dWDQ3bfo2kOAA4SvvoRKq1LcXpiqmp0I9EWUaH5z2c6qmt6Uz4BFppfDVCSQi3RB9Fp6ZSQCaU53U148DaOhuHiBg/AFF9IKUkAt0K3fucmmoFmVKe4dWczPktoykfYrwATLWDdCYV79bmHOvkT/zr7j926XlE8Jz3iW0lNsJ8BU11ChzhhdhbmdWQU1NVLWPl2R+ilFm70iAG2XEA0FTZUkq6+S3XY/GpqeKWGeV5X80hmvk2UZ1LlE+AqAKXUlJFcMWOs09N1bjMKn8SqOZ9jhgNUlnYcgsQVedSStoXrtX17ampUpc5PTqSjb6ZcjIZIJklhwBR5S7FpGniin2MnviUx/UdD/26+vvnS1XT2bZ6eU2HE2+BJThmfUHqNK7MMtapqTCdsfKErmZpXwkeNth0OABoCtXpQGJCLsllvqmpbJ1UeUKHozWvA5kw8PjwDbTSWHwE13pyec4dT0017UwoT/BQxLNLxIHrJDs+AKIad4pLpcv5PRCa0ireeVGWzWHod04xB3WB5fcHtNKLf4RSSnOZDsxPTeXwTCu/la4l97qzSWEpPb4AovJ4Skv1zrlNypnKiuX5gbIsDsFNTm+eSbN19wU00seChBIcdIX2oU9NlfRMKc/jap5Hby671lJi3ABElfV0IcVIl2O/4dRUaE+iPKvDkhMTnfGckQwHQNul93QiHU+XZjL31FSGz1h5foeo2cuHZVSHHgcAT1k+pSS86go9v5+aSvSZUp7o1ZTkzve9N4sYLwBTyT4dSDnXZVniPDUV8DNSnt3h6HNFBSV7ICkOAI6KfopL4diVugNCNVX3M6085UNxq0IjIrSIK3cAUbU/HUi02mUZgz011f4zUp7u4ZiROVcLCJwUBwBHMUDdSFzc5VhmOjWVBpQoT+wwldXbtf02P0L8Aq30ByShJN9dqLcvVFPdQNPK07yaz5TBD1Wey5A3gKiOoA6k4e+y7D2fmqoKGunxjQ2CQZSL9mQuUhwAHGUGdSKthZdnaAXVVHLQhPJUD1Fd6rWDnBw48gEQlSBUSioZL9e8LKqpHKEZPf7JhJVsq/mNsRlRPgGi8oSKSwPl+T2znNKKFXpRltRh6LUsGoMmePkdAG1WL9SJdGhesMVoVFMlQ3P63N/QpH438Qmx2tR5BYgqG+pEUkOv0BEbqqnKoUnl/7oaoY/ggB145+PJDUBU9VA5aUW9JIvVp6YaiFLl6V3VNm0ZbeI0p8E30EobdxJcyuv5LVOd0kokelGeuVG4gN19BtdefgdAmzUTlZec2kvx7XhqqqAo0cP7UKvsveCQ6FNIsKCf+FjhKb2Xvtf1w2/b8tRUYFGiLJdDd31XQxIfK0J8As00USjtFyB8kZYLUv5svuLf7xN/G8t5c9Ih4FwjnsmG16CRbgCn5ZJppyHlT+VV/tI4ZDZ7nl2RE2xYiJ4W6JXdLxf6Kq1SpPzHJ/n+TOsho9dpHBqj2LAQPS3QK7tfBfZl2uBI+Y9V7mk75N23ak6gF7NhoXDCY8F9p7jvq7Q4kvKPVb5G/Yjzq1NCVsNjw0LgxMeCr52aza/SvkrKP1b5N8ojvqDJrCZebFgonPBY8G+vFPfLc0aF4lNWhdT4/4Ogvz/vvDmfl7SglcrQ6BzQIZ7+vw3olOYQcNNUedKEc/cnUY0DkYBQzIMaG/zzHc1jF5a7f02W9jVN5faMbfkdlu8I7Jp6qJsSBwBBsT3deDcCIM+m+yaq1p5JW7KH6aWeVdIELCw5AYgK7fnNvI8EwP8vYMVvMiJTEad9T/r3fqbmnUAqvvbZXFkonveArzt+pxCgwxhzpqnWpMSW3aGIndNOp6cLAQ6ARutM6sW7tQAdbqgzTUUmJbb0DdG+Bsv2dKmkwQHQaIFJRb1jDlBqyqGjvvVY8vJ49fnParc6+VPMM3kT5TNopUHtqQM/yDR6yGmqOGnGlv/hKIfQ/Oy++yPKF0BUblI5b2cFpFoU6TRVmzRnS/6qHuvQbrMDSJI/gKjUpC68QxmQZyaHo77fueL29nDp9hiWVTtT0xQjKXIUtNLx+9SJH3R4XdA0VaCU2DK76k9g8TLzqclCPskmUfVJ5by/H9Bni4nTVHzSlC2lq7oZD05cSCYrTgCiypPKeWNGIM9qEqep8KRJW3ZXNQ1IduyatFjxARBVndSdN9QE8jyAcaKKTpq0JX0Y6zJCtbGTYcsJQFRxUjfeChXI8ge9aSo4aews80PR1+zYLE0K1NjgnkSP5bxhLdBqbbHTVGzSnC3na7tWEu7zawaWHAJElSaV8y7EQK41605ToUnztvSv6gtDE7Ogdqp8AkRVJpXzFtNAqFesTlORSXO2zK9q+emgAXZMUOQNIKowqah3DAeanQR0+KTHdapCfcfPmM+Uqt1nmIQ4nDhe/AXQ9luo81mWyQNOU6lJYz/YIY8qA5HBGibAhQ3uSfTYgTfoB3qcdG2aikxKnd+BRKNXZfWZVsiFA6DxApM68LYJQZszOE5TfUlTzl9TpcIXFxMw56PGBv98R/NY3PtcBHIX95m0ypJebHkchvs2cmjn+c7SOwAarCqpnLcYCRp9PnSaikqatqVzVQ+tJu8FSc6NI4CooqTS3iUmENuNy5SVk/QDW/6GoDdHkJ5qzmvuAGirlKRy3pcnyPOvzWmqJGnSlsJVfc/VRby6iBUfAFEZST14P6Wgxd/QpqmEpNSWziFpd5fRXst8eHAANFw9Ujfe3CrosnjGaSoeaewss0Mxrr8KPfNN4cYG+SR6LOdNyII8m/mcpsKRJp3/tklFt+jktfBhxQdAVDVSB948Lmhyl8NpKhlpbMvrcNQsynw69hJCHAAE5SJ14L39gkyni52mapGm/WjuX/omQyiJtCRRNtRMmscOvEtj0OStidNUJ1Lqx+fpFSYcPExhJcRCx8THsif8JppBi4XCTVOBSKkto8O0o/N7WtJaQ4YDoOHikMp5R9Og0rJpp6k2pBlbhlc1igtJ1zqa9LgCiApD6sA70wZNltg4TVUhjW3pHY51vvMrWJ0eQhwABBUhdeONg4M2kwudpoKQpmxZHg0SC1YUOwTZ4J/vaB7LeafnoNXWnaepGKQ5W+JXNdMZHYufJ0sOAaJKkHry9t1Biwk9jv+Nvi49PW1ZW5dCtrJmDV4LNh2+AehnzES78YNaD8qepiqRZp0/aw/SElhofYrz5hIgKhGpG++aH+QZrus0VYg0aXtKCFNZWpMrNIok+QCIykMq590OhB6jMZym2pBGtsSu6jZUOnIyUhQ4ABqvC6lP70EhJBiL3fhvzi++v94v9f4jtGOmtAnTNmPDJQD91M7oWa3JvFPHn8p/Er71trWoqdoX9jRxVGmiwknQTrvkU5qrpQ4/gpumsqcSW/aGoiUXQdoAGgEOgEZLnirgHXQEIBjcrF7yHhNbEoeuO4CJZ5okGQ6ARmud6sm7GwkRVtM27rvhudvnHQtMEQszjbwa5uvvD4B2602tYp1eLT3q98N0xc/T46VbvFXxfNU38QouPAat9F1OrWKNjiY9/kRe5TWJQ7cWkdrTEIgLC3kTHgted+/7JjT6fvT4xyofST30Z5I522BBc2GhbuJjwcfuPfyERheQHv9Y5StpR0+fYVPnW5YLC3kTHgu+du/HKDR6gvT4xyo/ST90XbtDZJMVcGEhb8JjhZ/UU09cm0NIjz8+yS8keWiNnOyJiJsLC8XzHvB1fZV9UoU2Z7wcPl8lbAErjJ69TqWpNysqHZPODZhDx4CQ3WzFPyY+Ndvl+Pg/4ormMoQqn45yEIpFhxtvAX50kR2KhTSHKx3/B5zQOEOo+qzY1rNvtrBgk3a2HqOk/wr8K2hJocGOj7ryqNP+TWYIYWmfH/HON2px5TCwAV93/PbgQo5H6I3/A+8nyRCqm07u/vo09V5zCyUTHr1ke3Yhx3b0xj+SDCFE+eW0QN9n6co7AvCjYLbHF7J8G3n8afuv4vvTue1rh6ruUUJZmxzOIsNPAG0Fp1oQ7Md2OL+RO4w/0gwhRONKgyc9ulx/bwB+jJLqYpVs6uvjj7kMoarzNXD4MmsjxlmAHx1kC5Ehzctbxz/GGUKVV1CF9b4+zoGFqgmPTrK7y5Dj73/jH0mGEB4wq1Dwsl54RwB+9JDddQav8QGOP0uzX+vmvP28R0iKpeFNASpZd3cAtg+sann29gMmfyVzhePxfywITWUIobGhJnBHG1LiHsB/AAiNkvLaLM+QgMcfExlCmCrP3ifSjIQOxwB+jJLuxVu0I+CPP+YyhKqOpzm6TixIjbsAP0ZJ+wyt10QTyB+nvc5lCCFLHzeC6cxUBp0HNuBsAPcAHPoNjIH8xwkZQlVdl+Upb+KYch3gR7ls+Ti0+pj4+Md0hlDVC28SRsK1+PAS4EfB7Nk5FPsC+/j/gyol2XCKUlW3/YCBDX1iifEV4P+rKpXLFqxDng0fj/9DNWich98ir2i+txsvybP+jgH80UG2yR26XNh1/B/pPqMMocorobRVdn5t/S0UTXyMku71tkRbih5/TGUI4TgctJAoT1c2nAP4MUqq51B+g9wbf7xkCGFIv71TtQNXLbcXAD/KZXPvodWL0sc/pjOEqmZBV19lWcOHlwA/RklxBdTsjhnkj9OeZjNQ5T6WKpKugUeb+yAfcApw2/EPmc4QPv6PJZ7JDKGqZdlqKHObZMJBgB89ZBMFIsksWsc/0gyh2vUpCQ35ZC69hZiJj1HSXrvl2WT0+GMiQwhTW7kss2w8p8MxgB+jpLVqiTQn8PHHVIYQmlvQp2yefkmJewA/OsjGMUSaLSGPf4wzhCp/mRNU2ucCBxaiJj56yJ4+RK6n449/TCfP6oiUbn/egZzsOArwRwfZm4lIM/Hk8Y9xhlBlFt/2lNqWAwtREx/dZNssIsl8aMc/0gwhTB07O8aeNrj+zgD8GCWdVUeqadaPPyaT3yUHJjfB9qfjzDgJ8Mcoqawn0vyZefwxzhDC8XZhqWxtNQ6cAvgxSipri0YrHB9/TGUIYUqsvYu7i5cU7wB+lM3ejkSJ0TePP5H/RHr+sYu1H1V/vdJpEWQ96+8agLYbYHWTB9kW9UH+D8uc2eS3zkES7ZoUpEGWwwB/dJMNVYlMV48f/5jMEMKk1pLKRbGbGAcBfhTPNrhEi/NIjv+Dm+glQwjDVmw7t6PPl9sLgP/AJiqX3YeJLNNHHv9HCk+ah5cjV7RPzQE/SqvuEMAfo6RzjuH32cnxx0uGEIbvzTkJe72sy+0FwI+i2YabqDRj+fHXPTSVIVR7jE0x03wdoMI/gB+jpOdch9+7WMf/4e6TZAihOMVviUpvnDV3BODHKOmcZeSYIuv4I8kQQpf3ftRVbrGvvyMAP75I9hMoQg1Kg9R1L5z2mOR+6bc49LnQWgNrDVxYKJ73gK/rq+wNUTTaeAb5E3mVaxKHXt9UZ9UAW1xYCJ4W8HV9lX0+ikazyyD/scp7Ug9tkaEOiOFwYSFvwmPB++49W4pG68sg/1jlnrRDl6K29kIu4cJC3oTHCvdUUklEnBFmkD9W+U76oTdDLB2QoePCQt3ExwrfqaWWmDhbzCB/rPKX5KFnpT/VXjcvFxaCpwV8XV9lX6wiwvW99x+sjx+e035PzxAOnbonYXMHGs0WwuY9dFL2en96PXvItSUHf7YLgZiHLb6DQjTCoMjsWu5XrINX/zD1Y0+gPbB3CB2iYoNx9noNQXOWYvKQDN9B9gPDYk3JvLN+5HgSF5t6s4dPIKKoD0XOo69VVAzakbhnXeEALJZUUTJlzEMMVn2PdQvaBvwjFaoPtmsQ89SIpHNUbExytrby10NoiQThT6PvRnRweBlfeYnWiqMV2JOayg2zSs21T7SMslOji3EXy/zVOFrogfazqLo2DbtXpoRyJi1bvKeSkYnkSWvFEYwnt5rK37c6ZporwqpBkan0g7wSasW0Zmq493nsWFTUbhnTmaD7BRJ193FfNVd/cevyEJr4nAwpwJgBnO4R89JvSFaodaWFnwLihwzKxD+NyvpIqB7jjoXrooqiZ1RsPM5W+8WnWuqpHLX2pn1QFNYZr4hX60fWFl9B9Sbnt5ZtyGxOi3Cb2lhseYAulvlrnbWAQw5pUfVlCvrRTAdV4lq2eP9yJBIludaKFYieurr+QLmrkX3isz5QWCr5yK6DynutWRreflZglmAzKFDq/wz0u8ndaI//df1dpqZ2rOeKOPEsHJUwMrVXCA3HFnpoci2+rdtkKC0aVy3M1v3Y1Zv9U22locme6Jotwjn+R/rYjgo395cMbQEn0tSYXbQD7WemSWy1ZWx2rEUiEV5trdiBwF6sqdzHIq/z3am9HlBYKvmIbppOkM+aUn/NBw47VuLs2nsGtaaNnj3Toh/m7Fgo7WzUsx6qxal120rksroWs87sX5BU12JGKKmuxa3QULLyR9QjWfyazec5gV4NLWfGeHUbtkcsh31A+WsTG229Cw3mS/SVL1FmUbXnEse0eFTK6NRd/lmRp0h4n1/6fkUHjPsylqVu/YhIKx+n6jdbropJ5dMwFhIqXYg7WOafmXvCJ8l+GXRsT/zbV/eE0FuWcH/RlSOk0lu/UiQqkBNXl63SUNzEJguU6pd+WNU9kfmWnffWvA6S54ZecD9ucf5PO9lAQcIuUUrlPD6O8SwYlf8W3k/C/B9SGmRuJ32PosJVMhnrPrhWZBsvQDaxc7EhegTZNAl5AEiZkQW3e2VBUs5I4LgSJ5PefHQ83FIDs/VIe7hvaJOI4IhrRQZCttCupQ/3D6ZVmDwgl5ZKPbRqYNYjaey9PRmSZLmFF9x31c3fd82NMBETqUhbIHvjSebAHvn7J5mZsyR6xoySU/EjZCUZ6yS5vnKWzZmo3AR7gafgahJHduyP9MF1haX7n8eyBY6CTzK7aOcwJHU62520iHtGPYmIdblWnIH4VLOJfR7RE1GcNchLgZWUJB+udTqJoDT3zjbVoDzX7gjYVhy23SWHW45BWR6O3RMOt+SCslQcKw/Hysax88mxe8IBDhFlNl9LUvJkRnG8m36ePSSFQgX3XxqIDhNOZ86FCq3DNBAlnDieCxXwhmkgSjhFPxcq3BzTQJRwMoQuVLBApoEo4bQTXahQj0wDUcIJPrpQAUaZBqKEU6l0ocIfM+1DObq0pgsnHslpCSZdiE5N3layOJFdTkswS0MkdeqqZHFi5JyWYFqHSLLVVcniRBs6LcE8EJH0rKuSxYnbdFqCiSMiCV1XJYsTAeu0BDNNRFLArkoWJ5bYaQmmpogkjV2VLE5UttMSzGURSTO7BilrFaw8yL/TJ+OAPwF4agj0VV0H+49PsMfgU7h51FPCLjk0YDvwf3rnvJe4KelTwjI0EDvgf0n/mIvqzPNMIlDHavvi0R/uWBW+DLurkms2P+DwFmjrxkqRNyDv9A2zxdHSzaNq0Kju9MsuRH6KKSJozNUts8LBY67CFxJ4nXJlApwp9FF11XyqCOAj9pn14hL42CAiAq8X2n9wTmCor275tLFugr+/f/u4uhfwuzoe1gZefVrcfHemkJeiclosNGKjIy55ZxpbqYvJ3mU9IwOvjQ7nuFoNDLzEUC0OttpdbSCSkmiqxGAtToEIV3eWHWWuDoHforUlPzAtkDVD6YJYCyzdUOnoCLM3uvtsCrzW3HaXD0yYUdFcMGNi88CM2+79ADMyanQsDiw3LA/suO086g8saprXJZcCRSexB4+ekj2128endIShgRc6XnU6M657H/XGwfW5zjrZNru1xthpF53ldx/31lkjngBTP2cxL/QOrUPc0qUEL70VXMMtuFHacMfbrXt3DoD7BYW7BMS7fMW7+OxFtzsH5rhowq3AYqCKXlKIGCaQlXTmZL7ivdtQEkgleWkzY+BWPlqgVbQoqWmNVzLLvOLWlj7aoF2SSbu9nmaHJ1rPwtfL1jFsGI58FAdFpGyllvu1h/U5ncpHI+X3p1utObDXp9wa+tg+jSJOpBpnsxxhTG0ZzDjdnGOsxvoix7NG4g/EgSmrqU6ylEaXdYi0bfSP2xPpxjj3TXqwi5cQNZTz2MYEib8tvk1nTBT6e2Vv0zcmifwD4XBTLDmdXKK2iPVBiWSJ6MZL3CRSh5GkOLIOK227SuvtZ7bt/x/+3eP76ENf7JN7e3Zsc3icRqr9KCnjFFOzuPP0u+eZF3vFVuDq5nVsAjd9d/Xo2+PsrcBsOf9Bru+VIn77f3B8gxHNiVzjNG4wos1SJxZObNr4U4bZx7gtfn4mWnukGvGJzbyIRwUkGzWQe3HtuTrs3qT9sKLuYltas8H99wl58h/bqp9SzQu+cUVBtnhPJxwuG854uaLx+CbDfhEjrj0iip36WlzIVNjLSJQpRcX1dKKnFBM304k7pXhxM52ED5CKF9GJHdtsqg9xlDmsbtoy2inuO6TFmHdB20ib5uy4ZYTlEKc3l2QuF+tCSXx5RA9eUvNLHSxJqWQdStqzqGjkHlU1bgxOUw3eoRIPrBslCNWXcLVSI9t1+LRzBQa7U3QdPe3qgeGQNBOiD04iVjdtHe0vd79iRO79RYzPvqR771kDe5nVs6En5h5VF+Jzmpp4h7p5YH1QAlHdJD5Wc/py3GKWwF6xEzhoPSp07gE0uM4+Nmbg9IFn+FJdpLF19Y1K/jBN3hijLr6Ms/E5XZT2bOHfztAV5UB4TxtLNoTw39pXqUs0g9zuXs9ovZIt9RvCkrM5bx3hkgAW6ZwqDJs2sO5BytTc/OvIeQi+0mY+ZL66+8cfdf02J88OdcVvx45atv/2/fX0N/uQ5xQ/8xf5Vr0ba6C5UWMMjjX65saUtr8qeOHQZGNnMW6yieZmjTU52myZw1MSLTMyV+bxglsVEtPg6jQhTRpUSqPIaRQljaJNg+rSbGekObGLZFN2GzxLi+K2x4l7eZ9ckKvkIl8t1Zy8RP3dPxV26aN44EnFQz4tZ+RIjvlEyso5uSF38U139ztoVUPrjZlc4D36EXKiinf/AXJX2ri9kRfE8XSIRkdeOOGWR16k+uLmR144cW2QvPACNutTPSSF/UewRvIqa9+9u724sdvTi+Pe5mEd0gdidb1YppGRV30tsL4owUn8B/E2145Sh5PE39hC1uGkPU9qkO9Qn7Hi12yXVbV64OUQt0xX59rZFaQQ7tRc0VFRsQzkk23frleLCohqC/OMc4cqCNGNUwxJsOiykH7CYIJickAWSfwkTrFJgsGXjXTB1qa46TBE9MUpnuS48Iwwv2J3ulH95hFjb7pRv2M0PLAulMBUD4ndsQdOP7lgY3ERU62p/vn7Hxv3k6ff1r8jaqBnuMW0TOstH79dPz01VKjTdnkU5Hi7C2RZ6K9iExDrjRIM1UVaWhkAPjoVXL96auTA2gF1i9QfSNZHGH67fnlygeH60I2vQybZkkCcbi4+VrC+KP6slvgb4m26HaUOLUnSsg4tbTxKuXhs2s9o5m84NIvtl2dr+dXpjJjmFvQrM1gzXbqPBlPsWVxLvqR0zLtzpmPevzUzT7cEvj58hlNuUHiMXOwVURLtBGbK3xcU7bCZkGgnORPth88iX+pVS9FObLagZdLazw+l5p5ntc0da/MG3y199EG6oo/Wa/ON42Q+0xf8tvCNWaDxouZccNKiB13jxazdpIUGXcOFv91SPMV3t6N0IJHOyjKTDraZQ1M0TTMat/RZBbPKIZrVtIaWaFlScG3V2+mQa++T8/JRJKul+/JJR1bXVNhFC4V1IUebpHqI45pi9ZP2LejKw29uFa7PyvuLLeIPhF+WOtv0OtaMEad8Tr+YN9B4OaKnmGo7XZzPi7Ti4lx9VfNGLbtay52b56Y/pOpoLXu16kY/ZHdu3Q0XrEuOCXYsEHvdz6ZqZwu1tH+eKarnfvHvw3NJtsZ2XUn+5kzbXW/6ye9n6tTbXucf3N1O6TzFz2/uYof48fa4LZnKq95j6CWyyUyETA8Cb+bz1xSWjSdQivOE0fLp1Aa6fYGekpgRZbVQmXWQ3rz9fzERfEb2eEIHltzCgEnxnTURlp8dzaQOx7mJ7iL6taHCLpxJqSaX37E9fLLnnql5uINX8s7Z+4JFN90ujgHAdLv8iF0xI7rJxvKvAOLE3eikxdPt9m4Ai4t0bfXcLCP9RBM5yPmPnKssYd3YtSwTPWQ5LS91OGk6J3O4aCc+QK0wPuWBYtnKv+NBT2Kjqx9J7g18eOOhuF2EnAXpQUqD2q8hDxm5rlVYP/FBiDpK/KQklLJK6qeloSyrZX6GNdYZjUMffwgMPI9ZyrhtfWxjzi/sIqhS6KYrDbr1FrtNoNRHZrL6rtvUipge5t6sxqgW7JqKGPAU0fN0TUcKeM6jW5MDp4tTfCmsF1ZyaaI3ad56UgdL3S3T69E1Gmd5zHyM/hQfohpK0nQbIFcB9qzCISrMsN44jaH60jRO5g9kPUOt6/j4i94OSxZVYyOxcxQMXB9v0QFF32v24+NZYHp3hq45T7fA7JBc5cQ9G7dDN0nib0k8bStSf5fU07GG6c2ajiA+9nyN4+DuHoF9ewbcLsKdReQfIkXn2C18DRwfZKqOYv8Ep9JEH9Jy3ZhI9ZMeZNFcMv9S1na1IORbvd0JIfDt+96GpWmkN0pvOH25ZGdoYYORr+UR1UWT2TTTizVVS5GPv2td4ziPytr905815jWts63aKe6c9h/o+9D30s+c+DfyPVEWv0zDYLCv1Z7DjZrAg+dwoybw4DncqAk8+A6xG3j0HWM38Hji0Zo+8nTHOgYdpjvmxGMzGzWQPiiN5fSTO4RQQbFfFE9CkvhlSSdqdKmDpKlI5iBZT62alnznDf8C5sNglhlZfSEVtJXfTmJ2VBmzpDZPF/+Hw17xb6z3TH33rkfzljR6UT3a3NU//XYhYLQtWIp8dbFhFszPq+w2+IibrVZt90JUH3ALJgdbFrZpR0R5xYrcamdC1v6tDthw264d4y6wJx2Ao/mU7T93yJX/0gHX3I3r1nc3PcAbA75bSughmFYjqEuLIKsR9GV6MM2CnSm4GUMApEQBtJmVHWOKJMpOiXGKJMZN4XgGIcUoxqSU7eRvoRL1IEJ+dYdo/NoO0HGGyzRagC25AMfszvZ7OsTr93VAgSu6SsYyUCVVgGpzTba/tkPq/EEHhFzkio0pIJHSQMac9bFlDV2wacSW392U85ybmi74QVskzltzt07Tb4Tz4JS0XzxeP7mG2Jw38mQb/JS6AnReIx3zRgxIRwxIRwpNj/miC0hHF5oZ80YOyGzt8efdxde0+Mjz7uL1X3zMebcht7EC6mRzkJanNzpPl8VRFDFFltniKktIN0qlOD2ca1vE+mDXtUT0k4QeLEr9R7qclpc5nKzPlervLF2Mt+TTGUHNRRfyfEo7j19TWeh8yVnk4OR67C9l/VFp/vU//0cczgak1My0mAycN+qWsjpiQBHt7YqbagKLsKKeJacPl0xmY90oWcwh+uIlbhKpAyUpUtaB0p5sNfJ5b2nBul0WyORWnlzv9ucnVGf05D1Nv6QvZqLDf3+LCRPhdS92v6u0n+epHU/yna7MO8rlgfUT3UKQ+lVEGTOcLi6BWT205ersz8MraTdvT60s6uaK7YtvdKvzQ8csDdEbpzkkgYBjAdIN28c9F6GUl+gnnmRBslXJu3k5wfl2CSwOr2a7pumwNYUhunCaJglyJnOQvrD9uWeRaLKBxJ8STzIkTUQmvMDG17SVndnXGY3yVbniYBuY69Nw69oVdx6BzV7drs5F6dveQelaV+WK+6XA3j59rs9g662bpbjzCRz2ml6auMCOrzMT6QGnraPoTuxiJ/k3I1uyxG3ZkRWuZSO7uCcHuZIjXsuNnPAsF7yFuwIA6AAKHQBzBh0KgMFxcwocCoDguLkNLhSggO2sSiE+BvNN07wBE8wiU5jXVqI9aHVFml7niEyEj0RXldxzaEds4ihFNDHKJR41tIua1E092qI2dbSX+nRAUzTUaZqhkY5pQrM6RwKpVCQ1aUhSmRTSqo4MdZFJbvWQRbY65CWfBpSiUNOUoYhiTSj7L/ekA70R3y0c7/Hk45Z1fdhLUof0y2wHtlGCHYzcrQevQodlowWbPZt5Z7JbU7b+SHflQOl9RZ7MbQOq4Ch0u2422t4nasWzvkX9M4AL3kYXi/g+mULvUnOwl2S8W4QAm2Y2JopNLC2Z6L3Wnffpl43aKrXEHex3cP09EKMLUg/8d0LI16GFHwZh/AiIcGHrl5XgqL0LlMpVQ3kbi7CIerQPNFlZi7GGqxI+vfiSWTFbH1YHl6s/yp0RSmh7s7jBHCLdeIncFO7Txd8oz2fIsTyfSQ43vrk1R+Q8r675iUtfTjM/FFJvbaO79/shjWhf0tAwTh3oN3XKNTYSfPQctTbLhq9D9/SPgc11cfTNlg9HEZ/bh6U34wubI1Wp8HVDkl71AVHGm3GS4Pj4MJl1OG36FWgHM8DmTapq8yQ1va5JQ98LRxjEe+ynzfIRJ9Fy9EcO0+gTQ6iMrnzewxwab04o1GGBOaHwQ6GGXXux9GI6YT59+DqxHP2RsxrtoPZ2cTCXNfkM4NU3N3g+h5d+IvodPtwR5yuGxjNbwLmX8vkScF5rH/0y9h/oWWAndnzyJN/xQyl64fe/G2Y2viVyx3jCZ4uftsC3vEv3tmXHvcLX+Ibf7Xf4wXsVOg5c+Dpv6Gbggqe8Z3/OWD67LT3agpd2VgEzCzWHwJmFbinMeyqv8t5TqL2wdc9dsFS5i3g1XoOXtDJeMdd6YTR7XbFm20siYglE+HY86hgiLAn2WPLCflJbX6nVaq5PiEyYfa5Y0/WSiFgCNbZuvhyoyzbm5wR2EWRn7NCwyYPpSn2dpwvD63eT9+XFnP29nDucBA770/j3lHOcYXcd9U9XQOxz34Gy4L4fj3a/9doL83eF2JmkFHa81zbs+AaUuYOcqLQ2U/PjmpjHQeRPbH86rleUdsJ7r5Pz8jFntCSLQ2i0KIXMouy0yJZtt2v+zFMIxQ6oAuJbqd/m+f7h9NH3Z6HZSVwSITuUgDagCxgOl2YG3AFPwLLbhOPyEj5HEEgFwkDakdGi08RuSIbs4kexRRa/lRVbZrHbWdJOlrTKktZZ7CZrm92PNOACh8DVuR+JuHbdECfHOXAJ3Op3MxgYZdR4g+ONvo0xtLSogeGZjDQwdgbjxrsw3lUTXHRUazWnKdEQD8niS/+ve3rny0djuobVYpJF3uHs6ZbkSUbsktaaNI4NHNQiky/fvO/HJNrvh2L2EPTHIu5FPYEXTtqk+xbxYEknfhiewo/BQ6QTlfELh5P3qu7k3iNWB83Rh72XW4gqGMoMheak7a2iVhQVtu4fhxW8TXTqcTbUEoO5sXZIcnmuHpHYMzSJrzSR96ju5GDTDG3ilKZJegtRg02TDNEGh/Q5/+PuTNouXAOuJvy0EiccvoTilPw4d+8nkoPXbtk3dovY4eNA1uyUHBvlSL0XxJ1s8enJp2ll2fphaaQcR2/2rpqVKlhKoqUVHLXq1TgnyAN9xP0kUO9r7Lx3P3aToG8xtd//pmh47sTuB7FLDvQQP4CsvVN8vgucepIH5k0WMG+hCqd08zYscBA/kSaOfthSKcXVmzOR1JRXv9zSpry/fxFVeOJAYD05TzJtsqrqqzrcIjXYVllrTlJiw9abtSdqy3ct6ff/W5WSmwHryTxSbLLqvBWGpNmsLGcYkuaysmfCqSm5N8XqiDn6sPdmG1AFpFDvutloe3dRKza10W/JnaW6C8+5uvLSPmqZIrkZOqNWbr4vgZGcEiv9qYzd/Zr+1CbqvFTpT2jWdWqp9N/Mqb5T71IZJD2x1A622mJK1SifF2MpVOOz+xvrUvezhPbjYdUZfsqw9GI6Yj59+KRLPUpZ52YiFI5SVUUzEYnaW83pyPCGinrLHGaiGHGOPaO6Bq7vlg3pjzpDIzyjnIfLF6cpSxN3ahu+uoIGAwQMcrzVVYcYNOTMUtv4DWXHzbnzg40mFXeBB2awxPlwDP6cOvwqam/9/veTM4klK9ZorFf4QCexWN1OtXfXvWo8DWzmdNm4oCJzfrBE2q+2GjUHui0BzWLJijUa6xU+3kmcKeiylKofsskPJiS3QqI2bWdB1p9a6ofqWLMV6hU+6knMnzpwfRHygxGs6eZ+oLOU1p8wTWPJwhp9nX/IHbij1FGmEDtoifPOD1ZgbNxv1Xj2CzHO+lMi1WI0a7TUK1yhDt8aHpOUdbHUasQa+cEq1r1cqre6WPf6U0NqxFqs0Vyv8JFQ4q7SORSw9PqHplYsfURSs5T8YEXHJ4g7y/T6TzaPsGIj1qfCG7b0bZNqW+uMgkuliS61V5P7Z7rqDYsSb+kZ10XV7UcjBuesnxBxcck+o/1+xMM5Z+PTXfK+qFO+phkMeGOWc4WNz4xWTRvaosWAf0SrW/0SreG3aIk/omX+Fa3wn1it6QXROv4SDXiof6KnRVN9iSexwnyz+LP/YjgM81gI2xcZHC9/WZCgg27F1YJIWclYRlogrGUmcdiwwWJByYzDhpYtPi6UTI30Lg5cGXFzw5MNFk1qQ2YcXlgu4YHQmko5LboGvqmXGBKZf/ACzEE3kqeLkHAAS4dWbItCl8mSI+yKm4G10NQtxoOlRcNej7bPI2yJEf8HL8AMuo6nh9j+AsxF1/G0zLrGQYkvwDx0HVe7nDpsNNeMi7EG+d1pk+VrPV8ilpHXYnxaFf1eFdfMx7DqvDaTi6nAFziJU5ZfL1xMhRh10iS3H/VSwnhRnGR5X9jCvJiKUS6dl5oCUTe6eoiIQZjfl7hg4ZF0rHSiGau+saQMwuOHDV/03OgGCHImA7DDy7PCm6FnBcW2S9AevCeaKswzNqZuoc/k46mndx1GZ3EzsBc0ztvBeDYw2ZSgvSJPNNUyz9hQ3YK7i/miftN1FDqLh4G9VON9OxjPJiZTCdojeaKpjnnGhusW3nNrTLsBgZjFwF6IdmEzArF1Cdpr74zO1YD3MECL3x2BMd0GNMTsxVqabRE2oyG2KUF7453RuRrlPQzi+d3RwHNn7AYMxBwG1jJsW2EzBmK7JThy3hmdq0HvYYB2fncM8Nz/uQELMS8DaxHedr5uxkJsrwTt2Tuju2o081xdqNuhTVvHlmH8JSwBp4Xr2A80n9OEIryhS5sx/w5P0jIiDxwGm76OrXv6dOrrt3wWmAfLlNjVAsWhMsISl6vneop3DkvRtKzbFv5Zzo5FRZyGYVd/ZghCSzOiHXuP4hrSjtUt3rQVI0nR0TH30GnEsAMfOiu5FR8ZZGrWmpZVDldmDJdYydORY1w7VlYu+a2MPHOY+HvkK6RLXuJyl+RjBzvZxW5Z53DaPg3D8nHl6QlybRnbjjXOaeVUcaadBR93a48yKkipQvuojJoq0ByG5dvaNcQda3r1Cuug83PH0kW3348+/iQ99NIffenHxBgx8bs3eXHapcB2iWkXQ/j2Yk3y7cTDxldo1LfaQcdSqXBmhDb0RjKTerGTxQ0GzC0WFf0gucVQNrDYYWve5marIfShE23QINAE+rZ5J3N/df2YrslHpLCOzJps/oVWu+Z+9WquVt2To9eBmiCRp0XVlyatTHQW11KaIPqao1ez5v4HQGJLKjlNtidqzdvZXXwzo/6wlQtV83YFMvkD+0i9pomg6tKEFaUilY8C+ipQQWq+P7ChZj9KpZRVIF3byjalILwu7J820vbMji6WadcXuTbqB0Z3ryj1SCt6fXSuzOaSwryPUG/X7TCNy1sbceGWhfDIh/DKknc2xrzf/7R8kF8+ik6vz875Kq+9y8+/YcwLNiKZNi80WWdedGTGnDAOdo3+LaT8aDe9vYlVyB86m0UpIevibmgokgS/AhPvxkMuiC8ZAhBSdLAgSfCLT/Du/CLIv+siAMhDBwuSBL8WH+++n4L4yCIAb0IHC5IEvxAV745+DeJCpQBYBB0sSBL8Ojy82x+D+O8gAL0/BwuSBL8kId8enxHkbxgJAJnPwYIkoWL7dnbAFfjYXn93Zsh/CSgAEj0HC5KELTtIeupDVv3dL/T/WhDg1XjZocnQlw22Yqpx1R+XX2NH98t2w3ypH1QVGeNOMzXGCnnv6ytnnX+S5tjkBVcPh4hM5njobH5u7Z0fp2pT/l0RrS0zUjGZi0AhTYFeEkrbz3418Fpqp2T+UxCBs/kDVbu8HbvtFOFnabrYZKyBfRE91sy6pGP74DK8LRVCyO39VPSwa0os7zuDNdWemvv/zK4EoMa3SqUpgJ9C+WF6z6cVgQhweeamd3ZT2PGEVorWszRTPNz14vux1xSa9aCIDu2X652pruZHZiOobPOfLMsO5NPmrGiNw6pgfKEMm4KiIJTAnjsIwcR1gUMyXpx3BptfRQCp3vm7HFnDkVVMT/j4JnCpCO4JDT8rehHipT4tyYibEyn10EpUe1b3InBLGFogpOZgSegJasr62fj/z+6KR118n4maQD8duFFY/KweRSD2Kj0rzJsC5JUni10bqg/AZ3ZFRja+qThNIULWF8yT+uRZNgIMc/mYPtsU3OU8CTBZ12YAPqEraXFJybTWBJDi7Hzat+3bpu6mDX1gesZUNwWxQV8KmOrHr1QCKJ7Jnd+fJnDgCe6uEj+rVxGgkUtLNuimMCEHrf+2HxTfEAW4LR09oprCZ5svMSb1jlUuHpVxSId7sPv5QbHvvv8+eWstT3YyUpQvxvoF4WLdy7f6ala8N5ButNTc+2wOvGi+TPPUkTr2Q/67aDRBJpo/GnIJW3c7CMfWRgb4rK6sfsVX7KU5KH5BKyzvWUZTKGuCWXmm2BSUBKHsnXyUiQMJgMul5vF5UyiWc6VKYkOeB/isrpR3xXeJpjkQd7mie7SuuwR8VleMJ+MLhtMcSiehZZD174qvanOAlYvMR03B/MoXvq76NFh2HpCv8V2MbApvr77oqNRBKoCHZB3S8R5rgMrnCJxGbVMXaFEky8jSuybgXWanzj6yj0wZzzblatlZSdwUuNiglbv5rP4oCHnfpNQebArRvs58YrTqX8DXdMUszN3BHuuba1u6KGvXNnlSln7pnAfl5WGTEEbN51kW6RU+ErvCRyBX+MjbCh9xWuEjLSs4hWHF3/yjCQZm1GiB96UbFmM+C+U6IWOIa1qMxbn+whjonJr/Z4m379nVFvj7P57bIVv7VxqhuOaetsPCFsx7+JJ3MLTeoaMHgNpbsMgHnP2H+6veizDg9fuPfXOtj9nzkWWTdOWT2eRy/3g1kUl5DCE/hc3PlVdjbwT1OjHalcyfFBgSZUvvRQCGABHO5Oup/Y0dHieZ6T3kj53YnE/xe1uZodORmfpEEsJIqr/475dF3vrZTILw0WqmnJbYiK6Z3UJ1PPRcEXBOVE75bwMkDMk60a+QGOCDxzT5ZwObht069ZOMjY9z1QXOyWmHkz4Rju72IHVLLZioP4AsTu6KUsgF/ARopuMmD8Nts8a6kgi+yl8fG5COiRu5EhNgD6dGSXgBxrHtJVWrzZYhECfZA9MxGazCcivS2gfKfWcHSGLEXf6RcYIpEoWeKBoUL0SajFmCOC8HyV6Bf0j7iUd35Op8VSazv5bdE4ELTOJ8yYtPuKC91juwvGQ01FYiyXCYQjgcq7t6u112YH9XAH1C2AJfHU/I+0oM9EGk7FX/Gzo2udzDZfe9WnmqRvg2UT8ulOpqwzydyB2P7lPjGb8ZzshkvnyU2KLZvkrozQ45yHZN1O60zOzbxMqGoh8xj4qQKxclVnWf0etUJE6mXenoh2kgeDVjyVj28UBQ0ylVrDh7uHmNiRZAvXwgaR7FH85tj74G3c7ZBbRpw6IIigeNfk1paMh9CmjpabnnVTkV8r1s4mYn8QDcSpS8kdhgLFl96CQge9AKRHgPpB+OzQORfX+gPrAwHBxo0MqpGwOwymi7medh7lV/yq6sDhREdXzGTvdrwK3WyoE9DZmHw04ydS7G4jfLvnlehH+ao2R9xLJBeIYJLRhnOwckp50BreM+CKCOwG7cKL8uganLLnDoE8Ya+Kw+08hUTHoZWIg7/8amUiGeMhBgZXO3cI4w4DaYjs3u7TBpBtQ/Dy7aw2RnrpgOq1kOKq6SudKeEWFwG83KgJk/5ZmvzTzroL7V3fkU/m8uCq9vEzbYZ3xaUDksMV+aeNeVsgp0neanPynzudG8Ru7KzyDeWjWIJs8s0CdZNvBZfYGJgQIGixSZlD4BxqiExUYYJfsftjJ94WX7Z5syrZqj4lo3fH48NH4dU51A47SDnVYObMFcTXPNyy4WHAywDZgwHV7cQjGt5HSD2adM5gkZo2b7w1YkBBoHkKnVAKNhsWFXtMEVUOUOzicLdt1G6evZy58zG8bKBBe6HBBhEbo0RqexCf94P6+y8rer9hq9jILAcP5sYgqFi9GzeAEfIaKYqsIVShM1Pg7ZJrryN/0tf5u3y9/xd2/paWzHx8NNaCp9nm5CVtuf3jLjWufxLvxL/8q/3oEtPRZSrteFCq/V6H6Ta4jRuRbrDnFPJQBQ9jT2HOQe9OpyNkJzsrq/AaDcE6i8Uh8ZvYaVaGNzXSCxEm1srgckVqKNHfcOQGIl2thcCSRWoo3NVUBiJdrYXI3fUZfhUgs/YV3i1Ds4Qm9TK3+PAmG1EOrTTjV0iKp67jnzDq/hYhcdUzgQlUXNLhP57h/TNXHg7PFdJtGfb1x5vPRY0yCuZFnMqsL9QFZX1oM3QEGQqtAygtN8Pd5EZMSXGE4v/9WncgiCldMmv2z8z/8tz6L6u05GLN1TWJEVK91dzytCeFgmik7bfJ5dgIEENVd/xmfJJaMb2orMUgL4e04t2TYX+pMl7n/kc2cdWiK7cYXF4CY/du7RyaHhYn89Zq9CWMLCxu5YKRG63/887kGWruamKLq1VNCTQK/ZI4CX6av2DZsIFz50BoIBUj3DbzLtLL3bHUtKr0jpxkv7/Ue3apghbvzxkBPsAJlb6XNsLN3WikfHBtTp6nJ0bFPdBoxHx3bWaf5ydGx63TaNRxW+2iM4gnX0Nr5TQw97ol4xVt4b9su3ikZfh0vlDXvlsDOGt/E2ej2Oad4T6Ug3T/EqUo1LL6tGhVwyWVDVuBpZQNW4GmbQ7a/X/NqqUIhkskAyJ9ubQMGK5dwV2FyyzEpm8wo6paNykZeAS5JANo6d+M6/9SaTeX5WkdEvEvwlS75YTkmAj/5o6db1Rv3fiES4uHCqFB0aEsq7BQnk2PoRbL6mdsB0NyaUXAi/Adkq1cU7L7NcQSvA3MvjBaYsKSTepfO99mb2aqeW+RLvNnyKvpuLEYCUL/HC/ei9vcWja1K+oltPdZpkVvxq/ZWrvXbw4ot5Ra+DB7Duu1ZIa91GPgllPykqAtqDYDwtOhgIgvF9McJAKIwfixQGwmH8FOgeBuPXooaBwHGAxQ4DKxD0FQO/fT1H0FdA4PYSOOkDMVcLSFucRCnNMdOJIHb9zgletBBfYw7N4kJPdvMivQ+0PUfYNzOkCeLnwXlOMVgGGMn+9lkWCY9DfrabiN9IVKuzsQmOa68mZhPgSRdxDadnQXv52MrnJsD3XnEYzPomsPetBHACVL/GARJlnMC1aWWPE6C61hqwPFtBFNRnFvWcgLp1fVv4mOvnUI1q/SDedsO84MB3J/g7fondJpNNcv4VcwcQylPFFoih8gPVgt/h5cGfjZe0td311bDRyjY9lgw6VvHhWm2m+gtBZt1iwDYGlOMOqzSQVmZreU1a/bhmtcKi9HWgQkhooVfbev2mbFUtHGzHQVqLK8UGkr6ET19NLEJZvUlx/ZPaVBJKQvr6aiGqhQFtG/CX8gjuUZJwHkyBoGFlFd9Tq80gQ9Dw0gJqu1BpQ4EUm0i6IFeAw831oNkYpPkednSVZFUtbVmRQkbSrXoLIuF6ZEbzqqYuPIFNuhXvOrUUJnBJoigPgxTLTyJVEjXlSGJFrhV6viRJEH2jlwwKVvF1a7UZStCUaxWTtYJBhpxiFTu1gkOF/4K+W6R0khKeejDssjFI+Va6SlqQ5VvpZCSpogqa62wx1xZzLR9nlYJZhT1jsnsTKauYfQHf30ibIKQg16Br0LrkVgHH50qZhYNi7H5Z4kO3AK0OisDEDoo4QYjU3cGs5xXPlV7iRR9x/WuCd5t29pWNcOYwjEgm5rCQqTmsZGZumcrOTFcdsMtMuA476HT4NsIJK5ZbBP/X2/2SN53sTmpCCUsNeBYikU0MNPPNGSNmBwafdtm/+qsF+ASattaAJVfmOXqcbwzB/9O++Lljuk6648sgIl6DO3If8X5ZSCc5+VQ+tgtRUi/opcnhuqBQ8K0pDpO4xrFjDrRMT/9fd7W61GYa4fYsbpzUUUZomxt/Sy3HNxRLVlI6FDprorh0qGUcpaI66gs3gEqZ1IJybWQ2QPPXt/DyvdGNW+1oO/am6YHo1B50Ql06CcsJlt1U2/Wr+vnzLM6mvRg1+2Nxbduntv6OMw916Bx8IKZCiBAQch7sqEj6gJ2D/CydcZuiqJsqKIFhIGOTAxJbRJjISCE6Lx7og0WICDkjhlQkfcCObH528qahMygMBWUwjGRselhiqwhTualEHz8EcYAIASHnxpKKpA/Y6dLPsvFejKOOmYISGAYyNjkgsUWEh7/m/b7GXxxBDIgQEHKWTKlI+oAdhP0sKZy9oxwPKiiBYSBjkwMSW0XYgduB3zyCGBAhIOR82baIpA9Pqvp1lj4TeIakzlFQAjGQsckBia0i7PDt2JUUQQyIEBBy5oypSPqAHS/+XEm58Y6+aQUlMAxkbHJAYqsIO3gbdClL0MMiRIScNWsqkj5gJ6E/O5qwadoSaAVlMIxkbHpYYusHL+vrjY8Je1WUz7KuAM5bb/sKE0/lwrZ41bweCo7CpIWBgIGAASBDA55wWtv9bZKoiwg8EJOVfGCp+IaJSVCmTHrqjPr/G3XoCvrFl+iCQJLcfXHk/IAahaPCR5qPb8oGwJdmmB0A4EsrzEZgCx+gk9G9NeRRHp0IE8SLE01+1QlR526eS6VfosBOon+WUYzlEjsplZTARYrBDE4/WHrrB6yUAlpGtNUA3ciK3Hs7IZjPjxtfpqknxzikDA7u9dueeiK5nzbtTGxQ3z0b+vT8kzUlh5vVlG70zHk1Ne3seRWtDGrjtbOo7dqZ1NDMprZtZlSDseqoBiszxB/Kh7/dnl/vwK/tj4KYNIxej4aYNhfX0c/nyxZBW3E+d9s24lJoDP4HTEzbYcMkf+9p/Z1P4zOLjd9UE7ruWe9OkX3ZetUqD9trQff/77c9Y4/389guSKrfV4G56+4S64/nkJR7cCmoLxm0+44p5CGTpU3S6i833Llf6MYXf/KUFGTGK50m8IJEePbJ53R+yyude/QcW5bs0SNpQc+xTf5PCxnJxj0XWE+wvAdQmLUKc1DuQN3aTCW7jm+Z8gFEqZxbxo8pq6fMGWNBT60WK0H0eUTlEuq5dNod6HPO6hYWBWSsuRzS6MBWqOdNS3sVAXMQTN2jF/TBYmWIP+fBXEg9dZpE+93snfYW6uborb0UYnBL1A+W/CICKT8TuOsv6APEShF/sZuonHoG5Z/pLZjzKaEYF1upwRxS6PDWqB9MgtJZ28UxlWaNON4yyFkUYgVEXgw2LpieNrF3uZily8GAjI1obWWRMYezPDlFQpKLCFgSFuo0x6APFitB9EVo4RLqufIg0H6Yvfo4l8gWQ82lEANboZ43Le2ls+qgnV6gjM7wvWLGvGzGjNUc/S+TtbE/mPANxiFvfMxNcefbuHiw/d8TCDxvmr9YztTu/WV7E0iRYZkdJ8tvQNaKxGUT4b3SUsZQ/6EGMWU2eSs1RF06GS6VfqkSexaFxfBo9q49JaqpDDLm+FbHudFvT1V0yzgWSpH49zfIA8QKiLwsi1wwPT1ijwIyy0eUCd3V72kri/w4nOXJB0hyEQHL7EU90hr0wWIFRF3ULy6Vnh/xl5D6WRL4nGlfM9RUFulxMKvTv1t6y+huQTv0VshFzkHPlF3d9hzyUPD6bvLruZZ3gR5r0tPRmmjg+s8i/wZsy8bUcistn0VbmifXf7Yfmnq2fZIsblXCfCB7r+bHo/ABR+MDHzmu25ggV8xUmefkRcJv/4tNWUXGpwjplqdoTLPMbofyTKj3SsvYSp09HcQE2+Ra6hB16Vy5VPolXOyfBRaDsJaOgvSjqQRy53BWp1/N+y9K8B5ehCXzpI7KDvpgsQLCL9MnE09PkqQfCZj9ITj49jXT1loKeXJUC9QTpiW8im6RIiUDBpeCB32AWAGRlyqYC6anSvwl+X/Wu/u8LVxdpq0cEuVwlienSEhyBYGX0RddSiDkAWIliL5wv1xCPVceBNoPs0+lxScNcq3mUoiBrVDPm5b2KrobKCntPrqOQMgDxMoQfyn5uZB66jSJ9rvZ69spC84uCO2lEENbonyA5BcRSHWYoCcHhDxArIC0VKAJE1tPqI19msPs28LBiBFWaTWFtBqMheqJ1gSqnSes2m1nHb28uSH2/2ES9aX7Fl/2fiFeOBVANqoGhUur51veKZesxnPIEWUF2prNIuuOb55ysgU5ygf8rqH/aO3QgyDlVDcTp+/c2XHaBxvTPeD4MQ4XXf4Xu7yy0qFSsgnISKvu7qLnK7x+wIhvg4Q8QKwU8VcrGJNTv2jLO3ajxXhQ8vjtQtdgAtl1eGvUL8maBFX07HOkcm/QiTtCHiBWQMhVgwMibeyKgBv6rrsZMsrB2y+flrLIlANZnJ4ULbG1k52aI6uAJe5eIKGnxnbHBonY63GpXUI9X2IXQbIo9rOO4jgF6DCLxDmuPcp5FNJeSk9tTOpNDb1EJeQBYgWEX+NqTDw9fdIO4maGw969BcZayyJzjmqB+ndLeOnkZ+7I6kqMe9FK6Gmz3X9XIiV1LdYotp5UeefBstiA8vOyPV36TSHBRmer/YnXBKqiTDjQKfckq52CahjtG+rWOiFnZYjahfgrIRRkHoSSF9mi5OSxrVm3KdwGZqf930GaUrrigNREKvHYn9DzLsTtQPh1mQoCb5B0b5Rs/3OR0ys4vD2N9JrDXVQ22v8dRCklYK0yMncvCj3TWqSeu660323Fe5eVge45BbJtDOD6io2HED0lkTnHt7n+JGmprqL1pGDd7TncBCjkXOl2VqBISC3weYXXEyv/3LTE2pCiDj/0szSeQtaN0Xr70zIXq3RKSnRE/ebOSQayGbROQG8cHnAUcuLmpwBIRaWL+sTWUzbX9No0cPYdRkGbFP6Mzmr7UzUXqH4eLssrTBjdNSq2RspwCm6EX/vCIPZmg8lnWMSiEjOmraSm04nQrLY/QKBSAlmqOgkyDbxtjtim2Q21Qs/U/ATacWOt7nDgSAx81HHAxd7sNcin+/SZzOzmhHV1skPPGeTp6Gy2P7hAVfTwXFLjmODLUqEPECsgFfWUSUXV0y3vB2seGr+rv7Cnr6PFHJJsRBbZn1hNiCrKNxXWUjVxEq+QB4gVEHvlVjPZ9OxJuiClJRAvmC08MxrLIXGOb339mdJSXUZZ5sWayfe641joubOTg5BFMuo83y+8nm75JwUx1ixfyKn3Dj/dp5GFA7Tj/jRNxKqoawp27ne4O0ZcyAGxIlJQ6bJcQj3zXhfI3hdxVHshz65ZmkslyY5vhf2Z1NJePzm7oO2D4PfguRCHTj5FFzlpdgT/uaDn37bODG01TdHxHEbcYwc55OWobdq4W2it5fNkDKz20x2eChdyHnf7S1zkpCLVvfLruRtFPGB10jYAdRUbaj2JrB2kBffnay5ZFT0HJLYEBvExvpAHiBWQhBbEYELqaZf2cmGLGOaDMJ3Yo70MsmwsltifSi35VbSUi+3ZQPyyL+T0CbECctAIDlxCPXceBNpvF/EmOrmlF6LmMoiYrND/bvZVSyu32ZH75I+jvYLF6sKhHhUbYGM0w8YbBCbhtsB7xb2v1Dpkdc/re7WXS+6MyRINfhsrJZD2TfJ6j2OoCRVOChB6gylxwfQ8im4OrGvNtY6l07ZVmEFWHd8c+5OpJbl+1lHDmg3F5SySoSZRv9NKRng1Wd+fbN1ngJ55ec8Et1rHcMeytkYoPoPUG6UR96doJlopZZ8DG2aB+EBjyCm6yeMaI/IWXeCC6dkW+5unRbRH26zRC9ZWBnl1eMvrz5eW5DJ6ijJsqCqXt3KGnjD9ftMZmWn5Kt/5oGfb5s/qkqwJYkEPB8+ygSzScOD2bKwtstQquq/sPTK57yPmf99srfFK0UhK23v5z5TNsrnJffi5gGHYmx9T2kIGWTt+uzYK11tsLbH66/x7e4W9bnfyDD3n81NyTxETdZjMMT0eBx97QJrH82GLzD4h6h6rjqhQR1nkag4JpP3ATbs/06OEtUTujwncba/He1RjQ7Rup+E2fOf3Lt9H5nETfIsMTr6v2rJqJhFsD4WnkLjjNN7+TG0i1RJHNzXKj5SKee+dBZa8/U48K7ps3X3If/PCe1WtWdRxqe2BJ23ySKzjm2KVlTZR92BMmA1ZbYwkiD6TIL9z2So6YFyamIsACBM9q2fVVwIRvilWa1C88JpMShCSRH6nx1V0wHhoylxcTQLvKTqhvhKI8E2xWgP4YeVD3ycISSq/M+4qOmA8NnUunLaizSE3Ul8JRPimWK0B/Ljyqe8ThCST30l8FRy68Z1Nm4sUsnPodnuqrwQifFOs1NDedzLb500Qklx+5wVWcOjGXzV9LuTMdAcjwFJfCUT4plipob2/4jc3nvehD4vJFpGXwrfENtXzT7OjnRdeLyc2UzWEM26QbJuSSLnh266wTl2s2qkuguxTckOtSnSnnpJnN7QoYyMbtIlhpRdeeFzzT2Gl7Qc2vGShrn+mjjd8i3VUJTWFq9wgWXs+VYpcuD8VCvPHYJbv1fyAN7ssmSn/7im//05wzrYq9CbR30x9zCF1XeZ5vNPzPdcaSEaUT1slIT4Vo9zAfNrfsRRoqiPrXrnzN4Jh0LkX4C6ScBw9yqFhkDPaudsOf06W1/q+2v/Tefyfley0CVZ2tUmpeSqYksxX+ZAT1TGKmr+qQz2jqvmsOtgzsprfquAJar6rgifo+a8c6hlVzYfVwdCFPzn5mUxqVJt0nLZwtCYGItChnOPd4/2FwMPKqwYOVq4aOGIlEIxWnjXIIJnGGFY1OZWXc4N0r6va0D53l8xoRlU2VwjKmoMYCm9Td1HimP/oNbl3wreKvT5MeaEiHIh5gN/KJyWZ6QUT3yuPdP9fNdN9i2o9tMFRK714EZkLMd5LctSEuic5xnpU9fyqB48RRIAZEBFgJogIMFNEBJgZItqBRSVPsdJtBmej6hUxgCEYCrChHBarG24Hu+GWPyJc4KpmxDimCdZ2BbqOSxjFMh2722PPJh5Q4PN+ZlfGAak+MuIDX/BV2fQD8/r3yN8X6+9Ko384737FHgA/LYqoK/+WG9gDYKZEEEXl3+oD0KO0eN/t/ORnxBd8VTadvhHA/7Gv2lmY6n8Pzt4KGsmyXZDI8ptFI3afSWvJEcuK7Gmfje8xK/9LM9lO5f/qjG4wjJ3HkZkwY9zxbFA1KoN9PLMkmcdiQ7qXWrOqnL26YlmoGsRy0FZkpVQHDFDgAIBaImJxphDoB/FV5XcdL2MmtEYih7Ub07JyyLIgSb7UKjQEu1A1hGXgsEgsi/VYkbDaWiR21FIiVs6UBHoivqn8rdNlmQkpedmxsxHTsnJIdYmRApMkX2oVGoJdqPbD/IMWWSyVFajKWvz/AsuVn19wir+Bd5uEZsaK652XkhnLSw5Vzh2Vw6muMVpgsuTLrTpDyItVI7gGdossmaObPGOshPnhLR9df07E93Y+vtblss1USAbtOOmKqVk55LIxVbnIMPhyq9Bu4S5W++JP1gQEFsys0tQYQHurxK5IiTXSRAPZ1817YVhlKapG04u6vNP7F3C1vndiy4ij4jVQrex06gHg7i73ZQOx6WeCdm8c+yGFt8phY8JFkGXxIHMfFlkM9VY97Wx5+kxITt4vIt8nRoAeIt/Zg854soj0EA3KXcsSh+Q+up7JdeIUwfa8M/7VGspX35Jqjf6EcsNyJFGf66FMQqM8Trr2LbXWCPUN//DRP6Sc3oXXGtsElG6YRtr8OqZMeWk1eBgWQhAh3Y+m2m8Q/d0tWIT/vX0mvqf8Yr63kT+z3tJ1xOqcNDMErIlksTy/rO8AtaJQPvkFfsx+yTeJzafP9dLlSlPa/Eq8I9R6CELXShUH45BjWe5FplHrSCD9m6ZSAdDTwdmzinq9hjP0Ky9B/T9WdI5cT4PT2JCNGk+/n8BCkwxOB4rPLYFStF6WBU83BOVwnFyXjcSKHzB/P8qQsTklHhziMVYxPAHW670EstGnB6yK7QlfSlUIpphlkuNAfHynpkQx24wjHooG8oARFafSeR1LvnUUM8kMGHvilXfgPii7YhPEeoM93X0he+Dmhm/8XC3gPSoXZ9Msi92JPNG9PEHfDRgVLrcbGDtia2sgD7GYgVNvnsWQqBeTRia+EHgaxEM7V8wxsyJ+dPNc7B3Y5ixyczmCnJCwuvvXyS02Lsd93cDF1H47yaKJsKBh61cxZjOQh3Omyib0CMP0WdyQ6riYzQlL8WyCv0QcmIy67QyIjXr43qPyYp928mU3Y5b/ZKvXga/NJDnnjLb3oG/g8VXwXWRUBZ/PyomUJtHnVuqXmvMFczlES+Upl/fD5ORkSFEW08+n3vj9hhGXXY2YiVp5RGQwj0VYzDHr8ZguSGVyfCHGSTIjUBFQLLY8Yv8aXxYvDykXEbLrylGHlYA4uq0ndxp4fhMvDXrSSs0P1g9tyZdoSxA+glKLdok40xfA8b+aH8sty+sT6RJJUgHyxevnpG5fuOcYQxdu3jSXjpGv05b1wsJLgzTEql1qmWvTVukvqXZKXUN450KVlipj6rYsL23CdtoJu2lvE6DcBfW7DQit7YxH5Qq7TvN+UdMbE+q3nPz5Fl4JdeOux/FS6kwbp0xPm8LE4lJd8LCMDLCMDLGMjLDGhvukrtisraYeFVu1BztsBiy5VPjNCgDQ9bnURky1zDIjHkTrCbofItG6axKDQQ65axEnx1G5ZBOLwYqJBoxIyvMbWPUmKnIG8jTz2j88xTdBYT6Qp11c3gHVWlKYQb5YrJakZuAP1V7/2eTQJMsHKxL7DaPpsy1T0tDzhwvjGduoXcTJf+ZKJL9JcB2djSIIUmg2bSo4DJf0BYcNg+2GbTftDBYWwuReE7vdzK9R/oP/GcyznCJuTBxHciXIxnHcNecKwDFWheVqk2xs2TXHvc5JnBDJYGA6p5dMJPEyrAIRcRuKhxZ8GXEbLS/Pnx/RHvwrp1dZCG09T7FTvzkSWiF0nI0bEOH0vDYjK5+qYt59A3+U7PjWST+1qWUiLX4wIup5MdTH6X9D0Fxz3oTUhFjlxMEkR5WxDvltQTYO48asP2BTGKXRqlQx797FaEByPUt/cQ6zwcdEzS03rmayS7XVocdqNhhqr2b9cH2lWb+LcObLlUO8SkdqHRJZQwu3J4DldiRUMcLXMCnwEblAfXRIaB3VCzJ8WLNTYcgxcnkZm5GVW1VxnawS7LzE0wh2bXmG9qzzv6b7gd77L7IdOaPUbyAvO4t2SESeI+AYyMt1/SRZDSb3xRmIOMsERc6zVSKjs3L6IraoYdX/7PdE+IZSl5fd9KyOatCnbpsaTL8JjE4m2mhVqrg5dM+dlQcdgVdlnIS3WBBg8hJNMwiWZB3Rr50qhru19fzETkeaP9n5cJITHwXG2pNT3w1tLVEnk3ZACcOTSbVxiaZUf4Rpwne+10nuFG48jQlkU2k7eThFRHWEjYN2eu1lgoMScsuvjrTclTPZhNbgwlmUk/qvOVzf1SVHlBot0LgeRLQ0ay0aOXanOSVogNujZA9w4YwUc/9KVF5HieqpJbWL5hUJIKn3mlvoq+6b6PYazFuOPiouX7i9DeathvFJmrIxtLUxZlJL/aiNyHX1Bd4yzW6tj4eT2278ECeujF1hq8nIyjUGcWNWR2snyNMjVmcur/famBLTx5NJFopqI9sqgMbl/tar+ufbRt0KEzuADvxjVuWpRtwqlVGwhBQJA+u1F89LtTFJOoC3O6obVPfGt7dCuf0mGTwTqc19rfeA4qp8E1SV+pwiaDXExG0zeeTHSEDpsnItDKK5Iu+esto7l2yWaGkWa+Ncn51GK1byxqm2/fIfIMWa/PlAjrL8IfqKTnm07c06GYymQES9PiSj0RiUeiE3WoAKcb1JdkYrkNsQ7ZIbHUC1TpLr0Q1IrUku0S04BcxlgLGLkTxhjQiCR1dQXMwwg7HK4BJJohZNoGSdMZfhikEZiFZye+YnETrQ2OBDPde7yChHeU92fVDaN+JtdrVprNps9d5oQyw214JCbYjF5hoo1IZY7E2ttdZaa62NMcYYY4yx1lprrbX2dVChNsRiRfjtHgCwQm2IxXYrKPz55SDMPxX+ICqaNvX18DQ0Yizyf7+PIuz6ypgYCqQvdFfwscsjcW+U4331MhtD3JAFL2jIOz1p0xASzIppfaOLQPn+dA55uoS2IbXl3V8dYJQO2X/i+1Nl+AJztX+LLpyoG0qob3TFV4Gf/vMC2lRAmw5oMwFtZ0DbFdBmHW23o+1xtL0bYZl7yBYYwwtGyjSGFxop6zC86OASkuSSWqax+VfIUVNhzNALd4blu3DBQ+49b788Ctz3CDls93r6t+sCkSkmUdeSlMfwPoiAIYhcNYEkO9NwKU/lfBCBgxE5mUxrZxou5SF9DyJgWCJXnSDJzjRcyjO7HkTAAEWuikGSnWm4lEf4PIjAoYr87Ojz21HDpTzR40EECFpk/yfll+tMw6U84N9BRAS+yEdmzjRcyvO+HUQESIxcgGmOZMlMsh5gqpYS4DPyKlxqZfcDDeX7IyLCaEl+8ifenG2Oxf/BtHrQVRrlTnIy2aad3v7Kog5N3EOUwvy36ayzCdnUXqAIo9kzpEWxjJxMAHTO3YhZ1KF5KZDUKJeQ8k509Xx+4kNa02qiDDDORrN6FQ9eujo36jpcN6HEMk4CuDDKccVG6whJ604vAW371n6X0A+OwR9AnzviiVLXvV4F7PZX70c/RcLlZALw4WwbLsrQzWZIJ46rpg6cnbBN7RXqMEsdS16cab5HBPb58Z7WXTYKb/v3ne9nDcVIHcw84a/GsYh81WG4p45UnEdAnQI84XsqNYowhAFbHUiAnp9TO6FbaRVKf6gkgDgYnUKJwJ7wTVy7p9w2aSUD54dSsr0n/IXWC+TedilDURQ+zsmEIsO8rd9FHdpihyjFkT7UWeIT/iqUGllPFMeWg/NvqkMdKGzXeonE/7ZbQw4IN5/khFCubJlJjQr04MiWBvKAqaNPKHT/eoHE56pmyEFh5dSxIRS6Y5cV0u+ps6UKhVZQp9lQ+NZJiQpMvMRUBnNjKs9QHZfpLBpKHcZa6kmEuSDsL8u7ivu58/mJX1m+VhOGV/MTx+6VnyFz3eF0ELb//NO9O06efqIRheuoriOfJeh8pq8zAJ6nk/tE4dsqZSrQkRdXXZjf1k92xkJn/4exz240bf+m/v79gGnyZwqcjywXp2c9cTulJM6pJ/dBRYe5UcSsOnRT25GKA+ypk+go9HU31Mi9LfK2KBhyT1mHRxU6LpBSgcGdOtpwqid1WiGFvvCGGhWY5rQtDaRVVe/IMa7EQqlhHXWYwIutF8YTU4IWKXxPz+cnPl8orSbKCe1svKpXOliXUoT2P/kKoxyQziXg9FHntFLURx0a2uXJDQNC+hVUWSq/mV6EgdY7CgPQej4VfsB7Pj/rSZFqKWG4NJdGfRUbtuHEqENTNyVxmRIn5ZLs5Mm/mLF8APmO7mgxxTjlAIKumCEaQNAV8/gCCLpitlUAQVa3ZQkQHyYdEkBqTlUDUJfq0P7tHz6dgbzuIifToaVTuTJTPPkPT5qTV5jQ6uQWiKtfCMWT/KCF5AZDT35hPZwP5PyHgyE3yH7y94uupqPt9w9vULfIlpfInDg3IIi6xfZXEBeifA6f5Vw3Z9tm7zcs/Sth1XQJHPoaB82oXOndRgDeoujzm+UTpWrYR5DEzMECTddS64wtHoxhaao5in6+qKCRFFo0PZAcQXwDKB/pDARAa7byk7kCVvMFM6OjAXJahVM70mi90jWK1lCOtYiYnhJekwVraYFZzmttgUbJqMbQ6D3OWErmtXVDwDNKFigDs9BjTueWeNUQGtUGF7VL8/KhaVTbGUKi10KIGiUbW4HF8GFCUW0zpmur3yCs4R5Gn6vlHUKzvlmJe+SqZR3Gq9aGXdEc0O4WyjwoNgO2AhvG3ByxtWlgjRqcR03EIJMv8AuTwE/DuALiljjYGiVi4BXIOJ0IFFKuM4+C1aiTgHOFZeo2vEZTlgP6CLBGDytGLVb6AZFnTa+y7F2qyeTA1qiydQFYDeuwItWEYoeBHGrRPvtKTtSnR3OLoKNdMoePDaZGtyf2AxAjqYDPmIXOjaSJXhF3Y6V79BsUuiWegrRRv6mYW+Jp4Tb6nKN7dspXxd2SnJ9T6Bcp/sUMH+pGy1nLO6R+eHMYvv7ob4Hnwt6omsvE9gJwtAz+8YE7LuIHCkuldNcKmD7Ub7Hnwd/oPXuv0k+475aHIG+U3mcBWBwfVrzVNvf4uVbr9wxpUPuO2/aNW+X5QDgq9YLVOXnIJ3UhzAHG0TyilwmGcj5GbaMrQB4LlzcIwOLT//x+w1qrzRxW7+WW6v7M5HE+VDDWenmIU/Zo5Xdnr0y7xocUM0Izi9j0hJY+P7EKS73OpbJqG4wF+CGjXfjfAtT33J+FWBATsfxGb/M7N81HUt+Y9ZBWEDKnwUv6YETIjnreK9EIbbZwSsrD4iHagJQfoqP1UtL7Npp/M4FyNFJUuy8hr2IxoX4ULjO2jXdfci5fwVXWL9ZVqRgc6Dy2FLCeGHlfNPtDrSSqYR8J26NKvJZjWCIVUCkVcbiTSKUUJU1FKtn2uiKRcbWiUDR2kch4piOR7cBEl4xnKxIFNV7591JAH4WGgYaBK7zd43rUGnSmy2xzQ7+NW/Fb8RPUvJZYbDdCoTbEYrs1FGpDLLbbQKE2xGK7CQq1IRbbzVCoDbHYboFCLW/Y9zis5C+VBW/zCKQa2trKnTOTv/LsayhYfk8V+co1I26KSfFFrTXuliCxw5Z4sC6FBpa5MViTAKcmL6Bo6t4qq+iSenGMiBAGdOFWs8KAd5OAZyb4XHz2Ilum/Ci6iY/NeOjBwBlH649QWRU3uQt8ZNKYkUnoMewC8ZicVC+ardoOY5daGkcujskNtptg9PgYkSxhEMhpVupwCQ1rnSqn+L+yut8YQN1NgjR4hCXJ4ul5hKnRq/si1q/mtaGgtUn3aXq7CTtZOSUEyjYRn2o5S7xkUQSrZQ/UbRIOJctdK+ZtUtzolR/PEoov+/x4t6kzQLdpt2PbJjfJmzdjPuHYqvkKaHzmLqt9vxFRN2UpPcoC0Ww6i6qbJLoUjieLij6FWLjrh9VN/J+FiK+bhF7zmwNqN+UA2U3CLcLNNOg6M0yqvZkdguRNmpPIojW4J1ea0q+rPczyMoQhjrgMUXtZ/DC/ibPDr8wSbbvwfpMY9KTBix8JOIkjGswonb3AOMFJhhBSBgEHJ9GUIYded3Poq5FE/7KSwYCGH05KSw0KfGZOsj3L+ipsyUDhzoBfnCTqvUMjGicxd0eefjM7S6QZVqpeqPpREWRH0JSTaOpIURtJ5Cg7iSRXHIw5STzn1u3fQzYnHWvlB3JOEu2I3vN8tg3oOcnaxbnsDTM0nnzPiRGd3P5KTFk8LVT7aBG3UHi591ypX4mWWEZfU9OAqQTDGfNUk79gwALmf6a/njjmpWdX6dFVOYoAjMMTuTgM5VPQT0M76775zNOGf4baGqxDwYV8XYSO9tTPBLZtiHl3Ik3DNbubgNBONHYBpNz5xj4kpNLldSf1t68Vns/i/rtuAQBcbrOCi8Ao8s9alur52FJ/FlfNetKz+dvSsAysyn5rh8IPbskqiyte9x/nrkODPBs+nXMPlLyE/D24Lf+LiFqpL9mBgWGi3UT5GidvYjb6fsLg449xUFr1TxFS99Ol73fsTe55L2jWGn1wZX4uVqrsLRTN/mox/CUj466b1g4t3o2tfaxbexHs+Gxa1msxthhbF30Ghod2H+VrFDooLXOvrLDp8WxTWSMfzT6GTzM+rR1avAd5Xg+IdR/Zn140z4WLY9QsX8gWQIixpdFnYHho91G+RqGD0jL3en/7CM5xi71e/lZHs4/h04xPa4cW8sYkKc125mU7Ptuf9YvXYgAytjT6DAwP7T7K1yh0UFrmXvma5tkXodRr5G9dNPsYPs34tHZo8W4cn5NzjrwVOz5jpPVaHEnG1kWfgeGh3Uf5GoUOSsvcK9lNTNu2ydbIR7OP4dOMT2uHFu+BwpMo5XSKdlzk4CX+jOu7/tGP/s+dJ8aWRp+B4aHdR/kahQ5Ky9zrPeMs3xmvc738rY5mH8OnGZ/WDi3kAwNOqekqcXye1d/H+LT78senLY0+A8NFu4/yNQodlJa5V9KcPk/o7Ddr5G9dNPsYPs34tHZo8W7Em1lM45h3ejHMFy4RZ7N8IVuUbcaWRp+B4aHdR/naO6ry2MZadrz3v9AgKzfUtWL+dkezj+Ej46PKNAodBrEs9G5E3TLNEZ20ZJ/xVT53/N17fBzjhfPr+IqK+ceRIGnkAYM9LLr+eUUNvJ/x2/ldv2J4FaleXT8Ty7VVw3o99g87z27EyMgMXznhj8jytb9e1q2dQXGu2FNWzkz4i83tE4j3n+/RYNTBxxe4lRTBEjYwJX9dhQBkMG/yZpn2i7cK/oX1oFjNh4ZHsZWEKvZySUUt9Q8uBFeaC0DWTZT08ieHGe2TF1VmUG9i14iFTPUPLnjKmkt9S6F8ZOYwOzElgDEG0cReHlIhXf3WhUY5B8MAJtIHANejZx54lvgEqdj7g1QO+pQBaWKmLJJGNvmsAk4Y7mjw6acdJoq/P+pRIW1FNp4VOV28VSBhSnIaBTkYMYKtwvgMF+m/MgdHF3zwZPfJW5MqbX4wDzWvFJiONfj7K3fde6VM9dN0Aa8dsnizbJSPwtR1jxIfXA8red5/D1/O9vD/7wqjn64ba7IlBLrwYB5imgbbu3l52Er8fri1583hdfYr/ZOHRU/b1hVHewFZQlurb0ODNT8JPnNaIYTQDxfEpy1iNLzQXpApWOf4npAGKylG7Ppvr34R/SxdkNfOxcmShfHxk3kaH/Q46y2aKA3hr9htUjUs+pm6KddAUAlehvTpJssxWTtqXjn18+aL2PV7r/Ya/fBysU3ZoOxZMj7eWTPY4mbwCh/w02eGhsYlIH3n4qbrkMOZ2VRpJ5mKn7VnlyDNShKTu1Ksp0P/5CIpuIaxsxfnwwvTs2eDSTnhrMQ/DPicKoDSP7p40rlb6oOA9fLI9PJ5T62Zq1V0+wn2lSZoC6B7F+2lhImxtdDmpyw84KECGkx9vpnknq+p0jH9cKFqXBltkZAp6+WJefPrxwMEe3aD4nJXjhUP6Z9cSDW34zRk5cn5cIWYw3MWr07PRlx2vDxve/2G9Cdy5Oo914xrYb9D5I4I1uDtir+8OO0RsocvAMakhqiD/QHOLIQ9AqG20t9tM+V5gwvbrHPcNEEdvAnIReV2r00aF+/Cux5vjb6nkvcGj2sVrMihzVH1OiVmkAx+vm5xsOdD/+N2zDzMF/UCICzBDOXZMl8Q2lR7bS7oGgxu//H+XgFPH+AUlUlQ93hnSduvGu2hOK4vWvA2YDPLPb+mWmP1wwXBWpsUoYEyZb08M7csTGBFajwOPt3FPm+H/9cIGf1kXVC6LuuAnov4/VmOktmitOvoHMchIrHbJdVHrB9uWjRhKWkHZ8r69C4DarlXuVOvv+Q2m/kM97HSXf1E3RgeCiW07YDzOZlX73zbMNPd4L/rq11/NnuVW+sfXOTJM17kug/Gxy+Q5LL2PHHtfT+k8OvNJnm+IRvi0tUnLzOug4cGKVgSM8Izovjrux5/YA17j6cHH7+Aq2Aiy1nGWLBKxW8y2Pwhdj2xAnj9cHHS65B3S1aalI+LqfUcWOs7j33Az1jQFJyLODHRd2A8zTlwmSrtKGsWN1oNjttHNr2iD/cSq/7WDzcHSevcdwtXopzP5c/kwq67sb0O/++jMgf3r/fvudmRZg4ObhQhqWQz1lF+LjlgQMh1wnpS1Pwpds1YNbx+uDghJesbZdBSPipTOTPZDsfPPGi4JINVrFlfP+AzAHcHM6hkSfloIFfevhQojHpbo/B5Ni19Qa6q6kSZU2VcB3EBefXi+UOObsXPix5/IQ9EIG0l24Q0HozcspXbAZxo1ve8/G0qXn/Uwnk27e3xv/xIWhFMQ/ACWPGHR7iP/HE7xJSXCyTd0fKoEpVKEF5oWrnKVC3XWM6CST0n6Wu/O77s7Sb8/riGE7c93+IBEXZQFarFuyyapbRO6uvjAIjatiHBirVZzMPOH3PnPWfWgQKM/Lyne7P8QKAdCDcw9oEq8pXCPjxB5azaT5vlDErzSlS49S3deYNdwwrbTAVo3os7RvRfstvJDzy7+Ezd+OQsm5rmFvXphTGGRufbgTn6+Uz25vkxebtwdHMOh55MQWFhH54hMo0Ie0yzu7S5RMRZio1oGo9EZcMrA0/xKInKISgV9hIZDWsYj+u2OuBT098bn2+3PgbA+MNN3D612R1tbdjekJnNq4zPJqxy0BIZFEIbCFMfEhHrI0FLiFeSiFAuXsrWPUqaSp/C5VjbzRx+nUQPu1y/OFt84+ZQp7xCOLaw8QcZkbMj+eh1lICWqBgEUU+q0VbuKHGNEnOv4igDE7mODD+na6KMKocVtfCOx1mW2YJkt8zP6GDxmbqxOQVIcKJB0KcrPHbXghUXS5Unl3jMuCOOSQVJmr453QccC7Z5yo9D6/xkHxbfuBlrGdGcnivo0xs8zgkqu7nwaiQeTyPXcjTlJr8MSZKDljtcuUp8lvt3uk84tQNZulFbx0BWq46ArwGZ2nMlNsbZp1S+RMZ8QWULjxiJyejxg20JXiQmxQa0EoNFyCqc22ciPMTmEba+071FfpYnXcjVy644QrPkuLAPL8zD84Bx5VY2ctFEL1mu9J8tPtzcDAvt3Vwu7LAqTXeot3bn3u9tZfqH8wOu3NRFK/VwZUbYDTDRPVMYh3NjXRzlgZJsC/GE2B5FmEeBnyC1LBL5d4d0MUrsZt4stM/Rv8BFJzS4YrgiJC4m6VD2zJBITJ7fWysoSkZicnhtOUmNDmm+mMabpnv29Hj+XWcedg+Anm7c1BYd4Tl3OtewnvDoCJRZOfWkTLjEA5n6ZjYQlcSldPrdzoFWEpe3gzc4NyqQ5stRjK5Tq3Nd25Tu7Ts/FavF792YGTJZcJ9ONerjYcqTgdRSJ8MTwofZH4dNA8AbcXFnnSCc3cURdhbTqjzstTb4+B3Y1kVaTWl3LpZ6YnwPUeOCHGbdBlyxj+hP8tfrBtAXN92xQFN02+Ya9nLzaY2NsrPtCcVaN1hPC9pLN3AUnhhJX2nmfa8CiwLeNsu31CmtXAYaiyF7T9bSFUUgczpjZxTYiZDIbKis2uOUTiKihwq8NA28ZKhExLageOqwMUlI4lLMojqXhEPRRUkYSHnNaO1Xc0lLcBh5/kh2q/zcGhd/cMPrFIVZDJpp0KdXH53lIqN7JulrsmjQoT9twOMXN1BkAlFDk1zjXoD1nuXsJt3LyPs12fvn5TNpXHyebs6mR3RWTrmQL8ScOt4WNih2I89/yW4P+QlDLv7oxqSk1WAvFrGePtyxkO5/kosuTfNIKqK8X7f8TwS3clqbRCZlI2zN5EONiIGhHXu7xinT1NByPbCHDYL9LzOQ4BN8FCNQA5k6E2HAUyd3E6M6F2gBVeeNj1Y9YpXI1aMxlMAGtH+RGjuANUIbGvwx+NNz3KVjwL01jcI4t5bZyKv8C99JNASOfw6MJN2aKFZLR17KW9FWKEnP3WWnUIFCKZKSUyQNChRKIVzxvFM2QaEyiFCnl1IIjQhZadsbYzJQKn/nIQLYxAAfDUi/2cROoidr7BsgdPYERNvrQ2/7eND36BEKHXnn28B6sWg+iNvHjk+D/h5dmepH1VFrln5M+fZQ27CIGKT1PRa0sFglBIqSYzc3hPFHoeJVDg5Zakih0uwMR1bgQ6G0itfHSQvzePcKpYu9RKdiehRKeq9s6h2CUSjB2+pwlKClkJlZaXpbuk0hc/dmZA2LjkLk4UO6JkEgChGUPsBUcBLqyyLCGmTsFsX/ponT96Nyx7HULkEWmnDkIxA3brqSrvBM0P91FWcbN5a7Qmc10Og8jsywHyWm335MmPIfAQ6Fem4DLhIjtx3MrLQL6D+po6F6ei19aW4PF/vTmmRs2goeOXimTy/OUmTiTccTVdJTZPoBKxtRvlVkyvvJgrayKB6iucfW1jPLiRQP6hrHlRR2xeU95bDn1Y17UyguECMeBv6kFQ8HyTB4MzwlRITX3wAVVmTiaEE9RMasyLicc+eZtCgpFvpm6E2zYkKyjYjYXqS4RHrbMFHWKC7xEp9TXqspMmeVleEBk4rMe+7vEs+XFRfzm6CRBjXF5REuk1+ZiyIi7Scx+A7KfDuRbGQZoQJVnOhIwRuBqVCcYLxjrI84lKjY9LZX8Kni5G3JkCdipSiN48oNWjoqQjm9mvg8y8xfDauf0jx0i60Ikb/kuDK4Me96CprS9llGxUcuo9haCI3iAVlhOXzPTvEwIoRXHE4qLjUWRPfYVRSXmG3kyfVMRQdsjF5TDZzSYze99mmjKS59lRJcyWyKil9+DJ2ZPeaRQpHnnK1j2bz+HhuEIu3ejMelr2Ys6lLFw3vUnV7bqeJ0NtUgrK9XcWLR4R5ZSFGcxBQR47rPFKdHVfxUOlQUEdIWD9+7N4rIy5f81mDRbIlZm7XMD6EVGXgliQMKRIrHgrk8B9dTMyTQgPPixJoReatEweUQUBGJaZxLvEtVNMxSZNxmls27ik3+0JcAupkQ0nSvFa6pcBiB+4lzm1dNC9z8TDG84rQ0GvdWJ0+JsoHSkKcbStT6oD5KTfZpC8GseEdSETTP2Y77FyGXIs6nyGAeGiDXIxAy5AGWEWGlwsaSG+h4AXWjCmGjFZhg0lUqbLAW6tkRwNmoEY0TgR4moRTaLh0e7rcsSSjxtkkWmXARTbNKCeLATyiJFchqPD8WNsdA6W6H0husCJmanA5QenjmDywUImiT1ItChbuCnjWLkHCxCuiCpxYkXGCLNm4G0QobLPJXTzhIRc5Mlb7uTBQiUc3WUDvzhAiefaG63YRCJQsOLGNnQKiobW9rFz4TTTrSLDIt810eQsmfBGNyOpxQemuqTUJ6IZTyQjiZP5wRNrorUdPkWWwMJGxYw1EJGwGEDInKppivgpBx88uHil4rX5/SskYGTgLXMWVEO882ns8hknUWSL1n5NDoL3D4C+gvhMLlmnMD+ryY6EmJaQO7Bv8JOpRtxUISZUvOuZe6/2hRAktOtPveNO9FEGl4h+axCAZiKksWKt+lCwyC2zYgYD0ZCeZmpAz2qtHfcHI+Y83QX5s840PhhiP8m1D7RelsevtlkRn4DjRjrnajRhGqLQP+PTaRT5exeS6c9HbfUZN/wmY8GKvMnI64kNEVKG+4+ZmQcdUECYh4T8hwJA2gj74SMvgQglDeqydc1KjseYDniZiMB1fpyCc8xG/mGnQUhEe3lhh7KohwSbfpMQbEEzHIhpGRihMeHqG7j6eghIeu90xqPAWEB51iSejeZeHhBnC7EkArZC5OF5/UqQoZVMbdfTWYIuUwU3qaBYVJldIQBGKmsGFV8LjZ9hI2csmTXgP0CRtiPZle31Vhsw3VB+QgKmyePGSYLmYVNoOMywgp3sIl63WJzwI94cLCmyldxCZkNjn1abJACBnnPkVsgTThAmIqZKjeK1wsJQrFaLyFidm9DNppfMLEDwPCvpFOYQNbe7dVIFvYcAdQqV2FiSYpqbNllflGSKFEpGBpGK8USkMTceXGXkKpnkAywS2z8DjnYPTEXVkiLjxUC+T0aaAKl8ENw5RnL4ULLamIvZlaGzFHBblsh26rSiFze12Z+XhAyHQouhNoxQqZRyHrrzvjhMqYYiyVQIKJS6QLnomMll+GGS7XGjb3ugSGW7y6WwuonvwmC5XevS+LRuueKzmbf38VxbLRUf8RKu+kouwbwIsQZvm8Qx4wffv3YMp46zEvgI8G+87aBjo69YTi2DHd8S0MGzrItbWRFl1hY3veeLo07ybAwmaF2fnGVEWInMfW64syFSJJLjYMtCkhwkpJNQf+XIh46euqGOsRNdM5790BlpAJUuXBGHsKkashLQ4vtaUMQyQXPFu+Tl8h4uuZXc30lhDxjo2x7kqy0bFfJjq1OdroOKorT4N0hMtru7kbD7XNlIWLHG9S95t2YUPp0e8CaVLIhKDnxSU9Nj97JIkdwplhhYmuGe8Qi2nhwsq0Deu8LFySs+rvwTxy1rKXxKjB2llH/0VISAo45XJcHY4Vqy/d4vHE8Oq4+cm/ENG4CGyZc3q1jTj9GNt80/ANt05XGm1t3IXashOLclF5VsDk7CCjRv+a1oSxes2z9tecd1dUrn38jlt+CRLb4S8oevmQkwOFmT+Nk5m+4kR/HY0hZj5Sv/fLxNxuXZkp9XWuBLz5n56ks0lnIbSejWn0LQoW144Ufetp8tiXSguCdZnXuHi8ZDTtglRpsmyGbwmSRhnmrHuldRzHx1ACnSkfXKPAbAbqPIfySolP4q2fvBCuYyIKb/5viY7xnGFtkBn2RXQsCWrTdkDfWppUGkrTWuYW/qsnaI5T3aFLTb4zEJZqP5Bn52sSrl1RKdv8Q3Fr+iiZx4Y3+7fogUKL7SneuhiED7A0HLz5X89Jf6LOmKH0ZqI/w+DPoD9HqJyDcd18iRDpwwrHyXXn+wLlWhE1Uz/mjDukZ1zDQyVRUmHtoYU3/PW0lyhAwXxdWl5utTwFVq91U/inoIvDycnFdIxMqT370uiblDL51qToG5KEQmM6YV7nNS4yxewHnHID9ep7j4yz3oPkmdeqHuZdswG6YpevbLOtN0Gg/mmPIhWv8CpS6tkO8WT+TsqekwOvuPOeb54Y0S51mSix5nXTdQPBf3jdljFtazJn6jAw8bPWvI6e8Qedap9lHV1jlWl/6PvAoVx74huV5unTPf0II6fjHU7ASIOiLWwvnGpUc7NRcnfW6G8qyuXNCfpzF2HlrrvzLTtse1hHApI9PH6G6e6sLivdIKzLvGGefbG64d4jvQ9PS+v5fIzUhebuwF4hetvieX/d1O6N8vg2878WPrJ7jmhJ137jiOnsM7Y4fvq5qXlm4F4nDnoVhodOCLgnePfEOtdBusw8st6J7cptRzsvl2oJOvkt3A+GWH4a64VWQNcF/EeHz2/yih4g5y1C1rnLm3EmwTX3hnkPTjr7sHR9rm8Ni3dH6eSGob6X5qG+9Tw8GFD2nZuvSWGjzsLduZWMspn9Fw4RHZtbZh8fDGEa/u/FBDG2SewvA+BYPhv3+R7sb6c/3rCVprSvfdgXnSjCWhGHT6SSFCryGVIgXyyMY1wXM76kmDPztBiEnA53KsYcoppMI6q+EN1kBjntIDtMCpMDOQ4PcCC5BzQkAasYvAktTuslluAIC1TKtCg0uMgE78/pOZl+BtCTSaRMX+M1REbUk+kttpsmVPg+Vz6PjLlLYisolIldbitIlIkNASXsfJbmzte/wAO6nxkfZa5RBek9ahqGYnrM23OaztKDKvrRjqLEBHgxvc43vQn2YnqT67NNh5MzsT7fvGzNVYK+mDQ4Q8U1vFv6SRramURUAp2sSS837B/K0J+v1WY10R2ecBItW+MEGkSN6bpsQJsr/clPli3ytaF4sgP2LcLeMF8aqIceUTo5ZfspTywCfYsqhlpMRu8Is3RpmJ611hnQY86bmjeZPd3FOoC2Zq2xJ0izUIjX/b1MAS3qAO4xZy4pyPbzV1pnpJHHf1wGO8I6qH/lRJ01wfKYws7bnrWDYWR+tHlnr9zzRW9+CrnhI78/aUegOeZ9AYPb/QjQMWPivKdZz6hAu1/hdEwu0ZyRokfrmN1y+KBTY6g6AaI/9GjS9TtkD0jdQXjM2Yf7agznjiOQxxRm3mnmmXbL+BU6qwlgx4TNggMSm3+L1RdmYQ446Tbsict/O1exL27cgRA/0HJ6NwGtTOirHaH3idA5Znf83uUKQHcKe2OOnbw9MfwPruooZVcahWN2ZN5xKIEOS6vg0unph1u5EDBUrr1YMeFs1QUzlwoCFQlJvPJ/eK5Mp9pZD46HmdFCI7c4itJTBxyyqJxO3QpgZI+M4fn/eeiKhpk3AHrAIDb/tiExCmZKFFXGXnYDjJI5HVOwFxJSEjP5RHVGV2uAVTL3krcYIw46qhzPYqxJf5/tXbOW2IrZbJ9iFvqgyXjBUj0QJZOXJFhFgErmKfuazirfoeRH9+nYsv/LurMem1dbimMyeYsEZpc4kr5TrX868V5dkdefGZp60J4cMktBM8d1FuUuux5CykRjhmpipcz77dQik2j+bzE/GLsGx0rm8Oi+IUN5pd7i3rQKPQf7qokWMSOeZI8g/soVtNmhzWIPEaue1LekH/y1qbEzcHnLptOWyTon9casvuB4/gC5lk7Qm9d2nLaV0s3q4bmufqLQhl6gE+tN9OG1ldKN9YC+226WMalfLR0mZh4cnwfGZxHIpi3FYcQus3TYJDQQmbCkqbE+4CpXu0ZfnuOFHlxLJ+iNXUcXcrUeXtMexvHGhUKBa7lSb6IP0oUbbn2CT4lGhC6iRC1NCWPdVuPNdGV/Et2VbosBkAnKVWJKV0FVUQxuTa+Ah0JwY3Rq7OCbxVX1lVIMvyd7zFtA0iAuzRzpSJsDE6lYUooz0LKTqYW1n7t9w4Z0Wm/rW/KuimQrkcZ1Jjvay4ecLvuEfMhcENQKLllMRONCkR+g4sPlhc/xtg3eut/gVzp2KVUBBCB74A8BL+x2yUkLQIkPRZ7DTKcehvOB+3aWsCyZkvZf+N+eeyhHy1IDgMRgX02eWpfl06YNZow49t5h+LAMVOE3wqZbc6R2ljyraKhZ02WlQYSTWQExawaG+hgi0txEr8qW4gamxVFFuaT5rmQk9VHIsKrCc6Y40NWNBqHCp2zErJF1rWTkCy/RSx5Vo5fZD+bs6+FhlVmpeUkesNDgezMYO2yeBaIfjU0eXXwSH5BDZVFcUGLzLLAk04/OilYbOhnX90rqsUUam1B/yj3gYODn3bWLujH20OLSMdTY1DBjswWcrWJtLwHnogVcHRr7Y+kOEbhcL1s/b5BMmzE655dVjdC5fVkVXXRLBVyy2QJr9RgRyibwuDJjlIjngRngrzXSEnieezMDtu7b0Mr//QB07S6WxaseCGWscXzEJhscFVvTwJ4bqwpcZcH1QDmIlVVmUvMsMNLkusqTuEQzxx+aOeSVnUw6D00cjxzUxWZwP/MVmDIR/fvBQwBX2T/X4c1L+5MsjU/0oLVnCX3yNDSylW13bFELkDb/qAu0K/vFj41i37wv8Fe2OlVKZlKdRKIpSXqSp1tws6wm6ohoCaufaPsAWzY5HBQm0Ui3WYfHZZXpy3YYh7R6tmY95GyzNRLyM1usoS+usx5Si9lKEjVEqfJszW6w3vkUDvldwwBAsoP4MFwzQ8211E7EfwpTFhTdvtEuy6AualBbIfc9HOl+StR3GC7W9JMylDb7M2MzPxReHvPziSBBSQnNwEwoOc3gBPm5RenYCCqRmJwzYw3csvLcBs3ct/npAnH6Bpg1Sf/tB1MBkaXvVqDdCrcCTQa4FXyAmFQJTt9+gq4efApisp1U5PTUoLJmLwBI2KZFGGJGcUfPYFpThCSj9F+AJedWopJR7OXoPqk5oLg2poAZtfk8NpZUACE1Z2L6vpLYXXRX8MmeT91h+z7qvdwD9O5zblwJWd2ofF/ba3lGH13lvxtNauzFVDqch8j+khDFpvr/mMFS0JNOKsKt863LC4u8niCS9833mFd7qo/9cwahiHtMF0jmjDyqUsMKulyCLQ0KRshFrE+ZYuFoUu5wZB6ZmHsxYnEEhsiD3kkBVo6U4sjmh7ETA70yAkGUp7e1yOgvW+pq5HKTCgY/XcDGVnJUKHjK8/Z5kSMxF9YamfSumzLjtXFtBIaoT7RSlHGvkwp8I48V5p4DvdYBg2MCrDLd7VMuQzVyyXRbL3XQygRAJJ5N7z8VQchRqh85cgl0U8sfESs9zXefdFbR4gtx0VMqXSObi1QwGKXrNthifoMdHMxz7zPwUMMBZYkSjyymp6/IB/MKCuviQO3xZflV9Qz1bAR9udmRm7WKt+maurZyG8Kxobcj0sHMuYrjyOXUFvQuvd9i5f5H06Pj6Or+2M5YM0tIa+RykQoGJ10tvFZyUyg40jFhLP5/SiXHRi6fbuoxaaWYQwOy99JHKilxA8GQHh55l+bRopm7bXWOupLpzqVFfpeOKpnikccxqWaQzZYatpWsM1joD7qG6C+wPUJmVJVHLl/adJliXs2R6rCjyxE/4zIwVSccWalbOqEZqgy9cQJTqJZpyaAmlXBHLoVu620duXIDIDb6TSbCRihDWXzkvXdTyx+RKz3Ndy9d57ISF3i5OOnI5YK1la9BSzMgZHohJQUYGaKnI5caxpbvsdj3qnjtG57rypAmVWBHPiMquKyI1cyoDjv67iYFjjJLhH3kbhg7LtArHRA4JqAuF+tCTYutjyw2CLGPLBfYlQ4InAxj0CJ/2UFLlXrksZJKNjvWsrT1LAVS2dLPLxGhQs0oxY5cemHqkDqCVlKh+dE992eUcfEz6oMk7527xKnI2m1dStBW7r2CJbdTr/qr/jFpiL2PCrNW89078rjKKaw6mWjDXLkONa1KPzLZRqMuSV7kCGH7sj3jcl2ldfFhxs7LlG0/gzo4TIvPjLshh0PyDrlBHePwSxaaRIVsh4CcNno3ZPkZV4+Z4vXIJdYtHTrNVCWJ3ji7Tof/XEoUNSmWRHJJYOzkwK7MQJCZ18eRHidqVmuF5F6Zf4WIL+V3uK7uZVYec3VLlCEIQTKvv6NZj0zglxICBFI6+IcSb4/hVIKBZN4WjvbMFLbFKeqSGJskP+UMPiGuQHJzmFpMWilODUjS4XwU5fdTnVJxIrlMMPfYgJ5ec31DwRfME3C4JuPCtPjMdRmyFiSP8KCOeQRqLD4mtYVx14tntKGuLGpKe4PkM+SemMuuPgNE1qHleZGznKscSPKYYu55dqHWA4NnbF6uDo4yRCFJFimMnRjglREIYszM5FjOGjWh/0VyOXRLJzWLlSkaj8TwsLFaMcoRDSG5JLqpFY7YlSGaJ8SgzUwSHjWjh0lyCYSp446glY7mu0tWpZn81Lj7K3jRZ6YT0qOPibp7sDNzGm5myk2Lu4SIJLdLntqnc/ZEHM+2J4FhoBwpIt638/f35R1LUds7aAP1FvRt78eN2gt6q1pU5N+386J15Wmcqve9xeDqJZljKyOC3EUKMYXQbAIpoCI5Ba4RjhrO/otInidn0B6TfOBNkmsjndKrfgtzoub9hzdQ6V4itYeoLN/y6436d7n2yfOqaNM7pgarJbkqh9iLkXdlVchEFRnJRaysFQrdUN1Stf7RxqjJ90WaEtpTiZwcEQ2lMnoTfU4CyG/BhOTqXxBuOar8Z36FBMy+8X+/U6ppHitrSpaFc8Sc+yzfXd3JFhnUN7CgjVOGoq74bn5h6J3PCuDNaMozjI2+YZp10C4XaSLCu/42TeuZGqDVttn0ZDWrQc97rrZmqfEDylovOvaKHHp4ZDAa5oCXtQp5WcK/uwJm1pre+BgjHpvX/SElT7EBD+JoROhGFx1ZQocHgNaqVLkPKeM88WD/URkCTtN7QR4jiAz97I2VWagOwLDpkVcSrNbqZ7+BkO1/4UGKo+gYc5g/Rsv6lkZoiuDFnK926abce2R7LpEyGZ3XDdBoazNsYLDQ1KfqFs15I/2Qbu1wsJZQBNjU+ruGyWKklNac2E2vtZIZDwZjMebsfJSzmcFtrwrtpQiu0vvHT6DK2tN0wK9uUZv3JelCHP69gL1MXWyIm+7NGsVt7jhsZT3z+PipRFWCzrUGqgpNtcu4uqZsLKYeJWeEve4XX79xaI3czdnaObfslMfVJ3FTRK/ABianvXl9/qkllb2pT277CkvdxD/nRmFempq50jaLPm60H8rdLPfEmhRZNxRSWjnyNz84INW737dWwCL/Va2xMa/AVjWqdr3+9J/TJEWnbtL6xdW14RXzhScehHc8DB/M2I7YaJS4q/LX3wuM+HlzdLNSO4D4znGirJgld25eelfqcUfW7CmqB1fX7soW4Qom3IGGZvPK79DdvOo7/OL1bCLems2KNTvJCXfxsi0tQPZNLNBwOVzpsGa7rgEw7JiXqGMuz7g+aLwWNg+degjfQPridpufEq/Aa8/wPduyWhcIX7GA9NddQXk3ylo1ZV+Ot5QVaLy+CPoiBoZcTEuWrL08i3B87YP4QfIgK9x5/96c+Y7fbYjR5LvKRg0FaG7enim0YfqBKx3xh5qB/7Xxx3AdeqoxOuD67d97fljAtjaQfGv9alu/ix4xlzHORVLdr0Vt3i9s3hstoPZo9fVUC8C8/1Y6iVe4v8Ltce2+krmdvjPvYFx9Iiebx5bkB1qCnFJ2NPb4EPH/BaD42v9lgJg7KNtvDOOzslO9Uv1aV+vKk+d3/yLzTkKS3+Zdm1WvlLlrbx7i3ewSwZStdAmbG/zukqCVrXRacQNqEwrdrIjWoRtYlsWuS6vtZZ0nSxjL1hUuw/3lw8Hs++m0bVRUwuC08/3KilVLX0MtljIOAGUYRch1RiKRSCQSiQS+7XYrfcbt7karUBtisR/31G9/NsjvASnUhlhsN+HUA3dR1F/z1KRn00REt3FSqM3RA3fRFtstUKgNsdhuC4XaEIvtdlCoDeUXpGLPvQsghdoQi/39PZ3W+csNAh8/AXT+ofxh6UHJf1y0x5W8O+ZnaM2/QjCfzGao+aIv+ZqfvOUz8/6AxWP70Dl6lLyVR2nE2aLkrCZKJfn67s+X3e4LpRYp3Inu4QZNeEzuatO7RbRamo3KbC1PUiyyJnadoIfxyCFO1jCvMYpkbcAT18x7fn9u5v4fCjp6tQYAXyXx7GUYiI660H8WLOE5pYl9LCn+Btq0FT/ZeEbNQmNY8o65J49n7nq6hmP+eSIFF9IRmjsxEv6i7TOylxKeK5hSA8fShJ6NJdXBi7FEoYMdlLBQLKXjqA2bJ5YQLC+baRvEElL4p8gTomNME2w0WCJfwJIfQl0m9fcrQbovaxcvC2tLOuKVcBqyuSslw6iHb29XQiJlu15Kp/VzvBN+dSUJp73qSkh/cCs4Oc2KnuBkKvkfIU8J+7cS4mzqVtKW1wQe0Yga4wtO2l6thCRboZViAg8DxEzXs1LqaQhn4NhtelTznp694uC6G1gFjE9Hjp3pCIGw2Bvn3lGclt9L+X+Tg8mSYrtDWnmdBgAznt49xj8mvLN+jC32j3IeKg56+zTwkr6M99P/6kIEJqyjQq5XZD0b8Y/4KSx6YBUHbl1ZqnX7SCZ0ToFC4qajOvf3hxZhDIJbeDaEg1ICq1CT1lHXUZcuubwKAQD3Ad6IHz0de8CVct5nJffmha3gSnjCLINaBlZxx2p4hhgDXSilDQX+X1jcdUrWB3zgSmg+MOLbU3GLMNm+lXz3thJioeZprRZFUbmQ63UfRmwl13Ot5LirlVIOaiUUr7cL6t7BJm/2UtY/zqKOYz/Wv0zI3BSytmB+l0OjKbwcjgpLGFhdNN8Vf1SzZfkPwWV5ZKBgTlkSzD1NrVgO9ew+SKc5Wa4f8n/1hHotuZ28ebiVXEO3kheq7S72l952DSF8R9zJ0ezdSjO994Pv7PRVExPoRz3j8fBzVPtEEj0SHUNANP5frGsJ6JqNrx1MID4vEgnLJqbDR0Mi4BRXwv4uknFPvcaWrfT+Fdn0/sp75rNb951mW7OV9MJkdhbhwnoP7i0YW7+Z9X/wIXl8bszPiT5n8+LxdjbHu5J27Fcag6xdiXdEXYpVnSyhYpm9irp/kVwP214lx9vQUZeQpRqBrsHnffjbsPdwoItIg1MMZh/WGceVim6nnwKVR5iyYLFony+mb8TePDg/DSQDA13imWwsKts+I4dTZzhrmMDUc3eXM2M4EaddqRP4EcaWtK/N70LYp/QqOh6TW1yjm9+75SV+8g4W+Ew8jNbcbt8FfVyZW/K9zXRNTqXdN77tFTPhhAmkGzLThcf1Oq2w87rbm8lJJRayBGRWF6CP1psDretop4FG5RNXoZDVgcmxmpvlYDFYauUSaacCFEtPkY3Vpnc43VTZxqCKBKeACWpPwtLt4hC5EAD0HdA48Wob3rbH423pGEOWMZAx+hiWiqJ3ps9TJFGKgtW5NVwWt2xj0ESCUoII+jcT3vcJ5XxYygcc34aXd31WqwLOqRVbGw9iHi7m2K52GU6qNVnKvlnWcdJsMK72aj7kr4w+JOlLemEPirE8ZLvogwtoGJxhMPuwznexVHCnXwINhBmgF+stGHuXxrW4m4fEJCFCmDwaS60khR7Z1xpcIok9W0Ll2liia5FOwKbbd+eJ0cErmkW5EgfB03JtbE6JQUKALu2thCZ7drXHI/mqNDqnUfT4BbLhWx0vdoJmhBLEPEg03oz35Je29o37FlIIxIFYlLSdPdjWxhZWCMSB2GCrylIZqi49m0sCnABih20sS4/bVws2jx2LQRcJTgGzurWIrortcvM9cjLDSRBorHNHhFcX45lDCWIeRLomj00839vaigSRGbs7VGYMPiZMJKyt0SIvodycCM5ds+2LyNDLDCcN0zj1MKMst1fGRBYmkG7IDNfSapVMeFfRtjEMMsNJwaxKXwxPe47ihlFmOGmYxmFsnlBt80g6leicKHbKP7RUbCSH04OibQyGSFBKEI2dJERrNhETRRhLX9VMYGVVo8UjN+OKu+GMAUHAaVoNCN/elp9tQR3rZk06u8xq8zG12+K5jYkmBCkNAquVM9+8F9/GbFRHWBNhGqf35L339iGiSS0WsgRkNpiu5/lNeqW+3Z+vQ06fRfSr6dqdJNw6+l23J8upp/0dKrWZbt+M9+JNvPbe8hZRCMQFCLL5b6m8L3xtBQZhADvWGAKXim5nhjwDUQbIsMYkuFQtx8YtEAgD2MEX+FpnjLz2peXUjFJKzgLqkOnafIE7j4e26u7N5icBTgARVIbEpV4KgYf2tZdAz7wbNddoU1yqzrCNRyAQBrDBzrolqknQa3J8mWe0q12Cw+3TwZCtOU7CqjbrjCLgIwWRkTXTCY6WqhCL1UJVCMUIopXQ0ZTicNpoKqksimpHfMfgX10KwWp3fvSIOFjojCqptg/lG44gmqrot/P/t2oxzWk5CEFExVV3JI7eM8Jp+1j14GmAM8AEyX67xEIQaiNgpO8j9PhmUtXugK1ur3GFOuK9M+naLdjVm6Qh1AAAPZD5d0lvqyK/3jmmlGNMdSJGJH2a5nGcxqieaXUAcC5dKd5mb2NGKkHMg8SOVV7ppXJf9voVCIQBBNE/vdQ6hR7ZV0Z6CIu1OVe94N7GjFKCmAeJHXy1hewQ3vZxopFXCc6BkiDbtZfKM/HaCQzCAAI820utD2btJc5SQh0dgB5A429Mv8x2dS9z/tKDlSqwjh1rjeFL1bhFFQJxIIJoE18qup0Z85AohHCFdXypvPRce4FBGMAOvtbOajsDuI+5zBoxyBIh05ex4+otrdxe/EOeZa6Jk6qD2UuHOqT7GcZ2EGS72y1AQucEnejuNUw3SR4OZBg9kGNI5HaxQlWjtSmUWGLiwoX/mJ2IxWc3TERzM7cxLDIQkqCi8RrGSxa+8OdugRLoBDTNo8WNKNveL9/eNYIywAQ/9r4CmeaeDH4BJjeXD1dWwacQt/JNLeg/5rcuHkMB06CNLjBFwQsN2jcL7OJ/677Qu2ezO0FfbzE75bl9ORtWGQhJULFjtV+Ayf1eYwqROBQba/cAUy+CwEP72gf6Pmt9rc5oKu92pe/QoPPcnaWgRC9GccU5bMnExe1+KFXqnaMvSZ+9CEzl7fV1EBiEAexY5UxgKsu5jgKBMIDlvvKcNGh+e5d9RitBzIPEBtGfvzqRvWzhxXhMdx1jyDIGejyuwSDT7e6QNxldSPYusDhTFhTfwVmFCaPMIA8iXZOzinhbwT2e7aeYMUviaHp8zBJ51+mYcl2qy6rP/R4PYVWbG48lvlHcJS/yjXOBz2pjQAP3Z+xMQi1tVtBmVpfgOe3d/jZmTmUEeRBpPCZfh4WbkNGhyyBrmMakNhuRV+fLJNKCrAgwjbP6shqCu0aTWAuyAmQ2iMWXJanAj2WhaCY+IUjphszqMjNj7WrexljqAsgaZscamxBTfXu/lQSAMICgsg4xtbkz/dW+MufWM9PG4n7jWBnluY1RVgnOgYqgQlUjKNHEUhIXLkwshrTUpIsumrSc1ElLXelKR51cZKQnU0wxzP6R6d/YTLaMeldX/7HVgZAFgaD4ZjW2s0/2uo5VxwUGXAOcASbIDjWm6jDnRsoDogCC7FpjqorYyHlAFECQnWxMFTZKHhAFUIhmNaZqO72RBQJhAEHleGOib4FLAXpL31rY2zU+OKZq1WzUPCAKIKi9cUy39SZyKQAtPW1jtac9kp4rbl8FBkIDnAFm9bnJ280An21s7QqBOBDBCosdU3VJ2igCgTCAoLbdMdG3CG0DLT1tI2124zFV2Gh5QBRAUDv0mBqINABA3wG5kWX/NBg3VP6dUi5SjBwRYEQ4kcsQLP3k49sv9epbtYkfyGQuIJM5fUz5A6NiB3LFaUFtlWw6qXTpkjc2ZdUvI5D9Tf/qjfHrsaKcqvYf/fcZcdfdz2EQteml0MuaBJeGKvYbU0nGvUT48CN6aGk2YZAy6Sipr2fY+FwUOjA1mHSMfyViaqmOJ2fQr+YAV/lI09aZbx2Pnylx/XDATl9m6ynTfwhiShdB+t11DSQ+geN5TC6jX3MbbupPZ/5FnDGZUx8q5RKKYD0osHyKfU4Ye6QOAAbZC3aXwchiEF18kgz1qvM1P9HyHTgeeHAUqZ2LRXCH/p48QTKNQ0t1BwF5DlRATcwmiOaQwtDOgQgICvEpmXgOzSEaggrJfdksnhQnm+Ci2Qq6Rb3fMsmCgAU34by80UtB+INC/BLq6aXJNlD9jW3OjrvYOmCt90SuXkFMK4THJDLNQntgZtemhInY8WkSO+y82zkwv1OwI8bWMmOWPlaGj6SmXiI2nCWRu5ZUmx4240p3i6/g/0e297tMGMgWmtb/W7EU7f98/K2s9l9sLKsLAbEo4RN/hdUBuNJGfkNU4VqusosphaaYUWaYSdNUttZsFChJ8gQ4SWNSlBq+EJooHQVPdm+6xhRMyJKWZpHSgk6S/AQlWSU6klbCIVGbNBASJ/uJ2HhUQPERjKS60okwLRGJMOlRiDTfZaXJEoIW+hbRHkQDQrtRwLWcZBebBw2xd0gfT4f0RTIXrDjBN6oGdDekRfU7cQZVFVEGOwF3QozZmUl9QTXNCI/cZK9wV8AVqx9RVijhBSvGVKHGeqelYD0IjwKJr1qCw6JQwheQiTOpa7GV3NbududuG3e3d5+b+2I9NeVOVIckP0YHJjouh1XfM5c6CJJ90ruTwVm7fWVfWDMZ8AIU/qnRBmbFWGB+ekpDjAqq7eEoJNF/giUwXZEkKOkhJKwcN8JKOwpCUzSztmlDOpDyS3I9x26yFKAJ7ua938BEJVCDswAALJ/FP9f8WzoSFit/S8e037dyRvuW8Cz1Lb9Y4WuLfbHY95RkPa/GTOPROs3d0VqxldxkN23OVUUZlJu5YuZpCm4qmhbeps9gGy0VKhak87zMyf0orQfGVHGZ3WXtLnfulHGLIbK1hkYC5R8r7xWYOTHlsyO2ZGc87KQqJTjDYaiWuZyRsLYTI9lkMKX3jANzkj9cemYKGHrEpQPcQhPexvw7fwQkpw3BmNoGyuaE7lEO74EFPQ5UzXxR4k1cFDtQFSUzJxhyf3xFIu+Bgg94t0tG5oH3IujMnN217MzkTWnK1Zhl4yxSzioPVuLQdZ31LYmkI/lFV8zSpJR7L8pz84WxKtHX/18rhgFhThfiilSuAPTmdDRquB8rsQlzgUQKFcGUyil72e/svvbwmPthZ6xjkb0cdvZQe+eYhzb48ku3oknViGLtYRVqzfVkq6l+tYdVqDXXk62m+tUeVqHWXE+27qHChPzrpdAyEW9u3sLcw+TYxdthrfmxHvqnMILsYlY1Z3TYkDK7PSxWNXesDYlnF7NW80wdNiSeXcyq5ozOStE1FNq7iqy1J1mqT3tXkTXW4VvoE1E+yWIk5GP3YlNrRkfHQ1mjde5dY7PWHmPLxnP3YqvWmTpK2XjuXmxqzegoZQzWsXeJjVpzjCkTj92LrVp3jCuLkRB2Lza1dozJbpjJ+UHI/7RG+dvjan8HxCwnREjmlvhpJW3mU2QvyQViocERpJtnjdFDNL66zunhW/IhqJxL6CTJIIQ8ZEkon6dO0mJQesKNPTItDmzCHj9jU1EGOxGZlZK4KY5idGP5uJXIjNFQyETv/ufq/LgH+QucZ0B0795Y4L84Hah3h1ba3nna+ZhrOchn5gMTwkHPdwH5V9r0TacI8nq+oruYHN5gqG6M8F23aRC/e/xJ30e9vfMZuXwrhbld8BGlM9cIPGUSp2gASkFw4W8NmXi7vu83zt6Zd9z/pbq299VV6cw1Mu+n65mjASgFwYW/NeTW8foORzl7Ry7fSsmjXfARpTPXCDxlEqdoAEpBcOFvDTlnvX6qDJ69I5dvJe9Hu+AjSmeuEXjKJE7RAJSC4MLfFYsyQHp9186cvSOXb6XC2i74iNKZawSeMolTNAClILjwd8WijLNeP89ez96Ry7ey4dIu+IjSmWsEnjKJUzQApSC48HfFKnmPvX42wp69I5dvZe/ZLviI0plrBJ4yiVM0AKUguPB3xefUfwtSV3ZNzLt6X97tcSP96a8/us7PLg9+nhVcAXNANpT9RLArX9TIt1X4eiaIzu+deVXgu8Gf3kEe2/7SY8+fNSb8mWO0T/ncsLWefZ18V6P46OzgoovFrNcr3X3yGA9fZWGesv1tyTBdm2cUfVwgzM4uTNHVOE3wOWGB+UFaQaEu0nPala9csgZG2zdtwIfVyTEj5eOElb+LElVimbIqtnyRsuyyh9KuoXORl4ImyllXAylZNUNZ7UqsB/+YZ6m3yspw86Qavg8ZUqWJrSDQjK5oM3so6QjM1ZwCJ0Z23kj1xZrZlRCPuW8e7YhWhpv45N+rj7qcKq4IzSt6YTkqrBS0xUwXqzbn2tVa7XfqWt2ATtSbUqBqTTRVnQlW1pg81awhYr164HSFSRGrJfHsSkdrdZsCao3pVoYbKCH/Bq3Q7UxxJ2TeyfN2UNghaBuYK1VdTrWrfXx3DKZB48pAQ9Xl354YrDBna6jM0R2luaciTsBUyDloqoPnTVag0+1Khce7qzvakK4MNlqH+t7X+BBfO4Tvh7wTgvZCAQx+9uQ3Ub6pSo9vAr++p9/b964MNVyOZ170IbruELw95I0hZGsoaIOfOnLl4tmWIo913xm3wV4ZbrAm/ScqoOvSKbva9Iv09emeaz2jW/XugdYq/2qg37X3Yv2ejnxYRuHk31f1WWwcwKK7OLviFLwtTHmjoIVsFbMCKkZw6h+jAL+m0da5ZXajnMZp8VGvGU9uwTqeCgcFDAAQ7MUxP/V++4uJxzW8bMWOKyzDTX3p9UwIq0XxlEUoXF198lS+Dsl160ETGidL9OuDItrWy5dL5X5DLEMMlNHJj5SQOKJ8HJOl455qUmfnelTQ5ALIjCgRkWxLHsu6SWvlHlosg84UyvOcqHpxqiibCM3qiV6oVkeFok1BkxQzXazOnGtbclspN5djGWKgyE5+pLrEEWXlmKwn91ScOjtXpYImHUBmRJWIZFvyWKubI9jplsgy9DythB+ZC6maxBb1U0FnJVU8FG8EpjLOQdMZPG+mChPdtvS4rtlhlOW4gVJUBlAJiqUoPaGqkpPnqhUgVasHTVqQ/KgSEs2mpHPr35X+1Pvosgw6VTzKiawgUXVkJGhLS/JizQpVLlwFTVrMdNFKE9e25LbKb02pTuo/qW96E2rWRKH5jxCIdeeKnrHZswcPsOAxaI7NmLudbFu+6LcuNvdeZxlupur8x2rkupNlz+CGuwdPuOA5aE5OGrydbVu+2m5rr06GLgQtgU8fJsLbP3gm0gJZwTI4W/ZgCRcsB83ISTMtsG3L1ugmJ1c7ebQMOVOBz1KCLmeKKyHzSp6Xg8IKQVvAXKkyc6ptraV+Z5vWDehEmSkF6hJNeQlWXfKwHBGXB21xUsRqSTzbWstX4BeVVk4ts5kiUkbcEFE9BGyEPIZjiqGgBS1RsKzEtK1Y6XQ0axlorqj+lkdBld/AqF+aQspvo9P55dIEvhGRkBxaMDsDuaJwbXrf73WKWo3i2YfKuL8iJQklsCtcdyX8ojIsYcvCTLeh9l9zXYcyqrsPETZciLiHHsXqmKJgFbS/OaElCv6bFjHtSlgPgt3pAjoZOm+2Tuzpc7X1ak4KvcXV2vqltwWubsHqW0Hb2IzZshPZtvahHvhRa13bMug84cWfCR4pvswXBVjDZxHWPFV2hubqzgEUJD979JcZeqnseIf4epJ91+eW4WYK8oOEsEIUT1mAwtWFJ09V65BcrR40gaGy5D6LE9G21PSo15AbnrcMN/JJNxcBa+Ipm3B1kydzSDYPmqGy5JqItmVrLnxrd6OGN/ZvSVanTzRlxHUR1V3AhsujO6boCprTEgVvMW3Ll3QfgaSeFy5DTFSU3zQQajhVjAjNEb0QjgqRghbMdLEac65txdFf4NcNxmWYuTrTDWRhh8h6IXAz5OUQrhEKWpCThitPbNuKY+565B5KLoPNlt+HJTH8Fl97C9/f8s4WtLcVwM3PHv32xRfLj8P+Yf65LmEuw8wVo26cEHuJrLcEbi55eQnXWAraAicNf0Yotn3Z8e55sX56LkPNVt+rMS96iK4bgrdD3gghW6GgBT91vB7Ft6t4p/HLf74bpcsws/X4kyMr9hRZbwrcnPLyFK4xFbRJThquPrFtaz6qzw+dW12GGf50YcU2kfVM4KbJyyZcwxQ0IycNN7Fty478pV1rc+wyyFjp6fbQoYe4WkPY3pBXh2D1oaANbMbsJbJtjWM/9DyfnPetNtJNWMRa5qxYhpcse7CMjJaDZqNSn29/h3Q89vqen9TjjvXBh7dc/xI8f8JU4aCAAQCCxTjmp95vRj6Y7ahf1s9WGS9DTHxx1G87J3U4VRwRmkf0wnBUGClog5kudjnXtsbRd/vU9uVl0NFy85tgitedc7YF6JfpK9G9U+YOb9a7BU2k464J+lulvlS3453OPa+9ndLLULMl+2qRF12tousKVfC2RuWNuhayVdIKmij5qeOfhYpvW4o87t3e2pK9DDpZln7jf/HadM62QP0yfZW6d0re4b2696CLln9N0M9GX6z7cbz7sm/99zLcYNH6zWimD6fsDr9If7jnkdGt4UEe/KvBXi9Vd7wzuN9OjTVfhp2sV78x2vxw0n74hfrh3grH5ygGMMZdGbqCX6zzcawvqE1sX4abrF6/fedsz6x990v13b3nfoHs1QD6xOtD3y9WHUc+9CKenPmRCn7b//kmzq4J3jd53YRsmIJqo1Kfb3+PosVHvY58cgeGo8JBAQMABItxzE+934x6sOphXk9ybKUAM9zIF2x1XyJgtSiesgiFq6tPnsrXIbluPWhCQ2XJfT+KiLb18uVSv5EI7AZ0oqSUAnWIpjoEKw95GI6Iw4M2OClil3i2NZab3XNgjhsoImUAHWIpDqGqQ56HAGl40AYkP+oSzbbGSr9TFOwGdKJ8lALVRVN1wcouD+6I6B4056SI3eLZlq+1Ozo1nfz+LoX732uXhvI9/sFUUyaMuipeICus6LGWMzZUdS1o+ptyBchvun9j5f043GuKzG0GYQacKU1lxJWkiOpSFLAuQXkuXsfkovXASY2WKPS5nTPtKh6KWrdN2LOzB4rppIfK6KSIAjJIlo55KEedGwtRQRMKIC2gLE6ObQliVb99LOwGdKJAlAJVJKKpCkWwsljkoTgdEQvUgyYcTopYEYlnW0Ja7N0rujebAMM+7/56orQ8E6q8nCpKLEKzzKIXStlRoZxT0CTHTBcrP+falgRX2/16nE8O/NiK209/szwyZR4ZXRnZw4jANHLQBm168u5fxl6C1xz04mR/ymQCCBRyENgK84+7P+Pg0sEvpj+TgISSXAjZKuZPf8bR5UNeTH8mBSmluRK6Vc2f/oyTK2d7Mf2ZDGSU5UbYVjN/+jM21x76YvozeZCnfO4Jv9WbP/0ZZ1yyrkDjzoExnTf0nQt/w1NuX2JK7MtMWeWvSXmeWa1E3FfLBOREfF/Atr4S5jsX921788uY4QYqwu9DNKgynCkqJCGzUpLnAnVQKNQQNAUBc6Uqy6m2pbBVnXawMQPNk5cSYCpLJEVRCZT15B4rVOeH4vSgCYiQHFQxYtmWWBavwPtyanccszFTLx8khN3iKW/h6luetkPy9qBtVJZcKYloW3t1fgQBnkyfUzzx84lvNSKPUbeY8nRQnu5x6vwwPWgTktz8NwXcqIqJ2nk0C4WT5KyVjQDAMoT4GAG2wbCD608Ll448TnECkUkoH0sg28Sw6U8rLh99nOIEKtNQP9ZAt6lh059W8Qgr+tNZlP9fkOzZZeKCFZHP6H0PidRS5ivJKuNrCsueSjpDc3XnoEmQnj3/R7F7qeJ42O1325LdgE5UpVKgilE0VQ0KVpaePJStI2K1etD0xUmR+/Y6Fd2uxrpOizmZgeYJSAkwp0iKU6A83ePU+WF60CYhOahcxLKr+fDgjxRi7qMoM9w8vcT7WBQpncxXUlHG1wSVPVVwhuZizgFUHD979AuAL1YK8lj3d70DqcywI0Xpd0kqVpDOFcWYsVmI2UMlB1io4hg08WEz5j4DdLJtKW+x36NXdgM6UXpKgao60VQFJ1hZa/JQt46IJetBExcnRayaxLMtIa3uNJ2WGWiegJQAc4qkOAXK0z1OnR+mB20SkoPKRSzbmmvsUfnRSW+gLjtx8mF6Kd7JukgBVVmjojqXyhLreKzsel6x1GuLpsqh14f82tobKw7H0hf889AVedOCmdDykZJWGlgRi6csW+HqQpWnanZIrl8PmvxQWXKfNYpoW3u52ctj5riBclIG0CmW4hSqOuV5CpCmB21C8qOKRzTbmiv9vjWzW9CB8lEKVBdN1QUruzy4I7Jb0JyTInaLZ1u+9gTaY+JrJ39H/XSv/fw9piPfDdNUy5RVyxcpW/aCZXTJctBs1tVA24vVa/Vwr8WTb4E2M9i8X27fkdnIEcgKI4PzyB5GwoWRgzbISTNXYNvV+Mbh6Q+KrP0CZwYZLL23uHeUnYjqkhOwLjd5LlzH5KL1wEkMlihYVmLal6SO9eCWTg79eoF+X5azpxPGmbF5Zg8zwMKMQZvkjOd/5ksuqonie8Tl8SRev3lwIGCQIsdaHPMz7jctDk710K/Hv9jWeWa4mS9L+n0hzxWhk2XP4Ia7Jw+45DFoTk4a/PKms23rZc7jfEFpgT4z3Fz9oe+/JhHVh4D1Ic/DMXl4AAcoUfJypm3p6qDX5Y13AaAZcqiylBLXxdRyIesuz+6gqitwzsuVvEW1Lz/6V/ilXg80A8+T2e1HigC5A1lhZ3De2cNOuLBz4DY4aaYCA9u29kr1kU701ic0oeUjtag0sDIUT1mBwtXFJ09V7JBcwB40taGy5MpLRNtS1tpaRyDas7MHSuikh6rnpIjCMUjWjHmoRZ0by1BBEwkgLaAqTo5tCWKdHp/KTt8rmqFnKsQf/wq4WMTW1I3QHQm51ytXwE4RK3AaY+dNFqHTbUuPvw3gr+9vqQ8czbAT5egPFQd2OleeGZtn9jADLMwUuEnNmCs+J9vYXFR7hEK9HyLNoUNf01IW1CGa6hCsPORhOCIOD9rgpEhd4tmYmL7F7e6gtBvQgUpSClQTTdUEq5s8mxDRPHCGSRFr4tmYLdEDzVrriksz3DwRxQfHBammzFeSVcbX9JU9FXKG5orOAZQeP3v0l4p7uUqRR71nONtJ0ww1Wo+v+rTYU2zNKXR3yutTwM5U4CY7b6b6Ys3sS4hHu2MKPdhpBpqtw6es0ENkvSFwc8jrQ7j6UOAGOGn4EtvGxtHv61TngprhRgvww5IYfouvvYXvb3lnC9rbCuaGZ89+kfTlOhzHuPtMun/UDDpblM9yo2+n7G6/SH+7553Rre2B3virgdbrmyuG45j3XkwPnJohR8v1Ey01+HDG5vBLdId7HhncGR7Ywb8O6PVyLcex7ut0X6ma4UZrVI+3FH6Krz2F7095Zwramwrg5GdPVuQbq47HOwvvGa6GbDVDjdbjqzEt+BRbcwrdnfL6FLAzFbQJzxupvlgz+xLike69nP0Ma4YcLcZPrFODC9IZm6L0S3SF6Z7rPIM7te7BFCn/OsCfV765Yj2OvC6lHqE1Q85W6bPU4OaMTfNLdM09WwZ3zANr/OuAtpdrO45yVy977dYMNlqir3Z50Zfoukvw/pLXl5CtpcAtfOr4F2zFtzE/6j2DbVRdM9RsSZ5pwYfYmkPo7pDXh4CdoaANeN70Jbp9jaM9bCKeHPjlAMPj/4eNTJkjo3NUPEQEpshBC+KevPt/akDlosHLz/HiZL+ZcECgkIPAVhzz8+435Xrw9Cu+9J8+J7Zb0IEvkSoFqhBFU1WgYGXpyUP5OiLWrQdNZZwUsS9SimdfL0uu/Pw/3X1sOm+eak52pmBOhqgVQxRkIo8VeJ6Zik9B0wUgJ5gQTop9acC/iMuXORs62Qw97yk8lo5IS2wFy+iKZQ8Wgcly0AyeN9MS3bbsW+z8HdHAOp7ZJMrTx5mnBxWkM0UxJmQWYvJczw4KtRyCJj5grlTBOdW+xLao2R3Q5riBGlMGUH2Jpagtoaq6kudSFSCVqQdNS5D8qPoRzb60s7jZCtPmuIFPygBqYimaUFWTZxMgmQfNIPlRTTT7siXNvq82xw18UgZQE0vRhKqaPJsAyTxoBsmPaqLZly3tNzm23YBO1I9SoLpoqi5Y2eXJDRHdg+acFLFbPPvyZbXW3rZnZw9UzkkPVc1JERVjkKwW81CJOjdWoYKmEEBaQFWcHPtSxPJms3qb4waqQxlAt1iKW6jqluctQNoetA3Jjyoc0exrryh3ZrgZYqBmTn7kFEecjsnTPU2dnaeCNgGZERUikn3Nlfo7UUe138jNkEOFopTAchFTQzRCdqQjz5XqoGq9KmhiAuZKlpeo9iWyQ72eZOu+czPcVImdCWGneMpTuPqUp+mQPD1oE5UlV1Ai2tZ8aOw3n7rdgg7UlFKADtFUh2D1Ic9DiDg8cAOTInaJZ2NjUbnl2s0QA9Vz8iOXOOJyTF7uaensvBS0BciMKBGR7GstbnYTvDluoE6UATTEUgyhqiHPIUAKD1pA8qMqRzT7iiXl1pk3QwzUzMmPnOKI0zF5uqeps/NU0CYgM6JCRLKvudT+DnGTT878FFR/QOfZ0wnjzNg8s4cZYGHGoE1yxvM/4TQX1Uj1PbJ1iSdR9OPKAwgYpMixFuYfcX9euPxcH6c/j0CEkVRyWSvmT39eccW5PU5/HoUoo6nmulbNn/686spzf5z+PAYxxlLLba2ZP/15zak4ykNbdApWSJvmor9p/baQAeVDyU7CN3ri57NdnWpnLsVAX2eN7yl889QUdVdKdA+QzcYlV0ieaACCMm4t8LzG+p4yqNTsxLJpkisP9QpxWv2MpKl6LUt20mtYoEB3c/9lJ0D1OQNGd5D6IFbp45n4EIkdiuoRbsBN6/8FMQUAB9pHjxJlkv5HBtKVYqLTQEbZAGvbZcrXfBMjq78mAxDQLmlS3k4NRq1ApspwCly7fsQcEyRGKqCVU4lYOMvfbCEd1+GO9j8pfVCgP9Z0zlrCl5LlMPnESiKhps04GoK63oJMdatT7T/9m5EEGxGPfNANkkOiYVtwOrRu8+WIkiCHTf/3jyjl+NvNw7QxdtZaNz4gaY7ck2cQ0WEk7ZQNeDIRBPx7sn+iZzBPdmfmpzUS/l3tf4kw5HtqT6P6IbwW8p8KDW612Stt/Fi3qtmK5vtms/MaNeDmmUM/hh0E26NGSNMGfcKafubB04OPnuzR6QFIp2m67Pjzw+GqrDNN1PnON/Tl/V8Ov9bDCAeQUvl2EOW4YPz7wGVuY6L7e+sHiJ30xPX8GhbCUZVwD2GAFB60QOSH/ULP+3rDmaQS/r4w9eryZ3+o/POnrYVxp//Dcb457Yk0mwDZ5Kkwz/NSTSpoWkEl1H8LHUZ7ZUc4Bt4vlF4dSHtsOamOsX3sMvfP3U2fmRGDJCDcuY6/LWP4vrszPrCs7mqOTcn6kxNJLJRdtrjS3NUc/RJ/RecueNhSyQtgPwT0eDnwmhs65XTip4/Tj1eqQv5YwB/ZeR8nJU2k6wS6Ko9+XIK3lTww5q3f8Qy9bcMFocG+/zhp37b3xJC+uoDioXAEqk2Y6dva/9rqcwLDsy86tW4bSTI8QDaj5cUuYWuRLWQtssWrmltQFYk4NSG20RY/9/9Zu1PGeue3VG9r+aOsA3kKL+TZE2nV24tE1/rEiX/9pXP587x9dbDgACy9/C/YTvl3r+mQT8YiRyyoYxbTd+Du7lxFbH3NmoXAhZEIVj+mmYQ+onW+cDbqa3hJdpC4GtL3bgS0KPGsrEEqzUgspZX1KFFEbUQmOUo/3LlVase3F8jCbpMOEq1xylglDhMpeUHuOqn/rnKGJAgp0T1TlTLfBv8jcOSpPNlwCWYl/GtVWUM2VU1NxlUfkMuQjxF/IJjfPFCCMYBuXSpw54F4Qtsz9EN2jdvDYMEBAd2dGpd+mN65LvPxvrDgAQLSJqD++Q+JUh7ZX39+wFcyR7wTBPiA6xl2CiCDHSHAIIsJvw9h+wsZDmFFc8bMtyrPNwcKbn8sDu//9IhnZO7nyh//Qur8FjCIs99RLUHkVTxiFvNrUiehHanfALYQQtKJ7d4XC7ABwy/4na+8BZ69tDekwgDgXXAivGZ+0UrFJR/SVYP88/mQHhRFdds6qP8axxtAEAYAkE9BpWWcXMKgmAu/gTMPSFaksqNY+2nGhMWbxzRa26yGAAL4UFyWjmDKAxgvUwUifQTeb956Q3aZDpiEvlCeo079+isS5xRQ1cyTzhGST3VcVaXyt49yJ10QcQOwY704wUEGQDxngMtEOgMZHAETNp7iBbUC3BNzjB8+Hf9VjoZAhLAI4eoihqVNyYC9EkDgBA1zKaMaH1xFkyEBCAD2hIDR0w2WKUckQYOF1MAHAb6v9ig+6BdgpwZ20AqJzZUlK9vY8QVs2O05Lj6TkxkN019oWeHqJpXKE14y4PO4q4Dqc/RjLOQI5G4KtdXnyLS0ioodCoCK9ul38HChi+mh5KiL316d+TXtuXlsmuyqj2olC7oFAIPQAmAhZaG3AQSMCYBBcQaeRauCpBtoKMowAGUgmnmX+i2OUosPpE+NhSXbd4tu5wOJCpwHVFPGmQBAEkuMnshHzwQ2d0aWPeVfnwpnIYBTwLmdL4gvQvDlqkGEnKqwPwDOqRcoQGgAgJQAAJpTwKIkgAzAR8waCHk2l0Zdzr+qFL24VtCfABocVgmg7p2de+xmV1VnWW4RgJkVYAYAZFlppKsAmOLPplrlYWDhksEHuozSswQPOqd2iYw3BEHLEiM5asash8FniB7ojpR6lYPREwCwdn+Z/D9Zu+hF7/4F1J98/p/I5fkGwxrwCgGUBhAUYQCFKgTAOB0PYhYp69FUPH40k6gqvkUj/WuEFwkAr8M9V4Bv1odAHQNOWQDYxgDGtQD4KHcDBHyRgDHNABgZGIGgEgAIazGAxDFOZ7HOM6MVBiDM98BnqArDxd7NFCiBLw9Z1HsLWlADExB3CIDwlRoU5GIAMQ89AImg6cicHRpPJdFa2rbIslfmUFtTs2Hd6u4W79AiUAEGum4aUd95BXCgiVT60Jv7OPf16ta1XzmQ1ixP6fz0ITv9Q6t2c63+kopwdc4KPZkyRRarNWOP/9f3x6oJAWZyDUieu8QgksovcO0jTH+SYfBmB+kpyRsYkkrY9IRXBEQvwo6ANQmBZie8Z9ym4pqbtT2Am0fICxsPMjSdCXYXqixvRuGMVJlWA1YgwMJ6HprELgb43LV17XxJwBW+7O65lCmLpygFN7XccBCDNqLoPdOPJBTOFrEB+2MAEB4BLrPQL0LLdk4YqUWbAW0/gENJACkKQOgPgC8byUVgRaPrAVXXuXuzfl48UhZSnC0JC29rohloCH9PQH9Ek7mq6w8gf6qQFKfcpiskjVBahAsJANl/DZpboh91zlXEvChFI/HI9uuvAn91/rX9KwDLDPmWtUx//S662sp63bOj8msqu4bVuy+YX+HI30Up27AsHgsAPXacKlgUgZSXYMPPPdNYVg9gZFB2CzNYC8kB8Rlh8gDltq05KmaXH+WmHwzNVQy3Js8B86dqSSl9V4RlmkUnZhjMK5Ts4X0PX7iQeuomRgGdfqAkCkN2nRHc2lTVZbbZa7Y/TvR0OYUFY9qq7afLcShIYEtB+N7EF+KP/9WCxL+6biAwt/SmjTxbZsIuy1aaJPzc60nm9uziSFtPyAMPYKmOObMTtIbS7MfUIa6jzuxLnn8fefUKpA+A+RSXDKGMEOCKOWT5NIYGcSoB4AlqSGhnb6WGiznjYm5X27cVrDKRVV/tYGtW+Lc8kZrNOI4bBlelWlqQ0cupYGiGJrvdX+RIOhSKmt8pPjikx2Dejh4+/PbD7yyslqX2iQPkXl4atwt37s1O1TQlh4gnyYsvh1pJRG4uwnJlb3IIsOilIXMyytzrGKXnAljQUxVB9sVNK5s0U374DO9vBtFJN+ZJOQe4cOrWvkaepAGcfHgSGvlOdomA6xH+N6H8ewiE30voas2EyTTE7z0y4eSWCioWrH2M650cZgPcMV0Sa43cO92YkEjaLCiJNNkKh6xR3E6c6zreB9wEshyqZiueIhCKSjmU4qB620feyjl5rJ62hLWkPMJRr0mwJjH336Wd9UAz6QZ1I71i7bUxGNvAJrhM03T/7Hmj8uSPHr8S7Gt3ykf1qs8oOkaxHmQeBdCJKUCTFc8saFWEucIlFPXqXinrK/e3FxtFuwZKKNllObs2dTK9uxJgr19yp74ysB2gElJmaKa1DLN3jTKWGuc6/3b2KkeRQ91kxTMbStd/AGBf7/ndn0r6aTL8CM3Sswl2N/aoXg0x1aY6qnPSOW4wt/vEPYJw/dSXszztNYvsHFNfxuLMqSgkDZVpKmWGRnXEzPvT5NoQ7siHLmQKUw5pmzTGDYlbEr+MJ9vrz9eJRq5sYXsbddwmMG6psdsNbLgNO6aQXGcB9yahyIdOOihXVLceE4x2rRDlTadVWac8stYGY59om5lJgNlg9qqcGci16urUoyec3FKjTo3zG9z0651ucuj7QeBm4l7hp/mmh8+n27P2cdh8lwcttjqH0E6NeT0l5rpP9clkH3XMK8SFEHIdyOXfzOwhDZE6iZM8m1sojSNL9mBOZvg/m8tAuBHtejp0ubxz8O1CokMlqRSRSlHTqGkUoZQydWWuqC9UnaHIpm4WZgPMEarBsHT1aqH0Hj0JxjaxSW7To1jBrLkJyZXa2HXQRHTiFgF/eWT7K4vKdWORcsZK9eVINRKIpV0DpZQYB5gE2OV2g08SVUVGSISPS/5DxsIdch2CmU+Q7bJd9uQpvPLZTq6PW2MPpyjm5tNrZ9AhGlcOkrKBQyOb8680Lhpib60fvZebi66Zu3Ml93UMgFMwdg82rcU4mMlFmp3bch1uXI95zkN1cOYgFklT5tCcVmcYlaNeBXMd7WQ3xVI2qVmYDTBHqAsm5Vav77YOsJPA9hKVtG3uKKtg1tyF5KpEc7dQoMhL3ejMg3mlHZWqO16Xg2e+yRVO5qyBV1iMfcIa55yYHfGhmA0je9W+moLCiOa+nHzM1Ce3dFCnH46bsgI7CD/PNPGzWJrOuKqznAn4ISge5ZC2KNFrA1gbInGY90wMMt+QvOo7A9tsVAJHoQKMA4+Fzb7Qn86Pz5N9bSg6ZmM96HgUgNgCOkFliqZa0QTMHZIgKXKvPKuV/3cECRBTQ9gmkiWbtZLi3esaqmOAOAnOdMdDgkexQjEOIxuuNy2QluMhXS45xMxD4/SoTjlvUEKVUqSmVH8CMDvHMbqlRL+r8ciharJsqiaRVz41YKKkeo0IeYu9jEHsEJ2QVjKEEl3YsObuwCzkZ5PNNNbisNDALZ0c7vzTWDZdy6b5XtOtdN3S02y0mIl3ZuvrB3RNvDfO7C36OsLWUDbjXcLgTlNM8vgaqKkOoAMTps0Zc6SMA9A5TcfECZsrkMWD7stbPlDjRtjFJCyULbKypOze1MiI315tJR0L8ANDLVbkrbara7No2uwnYGCPiXHIlRDirGAfgLS4whrHPOod7cm33pwU6ok59ZxrUcPZUAZ0cgqiyUq3bIH3WtTi1F0XW9PLxbimKXouwTedU9Y5FvOc+K22sGgLRFtcwv6gY6ZcbKBvh54ZzAPQLQiMwcoi38ct7Ev/pbpcHJXL6yLhd9rhRwVSDZO32taiLTGoy+cZVIFJVOVCtO/arulapIWITVLvVWeu1BUz5Wp9iTrvsddIp5O3ELbqzLW5VtfY6xDdudzYOwdOiKoWHtCw8sj22zMJsMs1biOJnTsP1UG3KGDuVXXkm8Vbqzu1hlFZ6iUMvqaefBVLqmFyszAbijka1YBJTPWi5u4Ixz4ykBYhNimtZKgp0SfAsuYOyWV87dQXh2no5C2MRqc0KFoXSWsqV3ftXgjfuQfvSW1MzMsjq+zw8m3D59/Osu1dtn2/3sHlIWHrUgldRtM9pqK9y5BLCegW05iEGXNkj5kEzDc6ZbbOSQK1WMAJW+bS3FZ2gswPlLBqs5aUUiO0TVY886BcBZ0XknBscy0Zzr6JhYSTfZbDbLB549rfnecBgj+tOsdDnfD8D5w9dIaQZ4cgeCSn6RjD3lx66394WFaot1pkqI8XwAy6Dhg+dEbT2M1/3+zwd4YxN3Hc4u3sUVerfT3x7iphQZuUJVDNHvsA+555ZN+7CUxfLoxUH/6dqFUVVIsnVNKT+WQ/xaecAY5IJrpSp51pOnmLoNGZhu1STWZKdy+Mz26A1nmfYnso97NaxgEubtjljLsue82RHBPTm5QiEOnlEQ16CG8M4UvWz3xYN5oRWdNzjKLcYcYkkGqE3GTFM4MzqYD5hRJCJS0J0iKDTYjsWM7cBpk/JCGnNCTF2V2xkdA0u82eMy3SswQupT26q6eP4+DF95lyTFqITtDrtd30tGv5G3zcxG9VytfewNobRHvzbpLlm17cgR3x1GtDXcM0zcJsgDlCXTCzuPXH6zw0FdRiCRvbeVSDSc8Rsnaabs7IJgLGcxaQaSg1lna7RSh3BHcXRgy2CpduTFBzzsCOS/E4+yYOkk7m2bxot4oQ73JptjnsUF7FtDhgkg7mwTyoB0YG2Dqs1X6XAgMRjlF8SBKix7OJdaisp8SN8ZtTuvD8m3v1kn/SiRKKlH4Lb4Nf81Tjc3SlHvm2yRFB8vcoqVTjbFSQfxrfET+SMFcx1DVC02yZIxSCrLIY9Wef2lBGZM4KPAVqwYaTODbFOMCGC3ZI3l5OfHUpNQ6bJJgqU1TVzEVNJqss99GYBmdLxaKZ5TAbzJ3iWjBWOaVzYD9foLVdtEmm6TY9N1qOa3hDgTw5IzRrQ10jNM12PO9yRbDFmWpUoknOQdVQi2rYqMmj3C8vmw2XTVcRy6tMlkTOWHWRFgE2IWWGZlrNMPf3Ee1j12bQOzrZxaFJ5BXvef+nP+tmdKXOWMgIunsX/PdrMiggXrXoBhN6zJbdnk8AKj8cs3DoJco4GBU+jUf4Oo8AdIspzHYX1caNdObMILyb1dPLZeXSUU9zBUuqEXKzZY6sLCjqFiNt6VJTcQf3B6TFNvaYTXjckrgl3bjxXPbvlEPHzyeLRimH7gfKr8Jshf6IFfx2cB6TgK++TBSXmPYd/fbP81h3alwPHjM29X4RwzoGv323p12J8+OU37U0Ts1dDKnB/zHAWGhS0GCJ7BKoX/L553UcG5xmfv5+TJn6+WvM8zfq/j5B7hrsei2CMTGgeMKM0ZSTWxr46wXwW20FMAMzUMPFuAyvi2nEiZ/Pr4lqQYIGO49t73ibYs0t0kvjoqMaNw11jaXZquxvRmb0i+gNjEoIwym86EB6B7VQw2kaRqEYh3FwPlV2+TjscuzXx3LpSKxZZBppYWCTXKZpulUPM+87u/bSaOiIJ01BJ7sgmoXZYOYoaoFxWdW1axi4irVVRq1RRNTG3e2pjisyW1xTbSLmAWcCN4W6xtLwl8d6a+CVFKGFyuCu6dl/zIxWet9dnOq5g1pEcEosR172GH7c8GM1kHf6q4206MImNM1us0dtcQOPV658PVRFJ6cQmqx45kCdYmwMs6ps+1BJVLWYBhNm7JFsNtzym5dyc/KpaxwmYWFumcuPtof1QzQqXRfnMpLusxPrIWJSAtRiTW4SecVbPBDOLqCEK/WY19XaA369WEVaXGMTbsyTfR5MiMqSu7xiy85CtenkOzXOX2BWVIaQubOhOr8uZrxewO4rOnWdoxCxieXIyx5jlcjrTOtMVINuwcIkkCbb5KgUt/BmVUp1qB6pRshNVjxT0FTK4VBdcKeoxuvU6ewtXiEtNNgEyZblsMtx33Hwykv2rh68vAZVgss0Tbfm4S5aeY3XOsoHihynVeioA7cDuXL5Mlfpp+epR65i0C2KmKTq0dKG/Zcvc5U+JhxfIXHySTWWfPjBrEGGkOsZB//WUACrUNdrJXQZXfdJR71/+JSAtIiwKbEceYUDZgK6wz0aYHdJgrObMUjoNnvMltEOgsrhmIC8ghapGgcmDMwpc2hMBwUzuMcM2CPJ0C3GNE0ir3jGIhg6g3tsQVyO11LNA833rERmabfj5g/pzrKulnX9Ht0owl27+2DLbl4TMGcOfuQgLQ7YpCvlSFGuP0ZWvWHy/qXBvvpVTjy2N3Syi0azjKdA7uD/CwCYOx/pslxfuySH13n1e9+wa4IDSP4FRzi4nY+1YxzancDtft0EdyoLyash5ABeYULX2DDNTimsMTVqJ1uuY3Veg5uu6fOzO1KLGnJiifHETCZhlxWur2pLRz78wJQWBG0aSyFDuwM79agcLpHKq0ziUF06my4GaYzNtXlqg7uiq68vhveLQjFlN4thWrfdY7e0tqYqO6/MvuMC7E3oGhtGuDzKkSuTdUyNGsy6rMLkVSBwF9QdwtSYMA2HmR5TI4PAiia/f/sdB/A0lBYCbZrKFhV1sKrhUkqr69Hpeuxnhg0n++GiYZidNNzIrEczNF10ZXcC3WHBKLZss1imuW2PbWm25jrjvCFhWZqrJnSNDdPsbg/ATmmh5j40u9p+BFsc+rpdRWcQ0xtSXK6+hm/R45vTJzoWuv8UbHMfU/C75+FEr4a3uMoeQxtaBSYsLJ8MnFcSKe9xN7C6jY3dxq792NXze2JTxZg3L5xSlVPz2aOgGRhMW1XI1/iJQnCkqc2CZ1UheMfNs3QCyyo+A8zyq4X5BB9Rag5s+v1orenxJaCrP8DXzCOPTPcbAa5epcfNuc+prl1kGYNRRcgqHVzrEmJJRmLk/+fivtuPVhl8hB/D35vSZgLIcG5CqtelZ3FmABISoMf7cii4oS1sMgKP3tfcE9D17qlH5q3cKxyY+7rgaZWm0XceYQt7wuGKF57x+O+91MIfuKYWauimIGAi+ifsRcR4p0/3MWpuBpo9/kjXYic/xGvj2hK6eoTB+pMOGN6Y4OvwlH6ugVEauWboh4F6ULRmRKJoyWK2r4+LTSmiAAhIAG3spsO/j3DEN6pxYpZOWh4p2Dd9tej8HT8iy5gDkrKbjBM0SBNwvezBEN19Y9cz08r9B9l8trkN7umklxkrwfwbGGoDIIEgnFc2XZja8OJCRf3z/H5QxnLBtgIifo1Copp+/SEXKgMPGkS95eh94aj8joCSFWkWs7q4iT0VKgcK2aEoCPVgopIMtz035oSahpLHNKHq1ukNQdgWD7lh+h/58B5CtI8wtamauXmABBHzPW2NGr7cMkqhQDgMuemOFqXskgvChtSwN8ZgE2IJG+Pp6U3V4jXNJh6MRAQAHzEIqs57JWDnjiIdl0gfFgmRW1JyQt4NGxReU/ASagkf1CI82yNDpyEhATCRypLT3o15/GRK/xrKeqe29dZQj71or0BR6R0Y+6Jfk8cm9Y3LcJM5qboJToGLRXyD3gCRqYX1sJZFm4rf6HqofIMOeiBpbSYDUdicWjDzm5eC2mNon/izP8jsqVs6496Yk1aKv/aWdvoaPAf8pdyWDmVHNejpBHpmf8uWr73y0RN3m1sfOxOGLY7qRvtAJ+OpU0Rm5x2iqBbDR9PmqMGHAKaIXMCysULhXIssA2q4SbGKmk9drU14T258golmP1Ymn02hvFmWpwqWUSqL7p7T5M2ln/948Z/CWNP2xpx+vIXMdnvtQ7Md8qsgTEoad4DwOSb82b02ImPxq2TzR0VFy3acaKOQtNlaOEnaT7Sm2jLB0sf/nyAARRMN3HCF9LZ57t2HXGW2VaKop2YbkD0i8UlKjJY/UKqK0jUzkc6E3lg31o1FhEpPr3JKGmO58c+mYIzywQvU//ZTixSom0UJ1F1iBOrdFrN0VVTSi9zgntyTe3JP7sk9uSeXZfXCQ/Zqb0+ElWhjuxlIrEQb262AxEq0sd0CJFaije3WQGIl2thuAyRWoo3ttkBiJdrYbgckVqKNPXcZQGIl2thuBBIr0cZ2E5BYiTa2m4HESrSx3QpIrEQb2y1AYiXa2G4NJFaije02QGIl2thuCyRWoo3tdkBiJdrYc1cBSKxEG9uNQGIl2thuAhIr0cZ2M5BYiTa2WwGJlWhjuwVIrEQb262BxEq0sd0GSKxEG9ttgcRKtLHdDkisRBt77gqAxEq0sd0IJFaije0mILESbWw3A4mVaGO7FZBYiTa2W4DESrSx3RpIrEQb222AxEq0sd0WSKxEG9vtgMRKtLHnrgaQWIk2r+1ZuQE=';
  if (compressed.length !== 291312 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4651631) throw new Error('Invalid embedded sheet data length.');
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
      if (field[11]) restored.defaultVariants = field[11];
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

  var VERSION = '0.6.18';
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
        // A contract without CSS has no condition. Unsupported/missing state is unknown and stays usable.
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
            // ponytail: 편집 이름칸은 소수 굴림에만 쓰인다. 한 이름칸을 5개 이상 공유하는 시트가 생기면 이 상한만 넓힌다.
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
    var result = dictionary();
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
      var rowLabel = match.section ? rowLabels[match.section + '|' + match.rowId] || '' : '';
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
    var matches = (data.contractRolls || []).filter(function (instance) {
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
      if (name) matches = (data.contractRolls || []).filter(function (instance) {
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

  function rollHasPercentileThreshold(item) {
    var raw = String(item && item.roll && item.roll.raw || '');
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
      structureLabels: context.structure, contract: instance.contract, roll: instance.roll,
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
    if (!rollStatusLabel(instance)) return '';
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
    data.contractRolls.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    data.contractRolls.forEach(function (instance) {
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
        contract: instance.contract,
        roll: instance.roll,
      };
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
    var character = profileCharacters()[0];
    if (character) {
      commonContractRolls(
        character.id,
        inspectContracts(character.id),
        false,
        attrObjects(character.id),
        function () { return undefined; },
      ).forEach(function (instance) {
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          contractCutinKey(instance),
          character.get('name'),
        );
      });
    }
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
