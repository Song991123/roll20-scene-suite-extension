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
  if (compressed.length !== 292048 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4662949) throw new Error('Invalid embedded sheet data length.');
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
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) label = group;
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
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var tm = String(instance.roll.raw).match(tr);
    var m = tm && !/^@\{[^{}]+\}$/.test(trim(tm[1]))
      ? qualifyContractMacro(characterId, instance, null) : null;
    if (m && m.ok) {
      var v = m.content.match(tr);
      var n = v && resolvedResourceValue(characterId, v[1]);
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
