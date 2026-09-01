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
  if (compressed.length !== 291472 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
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
        if (liveFields[name] && trim(fallback) === '') {
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
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null ? visibleDefault
            : getAttr(characterId, fullName, maximum ? 'max' : 'current');
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

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
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
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? fallback : getAttr(characterId, fullName, valueType || 'current');
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
