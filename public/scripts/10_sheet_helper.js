/*
 * Scene Suite 10 - Sheet Helper 0.6.32
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
  var compressed = 'm1GaSMlQNoZtiAzGqRcVWwv91zm2ZdoxQDtgF83CQ9Fv+vZYkYscHBc54wKeXhTQ5Ux13Ua0vaLpVhQPP0T6pTGtSZN0Eh1jVMAGQ7Wq7h9pC/4xZPN9aWyL7bW2KnqXiRRnAB2amTEEmswpEAC7bqLMP4Z8Hw+YWqvuRkFUVVVVVVVVXbr8kP303Z3ukkD4hI/4CVA/RUVd12rXTaLGWOsSuJRzPjOweYEyDSTjTGlN5UgJdRaqFqaSOJJUCbFliVq1co3C0XZVkVzh4H1JstRBYTSlSoLcwi64Eil16CRurY3fEMvmujWoOEd3NEFFAgnEk1g714elGxbs87EIbzCRS81mjxWNOWO4Q65FVyK0Y41tjl1iWtHAHJHzA39S0QrvkgMzZZKhaI4pLGzHVlOCSHMo6d+Zc4MRp4DNTkl/6eG0W4rrkvnlm4WluQWUW7bFTDuYu+juRQ9VoiopkE/VJYFjp75YRJKT31tidSR98pGU1opiqBskcNiwd/4i+pOQmn4gg5VfL8P+3qVo608uoQqP/YOOzNe6iEpKuiG9c7UaFd3IGg1p2Zy2LWlF+jk3uFFPLQx6U4jScpOlLdLAO6I0bCXb52vPXsjXq0NtDqJIVnCY0IutaOVnbkMLS6JeJbEqZ4sXtK+Z9kwtDmhu9MPS63gPZ5xr7IzBdzzGuzVR3iLj3xYz7Rf+xIgnv6Nv9LITDZPoL12hkh5xR5qzhjugMqJhvokCuZ3/LsVryQIKPgpS0U+/2Hlq/drDdZyvqLf/EA7MwM31lZQ4EcUr/mBnRD9IG8UTGVrGRiaS0Rwl7ecHPHdMcA+PZ2aX4vKLW4uzB4qGqPBd9P97lCiU6EmaIaPZIvMklXzpHmqzbQ3/ibq91/yZXXuStTZXYYVKlA7lKjpO0k0KCqIh2sCyKeO4ENvz3YBVGEoocLM5C9v5SKNAAcUomjjZ4ZLLZTdToWpNY3eP6xQ0uGkjpRYH2Ddoo9jpioEc8CEd9ZCkxyhL38PgxKI25+jUslEdil0/OzcxFPIXCC/JjEg1SF1RaRCT1eFrNh7GPV1LYKWTKWbzG741dsEoOAvBaClZ747vTf8BS3rkJ44oa6bPeFGDyuuc3nKIYATvCgkPEWqzEqw/Umoa32/FxtkIZItPWakv2nwXS90fyDpaaP2L2XhiQf0Vav888s/vp9XXb172TZ7bLSl7PdiQjIUDkmxpKEi8EfXAadvg+8xlpyuRVfmvpTbsaTDsCTgLhMmyX7as/nTNYTZXdKVtUgionqi/Hrft9kORBQ+kACwHklzh/oNqgxTRV9mm02o7dpLwEVpW+K+0/RulFKlLLubcbhHae7hssUpII+AzEvIs7+GPfpZaf7pu/tnjlhxPE7UhyZvPYBMWMWILXDafU9WnUA/lgEpUebBl0j9rWn+6qrwUcE8e4H5gSKkldeKgcdgEuVVJS/EM4OTXyL3koNSJiJ6C8va74UMlvLNGBio+tgbkmOexR4rynZRaBCRm6/zcePif1nvuq6JU+MuYOy1KpAq+mVrf6cryT5s4gd0/pOvGeFSRDxSHaxCWAUhUu8ohg3DM89kBUfH0Q7hpv8n4/LNtfxKUkoSNqisRnQZQ/V/A/xg4lUXYJnkfnKugcJvqxGCM6fkO0FpQ9HtLGT2oJznRkKCZ8ff1bG2Xb90KEXpVPytb60urK/mGdprDIusQJwcKGEuY4yQ4rpqn0KGHfQKR55vKhmkMj/Ywh60/oFHsGZkYmpaJkKta6+vDmp2woSuI75yAS9WoonTu7s2ubw8gyT/fAhoNOZIypERJVa+CzLBxqAbbMm5D+x+io4TvX0ZlRum4TbvWtF4BGoLI4cWGgl/SCnBGfNDkB69S1PyD5AVkZV39hNnECMXFlH+h2lz2DCcwDlSYO29opkpU22IFYbilRfAVC92kIEdmEEjxqdkxj6b9hyl3RNtIgupF150UNWCXjmMPmo+wiZjrRdxDVu3Nr+4cN70Nrad37XbfBkmgBEgImLFvUx+nNZfZuRNPQsC0ZDcu362AG4RlqlXr3K3mABwudGXCa16ySZtPJz3m+XSwSXwnle5i0enbQEdUW2EFE5WmIoH+sfod1/753+3vfZ9mxq/dkkSUTiJU08WYyYw4VYYootWwVTmx88bYOZ8gNynl30/CLbCAk5RSo97J3Pk6YOC+U6v8/zfVPNsBHyQlQQ6UHCjnqgU+pQ3UOreqisULc1czYMgKoGgR3BDyvPkDCRxAieRG0imUIZebKpUuOletK7utwN1ctKWr0n7/e02xa+Qg/aBVUBAIKxXQIOL9qzdpxe7aVJ2wBGA/3T/vwVShlMpIpyAYzdyZVLZGWib7ff6yN5X2E0c2R/Guvv+sCYPQQcKarq66f2ckLdAHwtDndFV194jPrmjRQBwDJ4GjUJaPg8Rh8OZpDICRof//qwQNYACDAZ7zf+FgiwZjPerbw1B2QLilOtsCKg19/kZ6RK0/8mcwlTh1Zq1u0wNVjNR/cxW8FP7f18xKzXPbqNkVpvy6j4SkR9YALneW2P4ooGfdssTVEumNlLeSZk3CYPynlVXyvWovQR6ZWZECWtVeNkNj6VMaWans57PD14nwcqQKSuM9X9GNxn8QMRwOv///ZpZKfoCGocOBwmUm40JSQYTpAl03dHIxVBAxnK76ry53YHYX49YZ8++7v8FGN1aHaEBuuHI+ovHR2JbxYYSuqqFM5MJkdxlJWk5ruIcH0m8N4jX/1oyok6yiryx3nTBgrd+nWpZqfjW5GmB3IekMs3RQBby3rELLcS4LbtnNXstzMja6KFEBpAyN3HDOR8c/ycEAU73/6HZAqWdUGLTlP+1Xn3KRXWSMJ5gNulELMjI+3dVVZ2mCoAhdYrveqXveEvSEFjDuqwB6+VUidJyoe3ZCKFyEdoGilpX0LWaS33iGX78/03IAeSgmgK+vJqtljAkuQLB2Ip5whQitnl0Zy4WonrNtxMSwfP+nffKUCuHCnPG2kZOO+H7PSNtSSgF0+cj3yU5rUjpblNJRDg8GnVK9hxL2bf9rmlLLaVrX1V3Arhl2h4Z3iGR0u/tdlNhdLqUAqifJvepSJKFMCCEJgeF5nxsPjlOud9aAbal2o/R/qK+9/SfdXXnH6GMyDuFlmp7uKclDS4gA09Q9ndWyTJ/KE+To/5Sup/jOlTxSLBVg5Gmw4J9vbyo1swFTAAwMAbUjXhqsjATqndXJ37TGYGAo1ziDge8dpW1KY9Sc+OtRJZP5rVaXzjuCNkgL/ItjaUHbI6kHbE17d+vYSJ+8ZNTfATs3bwb/T9P6xDtOCZrRaak3zSAHtAj2qPqYZWq8hPZ5t36Ykpxa2s3MFMMDxyknjH/ZAOsnmqjimDWMYP73vun3psAFyQbQfNPDwXcmSFU/iBrglArPqIrfRjH73L3PEtuqCJAo0QDSPFfiN25cJO21z2nwdgNk3dtoqBp471VRxpnI+DRxJglVioL5lLGRfK4kSwVf/6sv5c97+3AzWmLtI8h+/5rwtkDS8W+mJC97eR/CQORDciN70BiquhBkWLa/JfejHIbUYvDg/7+179WfWFrgECk9q6dqTlDG+T4XdgVegHpFPfgP7z/HcXfb3mOJZUzeh3GowRbQ3qim/2ABMfD/Of0ERpY+RhlLSrnvnhQXFERKp6SWbd2LdkIQ/QCuJmvqH3VgHBn/6dJZdY/WLOkAwO9dLiFLlbYW56lfnV4hMZY/k2wjvHchmYVulL4TDsKHewbymd5u1DDmjMJEtV5iCiSW2UtMwYAS/XT2Sf/y6XETWBWwrLw7xCoLQ5GjkcrLyoBfPJPZq0GVexJYwItR6h6U7AEw8ZrfPcn3fNHTMy5Y33VMC5j9f+G8WuOOajIZWNlC7+fBkD2hXcv/wx+lmnTFsXJxrKGO6gdpo9oFgxKgd1RvFiLaBRzFssmBaZOF1ws8fN+vvpQLCVExL4CYeWcNTZBhL5VshgEDolTWeXfmt5ethBSmInynWP9VmeIb8fonVf1qCRCUvoJXm3O9RQkMHmUSHOlrRUqbymsamQCI+5Zs3/+yL8TYzuANGDADEBwOYZmiw+VY39Xd1XdNu1VxIVchWrlU3OkDGgADoLX+OzedXIaHcFfRABhEv0iu77TOCkCgiXIXgFHs1y8tueQQuRncmRemdL+75cjIxUhdhiZ4t0bSXJDmYkAmCIRo3y9r9txJgkLIxZ3QIf2qGUVwYFyIXXUSsqfwZD10zTTxXf4LWUm0v916bS3JWITya33LfvaTdFIhCo0xq6DlCslDyOuZ3jYeidBpZ++qCrI8iROHFtdEa4Hvv3sFDNO/S9mHMagMrYHla4Rgzr6UNhgrZ8q5P/SwjFEQUueWYttZocp9ZZQrYKQ3i0E/xApfOfxJi5G/XD4QmMEZHNagyy10YcXNEqzl0UP/v6WVz2xm3tM4B4BMYGtVXX1BFzICzupW/8vMORA4Ff/s5LuTdCGxPUAcM8UbpAt6JvACofWrSuqe3s1yTtwAkHlGKEQEzP/jnwgOS8rQZDb0ue0qH/kwUHq9WpZiKa8kB2gCBWBajZSxEZRr/TsOzOiZkQn33uxMO4SEjFSGBgB8uKe048zf/s+HtZlRZJkqPXNcpjYZeUC+LiYwYQYLVa2aRUiMxVhiNtXGKon6PqFx9quTOHAIhUZdnBdHR1p994PH2M/3m2b0XjBKR40F4W2OKB1JX99XNptr1SGIjjU2udaxsoFCTjNWgqoFPfD+l1r/S3Gmq6YaN1l6mj9zpQKNCfbXRulgL15YLS4LdP+VdHHTvVC70xiBcEkUdL1o8Sqihf7zQq1TNea963zGiHLmW9ay1ocHhIX/+ot819AGUrUXn0mqlu0fUe3pE+q2GdAPT72pZequrs93XTTKwgfKtfyUsugMwH+WOIuRNaGC9PcMqfoDLlY9HGD1uaB8EikI0ktClbJMqnzTgQWQ4Hni3je9x96lUNOHnzIRjjXBj0m2lEoptFnwUqrgji/pIv7xHY/S8v/0F6r/HuubKXTBMJjYYqxTqla01jetl/6QsDODcgoQ/KRtgIzucRN6pZqeuuCQADQ0N+drSRTvdDdzioDB1IBlds03EwokoPn/VbO3Je/jiBIelYYb9L9T07l+IJ/mYDjwHm2oXFW7Dw+8Z0lq55/hrMZH/CGEzhH3XUAGQEgmSOyeSeszmlnLITe921+U7ppQVK5duilSbN0m+Ndf9nL/llYg8RDrDfEynmYphATRvfZJGZbW99uv1HclBSTNQVJVabY3Ly2ryjoydjOZzB6VWaGqUEdWExm9Smym5ajKM64ghJtvlWqWAj1nAUnvXJZA93N4B73jMQs0WNzKeLyXcVHCxS70ILikHM6B9w6sT5JcKk5FsAw7dfes9KpBuIfDeO8RBgfooN72qDRSlE/5n5094HvnAhswXFAVmQd6Zc+3Fx6r2Ha6YU+nlwTeIpwAiyRf/VxCCSb8L02/93t/uEfLLPJXlcMIjXO7h1Q3OYs431E6FiihbOn9Td5l75mD0BFJgHwU2cDMI0FYQ1HyuiVBbEfjzH7vMqWO586lwjC657LjKqUpRiG8lLIwiMaSrrzIb+ba00/Vspggav9TVWfzP5eq0ZdtE/FBuhCp0mUbIlhIKWVZMiyWKPlMQIwPougcVRbSCVFuYN7TY0iWgKwTn7yWRViMtED/77D98Wupap2dS3mzjup8JArnyTbokeF3o+w3Y0xtqx3wgP4/zgzofOWcKEKSIclCQWuZzmoVwO3qOiDhRMiF55LHZmIJxBbr/+v0XdnSyCHp0+zt6vCR5Eb6NmtLqWOm1Q9ZYHdwPqTby7Tq18Yv/X9nKu3X34l6QpDm6+3Z0d/tXYj1StUDFQWwEdw56uXIciN/qb3ZEB9AYAwUDgEw+M9tIQQTYzuCgRapVb1NQsOCJXWi8e3Sn1D/f89cBzrdpTum2VOOsj4uJqbhh/rvIgGjOnQviLEFO+N0Kn/Kds8OW0iDwU3KDqOimKAC/r9WvmKbfcqkLqlH6pLqjswMkAlwkqE4z7v8xuu0twUgKsxOsr8hU50dsIBSk9m/aZmWMEO1AOvBAVqeDpjC1F2FKuSPgcomy3v56dxsSK5X6aolGCRBKIwUIEyOE9W2JFCKsfCgFvyXq3+lfdiIMNOwAPhTuhrKgskbtdEvI5cJBIEGLAR2Z5WyYN7Kko0FlgA08CIaGE7967tl6ln98lMqKpQYUHFlSPX+m98lKhiSDaBdfOfN9MU9p4yA6b+9kigNidLptTNgBgxbWYtVmbnsOcPDbBfDah47Dg6L3ZbsJIjhhrF+tXpnDxtFYcwvVITkmOrmHJdDYXxSO3lcDmm2/3S/DdzCgJBIfA4taI7ZKmoJJnz7mUm3SIguLID2Hh67hybpwcAeHvHSAlaC8vdS7xuRDg/l+l+UJywT5GfkKaGF5UxL8f2JmtCpfgioPK961DNThoK1pI21bkv/7x8kOGyTo3z7NhXlwY8txCAza7h8DrpV7NzsQpeCL03Id44S6MLKtzbfI4G0Li9bZz4LKj1haJ4aszFBPhJcID0hq3vZ+r7M/ROGxxfWn+VWaTeh6D7GTP9Qs5a+wHmDobxpyCq1fj/2+v8Lm7TnJf28jzIzgIg4Apqe3vS5hf/eX/u+N9Sbole+HhxdXc6EwVTa6LBU1INkP+nUbTtjEtet6bAq+eaLaDp9b1KrC0MeBwrbs2pmZYXsDUnWq0msqb7dnknyeCE0UFJtTSEW+s6nFwj4M9hT3H/hSZIA7f4/KROYdeV8nNiCsCxbTbR7VRxf04Kr0JYjISQUocJ0emktLxm5VOCVy9BOChRT0T9IF5+H9SkqkZwKqsK/30/t3KQLr/cv1psQXJoGC+FNpuSZ8SPzvy1YkgcGTGIQhIYsBf7T91fpEmhpTej5GuPyOLxeqVMJkZYoZlpdg6Izn30kFjlzIIhhWi6pTn+5XMPuKzOAFDAw1C3HLft1XcecDkFWIWhujl0ymFeW9DEIjw8yf8eyL9g5jEjdQ94FirVqsaXzJ9nHmkmzqg7cgwNPtkYyDibLvfPlRZ2sy41FSCBtA/lKJmJTlauZATMxATy6T0vPkOjktE+MKdvK184oZ6JqanYLdvnyXcrs2DyAEhriXxXXsz15mL4jGVIGEtE+hLDcm682L9srtfpVsQyHiWMHxz0Cg/V4/q/2hqTFsj9FbXvOHbXh5RHkgfZO1xxM9K8txEgy51UsWH7IWn0UYs9fx+nZq4uIiJCjcpCERwwA8bB3ei9U7LtTJzSZMqv93kpr7pVzi68DNDmDCMMwjG4SUAZ3nEggUd3v9/ua1H0wll8JzgwIiLWBct+drUfoTNrQYVrvtwmQ8zI7XjhwYLXmUI4oXbHioaw3fRfKwSqRAv6igfKKzaGd63a0FoTM3wtlkwfzT/Bqbqo4JJi5Rts0D1umr31F3MalcQ+AQEzVg5Ptla4fPMlIJS2/WnZAVTnLY6ilu5dZKo2ROiNaJmNargi/pj8SyaMdhA6k6632+joI20kOpJeGRxvYVxp36Z8LDVNGTWQpdVkkMpp7KKtpLcLY+b4cQoBj2i3M/DT74V4mCPIleVrX0DNaK2uTgr+uClb9fkWTQDcRaupX3Yu0DxCZLQfdra24g4ixVUSIBRyyNR9tNWb/FS9k919YEDAj6Eo3F2dMpVXZC5LkOJ1/rupZpwmOKFeAg5nv731W9PQBlHyRBmMhsQ1v25nWt2eudKV6UUplzIjsNYV3wQVB1ef2yPJNTsmbGPgxXdWAVSccv5S34wlQTGNm2ftOlSTwNmLwLFfib20C/9JPP5FXeBsv78sLjMe41PRx7pEIZPX6TX1zR7Qf/xQyU7sOhGxBZE3WExWSoYADhU26nzeRaeJ/8jvdLNmMzC4qQBI+FR7Z52qYI25pXypYsDBbaiYcvgiVuDZz1zQ0bx5RCjcBhYcfa/1LNfPOsdK/AKKiIIotjsyrZrlCr+WrO84tAK3D9aGjJP0va1UAnSUqnLf4tGZqKI9LVzqZaTCgTLJWZvURTIpW/xDTlO5kDdPWmOKHE/DrDgUP0aRsD6ULM6vMBNYw0jqoeXxoJlpTumFvr0FFI/1+TOUTr8uOheIGLprs64utPZXf53SA7vbLk8KN5ZrcI0nteeaUh25U0pY/WCMDQtpXwhlPvx9b/G/53q8wYBwrEdCzhNfEltUIurKHx3tctoQNhCRDrh9SLC8ozuGuCzS644HY+jGmfkilw6w/HAdBRLTz0kDJf7b3oVpGY4OBwSD/8bk/NVKolnUtbSmKQ8aQrv0DiXcCqQP1SYN/kD989z7ZPMYvpwalmWXy9EosV5licwOGz5A0NDXYNziWcA4eZTba+ybUBEKwwKt+SSnDlX3q9xXx2Xy1gG+DbZHLnDUK3MKryu4iG8aVwXNBQ1zav9fmkS51netxJc+fgGXL2b/N+WZLshQ7tLi0R8ZvCPslxWyJDRbOz/zz/tjIUPw3So2Q3pHlvPAB+mV+F9cK/GEH8nn6b2TU7b8xfN40VzlfxINlmJoZxLOG1FcBJS218zxf36D4gBCweIzuFe9tgmwnmvr7KbJuyRXIOBc5MKHEmoF5Ute64qka3TZYFrnutLs3iVPdFyeVArQ4ogKFp/OLopbFm/gIq1dCHq05/7ufA3AM4RioUfR618WhHyu/SLwW0/EN6QkqecnLXvFq2VLBYlZUllbvp8+zDoPDbfvg+/8Yf2H0tryktrO5516kAW31/eGH5Wqu+e6ZooYG8TMqzZxXFpc/GiXm/Bnxn9XgaWVIQYii0pN1udfrEwBcVccTj9GQYc0hit3PU5JMVY6OsahxoeIIkFtKtSqujBtqHAPMLU21arD3GcRDnMWJXbIJVaa4tqAMxWXTiDGmMda0pqOX6jqOmn0qPFU55Z+aeLJO5unDVbeo9veAWyHuwm2Gvd0wvF08CgTbyrrBvlXRMt+KNGLcB2gHtdKEs1vyHpKBKU8bgPTN6ON9r6BBjfMQuHh4C60Mz5Ek/dFTwHdEnfN9VJkoLd9LwAvXnh/4CJLtBsCVDkBnB0RCNDEwkonTAEkKOlCyq1gqE0nfSNTCevpJE79P5NVv/4r1iuM0T/oQXs9xmqc3vAbjNE9vx3WTg1GgfQGAz9gFd8JSrFAGLS1naJ6uG7rMRn079+Aqv+IenXOzE+UWFrbGtp2tMY6NzpN98zR70Ye7vE/mw3Y8fxUs21FoI21Mm6aNbdO26d5un/KevHWWrxDkxlOeXLmRcL1NH4rN4xryzE9kt3l9Ky1C4oTgMyPTZzL6sYA4PihKrGEbWEkrm/Q2E/buVaYWaWboWRb6+PdHjdpo4+ktN7v+WIRphg3T0lx7BeZc72pEVqgjuxV4thsZwxBwoPwEpDTtKEw2NNQ1m+8LzISA0gDPg0kqk0TY7+55r/9fNSs1bWrbtnv0PlsI23/8F/x903N+sx0IGyyD7HUhUR59I6X+aJHxenvnggteeYwGoSr7517pX149X3ZGx6IvVlbSJ9Nb9OPYdn3d56Aiwf+r05Z8olSBJPgjDwlUICIi/rGRgAMj07L6yCLdB9/awYdt3U32obiuBh0B+rTzOo6dCZZzSMf6vFU9R84CTL+YS7CfQxk2b38v4G0f4qtcRI0Rh3LiGqan894MX9iX8cw+tgCdLN1QTaGcuIYpiO0B++b09Sv59tt4ZN26GGF/S5TGxT141Fp6HJ84eo4pbtoyJtk9OBZBVJJcyyArKZ5VUJU0PmtBq6TjZ93mx/l6acz2vvwCEgGHQhK98IPntd8V0/3+XYrKxAZA4wM0zDPACn/hXsiA52b9j7Tc+nT8uMOLHJ1v4K/q0rticruibbRrmBPXDTUMyZnjp4+2aqnBUnqOGhWYe1w35IV1TMnh+un5wvjxjxUMqW0hX3T3rxMNdVRJ4frpOe982e9xixzb869eM9YRIU1cPn1qq3ve+lK3XjMGEVK4fHraKrRPXgwGyV2uG+qIkMLlU6PPvuIQ4RhcPi8n6d/ncBp+Oth+T4juqX245wMRhjvI50WfDSfIghvruHp95measQxEvOd2B6+1BSTAwMUZ6Pm5FOz/XN49nqk/rqi7lm7MlD1x5uDpef9IBOqKPWSUehwnjp6buLA4VXbdjIA4LhxWCYa9CIXjAmGVMHj6gLg7TmywPXGQAAEXI6Cnp3qI00i+DogAAxdkoFPwS9UF74YFESLgQgR0Ftoe+7c71u1VF8SJ6wbrHseJo+eheKknm0lFUnFfXNSnEvNNlpl9oQdA8aV/mWGzhr2jbWnbIcb8eg/jzMHTB+VXdsthHEMde4hBXoRx5uD5s0NjWyVABBiwEAM8NwvPL6XFElqTdHZLJLNYKmuSyG6INBZLYk1S2ATTySGxNBwfqN53h6dTsbODLypjdlWPONb3LtoD+n0ZtEPUSjs0RH5bKrutI7dtEZltqbzWN5sPbTTdGCw3+OCeFSAzlgWqjIFtPH/VLctZeTEaLe+5LrcGqoyAbT5d2Zpeik60/H121y8RUEUEbHNJ3eYFGdJQimNyYxcBknOjGASma3iCc0nFNMc5e6W7n4p69T6s24gVqdWufULMm7G/eB2vsBx4gGTPwJXPQA9+2wJ7m2m9+faWek5dpqwS5mFK56CgZtYhYxjY4eWVkqJtpH8bXqp4hjKO7F48q/SqlR77enoufiPCP8JZ0lUrHn13+k9wdHR+6+mvVj78kQf3jq2Ec/AJ233XLj7G8sEJoMgE6LyTfhdqcPepZNfp1OY6FyGbi2sB1fRBIAoB6fy0nb/RfzF91C+IIkA6P3vlSn3VmD4KRBEgnZ8Wo/gxSiZMHwSiEJCeXSrxTqf0nayeFz+n0nTOBO5nSpWfmeYiZ6YZMn3WM32CLB8Jw8cGuyfI7JGwekwweoJsHgmTxwaLJ8jgocXiyJkFlp2LGj5A0w1Z5Ana4ulx8xVKT0GJ0U8U1JOpy1SNmdMJq8dqCJjIE0gjRJoYiUZBoDFBnokRZxSkmblPDi9hIHM3NVaPZWACGchpcmd4CFwLxUCF0TEKsfEJtKAcuH66J2JZXxOKp3NygSpy2HZvAR5s+A21904+pI1fbossFs+7BKMfYmqOIXhuUpwSjH6IqTmGpHIMSaWMCf149uuSsSsRPt55jH6ImTnG5LlJcUow+iGm5hhWj02KU4LRDzE378zY36mxvwtj/xtscKqpOdmtM+bune2mYSJObLzAztUT3Tmxdki/AoQnDrRAawxRGgV0xqnL8xOOGArnCWsHawcQLhyYn5gZImUKCJkOyJghIqaAhHl2eJ4nLdfrmvTtfXhUa9PMEKxl46usMH6tqK7OkIqwo+LMqLlvmLcOIulXWzlYA0CMFwW4uR+3WsP4aCuHBIiQAJef0xXhc8W5XHOX5clN89RWDtUKEFQ4Lj8jLcJGizPRDLDQIgy0OPssP/NsqCwADAtgM8tTmMvewNNWDh4pQHDpcdNLceFLp7ZysCxAcOlxc8p/W57snvPs1qI5F6O2ypHa7zTvb1Y9nl5m8uG4XTq3dsdZObxaFOfi1VY4F69WwLl4te/Nxajl7vVJJQFCSZhMMrWGso03gL+XdWMJgEACbOZy3LoRoawbEwACAlh2wkiALBImisxdjid/DGMq68ZqA4CAALa2FPshJXhokRNgB0EsDyle/rKAHqxMhRVS22/aor5nN14W6/n3nfo3gW+/F7W928j/UbSqjwtBxV5+th1O40HSNK//e8K8I84J/l67L7rwR38J/e97Vor+DuqR3V4UbnMbVpVmxxM+BZU52wkh5WQQKxGkctpEOWXCSpfIoTkJcwXt/E/X4ppQrXnVu+3CkR/nfzOFRCc8dEoQTwcaqAQ8XWM09ny8BsoN6Y11eSnm3u24v/qKqP0NtfeP5V9H1F+OEDECvdN0XYIKQNIpCRaC7kaCUeufBL4od3dR/dVQ8L8RVzZ8MWDk7JDKWnP8vPBXEP2l6KuJWz/9pHhwp/u0TnqP2/xBcIFHj6aP9Rg3w2ybINMmNctmmGETZNek5KOsH95AbpbAMEMgyA5IzQwYZgUEGQEzsgEcul/iW+/QsRIXhy6TuDh0hsTFnJsj/835JdYJZt998XvMoPzFEnkF8JO37/NdzqDXKb7xBv1JcTHoKYqLQR9QXAx6d1r/tqx3SZHdWffZ1xVjoQvLfqV1dkUiCchAQgonwBNe4PVnjielcdNaH0AAl0UYFw7moi5PaAjxlg3NPCHuCMXL2R4MhVLxe5aeT6HYCUwxY3D/Qi3AhDcw/nnKsr39sH9RNLQnd5omLlR70uJUwqKOrOiYqDiVpKgjKDqm9eFtX66EUkN6SnpdHVXKzF1jQieg9nto3lT2r33VsLjAbznjfbsZ74Ltlbg12eh7A+m5WYVbzs6BKhZurlGtqOovSE/4MzWoff/itAmFE8aaUG3fClQl8JZ6lOWUIfYmbv1hTM4jLU7sfM0233eGRBy89MqQmOLecFh4YhLdzDJr6eLvubG8p5YjkvKeWr4Qy3tqOTCUd9veOu5CE3pt7z+OZOIYEg3X3RwfC2s3pHot+qv6qnEbPjzEh0Nd07eIqFtDGrWEOKOt5FM1aRtYiQW8gLeaWSgLWHgFqcD+AFZfj7XXYtV1GEN90gKJxQeBN5pZ5A/NVacHPOEkHbTW9df75l5+rylIW0jrzc+lUxDQHg5/yLaj31WSEj1LzUYeg6AoV8kzv5SwKCx0jX5hcJbkVvWdtqrvJEj+M6uh2wG+KTl+Nv/89D0TPmsQznVSZEEGuXqWP5bPwxQQljppRJARFZ5j1OlWYzpcsoCS1VaBv+T5VmreuU+GljYbmypSClxwy86VTblUTtZlbcs6qSBx8BazCv8GC6vAbrCwCtkGC6tgbLD4DbPGZLPydxTjxMlTAuUxTPQnD18BGdU3DiO7gnl0g4vgMvirqKTGjwf3Jtb/wNCIVhSpYa8+u5NJhQODN5hUoC9YSIXwgoVTcC7t9anBg7/n3kQVcfOt769OFcVwLND4T3xsLqm6WGqMRgSZcNpUaaXIq0y9mtgMF01gnZf6ocVoNC0nE1nHPuCf0hVqv9W6u3a38A4wayxkTOtKdv/NH5XSYtRrQaNYYy06q/WYjwyqpylxJeVxYuYfpo2894+7g22l8BnIyFANTQu9RskSIBQsHvFdS9i5X2nSaxIEniUp5gJjOCfFeZm7UuN9PFtEDyP3o/V89kgyijsSz4wiisQzo1gh8cwoCki8tT7je0wtdY68iuB/0AnFVwoocOXAyaVMvWpYcK3jelbzzyT3eQPEKI7a9g5/3hytupc8gIrNMv42f0yMk1Eg+IGBJno3V/R8dxNtx/xtR/tt52F0MB7e5TTGOBSGONRGOEJtgOMr1OdYHQLAImmqCCq+orGEorCCoraAEl3rJ/7p7hSrKAvaUKjfD7pnEkb0wHHPkwxt5fhngfKspiRo6ioXn5TKvQ2czUD2PQyxc9qEC+WVhSvg1okKudTQUnb6zMlSGcmTRZIqi3WcClLG5N7d/Zz3q7xQ3SdFcaLxxUvFAmU/jtZ3ofJJbT9PM2H5gLtb/kM1RnEm//0AoItIkhEOgiyX2P7jf8PhhbwohCigD2OfYCAuJsfsuYi2Bgy8mBOTJZYpH6w4+rj5vx/d6xcohhwvUyNS5CnEQQHBPwzNErgUZUSdR7PSlWSZMNB4hpcNeYoBOkmKzxOXqts4zqqDXB6aLSxPzVNlUX23KvMAVhFjyLi89FBXfMvufd6+vMIQVjP9J8Jcw0vb8sEven7Zv+4feihjetrkW2dfKxQG8GiJ0vTkeU93vwNoG+T00Gbc1cKj9alHGbgg2fHYTqscR3PiS5hOs397wrDChKSAkiqipEknT4gkyNTOaht75EAJY4k3csmUoMkq06524Bd5ConQxnV4Hm94rq2Y4lo6U3zXAzIPLWO3h4YeGfxpTfxTHtkvRN8Q6Ze+aeMaZG6LKgOK73BdEGs+TH7up+5345c9pqXEyf7RvfqrDeNHflH97x5M+3ghJBPgYMg9WeY9svdJjc1GtST8StkojYSBjTpI7Unbh1y432vX41z/o/7fcz1Zgw8kmba+efR/4WfHQcjLHwUy/DT0NsOmSbWrkWZXL8VuADIZjrfeiCZbHe+bFIMl6rk7SX2mkMEhshl3+uaJJrdfrP3NfDgQ+15QrROQXlyr576XvXzuArfVgH75ShSqzCs/lMNJCfcrv7QNXYxMQuYCi/cUyFVpC7i5qFCHXygb5eiIb+j8k55lEw+5iW6grN0RWlSwqzVdfLMAK7V2zPoPqI5xYQ2NA5BkbyXb9ViLMAyueWdjXM+7AMMi1PrOtlRN9ZxC3cLaeoWAyQumGDAtBfTW2TTvtGxhlTRHvxzDxq2UEMvREzd2Ms/0qfzSdbzSg8wnHRfgedX4y3+wRDwvJrni3DESFrljBJLHCMTf+GbVMO86P0E1CZNPqUg3wYiFyUasOUH/8U99h3f3XaOvE5T51djSf3o78pmgBtBHgKvC6THkNlK5MGSpxBeyVJYLWSqlhSyVv0KWSlYhC2SmkOXzgEmde6feIBQxC6jXYeZtUCzm/tw669El5vlJENN323iaLkZ/f3L/qvzBp9+5fwbBJ7UIfkXwYOub7Srp5vR/j68OjjOJg32duMvbfinYUu/lC6miDyM/8C7kVcjTkVA8jHfF9Leifm9O1eAORIF3ItAMXCyZ+LwJ0UC3yqEK1OWFnhud4OnzVjoBz+dygpTP5QQWn8sJBj6XE8B7Lifo9lxOoOy5nODWc1kBqY8Hsxea5cQs6avf5cS+6F9vTgyFHjKW4q8Pnw1+wnUuAribDQAsDAOsrQOJy+X1kF/kV/0bMCAUa2lGOFACUxnvTmS6q2K4G8EWjfwjBMKLlxmM5OYIr6eaOqu+zH+n4K9XeyOlicn7/mFS9srjlr3Mqq/tX64jx/jA3ElKJFEMdsctaY6h1EMBpueOld6ctznNmKObmDsMhDNv78K4qFYdXxjouXcEoJbP8YVFEPnOtUw1sYML9jtR3j4sz4vIUR5ZqBE29ZYXZV7X/ONxSU5ljZEgyBcjkDWmQLyN/5pO9lFDwSiGLCrc7BfqXTff6Ka1iyQQ+4UB6ukb4RCYddkv5WQNj+MLI/polErAXita9q/jGTYqXIBbyCDnkIIBvULfXcujB/+dxoPBc3fw6MF/R+/YPF7xTy9FN2czaF5eRLWGPQIZq55SjLBjnGCVXSC8Jrr+X0vRvnNBWpOa/wGIf37BPhCfTOetZLFLySvqqrLd3Foow/zmguGzGtNbGpR1mlolnhVwoOg2myXXZQ0d/DfLN92RbjvkqLw5ontMqPosyBDjjwh7/8uL5LuGuGbE97JQS92hNNDcOb6wwDzvUK2ZP1R0oaiMKGUANs4sTYDhjZwc0IzKf++DBgpWYE7fZYhtFnHv518AmZBFMNXNBsu3D/7QMvXOn8rUtvUGumxv6mdpaGrHLc1l3Ff0tEQuazfjB1CStSjGKh2jz+0wyr+4RPbfXDHi+cliBPLFFEgVI5AupkCymALZYjB4Hp2HWDqz2FHf9fGZev0TgP2CIENQ4Szybvmyhd3jCo/Bg4YzRsmY3fAsUc94b6PpOdlNkKXeP/rqNakdeeud40aEeusbURrXxq1jhpsvtocVcCmeOWK9c9yIUG99I0rj2rhtuZR4JK+Hwg/ysctf0kGOh2INhk91k3XqNtqtzX91yiZ7EJC6ikNfKv+x8mvZOb7lQumJat+EEq6NU7mIKL9t8lC6wRJnxD6Othf+FL/j87uM6bPtaZElP3xmLwIzd5l/5gH6mQmn6mCvH800ndBdnWj6r/bX3CeYe6vGPvDW+8aN6NQXQfs2hK9cGrd94ke5vEv2xo+A+7PCJaf2NfpYGmvdVnNsm1KM3on/hUsD/zO5b+SWh7KCA39g1BFeXX76reM7wc3ZVal1Y1uPl+1eRFLZvU03KZkeu0SdvxSIbMyyF/mQk718h5zshTnkpC+5Yfw0ME/nUP3Fojy99/TjmKiH2/qPsnIh3SIZaCVjZP5ad+T0LqszfyepnvUvk20Xvy/mkMFVZb1Mb2hCaVAqDfcFTHGZt9yXcBGHDK4q62V6QxNKg1JpuGtFYEmXN0h/kpA0WXz9CCdNqF5PqrBg/Whm6rvMWapXRXjEM0UL6qfr/BF1+hHMFHWmZ/7ILD2Zopf0zB/hoydJFIyeNJEiHH7Pg+jL9Q3M+Zd7be4bldsT/SH0Ac/4hqjUG7Qg3ECo3DSmmLZ7T2L0d0Udnjqg0oMWhEAopTEFJ/jxcgPAUwdUetCCEAilAKx60Xvd3kvaYxvaQbvdv9v2kDbrR9RM8vNvHuV9dy5Y0/3+nC1x/lK6tgRyV8uRjVXmOjhyUle4MX/eEOp0IfQ5QuhTg1gpI4jBWji1VGlHQnucXzzKn7Etv2i0lwBxqRjVXsk5yg/WPib8lEPorD0WtHcUnQVBpDc0oDPolNaYIiOUn6plQOap2jmqgEgPGtABnZKGl6tO/quDxU8ulpaypvQ0ILEG2KFf2J4dJAihkXhP9F8uLOMzYs6f0ID9aeq/MFdG0ijSZk+kT5ZIniPROqkRfakx3LXV8q9F1rWrtt+kazsvC4G8i7jtr/OKnI+IjoiPSE40TK6tYO52fWO5oMOb3uWQwA3LRcqeoa/UU56tt87ATbKFRL6FXLWFSrrdCCGX/IaAXPVLNHNq779cRdN3jjmV5c6GUUp+/JhkmvwgfWyQLDkMdjHzqXM/NzA95ccxTR7pY0iWZBCal3ffYcr6a7efUn/Zqjmvj3obTuWmdg3FuNFur5f78ztRdmf72McFdkq3QXfL9Bg3sFf6DfrsF8MQzx3/bD9Jnjr6p+jpsJ7jXh9ztfPz+WO4VPtndSc4Cf87cNPmxrRrPA7/2w7Ls8J/0mAmv/xUbiwbPqwGYW5x6yRqg1xlUCmtMMWULIthFqC5xekkaiBXAZWSwhS8G/TEfG1ucTqJGshVQKWkMAX16RX9FszmFqeTqIFcBVRKCnNQOmwOA7c4nUQN5CqgUlIovC/HF6ZJK4FmdN+e2mJA/kNV/0mh8aRR/5mcgSQnBihBAWougBgHMC8FYH63vx3ZD/KffJbuy34pox/3ZF6t/6r2ZG3KqoH1nyMTWztW/4kt4Yq9hzoB0Moo9NeLRorL/TflKUwX9jH4DMCFi7vQWnyvw3mNNPjfCua1G+FfhwlNWXgR/xkTmfu07BSZbr0EuFf8Nq1OoTWoRQaR0gozTMPbdYhxL15xOoUWqEVApKQwAw+BHAqbl46bixwxOWJSRI5xbR3zJ8TE/94mfxZLjGnUf+pJuG5bA/bYFc/DoDcql5usdvqF5vnF9vi1ZvjV1vfTgnqEfB4xjkdL4XEK3xEyd8SIHTFZRw/U2V8i2/WzxcSKb66uegLqwK4sUJXF2gCwvbXOn9YAufHl+X0y9/9cTf6omfMf4PgPdrkemlphQhi9nbp4BJF+IUpwCcdU+AjhMaFW/Mtm+1MAgBfS0aoBHJ6q0mNWDREx0oidNpjicQ6nj9PY/1Y8f3jFfsBGOp6RFl8kpRbpYUX7eZKcu/Mf02TOldp/KJLGVZg/gsjE4j/wx/xiPl5H/5Kr9Kp/veUPaSKuy2w5Z9GfcLPUGDTryW3T77TQbf4QZLovKXlbMsyWlKqlhGl5ZGjJ0FlSUpYSkKXmYvWBDj+CspMOHYLFCzyZP5Vg0xIPDOelL/OjGvxHrInFaeKXkzjj1gTrGKItbKz8TXv5/IJ6xOvcfORymPaJKsM1FPoGmeu4GqOCZ9oSfDPPVuRfl4QuoQlf76NTCE4r+O4IDhf8mwoeI/ivKcTDP2GVP2AG32tpNkcc/GsujW8QmcV/VAn5AW0qLpsSwyakrxmErqlYa0q0mpCoZhCkpuKnKXFpQkqaGo4m0S81lx3mI48WFdNmWrWGZTNifKtuV1dfpDRm0gQD5TzMql9MNeyyvur6FiKJDbcvtrZSqQxaed6EzknkOQDqjRZ9m/kP+eS6VmjfAwXq/Zp/h9btq43fD3WvQu+7+GpZ7i04sirtI/e9LoL8/svb1xy/y6K8OvPvaah94XcQ1J/w+/VpX/jd8XQo+F502hd+5ze9Cr/PmrW4Qzc3IjY3BDS34zLT4ZgbUZgbQpfbsZYbI5Z9ZzLXrDIOu66Zw2lPjq2QbQiHUZE3nzSpZ+EPvzbxCsvEAUmruWC9ie536K5AF4OGLvX6R8doMIQPQUyGQvQQzExc0kSEsBgJyUMoK6sEMeXgRTK4RVtlyZMW9errgamFJ2xkU5O0GJpa/4XYiaK0wuuU8qC1GdMzfBfO6uEWSnrnpYKgg3I20K6EryvD6aooumvAc9tTePWZte5Zs/+wGJRVDVxVx1KVIVStkVODOsKkYcHkUcHPsFQh7TKj3fbBIv7ZLHvF5VLhsyTULBkkS8XG8oXEkpCwZOArFe/KF+ZKQreSwaxUDCtf6CoJsUoGqFJxqXzhqCQUKhl0SsWakiKm4Ixs/ndhVDeOdgiGBxk1fMPBkSD4146M7uHXUsTwRWTBoZFJKpGHbiIH6c07G4OHOrPmKuNylPGWXp25uuZ8K6nN/fxSkoq1H7J0ZuI8wYNEMMLB2S0/crZLeXZKN8YtO8EkO8UTO8QK+6A4YCN/kUUIskxA80FxtUYXWUQgyww0L+JUzWtMHZbkusSUXwiVM6RbPCnFS3SgOhLCUThh6isLVUQkYPZKrY572J66Ut63lNahikzhf+hirMidvXT7qivVo+GhpFM+rNon2cPHMa80zAlIoLEu6um1KQAlHWRYto2aNnzZC97SR/LPBHcG/9ExCdikvln4Px3OIVW9mNTJfo5okDE7McX2g60uVdiGQ4z/5ScjCfyxF/gpcGSlroMMpfNMTPComhrRoLLLu2InS67j0gSNNcI8206ei1ucs9Uy/cJ84pthAkWR28oXM9AgU5dpgTWwQU3BtMAstMgWTAtL21tAqfNh6XpLHHU+LH1vEaKmTGH/LWSu5PZOYqAxg3lxA4Rpw4Tpj0+YBr8JjwoyHs7Gq0pT0bZLA1CIVBYLiTOW8BGb6Dgobyy31LH/KH+CMkxkwVyOnSQ4n+b/4QkPTT/7cOMCpYNpN6XdmHZf2s1JX1KQliwOxai+A9mxmD05rVGDfDJGDu1+mBz+E1jb/HIZ0GZxME+Dxl+E11GI8YODQ7HjMvWpjFFU92HJSCrk27/wdPjPpOBw7JizQG0boRgooBtsT3639fnYjp623lY/uAz9me5p/jFFt1lNkT1a5US2CNE5likpdxwe+JVKps4jp6dvF75qDfdS32sdexn+69vO8uRR0SablXVnovHWPbAMf8+XD3l/7yLnmX1S5HLebCE9cTNGvdIIaRtr9XTFsHau6XaUoGP4+sBvGxsa7b9/4Hg1+jF+WPhkoNl/k4bDpRw0lcUGmSMHC3lAHu7VZ5bsyfd3fcxFB//uk/9opz/d//wwNHu1jCFSRWQulpmXb4rlykocggr8yc6Ymq8pX/OPv6OUEHD2cVYNRnZW1SWgKXMjXiB3BmnxgQB3AdXDl0nlLBlMriXCC0ldRZ+z4l0F4T+6sVKWkgoiI4eFhmy5/Zf7aIOe9Fzg5XJAErShLII/C+AOwB1whl4Huz+pB4LyAalTX5lC6vQA41s6pFT9A4+24xx/fJuNIh0822i/eOXUmBhyI/l6nuyKnwKzhr2T/dqbxEfWk75szgR7UclYS9qCmWAv3t9lHekKZoK99LsHzBBTMBV89nfCaqMGdXOCrKPpsI4nvzqe6urNILY61sP9pKft00eaJ901WUouhMykMS4zHTLBCUuNzO4mZjxX1Hmq8bpuxui7SdFCBtb8RbZOJjUcIkG+JjODkWiLvEn1osgnGouIUej6tvz+HOLo/M7Z/7hdTl9YussrRqfniN7lNHmXBYIdNF/iE0ZBCKs8C9W4bArfAPRBqxJ1rO3svVtSiXyS100JyCVoPmT0X+5FRrZApfv0WW56EtW0JnF7OdE6Swwh3i0EnFiS9jhYsp5/rlClHP0adgauOesWd1fMQOtOAeERhNBJZ+EpGG2lqHip2bsLkEOpjqYh8R42R0tSQuzZ92/sxnbF7owAZzsMcP9X55kSDsOzvnPx1W6le+lcTprcIBMLMSeCNzQaV8CUCAt1ZKWJqMKHCW3fHiLH9UO0Ws62HPgRQGbaIJEEukhZGv5jji0WgG7/GFWpyZK1I0arR6IE/+JFM8IpfpWVW8JmiXobM+V4XaLaSXfJiLrXbMqW42dhhCFp8fMd8vmzn1kQ1K/9HF+4f5ncXiCwc+jjPlcL4tHjvd64GTJO8/MLcvdI7gxC5cgioxSgCZLPLaEn6GGr3IiLygauyo3MVU0X3bpxoP8u98eXdUgnpdPSYdktsrPkDBY3R41J5IWdh6xzHgKOdES4IdPeDpJStX91S/+geFIfKFiwutE3bThHDl1F2Qoksove/Qy8j4vij9l0BIyMVSc31a2rwEu5Cre8FKX2wfooL5HZAJ9YH/Itrv3rD6qpCY2VnO2jxgRb9fTxeUc/akxwXXXWjspnAufwa0ngS8dKEiPF2p0NpIdM1BiI7KxJb7Vg72j1Gs/DX99tEENmez10Q66fvlH0ddH/QOmr0I/SwaKq7ktEBDosVyHNYd9y279ClZqGFLVYD6NYF4FYF29YH12YpaycFDQ6GoxQQliXgdKUo+sK5jy1TX5ZSayz9q9NoSYn89LSgvUOfwUJNVlqyOpWJ6h5ANltFC7YaM5K1R8Qsecs/eVliQCABiT/PeDW416V16E5lGN4n548L6cp0D8ZTisHaAk9ZBjdOojcevjbamjbFsXWVvGxjkmnpNOyszSymkgcMvGSTrtJ8Nz1Kkov9zLQX1b6y4f+UtODhWbCi9Avp2di3RC7l+CNUFBSkoYUm44wApLscAdkm4mhVS5IyDiEPAm2h5+d4XaXoxK5Xum8AkB6KhddSSz9Ukd5ClXcw0ACq2Etif3W+jF586ue+bG3Ncyzut3hT2kln7q6ZtWT9A5PWR3t40TkWIk5LmCakNBQn+yWoXk62aXQETiyH8hPs1z2iM6vka2PrmIIhgYZVAMHVAv1Uwnj04aInnI/6pB0Rjop54uu5itJWxxwaRNfmeNA21UZCgnmCgmKDGWWzMBLKmd1bKr8yswdgwpHid23yieO7FOnv9lctpWL440d02GdnfEG6HS7Ttcnuoe5ZLfUFt6eM545+8X2VF1nTdS7FiqyJsDSGTvJoicAHOFCEQmmMdtJVo/vFceO8DmS0xYSNts59Y+7yJShYJUnqErex8No3xgVRIrKi0QaOiSJWA9/j7bNlvNEz2iC7CPJ+rCz020m9xmi94MVuscneIFf34uPAQ7AQk2vAVSk5T2Ai7V9BkiJju8BurRuPwNMmRU7zKi8N36hQALPxcejo3Fk4AfqlDhHY+nRU8mQ2wqctgqFLcJcixDW+g4Feu83Kil1ofG3LIj59l9pdaIWd9pNAzvOqzTm4AwX4R6zaNf9aUJq/XxummDv/9lfGI5aOjEoAZJ2WVYk1jwU0ejtXM0iqwmJTrIAzG5HnOV+AG4nHFj3XQn7JniSXvdNpCTDTVgkw00MJMNNwCPDS3QjKQN83TqD31dm/tij4EE1wGF6OR30PvT+sR28YzoqSbFsjGePdY5i75mojrm8oToXEErqutK3XQJLb4yTA3pmUYBv+/n/9smEZnuyeZEypK2dNOwh6ronH1Vvl5z++ZDM2aYvdAFFFAfi3WFO/RHaXrMfhAITR1nXOPyMiPg7L2HS24oAg4TExQ3W4bha53nO6Wd/z19Ix8MtfV+if9dWt+k31wcPYPru6smbWsIv6lbCbtKyiz4kiQRgrxvpGLUZrx4mfYr9GsCXQaJbr5jKhuZ5Ur+WoCRcrCwBrtMw4RoL7o1/OVnqxWu8cRsni8DoQjcCTkABBAuHsgQfumUXPic0MJI5J71iFfa4VijbBx4OQr0hYO1ENx6gLFZoMIaVQssfFK8KOddRdivk1scLEboOv53SkMf7Nup351G6XO7c04ixOektzpRMk9lkWrnU+a0zzvtMEHp8tIHkNKMgmQA8WvykATCz1FkudidSriehEZYeU/+FaYbXeixJWtfn9/6T2VQmlfFzDw5Wmetb90iX+U78vSHHtrNTFLkZZPRU1xc6Kp2SzspuF694oqtQW2AXCTcCMfQN4GRxVm0OHGvl44Ax69iiWU7PSyCOdtbJXTOdDPeKW/QGYtoYTBuJ6Y8LU00f6JB0VH5B5MvtBgZsTHqFm0b0aSx8+gpjhJm5Qu9ghS6v0nBqb3JYpf9WF2RpB0p51IJEDPcEx5qw8huUBcQ8N4ncYiXiEFjaCoW81MGRyJjkz5Iflc9i35TSfV4wgZxvNJeMW//uOWbnj3qPZkKlK0TLCwC7IRXBh3JdkyTWoO7Ct7kK3xk5I7g0rw5oggUF+mqDQQ4GMK8CuXoHCSnyOV/r233JD9zt4UENHg8QCgaDhrmHyUzeW6yPGDGm6/yPfpKv2JJrg3g8AahhQhrqMXl3qZPUYTrJSd9A+f3nbjCUuqFvjvX0LKoyC+lZSGYhfsRXw1Uy8X+Hh/Q3Jq/5qtDtQwJ/+VBE847Sh3fx/juyKB5Cs2HEWuYf05m7n+qxkjTo1UuS5Eqry4RenSPRoxtj6jZSQNDAAI4ZIjFjfF7Gpu6r6GWYUFPFJ6je3AjcSIK0k8JXkZLvvyQj5lbgJhaknTW+GlN3Jl1INyJUU44tCuZ3AMKwIEzmVXndReou5cqA2AcKcDlL9P01WjVcLldR88KqaUbomVmZ+dfZ2jJeHTSoqhg0t21vaOEmoDfDD3OvjRttscnK+SM5G8V3kMNCaVue+4AaJyBECcuzJuxxV9KBdCLSVfTiFgTzw6Jgy4FN5XEH0pn8t+UXjCPRVG9DZfdlpLUM+BzzD3GYq4BEeYiaUicvXSVVfZ20NrOSe5IazgcjJgTBDSZLY5sIEQsUO8Zyd8U1xmda2YY708GQ8Bka04IB+Oa1DYYEz5A4wc88KdlP8f1eVXbbAqkFcIbWPO1GoOsNDXqNiZgJLW5am9n7qP7qdq9prv5jwA1BsBiYyGes3Vy6kv+PxKRXGnVGYjSQAVHfZbyJtZJwoVKHEo2QDDfUFI2QGt7QpmiEZLmltmiE1PKWtiwrJAdV+296EQPfe/fgvToFOb2qYR34lHVkvjrgPXodMp/ER1DxY9uX/jBBb6++bwwL9X9iXtWNJiRALEqsQVkWAbAw2PLgbPUbQtVPD9VXJZnJO2jXQrD4FPttKvfNIUhv7P7ceIxPKOUPwZQVkvT2VOpTM0Vi2uUgm61FWnDL87T8M6iKnkmgEoP1mKpbXkmAWJRYe3ICA2BhsJWBrz1M+hR9Y+ih6CW05T17AMwPk74trvYw6VNoCz0UvYR8yAa0rdyU3b6Juj0r9363lbAxHcFsif20psx3XewpVahCFRbXBbWoRS0mNbKbTFuuvGiLk8gMCYjr8LQb2Vg2FKEeujEbm47MyTeZGqlKgCScMLEYuW0WAl4IgZpuD4ZM3ilmWsyE8LQXoUovUtM9t5eiFrVYTFcTrrEnPUJxUjkdQ5xwUjlxwknlxAkHq/rkwCQ5ODBJDg5MkoMDg6o+XfPwpeecc3zpOeccX3rOOds1lnI4WMrhYCmHYw0wEjlwwEjkwAEjACQUiutvXDay+kjRfRYq8YD1uYfd7n1+rTer1QafYNgr3yC6ltK8W620DVqfZYD7ZAaFU1HoT0DrbrmzaOv2uIcjGo0DgQODA/MhIac9zX1y7sGbaOt5vanrvvclsO7pkhUdie02vQlIKPMC9zn8vkCIFGma8Y9fLEpsVcT8YlFiS5Dnud2ac+/o/Fx3aULDkZPxKOqmNFMgv1iQWO4bE0QcaPiOct9r97hv3CP5cjgQ/KnlYUmffc01mW7Si1wibwKDFd5htdACkLfk7ZUf5oZJnyFd3B80wk9o+/bMVlKANXkDAqaNDMNCyd3aW/LRXLz/XP7/a9S+RkkEEoETQmAhMMksN5Vu5H8jWydmU7OxkbEtKSMkdwkqa1LcIkbkIv+tFt6/OY6n9uuAblH3aS4qPhRff2A/46WrGd0/1kY2HN/JOGp13uP0PpKLWtI15J24GxYEWxH4SJ2GE1C3oyNXP9WWN+BuWAwsyf3083/LqWa337K2/UbjPwp2tvqix7nzUZOPK1c9KPkA+lEZFkWPHy3DCYvzpuldJBZjJnXalXznW59ho3yvxC9+gZTOuGodTlidPI3GJVBcPbylHmodBquTM1rE+uKq+yzttA6D1XmZ/Itb7hWLEVsPcZBa1KpiFurPFDUiBw83SWhJ0e03LsNgcUsaPJRTAIWI9RBeESJSTnDN+Tyj0bK3/OmL6SoAyitixGoIr4gRqyG8IkashvCKEJE7wN8fNz9amKJWNB0l+T1tDQO2nAUOP2L0Vyb3pd27z4fib1m2HDxUEx50zxlHHrLs0O+hWjZ/AD353s4vwe8bBBJlithFlh/O6HgkbnQmN4FO40I3gU43QjeBjotCN4H+IG2GW6leJLQYWAuE4N4SU9aieCEG1gKe4B51kieLGwG1iCW0ItvEC3PCpG+Fe9RJnUwroBa5hPkpiHUumaudvx6l/iGH2eWf/mzlP465i1bcosTvpXvca/fIz3MYi5SiNN+3hR+dngwKnjiLsP3GAjbZcHkAjVk1RMRII3ZbziikM+aUqqF7EqkyNSkfTYaEKSgtpwgRayGcIkSshXCKCJHbe9S58c+OxnkWe9t2isqWRNsK54hFKyExm7F3Ot9u3cwbzHVCFKpIPz+XwV4OL/2z7uxINDwfIuaQnO5ml0wD+dbsMmfY78DfJmHgbJJ9b3hoisqAaBMzvW/EIlf659Pnq3lrQLOY18Zui6LwXqdVuMfa2dHhGn1wjvjkazbJCYuAZXB8fteI1UutQ838OWEhsHVAT5y0Kdo2QCxaCVnRRUIv4OKEuPCRS7MhRGVLWpvZNZn9KkEUhXdGrcJgbRtcI1YflaTDHwJ8tGh0WdPISFALPUf/1fvq18XHPSxR7sFDSheaeL/p/a62FIuiySy8LUbCaSms6emyB49WYbA2NSNRwRTWTXaZZ1plQbRZGP0jBpEcaBnJec+zN4gzn8CKEKsgfCJCrILwiQixCnJy9kEE5KDwTeLYK9U53UiFNM7+1OqDBcAyuD63W7RJnCKtH1pRi6n/FdAHc8Kkr98t2iROoX5oRSohMSPlfSx960EDEdLX39MmcQr1QytiCfPTkmIsaLyyxh8/GEc3Rud7mSIgm00nG60TbU3yDusF5J0I6wXM4Arre2uoKPwbPp7Ti0eJWkdJw48emUihns4bXpmIcWk+Hl1JqebHi51ETSTNxiNEKVXGeLGTqMc7aToe1VepitOLnUQtJA2F6sTfY2+XwPILFZtWXDtrLhEg1kC4RIBYA+ESmE9yCisraRpg99g9BkUJjJEsTxCg9JEjRQoesqpBUSNR2CnDaFBISLSmRstBPrW7+I+YdhfsEdPgIjva9zD5a3KiXDmt3PTl1rBtaS4ay0mUWU4jn/aH19b+6DmhDb3LWy3k0oUIESKMMMIIs2guRjSiEVZYYUUr2tGyK38Cs1qDXe1nnC9j3hlaF8wPy5bvNL1LpIlPWFl/RypKCfXnN7hgAbDlwyXSpExR1g+pSMUkhlt39onvV9MLEQ0GK+vP33LBAmDLh0ukSZmirB9SkYqpP/vRBfPApK/fJdKkTKF+SEUpof7cYRfMA5O+fpdIkzKF+iEVpYTEcFP9PvH9ZnrhnU40GKzM7NKXdMYuMy4Yu+EkGsNJlMlPv86sB2TGv/vphY8i0WCwcn4kOkHeWRMPMkpiAGR4MAS90+hyWCOPGlvCavvdVleCe8l99+o+6uX3LwrDb1p0uTdouph2XBSdhsll2blag/zBysQ/Kpa6sm+hNO4UFoQsjP6hd8pu4lSuIB/UyNGWZzzGkb3M2xT0PGJusXqWMn582MeHeWELgUPbz+0nYbKsDraX7YUgTB1sX9sXoRim2va55xFzi811+2SrCJUh1OsrEP96ePKnMRgCZwsIfiZViOj8AvQRo/ML0wWQzi9DGU965aJwOdG3hZ4Lh8/98Vzse47nAt1zPBfVnuO5EPYcz8Wr5/gtOD0nFficIDiI4sAgXrxu1sq4cUD4EFOEDrGvoCR8zcnchGfOldDn7T7ndIdS9Ko/w8AD88OWDvPA/LD63aFMymRh7VCKVML8HGzdJIFXFQVs8Prz6l2mf79VpCegJILD1LLXdiUB1wYWJr5pdy1KHtslObXMG5EYYGFyODhOyD7zrgiWmBBhaji4P8g+17EIkWCwMPPTx7cpofJow9Qyb0RigIXZGZYDFC9pgJ0+GJBDFng5134nPYefsjJsKQF2C8BvEdVY/gFbcbNe9QzY6JZRPTNbSyp0iLnFFi5taEw7gwYTostA8cviGvMJRAT50t4QQzDtDR4E096wQDCtDPgjWZb+UBoce81m4TPYs/KNZ8bZ98YLsGfdwzRltv2Aqo6rsQtk0t0oHaaTlE5iOnnpJCfdMfPNljgAxA3LRnzlmNzTsudUCEWuZVeU6AA3LBudMAmTx9XdCEUobnUH7Q5ww7LBAV6oPnpmUAiTOpM/mHxVz+lvTV/2n+KbvqWEoZdy+b6HnedUJa+h5dBPFIc/6Bhgd7DckLjMY6Aw3IJDJpPtoPn0r47BVdn7kgGfsj+o4TpKcXv6YMkn0Qnbx4hMcMl8sVQVL9WwSJIrJsMKWZtnbkx11arwHe/dglrRkOwVwYqln1ecnJUZitLbDIKmotIJUYT4WZnpKH1IQCBUuEQnCrpfqxWlEiwvF65XxL2VmUXSVyAQKlyCBSbdNKtSCZaXCxoSUMU4hCjjA2IWj4zLLPgYl1mkMS6vsGJcCJ/Y/pn963Xo6abJ/j3ZpbCFDcm1NrX0YXq2cpsvlQlCWHXj2jxc8mkl/0dLHhoIDBjULPXGqMkFyqFmqbcVTC5QAlOQVTlQAtNJoETCByxHfuPfJhRHyDq+zIehTigvud/PbUV39rl9/JclfbS2q1pCdUiTHRsbhk4Y4QQTXEhjBZFbLV6ZA/lweKUJ5DLLCUjllQCQyyvbH5dXaj8urzx+XF5J+7icMvRx4We7Nf44IP7Z+ju/WQc908Af0lJWbMZH46wy7vHeKr0e781y6bHeKnEe7z2y5NWd2Z9O+/gwP734hDD/Sd42tp/UueT52LpaC/EZQ2WTr2pexuATivrkbagxQGQmYYzKJl9cVuPJqGzyNtQYIDKTMAAmvInV4rtnq30uVECobPKNCpcx+FnBfe421BggMpMwRmWT7xe5jMEnFPXJ21BjgMhMwgAJQVFBgCf1Dm3P145Cjykb7yTN2buPokenPL1w2nQ/55juAy/Rnbq9YqnyUOwTOJW1U5RU1k4hUVl7xT/dcYiBfqnLYPyW0mnKX+nAhzlOsvawtwr0VulYEJekxnjw2/fYpFWAh8KLpUrBC5NgzpCUWCCS5MUX/aUsunR1oEWNkGVLxC9zn+6654ncdCaX5BF5QCQKRObdS9RATA4PXN5xJgSOVQhbNhBG8Wq5DILTrv/trz1cLjMfKus/B9YxVo/tkZvFZPJbjqaP0tCjB7wcGeglXkcK9IAXAAId61qcY88kt9rDM6OtPdPX2jNXrT0T09ozC609U87aM7+sPZPJ2jNzrD3TxNozJ6w9E8DaM9urPVO72jOPqz2TttozQ6s907HaM/eqPROt2jOrqj1TqNozX6o9k6PaMxOqPdOe2jPHqT0Tmto0e2nd3/0C7X7nQ50+ticM8N8k+4jey7+NkWCY3GV+uWz7sTGcGJ84xjxb2HoS53LnY9sKHo0/oUlV3qvmh2Lwk4j0tFvgDQgCEgKOI1Vpb1rgDZMjVWm3wBsQBCQEHEFMz2e8SPjBbWt+QYpERNKc+m/JB9+XD4FLMF8ul8i9XCZhenkyicnLZRKAl8sk2i6XSWhdLms4uut/d6UPlfWpZL3Wq9jWH4B3svjpmxVaf0U4ajaFTDEjdkJzieTL2u8RtpfLIUYvopZ+Plq+/B1x8OR4zmqpJ7tuWWGywgShZgeVSRZf1nyPlL14NW8f833sumzs1v7gwp0fO5fyaGLF44mZ6kcawf/9+IcXkj/K1Lv6g4/5JI4Rsbc5HLbv2yY+tse6X8SuIOeNyaWGncg9ohCz1juEHOZyiC/M5RBMmMshcjCXO5jgcUhgEoXwGgQEFor8J5LHQWAR6pc13iKu71LkFi4qN3XePwV8qPxYswT79WGi8AN5kDjE+2Vt9wfuy+UNyRfqP54Ht2RrzjQ3YrsJ4TOaSOl4opb61NeiTJ2xMnWa4tPOyzn+7ri0U3qw1pPS8Z5a6g/zvhahemOlii4NU6guLk3fY5n5Z8196biYpV59LUL1xlJVXUQ7LblDg8sf5GG35AQKyqIbezuqQXho1nR7WNBc9oCfueyhPHP5g3TGZ0jwiJoXUpz2qRIo07bI8uFAmt5vtJXcRFvHO7SJnEJzh93MW+4OqJnLHSozlzsIZi4PeMvW/O5Qu9uh97JD71zHywyfOrQH+NGnI083fxoewZQ5/mfecHNkz1zmmJ25zNE4c5njbOYyR9DMZY6NmcsY9TLUfXsjtjXqR1xXLY7e98Rt6rLHZmTPx/Z8M66+gdQSHX/w+g9U48GPQEJhYYLhSgmVaBNs5QmaJNU7mi81/hkxLReOJ2KoT30lysRt46nqojDLjM924kbkGU0oHD+0iaFefSU6cdu4epbV7j2h7zNLJbkPw7839NvZBdF7eqNo+St9uNkbTTf/9cXJjd+91+l+7DX8t8zXy3Ivkv0pNgF3ncnhYI04mzXbGks2lzVKbC5r/Ndc1siuuawxW3N5o7GWXFxAHE1GYCmE1Gv9uDtWPJ9Er7T4RToaLPuwsY1TeeG+09bm6qmFVSl5bU3isvSo92v1tXrxmLTwv370X/7mFbGMcd5qSfY8Q9x9/TkRbarbvzvpMA33mvQODnDe6pez5DTapZlb35TIjOQimf5alL+e4C8H97+M4PVLNX3kctTy5ywsfmesjaybt9oZMzeXHxru2abX1t6MCjYqlNU+IAI7fUId0gRTedoJaSk4GwtxVa15i9dTT7qN+wuyn3DU/MeNc0pWcG+mrHGKs0YbIxDnMsYWzmWMGpzLGA84lzHSby5jDN9cXui89a4Q/cT8PW4356EQ9l7BAaI7Gj7Ect3o9LqrRx0QulV0nJdqkF4P2rT6ZjNv2kBcFrz7kzv1t4oPf2u47ufdYz+5o36r+OW3hjt+a3jhxy+YfaG68zb7gnCf4pRcl+dRoUepUFJ2341b8RNw3HJcPMVV9f4fqpjnUSrUu2H0SIexOhEJSGiqO8WPT7UL+x5+ncFulV4+Ij/ullTLGV5twsv0QFccP1FFRWO9zJb0qiLZyzLaS7vox6IjD85TtiqaOoRltkSqIilZRiXtQoLyRlLRmGS2RKoiKVkmJZ215e6x3rM4spQ2fPdVSXVTb20M+nwFmoC12FUICbgcBYcA6kBF+hNcH4SFLgALYa6J88M/EAhmeNRtvNzyMPhXYCukBKzBpoJFwGUqDARcpgI8wGUqdANcpoIywGUq3AJcpgIpwGUpRAJKlz1HnfUMP0b71+kECoC311MIALg8wf1zecL25zIA5D/tK0i2c/hyKkWPkrIeVvoeNQh7GEr7ql3P59eT+nangc/I+OR1c+6p7Bci5fN25juapoIlwJprKQwCXJYCHMBlKXQBXHaCEuDDkO/bD+5+IxN3wd3pSxqXRucK38VICF3ao0PvTxj1/kTwGi9rlZtlsposO9+6cxu1P72r1rMOLFIJ2F2NDaG4WyHIdiuEz26FwNitEPK6FYJZt0KY6lYIQN0KoaVbIWh0K4SDboVAz60QwrkVgjO3QtjlVgio3AqhklslCPIAxihrvuMyu+f46rWIvV1W21OGD9t28kfjm/AV58tOmAjqe9je2PVf+lVzFccHnCQWqiYW6ScOoJtYJ53VFN9ITY6PDvlR9UJykE5IRqCJVVOoAX0CUKiCRXo4gA7WKVVTiP8Vd6NQ1bBIDwfQwTqlago1xmsECkWwSA8H0ME6pWoKH8b+OfEBKFTBIj0cQAfrlKopbCMGX+ArKgpVsEgPB9DBOrGKR01vSfqJSwBvq5+IA3A5iiXAwqStXJhAlWw4DCH+s6bagffnsoPlz2UHuJ/LDko/lxlIfinF3XUryNhGPJ665XqRqZga6LVG9J0kiz7V24q1GpdwJkG3Py1fuXxmvGO9vXcRTE7TJjxkEMfcn59Qrk6CTf0E+2oJZjUTqwkpwgDmJ5Srk2BTP8G+WoJZzcQKO+0aPV5DwTn41R6voxx3WnDaGuJOC744Q9zlvWSDi9phaWcNNUPJzmWGf53LDNk6lxlmdS47NOov92d+8TrOefRJfSmQulAg95hA7SiB2j8Cfg7yAjDP2+kFTZ7LC3Q8lxeceC4voPBcPhDgIRY0i7rHoqtv3c3lhXAxdKFiWJiOtmNvBjaD5s6aaQW6fZKZvuxgs25QTHJ7ASZywVwlWEm1k1lH4dOfYYnMA9zemr7W+Ti7Sx8OfZzdpW+YPs7u0udUH2d36cuuj7O79JHZQxJLQoAo7R9q6odY+GEW9qH0fKj5HmK1h1msh9LooSZ5iCUeawA89r9ZgRANH3KKV72SE2IFrCWNsCjgMkKZgMsIPwIuI2QIuIwwH+AyQnOAywinAS4jBAa4TLAVgBajuPF8sTk4vnvt0lhIl9m+ry/deC/ru576EcnuPgdimQZqcy6FmvBxq0xbWv5xEU745VkbfZDJc/lgjufyQRPPZYQTXjcHLh+2xwZlwluU5Ftenm/7QvNtUT22fTa23eut+wx+YWSDW5wnG0TiPNlgDefJBkU4Tzb4wPkcy/eET0L2m+QiETdjl4S5qXp3Hj5pRjef9lzQJISRhBiQ0N4RTt0IYRkhpiK0S4RTIUKYQ4hRCPEHobcgfh+lrLdFx30iZx/D8oS96qeuE34Z87dSoHwM/zVWesZAVMl5KVQq+JSSOSVETRkmTIn0d4Tp6NKfW6JHmYj0SMO8gSZghblMYAhzmQAM5jKBDsxlAgqYywTuL5cJkF8uE4i+XCbge7lMYPVymQDm5TKBwstlAnKXywS+LpcBMF3t48T1yAND+hEFF44pPgKPYEqKDz1K0auv2q6kTFJFmQ+U5UrrR4b5M2Me8VQh/p4LGYR7GYd62QT7piqXycdHUA7XbTQ7Q1RfMaaT3kBr9J6jnqGtkbSoVO8kQyWReic9TVVWd210b7PcsPUJ/h60c586XODZ0vZZAK/lyoRUa8gXFp0LLFqPV6SOrkj9W+HHbHoCV6SlaXCG143gY2o+fd3df5Yvzxkwv1cs8LpNC1mWo7dkAC3APfHGGcB2YjIA5MRlALWJywBEE5cBPCYuA+BLXAaQlrgMwCpxGcBQ0s5t1YfvsSlFotvv0h6bg/fYlBKTbh+zx2Zbo24paMXuupjvfUPR13aO6TJJei4ADrK7QWo2KLsGj1SDbGmQ6gzKmMEjyiD7GKQOg7JgkPMLC8DzDdnjBy+TkyoYICJiTUvNOrSJFvLeBbrcHPPCIWTcjZ9Wg2liqWl/kzQ3bb67fzPGD2IWLnR2RRmSf6CFFSXK+2SiTt6RdawEWtZVtwGJxArdQD4cKUTQyyVf6BiKtXRT8suRlqj04gr5n3Kwy8Jfl0m7LhFyXTbb2iF/vz6OcRSIjgjMii7hOBVYRONSsrfuymJSLtjdBM/x/ywByoTjvtl/yAoV8yt5sy1weikkeMkDvvi0X/6oQfI3leAx/I73Abh6HfqT6scKBQgDSTpekwjTJKQy6WBM7hhMIvSSkLSkAyy54yqJcEpCepIOmuSOlSRCJAmJSDoQkjv+kQh7JKQc6eBG7phGIpSRkFykAxa54xSNa4pNy4VPHxb8DEsV1SH+g29KgzzUpnt4mu4hNN2fZdPdb9Pdu+lYFX4mY1poUBY6coUMWGGNU6HBU+hoFDIIhZY9QQc7cDuevItLmTfjU3llvj/FcDLSgPdPXYcPh/LB83BdkDg+Hqm3w2A4FAbAYknBLMvkcGiuKn/fkblHatadfagSetjWBYUsD2IlIpKKip1LwVQURgpiEseEIY2WY9bkhj40FXZteqh2huMx4jcuZfMnOuia51BdE4q4uP3a5tqEER71ZZCtKEKDaVzq4jF+BTJ43CzJMllNlp1v/UKo9ODX+IhDaE80/ToecXq0K5pcBaceZ7ccw5+ImBW1vrnzSc5hYTINN5eCdyTh7lg63ankuaOpcn+/mQt8i8aOwwxOVBJ9dYZ+GxpvTmRLva9582vk8QccXx8gXMvlsP+sDup9zhANhcHVsUf+o84uGrYwgPxxuAlaLr+ed0B+FbQk0Vpm4vRoHvxa3Eq6rGmuReQzYQ8TKT0eRfJw3XNteYD8XVaAUo62h6KlGJtyvt0FPd2ktVH3xyW/QsBAfkn1g5QCM10LGdHMWrGTKXAs1GNV8hpgKU+GPQ+bNB7X/MD3y31Vef3bUGghNFW7IcRXntgi8Ugiojghmqggmhggw0aN+0Bz+sBwiyWLXWT+8NseWU/6nk/sGvlDMkScVtcGLaF1Qv/NtBP6CvD79GUGu0Pxr4RTk2oHkrlnZac9X2DE+lU5jcd028C8Wd4XX6sCAu7z5U6Kx7w+60aDTpMptCVPfe8cFGCWoPN4OFOypebIgRDJLC4ZEbiR5RguBvRLlZZNQXwhDdvc8VJEI4N+9v5XZdF+vgpFIYp2GEyarZ5T0SCrGvOpluo2jQtN7apdy2t5LZp0VeeBWONDm/H8QOyHG2rnd3KkHTVXjoVTBDmhEXeUOMNqFJ66j2FA5rtbRcz4jkcdL27p/0FUPVZSKnnu+n5Ji7SRuAUSN4xyS2SPeXLLOp9yWYt0rDDQs7il2QcRcnHiV67xtOYhIBGP8K3uB2No1cqyvyd5zKK49kJQomWnYmoPZogPPugxn1/4gIGPn8pwsx2vWYp5ei6AY9ooAhfg8puPbS2uWUuEKe+kmYjV/r2aiPwX3jyMV/Ukc78Y+WCcnP9F3La6brgWydXHxLZBqS8FVGR5K+8+Pf/kQ6feWYWZaCVvadHQBj/Gb0v5012GjRnzvIazB/qWh1Qn40FjcO5LBX2MKag4CdbHKyKkrDm0Bd1P6javEPDS+ISu7Y/BjYluRHzzipmMm1deHIzxgqFqolfgleI7oV/D7C70DF5hk0Eexl+1+UtzpAEo14MGu5oyTpMMTYVELrWOeesei27W6crHSKIQuETFpYcxnwazrrCRTPWCmnr7MjRAKmZlF1S/J1SvSDQV0b4dD0dzT9P74xcmALPtZ4Ef8JhK0QZ7x/1dT24K1mjFunh/NR0hBn9tig03ZZNLGJGaQBAYAg0Dy4TdJ5zjFcYpL6+4pGsrWvfQPbZVj7r+VHR3CuiJ3il1LsgpOaQkmrpTuFWFgivunYqJEiNWQSuY8w/C5JTBUVP399H1p8LrRC5ofHJKfK5G8GQkQN9yUnXdySNWQavgVcgqTkuVTollyD3IIxATkWPplz3U942WlHcTBqrO/LdffrH9A9t7l1zKpEzOlMzTUjaPemLe5BdDTuTEQUkDHdDdW0dhfJKKOHE33pfmBtUa/x91u7SFEhpyDkXivGtgdZodRLz/u604CzHjOsxwiXIM7gP+CTjbRkayAcg3DwXlzIuAsaLf1uoF3J+H6kfGJb/aOUT/WXti2AKzp9sm+vo3mDOL69h8Ftb7GLxJ8vnFX2mcs+UJvcT8ZyXbnKiTs9g/K/9b+RLS87n8X+miuXC5TehdyxmJMGRF66J6XubNhLkpn0m2K+3i8ux8RmoLEUst9VCJbkMo1QlYxX+J5UyJ+ssIUzbGWGvtbxrOeZ7n8+2Bu2xnvMsu4RN8F6Ip0nMdHBBW61/qmUYZOhb7R3Xi8m35gLAoIoe6RtUK7hyPLNb2QMGauYbKbUdIqZSm6XZ+Dc5NEo0gl9Ax958ebkv28WffPoExRkbq3VHnMao8854H1nnp/i89Qu6ioTItF/f//6EXaf9enxzQeVwkbkeBzqpnO7Pdfv6wllPmkiJGactGZnFLFjIPa1sJxLtbP9eyOdBdv22icnlbHDs9U9bYK74v72di+v7F7+IF5i6vnT9bFNMgdVrfxEAdrKGG+MELNnFirSOzNRm6kvVwBgd1F0wgGZiNAyd5OejweZsoJ85cuHJLeZHoiiVOnLlw5QYvsh7iiRNnLly5HfA4fazvQHkUTiVsTHYLyPLL//cvuvzsfsIQzc6rG52r3KqpSAgwPKO19s457/N5T8UxUBbjgzrY3SK7nVi+blFjMUSZtJJhI8ZMUQ8iAhERUeEsVN8tsssJmioVGAFE8AmX7EzK5EzJ1EzL9KGBrIkw+y7xhQoIkwgxu9F/xWXSEaO03WwsGARzjgHbOG2vCLPAMxlarHAxK+F+6Wnc+2Wx3nttG+Z1Y0AenuL1l3LdbNOfnOn95rrlDPePk2D+ml36h+dGhucPDmNkJ6eURZ9k6iJYEtiJuAD7hJ1wCrA9OBnKdHyMt0+fHQeWxe++9agtGh8lcBO8tBWQxwQ/vE0XLDyaTQAM3qSgPCb68Nha/HI0vbZepQP8g/hiVBXNOGPtLTlUrQhpb5Ny+EaV6I05BxfQWxJAQ+swaeTYzIjbZXaR5Yrz9C6o4+RHx9lBB8W55QT58DwjbRHPDC6IqbMQxdn9Fn2X2VF4inHusUWPHgQiIlKoLYUAyGZQGmRzAg2yWW4G2bx+gjjsdhjnAJm6J9sMFYDiNmkz69wjaXvg/6KhmvtwqB5mdo2fsBP8xTRjCdncg4Rs+n9F/qS7XLIzpWFj6VGXeNjY0wmEOYEyNzDmBT5/l+HfgVlNwPH/hUnVm44gT4yds7MjBaCPzYDGK/a1LkngYFbPAR2lvd20K9rCgklUDTdFpWCDTgOpIdeVeQv2PtBm8VJwOYxdrWaavwwmA9xmCC13/c+CThTsGiKglNMtWKPWPTRHAaxDNB+q4FqME6i48tM0MLZAwpW7WoReNDW8e3gJY6SLKzvsBcKPFwcAubaEBJ82+GR8e8TV9MKPegkRZg+r1EfHSrQcn+vI8uOAvOFhfpARu4gpQVmBYyROMlFcOj4hDdWDO4dy/id1lxhxwWkNm+csyuecDPusgjeDGYkyyTZNf/WIVdgq8qK7ZYsxOcYR+BE3Rk4W/4tfDzIfFzORtUiXtHE6FJIH1vAwk2bu+M5+6W1TBC2A7AL+/JYXE+Bd+ex3rJoDgP9ihjLM2K1rXHlxjX1iP2My/DxNgd8cv2+L/zd+a63e10kHP+FSU746yS668JL7VEkLiADe6AY6OzdZRG4KDqDr8UuOCssWOCINdx/mjvWSlNnVlNXsq3okIe0BVBAk/BltnseQAHicDBuG5lVtrVBG/Ax1lnjxTMsgQBVO5jrAWyfe89rFNXuY0xL2gtVWV5iPVhEJTUhXP7dwTHHhX0upqB9GBVNFcV6h2l+AJaGArkwoXCvzHWErStuvp5FpePMq3HGn+ZU6mTAqfF7bZnGxOdw8vN+rk944hyYHcYFMWN9LenLyySd+87bJF09JT04+9YSmVGGFrTB42gWRfaXDp/6pST0bOX8pauj3ZQmZzKvwuGjKgC6720l33nYwqMszhDDJCQqJXbNPrNDtMFWQYA3QNoYigpvGr+GROEea8D1dkCSgJM4STM/cnZ6m5etWPHmurmxy5cYzd154vazZQf0aABS37VRyw/FCe3JxEkCYVMdMKdgGSId6bJ/Hj1hhx8VjZNH+Ht+AHJN9HXHQ0jev+Bjk3oM9o9izajkXHrILghX4BJOtzINygcL9b/2AY5jzOwFHUKdnCmBz55TSXI52Ywjw/12d09Fv5vBqq7cLV/930WUg4AJYDTnqyThGvWlqC9dKafOQa08Mv2RxE8p6llZtOmvXRVducLG52DuINFcP/cbDlDNnCh+Fc0iTLG97tffTl8+w54S5AVan2UmWq9w1v0edZgehqZR7gHd69CCQEZPtaJzBAZl2+Pu1kyoszkLbSkJnfLlbTa7qHGLBIupRp9lJfDCDjgN1mp0EU+GwETBfYeKOA2t8hVN3KKix/GeIhPBzaUTRXCfffgTZco9cdErzO5MCFuzqsEEl3kzs0dHJmedKr4pmm/v9DZvCCo7Uk0HqtxP26qw/AsYfaUo/QXXxHck+6KhIAaHqJsjpjY5cma4K3q4jS92NLkhlLCxty57ytlX6zsxvrcS1xaoSWbACFBqg0j/+xT34QT52bhurFLdmdsOhOMZ+heK+EtYID3m3/A6TtN/28wBTMCst4uQGjn27Ye1gpYV4kC2x5bcHAQe2yJaqYPiCvAN17EQ0TQma0z/ouCnTVbGFCt7LcDWEAq4ObHCpfLeisL45QOI2+YRIwm0fn7AbnQ5Ofp1oe2dHKep0QDlKWos+xuNntbjFwXKCzqDn6vJcXRvr7UewZMtnupBKOj4WnEgJDYQNQfOzXrDpuhE661vL951rYBHaVr6+qWDf9OPMSsf659GR3Oe7HQlI6GajL6Xlo9Kv5nXl5nPkAwAvhzPDutwUAKONrjSkLe4CTLGnYbyZmPEK7dsuwvjdDbkOXZR6dqcW4NVxn9uW5u1hImNOjAMyYi/DF8VtPM77K7U9hjoG+v5Jjmc27+WnOTumsz/820a67vcerEyfj0NYx8zheqmWtfNi7xZp2KwZwG7pVfa3rM4XD0ITk2mUsgkO1xRf2NipiY2e9DacinkEnfv5ofr7eX9WzslD8cfvoTk4mXk79YQu4By4LnLVCPdJslcJzv3KvpR8QrpHk99ikSWiS/boqMdxBS+KaKz7OrXZfW/7zvcwlpJMcg6S5WSiwMSHH7jZs8tnbyi1DndlMmivTib2JKIMQtGaHUZW0jWn0XQz6hUoFRCszYVZrfTyYRc6WKsBDbwyBlNZDubIwFIBwloN9KAwqz21h8kYaBCWst1al8PIazanEa+yoDtyuua4+vcIurUQsIcqPssfPQf5Tz+RSx6iD0xP477VS5zcblo7IbeMhNW1P2Je9fQS8lxwUq4D6WgJDLrT4coj/T1YTijNPb8RoRmOvPY0hFc5m7BXlXtuZLrxgLz21J6HSThys6uwtVhyLROejIDaUmWcsysE9EpBPWo9YGx3ygKMTQ/jLJ9RBfruJI2sLqmazhVr66geyIqcgp23czStmeepuKgPItGggYmcu4+FM9L28HhmMD0G3hPRWUeQwDvB37vsHa0l5egR80E59X3iNS1KaFgc16nmZFZlytFYL0daHF/OB+6e4q/9Ab8RyWVYQonZKlNYvCHAPvc+zQK4yIREL6x+fFTUuJ69j0YOHMXSPAfXG6bFNXnteQAfhvxX2rg2Be69fkzFYGBRdYBfkTlzyU4hxA1+Wz7PeISDtNLRYZzpx3+B+vn/JynjT9c1eK1cmoq5drTZrex7OVBKOlJFm8eto3QYa0PAVrQ+lDFeKs06Y1gU6hp2TxMa7yldmD6ehJfkXPBaAm+TbNicrA+p/Pa3F1fml7r4vAdNWL1VOxoSV1/tqmwEiYBD9sZrEx6EcHvQm3EonxYZiBP3KFMWdqt7xGHGGkSp43QZp7kKRDzgB4NNP0Sp85Dh1dZOjsCy6cVES40snl7I2eyBUnEjC3a2hnxpAb8khFCkFxk7ttCKZgBv0wsQU80IcUsUbvbh5TKKt2tOA/cm8Y7dBGt2nr1WeqwsajtP7l0F8bF00eRE+DKfS7DplBes/Li23Iw6lpkF3VOP3m6YfL5cvtQ9LR9K15AECPGtb20skkvg7+Xjjf/n6JnlJ8rA3bd4nHBGccO43u56bJ5xf6x9ScDonAwAPxoVjGgDkvyIwVx+2+5+NRwyjQWWO88yt6/zvv9tB8s+dcYVgp8w9NSt0aihPDrRL9m1nOIY1vbUkbDqtqfPH4GVdsnA7MZDJRQpJ5NrWBSw2FVMBNGZhCnl0Vlyh/cqvjFzXR7JKFfXooo6l7YczwRHr7VDFvbxHE65F9Oz6hhrYyGJtoS46nrJT0zosEyHkZv9wXNRFc65EPk+OizBbqigLLIkW6nM9YO6sdxU/AvPyLGaO4tm3nW+jnUPVeP6qPrMeVNFhOGh8DVekNeeZpmTNXCEDLQgmwC5L6IZkAHOsBkoeviVPhRDn2G1XOC9NUzv1TjixZN70h0Os+RujmehafD2s8G8UlVcJWxRNRp+CSewWjOdVY+LQiwtNlCtrTMYy8UkFpYaVs19tPJAaES5n861Dz7NogZCRN2iWfj+fdensIqVRDmtidtldpGlEjvayMltmoJK50+/l8orsMFY7fkq9Li19mAcw6WZaMY+9AILTfKL7TUuLFPNcR7PIz3TvPjClbwGXfUs+XY2rWPXJkISQCGCSVWB403ntV4XRDx+nPbfx12/v5sjE3ATtK9MrMiImnXTX9GeWqWqmUfezBEYSEMh+8zkNk35Pi/J3s0Zh4QIrUKI2tJskPOQrJSpa+lC7Sfkz1/g83NlQLEIJAoh5avxCBjHxqETpOxYuIInoXw2jYBzZGjMujWLtWb8WiiYFZl3p/eWoSjlCe+y1rOGrFiNmRgFiGsBlzrESmDZnW3LXl4pCIaiuuvTGeJr6oeRc0c51q2HTxP7iWRUdJYHj57TorEZU14/AlLqi88aYViSMRN0IfcA8HpGJpWa05MlRL/A11RCH4ZcKLHXGo0oZbQ8DOAWW6pXE+M5SIseQZ6usnQ7pkZWArIaEzXVg+NUaedRDtZikFeAzK7n0OHVx0iPHl2riX2qV9aLed4BbGgWLIRjIQbjkCRlvxdOFBbL567HlO9CMzH6WZMAFLRqgAv7CM/7RVLX6dxQvLFWs4eQLVd6gHg78U4cKtJfyEslXR3xzNOjGk+cXqRHz8DjamHVulJLvLoiPD9PSrm3qYTxtesEEOzu3lW/pel30eD0AoJHl1KPt+kcH6zy2ywiEeDGRSom2SamndYCSBI52ytuF1wMska8pp20SdwWxlsQ9ODQZ6dhMiSgjkaUDpM2tLHtlJ+z7ho14BAXCyxQlydDjPQhmpNzZWCqgqX1M4wojc3XU4/jvF3jL+FDLMFXXzby2oN81iQ4wtP857zwqx/6cNbuctgt0Ehsb9JqbKOsrMI9jsdpVzijGltVFRArhZ+Z8qnnHh5oKi6J32NkaqCiYUY/Cq3S7QmK63Px7XxKLvuaysO1o3qGoeprbm01B1KUvDvKjaZeDlbW6XQdq4OZLjuCS86xMLS6HoY21mx3iuhOZCIngfuSeqHEs6aOA9BhjvaJ+dLABSosVtYuLjNrtkuQSHw0n16Pqg7LpV1wdKtKIYz4M6yATjPPwFiE99kVXplwRPiOc86eua0TrmuCHApBDd2MklOUvmbw2cFCOoUovmYOK9VMfyvaTayMNpANMtfFoRI+M54HTAYsuP/n/B0pmFB57z3t8Ct8yMfj/oxzEeHPPGhWkUSXA9l7ddcawWxWx1dcnc7oyZPv9Qd+fw+fIhohdLSQ0Wgc4vI4ITjRpRjU+iXLsiZVDHamZII2yeEmriBvVrvpzMi0CDF2WvAFXiMOpClfzi3SBX0gWhAhBTORnMlEhIbNDA2mMCqkwt8VVsxEGYVMYUb1KR+5GWyO3ygp/+H0tGAAHOa2lAuiHlP5CMunBPyqcnH2E/FB7IN8G9IzLiN0zCkfygVzjnu4lqk0zHFPCVAUs9JCiSjs4/PygSfEoSCpB+1uoKozBY4LSTXMMW9V2FO0dLgBg20WVdcxuByrK7EyG6xJQlIjEO/KozhBAYOB/AbB0ba4BvZ65SElSG6PRegf+/m0gzYDvPg8Lfhh81Y5xizigJfUA5sGUTA/q6NfclmSVDaQmBsDOXzYDpzl/2nYvb3zlFlYglzJx7ifH1/g4Q7CPZBnG+rBEyqWnq4PfeS8vuKocE5kNyc6mxONzbEA8c/H6/F2fC60d36OlUbXOVgf7cB3H0MfQzyUDVD6E6vP5f7cAoLDtHYq1/I/EXxYCc/ZQD4q1rJ6TkgG4Dnh1rLlpXEVDZweyTs67Qf/m3K7RcvhXqryT2ClULUWG7BlJ9qlH3pm1n/YsSJhVpooBtcib3+MX7lE2KkDcZVdX+7KV+5CF5K5vl4KZPV3iikzxV2uHmGvXiehiLLAgoBkQ/ve1LbigTu/gSJGD1OhPe+hEqR+bqE3F2VdeqvMajAKwQPu4bkr/TQJ++wBXAJamQFZN51T8ugFipF48hxTWhF+Q5eghLoBNvg6+Sxnxep+DIwmA6xJ72BpT3O2JBRTptQsdWxR59vk1PFnzaGoP7dSdKmkjcDJZ7XbVSVgLIZYF9n6qZMyjhenHxL0+LA25cjYb3eSpJXTuILYjmjsUUZRcSqpLgOL8dY6TERu08dYXJTmuLNKygiAb2xZcagJYhIfsAO9mD6xCvmtuPJTbIjdg8Q1JwTvGHJ5QG3HyC5VTcP5AFBk2NqhcClXUGWoHh0xaZIVYW2RjVO8xMXSW7HyNcw0zTNchLxOfkSPqN9UEkEtJezTd7BUVOiNMfDmaF4cv3ukZi0cx7aCIz66R8dP6IXAHcVEcaUMVAJ3x1ODvSyRMjcTvr2nQC3HCt+1dY5oyHoXvG2lk6gxPjIQz8CD0R1D0i833eyeYDgX4bichMXjDNzKFUYnwi1beKeYxjxM5+pY9L4LjdHjftbbpf1X+7CQtUjQI5DjZRnoRe9RuMWEE+DEobDGEibAf+o0MAAIwL+1W4CFLp1aZYXRbK7nO3vwYHnsie15XxcRQx+P+wFt0tjPRqhpQHg7/fbedK380j3kqeFJV1aniXIqi3Ifhuv/KSheEhZT+UmykJbWaSMBR1UcJ/Opa+QBA8w4HqduYmgM4PBe6s5PN7WRUTI46nVZqZGX3Wm1u6d0E+sYJGE+h+04wNKIl51UeUdBxSwxJHXBbadc8tWBLOinFwgcBu7efbrFz873VubUzxmxWZnR8yhf1n/Z7TrXJd7BzHLYJYQyjWziCaeWUvHHLRqeYGZQBmdIhmbYKN/DqL/0IcBp2oaBvm1Do6xxPNqmvfWFdpU1FuRF87PSlvLI0OFmc7bONaTMuDSePpTkYTnnQkJgG+eGB8pOM+cPpErMERWtozne9OITiwGCDi0DdvgyXMaQl93QKFVL8fxlTq7tbS+d64AnpFt2IhDxhvHg2+M11nQs+9DGmw8RCVc6f06x4Cxrau7pDou5konrQCYGGVlcKFL8XL6/1hCw52EMgjMJb31cSlH8bCsAhT/oUZFPDqwccVF9cCmnGhcMAb2tgCR1FzsK3MOnhOAaQ60URKerq6gxzen0TLFGu8qWnhhS1xR7F8fmK6EccSs07oP9KJtr+LBCn4trywq4sLnxg6cKQfkHt+wFf+VuIZh9k3JUEUnqJA4Pv3dJiexIsiY8QGfDRgdYFbGlMHuEyvjq4H2+Gza35c0NanbAzKuO8Evul55CboPnT56BCe3Ds4bZ3R7Gmv10ElaJ4+nv9aI1Be9BpUvWCJS9EYVbDtU0pU5Ot1y+19XeaQ8NsGrnE7rl6FzKeAq6ERTN7P749TvEL0/cxnldiVIR/MVhxwrZC440EAtc5QnBfVmIv29Bf6+Cvrjcl5LLNOSmh1OBKA8iRsm8Tl1nnZ9ugGC3YNNGw5n0Gkw3n6e2d7KbV1Kpm/epo0ckyrdHdPOl8sPlnrjqSiL+PX4qXQfWI/135wzCa5uQZ3kpsOOm4rUNLtWttQyvjchrG4S5CifMx+bl5ZGcW6NAPN5/4pUiPQG728n/bi1zKW1GQjamaPvx/0tiWKJebu0prC6CCWOzemEwD+6nTrnPVKsC9RYbSJ3lHlS9gPSEuX0ykXVOVmR+VBwBKN56kTwMcbdNqUxZrqK61scfRXXyIA5eGdPu+VzWZkOl6zqzcblMYv1VfwrmKskw6eLBZI8WvRkrSkcVsnSGlaKqIDW8mkmv6xPlRVjmECQWNK4NHA1bzwO9ZHgLHWdGfSasGLm8bg9c25TI13EkfsxGafqhtQ7mHXV2xCgXr1aSkORtc6uz+ATzng48sw1fzSbaKDjtrW5WpmdWrOYWeblMK0nPZbqi9oKc7t8LhTYjWRQvEPjyM4zd25Xe+/YctyuI7Zibij+sO+LI4WuzlKZoL5akDXykmUS00US5fl6cgmjsgtQ4pU3NfKn8XPlHQnlgGsM50Z5cbkERnA7y+NHP7GGTGr4ojtiVH3TsCB+8r+aiW4XpIXzCtper/gbLOuk9iRrnJX61sZf/XpD4DaBqNakXOWRECkkebg3Q8zlc1jw67YRlyDxsok8xgEz/ObbT9zHLIWINj+NZive7uWcybgTDcjHtRs48R3i4nP5rqHu7QSnRLXaLcsOASEANDOMb3EfoaCU1k1m1mUgFf5FeH1jzzLOeKnwt2nFpAWzwYGHva3foECXox8nsRiTuk7c4CHdz9XWKLZc97XP5/aWJrLukom152oB9h4VUfLq59x1CD8646nPEWCT3dUvs/D+OPvXc3ZK9eUIIUdqnpWdw4C4qGzuBSauhhlGadNVP04Y2KWR3nls1iu5e9GcfJe8IW7qeqgqYMrUVZhoSP+/e4a7ruRqE6mt41NroEUYDBviCvbf3x573C7P7NsGT4J7n8s5Bta06IzpqTwtULsek4H90GB1Fzsa3ay/tTfumvZ1tLRjEcXYYJs5Vuz7im8oAXg48kS4VKRYbjLqbOFCGPAcX/hafWvA4YSv3WsYSkccdN9jzKPeu4/4xsOc5/RTMpv5sKR0AaE+hTsOna78gWtktFNMLI5xhAGkAmZBPxRrp6Qvmh6SV0wKEAbQBtAG0Af6IXug4IurnCjIiThOqamnntqoV1tJoo0ptLSA9Q14fp7qK79a77Hml1icV/Cq7IfmHPlzp5S6fsQcevxyX73+ZZM0xPkjK0n5R39H5/TuNeu+a5U6ruYtdhKy9W950DV5zFoSsvV85heaDS3CA/FAvz9B8qAiG8aHq5R7qA5qzKqNjut8VWvs00MXnHCqx4tjx/xp1UC+gFFD5qbxqRX4Qi2kTbi+sn8eOTZgpComxoVL7WfVDCsvsrvhC6R4s1TO7x2UjClekozA9adI6+KTrz6OHdsIbqMgWxp/h8y9U5mpFAC31j0dWJ/SVGL8fu3rVbmjcbv524rsyY+EBjHHR7566+GjhL4sU+HW9bXdj3WEBXnJO4rRbgvPQs8YJ10tScj/KA1dyOz6YU7sxNGFd1GL4o+tI4zfTiEZtLc5CTtO+LLk1w8RjMXaghBkxom+NW5MHGdcgsGCZsHp5vjadL9iX63ZFVByaCgJ2pYOKWa/bphHf1TY4CgACAJCnr2Y4SaB0KwgNtI3exDxQPXwokRWymvZmKj4joxsY7dhG07T73APngBYEy692Ic1ncA5tDmkLczGToCtDo4UEg/Nw58Uk7LqpRWtubg6tWWrbbkEq1oQ7k8mOMhn26IO6NTh7eV9aNmins4L7/FWdcsi42dygTyeRPXWxdjqmx2iY0a/Sipk1RSkPqIynESrkCVApT4CKeQKwwgDEDgMQS0wnW+1rmguZYs7NFAEZ7OZy6Ko/zRnPrHZzAW+uV8LYPNNdDSrML1KySUu/+UnZsRPQXCZ3jGpoVMRQXrlRzvjAL36/zozj3MTddQJiOqqs1U8usR6k8lrDD0Q8RiuwhiY4wIwwUERwAZMnSDI9k+0UWMcl77P6/pB85jWbCUPfPMacQqdsZTM5zrczVqInmlfWw677TLWZXYC7rTHLiwzR4eXhP1t5Lk8w2031Rkojf3cTQ7yS4RGPrpZczal7LaEA1GLcQIbFkQ1ggr1VIYnEi8o510ORvHTW6JUBy2skJQJBX4u23HQz8ZM0pZ1Ilq9uJrxnoeZ7LXPY02OBkcanNw5X2TCFXZlL0g7uHkz6/awiSfipJQ5WggfXxFNsa4oeCKdZIjm+fe3xSI9Vmaeut/bCZT2TS82LJgNDcDScPLJ06GE+f9ZBV3nOxYYiCzA5tlrCfsll7MIF8YbhRrJClXfGlILLgnvrjfM8aqR25gYW+rYSLVEGCfSeycZDMrsdTlhq5XNQ8qqpB2mxD9SIIx12cjRkpzgrZwXIi/qtyWuMoMgnpzNW2627qdS3D1VKFRrCvsIIbKZPV4cFt4g8zPesfoCdDJaIJXOaclJzltvcPEw8xiZGiL3xFZKEUXMTPcvxGT/J12YO8dOGMQbBBb5Evgw9wi0oE5AVEA7b9XHX9SzfCVdHjxjrC4lNuk8KkEl07gGPkSxHblYZ6XIJUNrPfPTMCrFBEWgUhBwvG/WUKIXlGVq3zvNkIiS1P9EfHHIivgq5/hBkQ9SZjnTyK6Dk0g2Npziqnh0EapuFLI6wDMuhvIdnBgjfnxIualwPJYh+kqFUX0I0GR59IVVgh/RgC4QNMumht114kWCgkHLb9eJkGeQzmM7uqO3dc7s/+JPmEzpgIQGkjHZb9pTqXWmsRaDlWZpjiz9A+L13gseISQ8szCsM3ISRoEcidMLCoAzA9Vqlpljwi3F10t6gcqzxLpp0wplC5DKhXBaWIg3c2ADSAMLI+rpC9yz4FUa68fKF4jUpQwpN9EV7fua7ezI1NTU1MzMz+y0vz7Jlc3NzK1YorijIWyOaSyx+TiiKQBbXdWuv4J2P8Fg//TlvmTyzKc64Qk5oF6UXuD/hBkiZE4DPl5/mlqVGMY0QRR2JBevEb5W3h282YB3VdQCwhnztzPCcsdFuMAAbADzB+Q7R9nm6UKIba4gp3Q1ZGPcX1W4lZqZ65bHWoT8JB7OhP/LLX37oVMVk1IFXCDFClunwE4H1h/uUOxQUO/ftA+tt29UagEuugmkP6sec81z1yuEKMvw4/VbSNVihIg0diFYzpcuUx6hqMcwkBB9IPnoU8LaBXEpvC960+rj0y++ycq66fuhvY7vWHe6kApCKUqVvhABjvprXrUu1WWYK9Gs+gMs3OLg8kFMc3HBMsr59IiCsHtYO8/7vD8aAAYJUbX+NZhGtLwwCLZS+XQ3IC+GXvWN6W6GXTRICEJMsXQoKzymKnIWkhK9tFm6a+l0fXOaqRkNgWmlhfjZwUgZgo7EqbWdaMclmoRb+xE6pmDTfLPjsVox7RYj09WMmoKIxE1upLcjZYaOd1jK5hie8Napp+9USZGbafonhbWmysitk7qiaAJc41quy42WhUTy7YJU0aqfvpni7GpUBTKYVoV97b3ZWw0sEHjj50HpZNo6sb11QG7NQYHpiYIzwbJW8HafTMihaZjzQy0qbepDsye3pclmZp47ElQeYFHlZ6VPjjTaErzpdVpZaQJ0hDVtrNNjC2hEGTmQkYAA2ADeHNtNffpABrFB73rFtr19UiepRCaw7k+cg5fhEKEPfOitrTzKsSldlq8qr8lZBQgkpS2E5WuUQYQFuVTDhZMtOQltFBTLArUQGGCsxHr1rmaEZlpFHu5wlkUSMg3otdiqCCNyiypMBwjCX/8lL5Qn2DoHp/D/zdkWDes4H5LawzKAMplQWSrr83sk/fj+f5UJ6ZujRyxJwj1FAP9GbFKgoHsJpYJt0PTXmd0msqM5GMbabPpqgUaXDp2ApVLAYIv8x1oP151rIe+Bviv8K60vrCKaz6xAG+dXfvf4uFLMywCnhJcEtWpgcuglYiBY+/JTXS/+RQn+0u2ZpgK95qFjdYTo04lxbgeYJQzohb3FSImktTbK+rpJekssY2jV2J7nk1IFKY2rtKfZmwL3JjokR2sUYALAhsRf2uikWwYsT3Kt9XTooS3KuEqkOXCzECzRksU8nJDIf5qwntq+vGbHMhxnPtvvCUZPNfEDf5NWFB0hA80HA4l2HDE3SWQ9Dt17vsCxfUVsaW7qgpCaXaLIee28vUw5OVwEjBspM5QFyhLMXVMRw4pV4cVmTMrnexhosxpf1hGS6aV85XetLXtNMxaASmVsIaleQLfSGv3XZleB1JbjrhPDmw4Xu1nJCWCQ4Hzad7tmDh0iM88FAgcA45IQsp0PLxIpcIp6vJTKgUg7EFKnMGPSofbGfbSjiXILKfGaULFQLATJ5W2qW32sOZKb00raHDwCF7NtzNvZwb0ZGR7Sy7fAOyLpkwd3RZYCSXpcxUAYE7QtccNNnjp2QZQhgBq5AKkB2dZR75LoYkF29Onx6xBSgWAqO6rkP8+bsQEUKtMNCPeyz8D3vIJkoQHGZjFbWUoZzVdydKDNLZL4Cy4EsRMGWjXDk1hxbi+oOzVepVo8v92p1sG/Kszqg0U8FyNZNcpnpXbDpsvf8hDEPve7v53m/jdewyDPWsxjyTOkMAaDWB6AzCfGaKYrXa1XORUSwE9UXUNlcHhZK79kDUJkU6sZw2wqAWsaiuKpGYutFECmJfFMFOB4ocXuq4FBOYBkthypZaYXhUAYVeFpfytdGfl9/hNpwRLaA0SHqQjEp5KAQNeAwUMzeIlZaYwBQzN7CfSHqwSGiJDkdjwDg52MFE/QGyVkTJY5MjCMWDS6uaDTAE48GeCLSAMV8LWsjYw5PrBpcPNFqgFeD2eBtBnnS/6U9ILI2Ln23tm9PF7q+F+LKfhSNezSCX0T1XGcPcxGRUT9/Kk8FViH/LPE4ks45PQdL2YJpqnqinWcFh2/HUIIGbo0ITKmKcN2lPjaD4vCamcTOSYzT41Hn0Si9OhLnWwOcHlld0yI7NgNp3dcSsMgIkFNzVxYKnAzGFTrVuMWSrmXyZYXVokiKvbPJPPJkAgWxGdwqT45IzY2WOD00FsPm99KOROObUkzcM2Qe4qkiE05RKjdgasSRCLKk3V1Jd9XgZattXTvTgOU0Yo2RMaFuJ1pWM9CqMjEeYI+qZe3R/OSuyWj61vTcjPzesTNMeIoDaxUChPtG9i0AjYApD8SKQKdINAO6aQTG6JO0ienxbmuAWrH312vNH5wynuLB4wHt2lN73pLvW5jT4qbD4pLC+J/C9J/G8H/+z7Uc9qCLWYUuKtVMWqeyZgu8duqeiq4/Pc54MPmoMBGf5Z2nRe+MujulmavshRvi/jCDqqAvUq2y3nnm/d8f7dDtCc6GHjUBBB96OPvhHSwruKcduk5SjrgOC3ygeCOnCF9iOqd+GjS0DE66Uzz1A0Bc2QRYmvapn2UuIvJU8FRQczBtCLLz11q/LqUynU49Tc/Zl42EMB75weOeWsYo663CoACmnunv+elUBQBHXo3tVmtxp0kgrVZrpb2Xe7nEOD51DExPqk2HTQQ8XIhEP1SY/O1JCMkxA3G+bVoRZDYpHgOm2jhfVNzLC6PaIFJ6MNqh6xNUflLFal4e1/e2FoQ64Xhw59h9susTTGU+okcMLeRLP3z/rDahdsBAAHwAR1qwh/nSTcgPoBLB2KVNWx4QJc3VDzUMMaswcCADeAYAO0sQNoCUsCetEw6OxM6UYpGEYS8qciSlfCJhSA9BwSDL6HzX+ihirdwb1toVGZd2Haqs7HmojxVRyfHpQorx9FNc19W2hNgPjusfTWk5e59uhSNRaCdX9ZGXnX5cDdraHUe6kUm2VbCd5JZaDzlSnhyW5/ei7e6DOHNkGVbPfjdsj6Kc0R9Uya4Ptjo7g4nIYc9AYtBZWhMwnXAsI80ytl1SX4pyA6bgbriJx+o0DGzNmpvmJe8aOmJFgmqqBNxasieTYu6KwG2UrsKUa46GsVkdyLe58GrIDjk5XX07l4jWNkXeO3W8Lp2WiC9wGwU3eaPPIjNOqyMZ/tC8yXbY9ipF5KeBQNTIt2pKCup79Rb5NimKzvdUleOtWc5m9hgA8sVgs1zedKUzjonLZkl7KYoNnROrzVKWsTmJxLWJcya6uOmZmHGV+dnyHFHKb2zNZPCtGR5DpHgpj4HT04Z3LKBVW2rDPoO6Zk4HY7pgWRepayzDY2IHUQBJbogCKKVfzTFPQYdb3+Mwud8HHbv2/CrEzY4lg/PKetxGsKrfijsoFiTPN7KPa9mNTsh+GXgVWtDiWY5LQ2i7SJyOyVKVxGqd655bEUaWURvsMWAxL0z7f+Jy06cGvYaejAxWhDEIpba9dUoEQfAOe0IL32G0AB5gkcPAYocjw8Tf523Itdhr7RZ5xJho/5xQrWFrkcTbVQxyO5FApa1Y96MNukhQHAmnnUGpj7nmPdjgcS831ZTOOMgxi6T4UEGvPpIAxJzab+vbCIT1ceQlCt2rYEGsPggli5v9wANbfYzl3epgSRns6oOVC+CRc/NUH3y8NqHmU1N9yENUya3VOvjVh5aZobngVUC8NqDTB6woWCA+9aB79aCsD0dHd7oA0IBTH0JhvrnXpINQfYxVr1F9HSQw1UfpCCFANFewqo8bhLg7NF4oUjkd4aU3NYmOo2DEy9ba7FPPMc/vghgVpwEGYhLW2cCVTNXT0Gk6AwlkkDXPiBQlsWUgMs45ICujuuU3xl8e4zWurhBGHl71zwSRcA02fAp2DPZQESPyh/bXhzutg+zIw/jeRoa2b1hBoC0yLRJCqIs4HZzzjszXXuBBiBiP5poaOKT1bsrokC4WQuihOBmVmG3UU1sHXpTVji17PR6nJeBcND8mR8aDFuggFF+cjLmGFfl7OTzofQbG6YDlKrXkGBjEXFTzegrkSDQ06EEMMYl/mu2+VYmFZxB7LkqVTxEpI978YFBzLU1O5ZckwZhsDoWlJ6bOdRu+JCYEgWi7n7RD8UE5mUBWbDFB03jfIAhZF1qwBZ/r0036ZQyhOGR1WPQK1cU6xANGyKTBTt4XbJ3GTSmtXx5Tacx0csOLqBw8KBKXE415ofEcAEnHMQhBEwrdnjjgbWtlORk7vm3OZOAeYtaWSWEGninEiHhnW0cxSQg9T1Pesnoar6O8WY1xoJfLF6UPqnTlCcBHggO3AUCR1aQzCzGfPXQgyBzOkKuc4ov6/gzFC2Bz3J7fs62VexHE6Kr1Yl9/wW6RU5qLb/w9K/c1SacIY74u+QB71hNUHLVG5PHLpHsumE/o1RAGOKvHPwpCaQ+yr0TDP9rE/lounzbsM6WoEn3ALxRQ5UZOsYcnlwxAtS5kFMn2GtALA7HqU8qABq0jT1TtAuTT1zCohErnVljHkeeO6p06Ey1E+2fp0s4A+223EypakvfsqGv6hCBfgChBZhmbSyGnN1mfK+kQ9IvWmSrTNq+79QTDOpO5lgrJ921UFfy11UyH+Rd+F+NG6Nn1vZH8DE5yCbf1Ih/sMwXzB6zgfgzkJ0imp95UJEq9Qi98d1QRRG27AImgllRURqYYEv2zU4AzdTQxmukH7BEwpBMO1HucZNpqqov7m5YHVUZt6UAa/OqYjyqFIyG29dufo2TMMruaRNyXvcTQLleIzpZybaQQGymxhmMJxFCIG4RtF1ku2vp9dJmdhZYo5d2IocvsIvsrlrB7wdBldlEHYsOPEFt/uoxWMbL2c4AUGSPlw3gJ3IJ64sQ1eDT+sU4qWxxxR39oAsNCM/QcQyB5gMC55crg1toOA5v2FlY7lgJFM6IA8hKlLSIsBphVm3ZuBQUSqr5Q3VUpYfVZyQEI3C0LJVISs9UJVF3IziDwMgzJEbt1cZgoI1XttFaognktX7xQutXHxR0R3h2ZImfR21zsdH1njcN5k2AAkrxdGW7ZJB06j5UiJkr1s1QGIqOhQFLNpIM+yTXWTLdsNujxmvVixVAx5iHvZ+F1otiC32m0LAmd8bbRwh1KMSb0O1N4y4l1cnyeFC3rWjW/SHHgSrXkBBgW4QchSX0PlnneKd2z171L2/TXXELgrVnj4e2CcyGpTLJpNiEZrxbpHqZJJkjIVhaD0IUyuGlKm6P0gTex1SDFBu0O6LCcaaJ4QQ3G9h5xID14Ph3X59aPRzxajxpDGncPLvyIRHqVxz3kcgx1WpoUy9s10k1Ul0NRGXr0KJUm+HlZM5cXDnqEqap2oFw0hNXZ2GemCqE524U1YJGU4nUJWbpUZEWw9dPYAR7oYDGCi4Plcwp6QzmcwVTNZeOzMlZHuDYnDkiNYLJe6vkgJMmGitKqth3vWFockAN2q8om1EjM6m4g8XZ3jtRH/rgdvFGFeqyw4gkqPLcGNuLCxRSnfU5OpOjct+kNZBYHSM/llIIM3QnqhI72OWdC6mer5oLO1kndnEND0cONpz7omQdPdZb7XQrkust5fruUeD5VgCBWs5RkKQnh4Tv1gqnziA6T9c7gkSrEC+jY9MYXXpGWoZIERhF4aJESBeVikaCckzo6pVE4ZFGLpdAoKSFq59rS4MT+9I3wAJitJ0/yZzrisfXmIgZLeZhptsFreV/jPjvJqbU7r4oFMQC2OxUxrWqn+lxm3Us29KJsEnpWCOlQzFdXCU/nlTERS6uCo5k9gJ5y3r6nmHCx0iJodgpjXpP5otXS1lMXArrNKrkiT/UOy12hJdaY3Kk3BCdUjB3bmmnI2tOkByxEOSkLNBaywq2WakKeU3WxtbxNPewZp4JPg540ekm1sFhXFARdW1AsqoaowRIAyuP31LzeEpZqoRjprXHVA8ewTCS+WM38ihA1Lx4nlLYNx7xDOB3UMoNOGIWujB9PnrIzTgyYWXegOcpvew2W8LRROBkVtYKw14VmgBvdixjBa9Inq8ixmrWKK4ltOfoYClnA4QtkpflZlxBcwQ/RqZ7A9fNnanJBK+OXenzu/j25C7+VLkXoasVL/CrS7S4h6p02blwQA0Xduje44nLqFkmJbELS7yWftj28OJEVnQa/kqHkElDZzzprQLXVFzMdEuYOQqvVTwOKJYB0/dSa3W7KY8bWh48YCuvvaT5Y/xKg/WUtVYpNtAnjCQuN4F5WhYgE4Wa0sGWQPhyupyC6pDT8Vkht0RFKSSrte1YNhaym0nxq6uLm10F6QD7A8WTWHHaYxzImk+oSskZgvI7nCHQkZYEXaGmlU7vpWMKp4E4aHH6o1wkli7h1GiJ+yy501SfYKU4twErHsXAVeiFVTrxGude+4kKdO8+cV0YlWRfzsb/Bkqn78m6oQsQukFbHqSGgMpQL4GNvLhKrYDiC75UnIINX7oBNFrpsIv3MSlyMh2VoZqPfQoy2N4LzghhKB2JJVFEwZgNEPISHU3U4tqK9c5Ca0rIN42Hs2ISRTrzGUSyZhhoY61gsjjtUKXycJN8QrO88o8cOkpK4PEOkNSG6RjWHATliadvzir949ZRh7/pS2aa/Zjx+jDIUgBRdkHqtJeE4nqU9hFREzRjY+gaLD6ijWYRj68ilUrjhHLYAAg8EalVGJVuOM3EGCqJByynmWkGwnApOt9Ig2c1x3z+K6EGu9kla9bY0jjqpoGHYkYZJc3ekdAnAB6lbmrnW3Uca00LtMIZlrNwTuzROFfEsN0Er8m7Be7U82DfPw/xGzyHLBQeHpz3PCc3lXUwytiIh1GFM/ErlIKLyhl8ZAdXAM2440MudZ6ON680zcV1vlfmaXy8XdLscQ68L9b5XLkeLJ4qoYlVF5FTxpd8LaXIZp754vhTri10UiJk7cT1YvSN2JkLlSxTdUJnuAOtOjkLQVvkJdMkR4EUDLuz6ODM7q5Viw0NoNbaSjiPLZS1tYztWEaZ1ge+5noT1ZK7BOnmXQ6ITfNBeBai9WZBZJPy1FPzm2UnSiKjee20OWoQL2plvL4xVRrycxU6/3Xtg0uAjH3yJcpwwTe7d0nQH+AyVYiAdh4/CyYNKCd5gWZZ2nFMLYlRrUV1ubHB2p2MsDcaAy/Jgw334tKGgkeYA6l4IKG2QTUS/WczSqSKepmR+TEizbZ7RKeqHu1MbiRPK60SBYO/wCoo4OqtNNkbhRsGXn7WqvS28w+AltwnvtDOHrReQyZNAvJKoSOsLtIx9Qqgl8fqd9meVpZlIgZKwjUVHxkAluwCUKIpy7wMyhi70LoJ8jfkdkIEu9M4Clkjl5buvKqP6b18op3wQc2ttH1Evd+Jc1lC/XF/W0H7p5K1uuPLMPnqifkRJQR8Do8QcITjqlqRDaT3v5lK6f199t8g0XAJi8q3fcX3+CucqkzvLTCvwq3PEp4763sjhvPy2JyG0wiMP+tDz23BVeqZ1x2xV44J7vWpzSKXpeAOw4MYOVgZLqcONix7yXkGmNpLi4Fcni1B1bttuwEO6Kpy9LoKoewAmHg/YCpXj1C+8HL43kc5WhTci/NGk3kROgUxSitmc/bavd3TySgBwwMjREBjxdf8lUI4R97XO+G0wXxfyJLiey4n7+z5HkC1jzvZlyIu6/B0UVBfNmHyn9S9w6A3MKR7YAE1xpWNxPuLgcIJEz5lI3SQC8/hpLP3HCmYwOZ7HuMVhu9n+xLGlTIDUn7CP9Re/lcXTSjkluPpKKkH450xsxULliRdqRrCzv5dbXiB7Qkt4SsZsWTbrMJbfLM9YR6MpPGy4iD/MsjO9o5AqINIeDymIXR3jW5PGrwWlrtpi18e3IWQONuoHEGWr5NYqIbVK1qwSLOthRsracLR2hBRZinMwBMuOdAY3O0k88aFl8PnO0lbgL5K4AstI6koEVLWM8LkaVOGLI68cc5J/YICMFtpf8v/SRgBwgIhKc32BpwvKWDz9mm7FvxU9oo1bE0ngn42nUDJUtG5aO5F2TWm6cEhqgk7VWTG7m0M7MSOz163CFCw119vljAwRCyTF3M6IQmKimndbbXGzAlPLxu9/Dk927V82XiVotInK+MROyZ0Q7isk+To3C+73NDBPoX9pOYCjbSYhlVfIsRVCa4WQWNeuI72jYEviZJcN6c2/gWsW7fIKIa1s117am/ZNezvQNtRo1RvjTa6sjRjd7rs3L+ETdqXagxE+x8fQJ3e1svpfBKuMF8OqxsXIa7I5vK9fbkWJrm04ObciTwg9lsunKZ8bhddXCdbkTd2RN7Fod/IIEMtNW2swuCagcLu7SutCdyKEkcnfC30N77EXKK2KRqtN862BGVj1mrFtCWXqkCj+RVRX9ILtGhEJar1t9V03TAsfDwN+ejinPvU478OhtilHiiCMhtx8xeM50zVKQfLoXNA/7EMsHtUo1vkH1/ptBfxfn3EHXaHY997350vD9GVdkpWKdsRBKI8RBmPCK6UKIcp50lHOffCLL0jSlxrpi4j05UH6wh9pGipWLePKcPQFNnpDJ3oHITxWR8iiLzPRF5CIY6+UHP8sJtGz6kTvJIz3FG3owF1KNaJQaGhoaL42M7FhQ0tLy5Yt1261VFnizKmROaxviIl+W923yMr6mxinVsFvyVBYda8Yw6LND+taZWJ81dY7KLZ64aETvYNAx3QzaN+ssCf/jZ2eVajfsEd2aM/5v9Q6FtWgv0JGcfx4amg0wqptKOH/xqWpMyFDJ47OUqcor6YLdvpSXzVbLfgf3LKDsnojgxRvWmw+Mm/UzixPZLG9QrTjLqotdmjD1u1VvcBoXAnVsI1xjFfyueyub4AadDpnml0f1Zc9Ifrs2NgVQY5QO+YovozG8Rw5xz4MB0fnBIDaD/WUl7dducdLu7nOOuIpS5NGCzRqCb9G68PTrGqOt3AArZMVfOuBXv1vB9oY93X+sCvLxRhAtr7oXGiKQwkCZ3u0XrELpBvrkoJbRLcg+/g00MbgcxgGkFYq+mnpUejrZXL6rMyU266k7K1cin/fwsNmZHjFE3hQSnJawsRnbwdJvHD8Pfmij8WvMOsYsjyn5ZUCJkLtLpSH+yDl9DTvRFu6SkPwkF37YPgz0n1X+H568h1paPcZWeicPhvW3Q41reZnvujUA8Cajw2zWGHQxd9W+q0qZPlEYvDiv6JbzXKfHsEVNxIOGH0kWmfSAuNZ3Jdx9c+PkDzNJoOpKi80/Lr3NViv8vukE09bv1Pk9C0+zovZPt7Gd7Hk2jTqKS0LUWqbq96czMSp2dUNOkING1O19dlhn+jw+4Ptg90BeKqDjQG90s1KyCrUtlth3etQ3Wa7rwTGh8QTJLlNSiUq35Zd1+yz/AZ45oEc6n9YS9pLFBe2rzlBFHr3XcxGoRXPaXI6PaxHv9wF32c2Vfe2meO6XNtg2LZ4nm+vjkei6LliP/Iuk+ep1kpwY8VOpux+4WLbRWYVCLFNswru0JbuW8Hn9AmDSNC1/fwN/+wZ2YLaPblIg4dSgZ/bouDiKKTEZFRomqB6Qjzho/UhnvDR8UCRdCy1uNgV54qZbqJDenUiXWzTYvdlzLX9fZNKPxC03mQONttrkUDS+CoC3gAfB7YbTGU3SVgKhNMyU3ePYPhB+uNzMn68eM/pKRvSrO7JlJBWg6eJBiu+eRmcwmkkOOdcqui6mOo4pUkHliECjGPoFRldRJmuQG2DogBJkdvZpuZixyOHRw/Bbe50wPpm4bkDoUiSKGHMiELaNFNsGkuwIo95xkc7bJG6h4USDnyaF5JKerLtWB71rPYxUIzynWnA6xHA2j3lpRxrRBzv7XEha7kncpYIwdGUr94RbQ1EPs8Fcuck6+BHFBZq5cNWSutmjCNkQiFAtL5Ua7TmSYcrKqJ44speRNhNg61OpQ3ygK+tyBoR5eLQKlT1zScHUI9A/PR5sDgZJeTz0BUlhNq3+kIhJWaP15aS9KQ5o5p+k9O27pg1fPwkkUTQVBResuMzItUuHOimcoAK+WzIwSDVnHqW4tkJOqIdlaAQy/aGdbPBxVMQ0HEC0059Srv0TkYYUTniT/Bc7cGEJvMMOUVOihxAJ/U8J+pZcuV2iPMlAcNyGyowivLhnYq/ZjbQX4EHomKIcpoi1Lp4PBGlOQpC8OJUtJTwjC7WxIb1uc2GIkpbfnN3ZtbU0kMHfiqlmKFQFxgJaaDsquRQDuJpV0S6vbL+aEaBUdJ4R6+QBD7LyO60R6HntDq97+agWISC9j0fb/ERR4RrrcBd61zrCDcY6HCW1k9WIyBMVgo4qJVdmVCe4BrINrk/EmB2Rms8QdJ5aZWGm7njniWGF47Xa0Oqxi8rbkt15HiKDRVNjr09jrlQxDPbqKkPFe+WPkZuzPPLTd7qlACKiRdkGwi8zetqo4mqp3wpo6wpXZ34Ilz362OvjHCmMFueC2lRgfoKchQMgH1b5lT6JOux3qOenKdHDS4OYxNy0BgGnOnqFfhQLaE4a5nkxt8suRvFcIpwIzONKArzxqC1xFrWUf3w6PEiM2YfmbBI8amEEkZHya+RwWc0bzeXmt9GH1s7TeDL1/W2vMJdrrv1w5GOPOUvBT0Vw+f89S5OBOhS2pBJRWGQJ7FGjxKNDLNjw7oQTL23VgqynOrRxiNLsVzzTbNSCGcdRxGJmQOAkybiE+xDVEtj1JgOgVFgeyE9ensdUgBaqG19lnWK5e1dKaEKp0iLYALtd+6mQ+HKhQw+K9BxzuQmzYDxIghUyx9a6iMsRoi1ntFc3baP6lfGLm/eGI95qMcBMbjFL8mKzTq8S/qcDjA9zERqBozOkw11EBpqQrVBzmhrAlencGCp4IxRByjCGmlNY7bz6BHiJDjWWsfRI6TEJDWzZF1YLRg5Zk7oROb0+RTnHhQ+Dg6hHnhoDVstCZc2HrIsSd0uEKf55ZPr8h4fzrhdLZSW+F2kfJvPemNzjK1HEnW4LEStfTG2EL9TWe4BWv3BGg20CUGFAEecR644b4dcPZ+jZO5RxjarOd7qzmOHS2vS+pCd/v194rQXMtVXD/wASNBISqZgGKXs1PfHlTXCKCfFFQJFPIrdw+Fx1T0uAP3Xh2xotyIzhLSc2o4xquZgdduZRq4s+/6nzUv3Icbvx0YszJVWgitezPGzZD193nxSaEhsPQXQ5qqHqDVJ/ENYCv8ESBt8gM+gRWxfw3JXFaZoBcA5+xiPTy5FRvgjzVsiJRv+lS6hCq3KieqVMySl/JMLJtZ1LRXectbBhe+GnOkmLq2xPO8Q8WRfZGlfjEhR2ntO1GWnUpEP8PV5inUCGJ5EuU1uWTQCGITU/mVLhutuNcxKN2G58BYF3qLrfxpFdGWf7Xd/Sg1tqsgBiOMBADf424yD/+3oLDPw7D/uYnX0CT/nVvC5/tW/ZXlZ3lwDfYdMUTqhJXhDJu5PIyjx0z+5oO3OQ7x5KGp7vbswgegBzsYBB75WLzctYip6VBN766Wq55QqtC6NNxfD8fFZ6UMdOf7qO8fouS//X1cwIw4uqj46vPtQqvF3pFGXpKlSDia5nyCThHwvtn7RWvuavTPQXgcrXwuH/PxWktQ8JE1F/PloGzK4kqCN/OmqeuaI/+7ZC1rpba+BavwauFZxSnFx31JVSuMTe/2qrgL9SU/eYBa4fpOQy8LTsoRuBrFkpT0jnOUUaOB2pTttIcLToxr30imtket6Gi/IORFe98DY7LQwZcSk4fFKnmm4KmUMDXoyyAmQU756/qj+d6lX7GbKbez8IqyAfP3tOjMoR44+yw0eiVAFDqOYADElqA9hkbQa50SrAZGIOdHqPiRiXsD+rcJewUEYQszmPozkdPTTB7J//wXqrv/fTmh6aAfCUxOJKitaNyY3nPaaEJAG1+XtA55L93gGIn0NaJyj7DmVns/3M3C4NcaDbZiDE8oxwv91exehoSj1urcRNBWzgadZNfxnbklNvaErEdrtXp4eakiPTcxYY5b+xbY401897v13Ds6j0Pzd42vdX1DR6wiNcN/Qed2OOoKY+zfNbXVmdc3qbKvVrZ6nYUHKHnPp5JhQGtCytLKnXDKOdATH/Sjz8+Wx6oPdb9pKx++XRwulrrYQGWQlklY94CXrvciS4yJf+68wqckmMZmTmAB3MogJ8CbAn5TCr+AU0uOqNoPbc1O4wTxa1jk8ivOXsX7usI+v76CHP3v9l3q4cT+sN3bEhfjR+wGF6jI8s4D/DvceOHy1P6oMUy8BmDc5uVePB3QPBCOLk7Mkzq/b9mrn5bOvhzv6/M/s1HZsVLCLtQsB7W4GvmOj5B5SzEyijHoMmcC+WQ7qCZLbU4pfJsEX+IkoKzjY1v2dCnciC3u8i9Iy6xurZcxQ5MnWEuz10Th84FbnFec8Ol0bvDtbWmT7hlE0bJSbnw1pu/YXy74uV1avFKRH8XAyZwYSIxm7ql6gECJXOguBu8iubIuNgVkfAoik0A9fQuPNbNJElGQ0sfoAkVR0yheduF6YFvKmfM2+iETz8UAK2BIXHBtOXEaXBRtObTm3AV/pBEOlh12gE8NheNQDHI95dR96sdDBwnAqMhodODOcSYc4O8OFdIxzY5jwaeu+3JU62kK/0zUUyPOetp4BB5r1Ye3pfbT1PpO28x0niXFzp1yoLKV1xK/cPFGbMEtUt99lIoEtWcw0JGBHWh6FoJkBTVc8qf82de1Nf/F7L2NP5VN3fn/qGldee4Zc5J93ptyjpBnra5bkqBeVLHmLFCn7LVXqbtKk7at0530NGS56yTJlbpaFdSIgdVW0bv0jmENWpvea1xbm/LMmmtMsAsGfwHBH09cEubY0dpKuCqOwLtjP+X+rEjUkuoa+Iu645RUGRWXG7vMurmnQBylvaunLCkcN0a5p7DRhvrfcdT1kMYg++2gjDOewcfBaOQH4rQ/RulDyH2es9udXioku+ZevVTVOi3XiHRe6SZNBrtnBJBVwr8JskVjBowo2i8UG1io8WCI62KqmxdFJlgE78zmBC1YyLFgiccsgFce8k84b3jgYgyXtCQRcMfKOZ6lPKKcTtRzIQ7mM56gvqN86ICiGGFZ9N9zIsZRNBuHY6rYImeoQEG+dqBQ9SCEKx/NF8gMGrWUflt6H40rGQ+QXPAYNDwNb5ZHhHQ+T942Fb0/7v75NhzX/DohN6XDvhdiIDp/XIp4n0xJAHm2d2sxba58FZJpSLeJ0Ug+VLY7TUtzG+qgJXOepNcMbT+ofE1FtbJ6M/suTN8MnT96MxJPRy5M3vzBOaTesyshQ0PCU+uf2Kjl6NPKU9yedacsWB1+e7CohNocHuIyn9D/7bQkLnTw8WerCvu5VNdE8Wep95+Ay99VNQhqUkPS3jkSfMloCExcGJprbNGfbLy4sFUlxXoqcKUmNuTo8t2YEnEvjmYhrw/Lszag8G/3MszfDP569Gf7w7M3fP3FO21Xp1izcTZ5T/0zG9mrkCzzn/Tl7VNc1eojn6/x8q2odDC4uz7l/Rra2EVYX8WypA6+Oyr1PiWdL3RI8dAO6eg4uU18Slr7rWPRTxktAicvknlMW3NZKVSaNYipWXtGWAqYgRpjUowGoMZx6BkK/DoDmeLVRBkA/DoB+ilf7maNlDqkaoizoxUu7rfodtIlT8dKWxFxnEzIv3pUaMZ0dVbjFS339RGVX+VYDSP21gq3SKo8GkPok8qhefhcawr6sneYhrOrHYFbpq4d/7yKMvFH/poxsuJnnou96g5rix6PecMWPZ33xQ/XFj9UXP77rix/f9MWPF33xI/TFj9YXP86vMJEUphC8GQGdw8Mj6MkOKs6jD8jEnPqWy9V3H3cs/7zbDL5rij/ox2S8/CflesXKJWI4pqP/r7vUJSGt8iI14ugu7pGH3UZxdISjc9D+UEGbjK1zz+lE2fwfE/c6fjjOBgr2jfj35bj5uhZx7T8Df/bvoYIg1Q2JJ1hJbko+UV9LXuFjkFJD1Rr1aMFn6lvJG3z6EUXAM2AAlwE4rqHvxeSxTpWsrt8Rq9gb+a6f/wjlIBDGeNhIL2zKVCf+njmCIJlrUnAwJu4lT7niv84rweQ2P3cXiWG7nmfC36IafhnozPdowSoF8ihzk8NHosMfwSJySFHuPIZPxIA/gzVmeIJNNhw+ExP+CtZjR+44oAZ8IV74ESwWE69oGSH4mljw81eGiBcMF5WPx3JfPAAZlWVfbmRH6zIScU6NzmI7fIyWb+ywbx9r1lAu/TfT/9sUbOfLhw/qJEnfp3v90IS29ira6ULfWHgsva1hQisRe4fBM+ptLfQAYcQedrj0TpsmaK/S0Xa6ofR+OWdCSboaQwqRdB59S/DUObMW3o2ht21D78TmmScgoNK2aS5aUt+0BcGUti3jok587gkgpW2fPEOQm0ADpLRtT+EDwJ36gJS2nQ59Uy7pvUBKZwJHB8l2ScAdQ9jPmSLdJUOh42Ar/T213OAoAN5b8DKMrZ8LRUHdBqJ7Rzigtv3jyeq266QdgRk8148kvNXyc4oqZG0beMitrGr5zagKthMzcG1l15Sf5w0UpfnCU40v/tSUFUfXXteRwV33vtaTN2PZqG0BnmOrnqvdrCAQb3ildBOitv333flsvho8IIQni/5ZbWcCTu2GucEV/VFtZ5ZMRTt4wxX9u9re588erL5cuKL/VNtPAqRgButwRf+ro7vHNvC9+mYg5+DUkvLrMttWN72pRC2pQWtvtBdnUo1aZp6tN51ICXQY41ZPx5aoJ15dYjg8ld62ei1V5eKswyPqbcuXiHEuQAlceqd8x7kzFGlFN5PeKeNwm0q4AgHrnCruuCBdYVm6KfS2fGdylI4TFsintOV33yDKpj4CuZS2zGG0rnEkEEhpy7GHGNn8rgIpbVnRdMp2yRJIacug13roQguAlE4tLAlh4gnSwM0Bt5a0FW+Cd+GNUmNrSc/Fz1x5Bt3U2VpmDhbpkR4oPIrt1f421XqkqrHXAHjjf/492Rsq1rfir+dPxvM/ip8/rT7N6wavIzkDE8/Y8J2OfFQRv+w65qJ1yNrM2MRrwy898vN3EZ8nUreXLx5HHB6GqbyGRa/oFb58RIf+vf0cH8vt94jvL5dGccrt1X1L2wIdGRsDDjzHVr3IfvVjbr3wdsrt1f6xcK0wsTrWGniy6F+yLWio4JfQAa7oT9kOuc54u6gPXNFfst1MpxOdZQ9c0X9lue6maVsfVrhq/wOllQa2ABTYQfN2yhPWqNBxNLTUTs3qDFVhH1vaa8863WoUKbXCGH+/ez6WJt7NMrcrBQ+ltyW5K1PcJKbwhHo/eMt1mbNFMtx6W1NpeofWJxxe9E6Z91Jc4Lx3IJXOqe7ulhZ21tFNobdl6Sps68UXIJ/Slv0OiUYYDYJcSlsehT5WdwgaSGnLWt1u0z6OQEpbpjJtMu4rBKS05cW7XZcHJEBKp+a+5Bx63W1Up+Hvd9qowOUPS8hp4/c7va3uMDlyb9H09xu76NnSjz6Nfno57Fte1lPQzyuH3XhGPfYJNrS/V8wkd1wXidkeZ5Dr930905SiJ8W+9PkJKSWpuJe+PHHeE/7OEdfhdf16zix2fu6f4VeniKe6337y1Iqf9/eK2cN21RbgyVsEefIWCpysJB05fUFnkzr1H54Fnus+N8+t+EV+r5gxaldtTp69BZ959hZ8wtlK4qecv6IzCJ3iXyx+ZZ/j11Lf87eIWYJemV3fW/C9+6NfrWn1qzX/1q/7d9om/Rx6/aucOwYXFzc+CtOPsO2Ae4zoVe+44V9XusOpPS4i2tjbD+K56v+Sa6bkVg/uxZ0X0S3iyZp+fC36PNVVW1RcPXa49uCXDJSn4VcVfz1mjVEN0dynJzznUb4vPsD3EKedoRgSrKYG97j232mhZzHytVnjwyNW//OtufYGsN4dNniy6O/NtqnXaWBqe3BFPzfnu20EwbwJV/RLs+11b/mZACBc0a/Ndlyz2i4TOFzRb23uLpQ8snNtG/cPZM9TmvAA4KiKMoLtDHGa2pu0xUvWRXgZqs9gG1nuAU+ZCLoPl47QdrX3kmFEZUAqpS2nrg9px4sHmtJuniTbgSQPSKP0KPCtAD/TdIkgOqdrYAeZ+E4HXetteyxWILgKBwQU2ja23vY5DgDIJbTtuRE24ctwgYS2jR6jA96FBSS07VBR1OGSEiChbRPtJPB2zQEJnQ69DF9X4SFubg+994d3IuzWuaS9iq30L1PLK2vPyVEAXoYp7rU2CSn1Md0H2Qet7fvT+ZZPdRPd2kNLUaqfh46BXbfU4eOKJniy6vnZJookysG+VgJ/dHgGC9b04XXXh/eDhSoriLS6FlMivZ391gxcLEgLmCtmIUJybNWfYpkRSzea8yQ8Ye2nr2L7rVOa1FNseLLoP8V2DN12Oe0OXNF/i+0DJortSHS4ov8Vy93ot5c9CuCq/Q2K7Q3VE6fhHOGKxpKab5+neggvH86StqFih14xVIJY0gMj0iPXoYswlplIWxXCVa88tpJeg9NjOgZzBh4IJbVdKNqoYBQccJLa6lXQyZjkB6BonbUec3uu9IIkOqdqeBAOtlQ63RR6W04nMGhzdQD5lLbM6wWEoQsJciltGdzIsGzDD5DSlhWWKa+eDQApbXlZG1xWnzeQ0pa9mmoJTbWAlF5wBzz3pt69Ewl9IEvqkw8gvQ+lEcGSJVG5bF7DI4Zl5uj3VLxnQ5XSsu1vD85N+cpFH717pC0uGz8LCWaUTjQtvJAuC1f1eWp2d+oZ2TmNDK/V37lZESlkAjDNPf+Dv/rCT5uzC5dxUAX98Cjfl+Sjpu00lrZMdhj+tFW/qmVAm55Ey5PwV1j1H9+ba2p+gTcWGZ4s+rnZ3nvHOmfDD1zRL832i6U9yInRcMW/dl0u9mwHiqHmin5rtg2JjZxJV+AKf58eKKuo8KwNNKT5MmUsHCCBi1i0tEyNRJYYErWC1pYzDy+VJZHMWcb4sgtjdecZWN0+PxBK6idwsy1ux2ogxJLa7njMIW5jH1CltjHPgjuEmQCkkTpldVpJa2dyEETnVOe45enNwdF90tvywlt2PJvOIJ/SlgF3lnKL2kAupS1THz8HWzgYSGnLrZwAeCeIgZS2jC1S9NoRHUhpy3PvPRGbRgRSOrVsKu45a7FxloYv06ZDZSdCsaWNl+mt+j2vIUKdps8WK7gM1MlCg0REJkXMJRfNvUjhzV64flcPwfRzdEWUAjA/TLaRIT/aFZM6tYjfFTvEVbEShjYsyv87l9RgA2cyKZs42186zbUykLNqJ9ESd0oy7f4fDKemlL0Mp72OEsMrBPvM+bQkhrzf8ml5jM++DHxaHkMBXz4tj1H2h7nX/ORbAvBpSQz7Pt8+7mxfExjlSYtg7NDyac4/gEumNLdnAJ/mjoQ9n+aOBsCn2UNYQ5/ztLhoyPhAm0vzhYT3PGlyuPb3bPtl0xTuYlqh2TT5duVEm7mRSldR7mkFdU8TqnuqoPz8DcojvqCc/gOq+/iDupMBU1TwVKUSVJFAVeJhivANqsTNFBEdUo8Yj2K6e3xjqhn9184oNIsj366caBNCV1Gc4oThFE8QJ08gfvED8Qg9iJN/QTyiArkTixEVMyTKC6XEDYmIOyMiVkZEUJAS43lExRA7qx9nRs3gvnYqphWKfLtyok0IXUVx8gVzp2BAd4oadL+/At0jWtCdwof6fTDmJjFgHhU09KjQQY+IAD3Cf8wjwsg8Ig7MI8JypgeInV//3zGvGdvXzhfTCkW+XTnRJnSsouSPF67aipSm4hkzSQNXIf+HzNmaoY1PgnyWDW3rlKc9rkjXJqSQo41iJbnmWoUbbRQrRDXXKtRoo1j5pRlWYUYbwooObdUKMTpzERx1HqKKqy9TeIczY9hung7His4zawAgx5F6DpmXoRh/jUFnn/cvFT6HJGNOp3p/x/mzXtCUS66af9XeBD9mp6D/4cI6mYdkITpvSATLt6zChiqWvCB6b14Xl5Wmv6Kd+E/vHibDpXiDOYl1zWnqdbZfty31cBxDP38+5ceKyqg04i4mRO2/Y0Hymhd4GxDi9q9k1Hp7SqhOSGb/OSXZlGPZQU7bC+6oenZ3RZvGF7XWpPaeGHcJK7mEaktcb2LuymuPbsVok5gAXrNUZ6Z3ZNo3GueeT2HF5J4aYm05T4TKfPOphZffkepfoewDBsdBlYs7Cp2uN5+wJWqVimvoyvR+r90GmJRj8ryUcaxG/hEZjhPUVByLP3H9jfjHr8wrP+5StnBMwTh/joS++ooCfJTGTxAVucT1IezwZ44aR7asLsBlYQJJfKjFJC4NyO3sS/6OwQyoiel8PnaFJxjIw667KWFShz/G5MkfG5dYkY9kWMQO+ahMxf5+Qj7BwGLl9vGZFEVY83Z/ZrNQhz8E9cC60K4HFf0TwaFH/wfgyOO0VUUbl2fIgk5hUd6o82u+A/4RbAQ+DnrgRubjsAcs/s95P3DxccIDFyvdBEyQArUHTd3TbBZsBEK7HljXT4sOPfpno0OP/k//nC0debyUbj4oMrJ5TjGmeMPQ7GIGt2/FOfX5UwPnE1MoONi9viocp0LO5WJPSMcknaX1C3rNcsiRXwWJMTuPNbC6x3ZR0dnEKVrZpF+Str8sLXeTA+PySt2bSluOoVxc0ZyIyhxFg3y9447KwTc3l0llWzZ8+/TJpv1hXwbDRDI7nrDFHdFwDHKCE/lSy2CnEwqMB+FwQELlmZ0Ig2Uy42zNIiAb+PDcQEGDF+Apxq8f/zUgf+PBquFoRbqlPPS7gXoacVKUzANGwvnxhNFCLFEbk0KmZRzFoCl0K+jmhM4O0hsMnvRjUhzUTmY0rAswAvrBaVik0eY0S6cQtYHcWiPNSpZzMYBlBCiNPC8f7jPDHOfXKLOKJUjMoTwziUadVS39sQ5XWNVrtFnNMs6p8lhVcqNP645xvksTj7QxZg3L/MJo9ProGnPWtPTHCyuwfSa5Xuofyf32yqdyT/rf1xWuV/A8HslkNJXWl3BDKpQaBsDkYWKzJmzXIgUveZh3uSgK2xa6WZQwa9jSvH5Or5k4eZjY3ZupnoEpTB4qdhMtL5dedyYPFTtTRcMRaYXkoWK3INF7T0Q1eajYvS3UrGG8SB4sbsGuUhVhmjxUjjlonz3R5d4gQbGDD3JZj9Q3eaiU8wUfiyHaiZYj5fnlt8quxeLvhM7y9sNn02aLROPya3SFGlHS5A5Hnl/tit6pWA6dggtcoj1SvZtjEyfYRUmkWgEWb3CUJbEYEqyTnVSWRL78ngGbc8uSuDmmA0iuKUvi2w1NuyhyWRJZI15qvtaQJTHpMelMOStLopWPpCEdjCzJMKf2yOv0eWzZI+Hm8VZproQegik+ryZbJLLp6A4eR4iSFrK0aXnNKHqnzuxxTFcGivZI1Z/2HI4knyiJ8J1ePNS1J0siioTP48kEXQpRdqc5HiFLoj9OOr5jL1kq79ZABp1dlsSYlL5r0H2yJHKiPvJ03JElUSfcKa5NSJbkQIAc4eiY4tAy7PiVyz7/myzE9jaHcy17LM6fH/rl0cwgiFWHEW4SCmSNmXOcrzAd9rgQTDo1SMSzIybDWH4FYwXTL+c+F2M2HqFgklQFXCKe+UFH6ih6hgmT0zvnOM9kYts71efK45vzntUySw7BfPChAiRezmcOzdSa8/LMg1go+vO2gQ5E168mbybpMPrTwYL2sntib6aETT3ys8hidrp3yKcm7Hyd2cxPc97LDpjE1M5VHPVKC5N7ZySoKG8fyGZ+PecvY8uSe3jXWRXtKhITuzdP+dKCBJM/dR1mCdtQXQXGZyJRrpBR92g0NHkvL7gvovW4N15237JJwWLV1XoU/krf+VYth8YnhvbcJQAIlotL6bRHOAYAgQdhuiyAI8Y1UPTDdQRzpZFTsRgu+pblJbjRhFuxAUDoWs451VZ4+CBszr/kEGZgXtPLlA0XvQ42pyBCHRY0+l7lvotKl/BeBo+ecv649jACkcNG32krtQrw+gtk9Fc5FujC+KlOyOgpT7NDU2dQChk95XuF8NAlsUJGj93ZwviYcW7yMEuU66UVaL92DRd9oXKZV6mWwi5Rc9R2iNkccP5ldLM0uWef7DO7zj8UrCAKRC3q/BrZSWUQCKI8Fmpccdt9waKVZ470e5atT1u05vynYV4rL5FEy048iQGlkM+e6jBd2QJb0l0HZYfmWBgEeMJWqoNxqSGBQc5WUy02D4cf0XSskGipacaQLsecxUWvaeAjWIop7aiyjHg+W4OJFGUafxU29d5yiJLYQb0ByYqp2mIRZXZ8w2Eo2iidnR19HjqwZ5j9Sx8B7qXqfrH7PvFHdp2/DWAnPbOfqPPzE8whOWIR5bGIDVTM3tNT/e6uLAOLiqXdsrv5jg9+NgRlJVp2YtRMYaFnfbI/fEeOc4aL0ROtOZf6ExNmsjeixdZadnrwuA5Umafu0Vyt6mvRUtOMcnfJ3J6LXtPkqXRSAVITZRqdaHCRWjlRpnFTdA0xURUlsWhUrVyHRHXsLFK5GSSz/UTv719j+gC7oxUUhi/EFsu/6/PH/UIw58YL135vO9wm0mFOSJKhy44NPqwpLnYyB3B4WPotgLFsOOBhNuAxneTbEjzMqd1TZla1yofVaLp6JM6EDtONUUu3PnpFh/yOVOvHm3V4yJ8SMcC+ycFDbgsqvMREJjzkhrXnST0spkNubYDu1JkHHXLTF9qU1kHokKuSVSIlVUmHFLseu6ikzGDIPDz3s8CupkNOsJ6PARyhMwbmPIR1R6iHS4c5uy1xOuWq8DAn60I3R5wvHma2Zw1xzcaFh9lOr48f6jngYdFMPz+vg8XDbPZyQTamvOkwnU4Ye/ilFh3ya/WZ9Ormw0M+hPVDSUwAPOR2C+WZxrnhIfci3sutCnl0yGX1lQS6O8ND8FuzvXI5OuTSjb7eOjTGQwlnBHoyq4Ahc0veQFBCEh1yJmyFjnB7nTMwZ2sTSCJJJB7mpHlLwrLUxIc5TSXIkxGv+TBzLTQdBBQQH5abAGMmEVo+zMnCNHyZpsqH2ewCGVtXT+NhuiRwE8IbDTzkA8WqhcLF+LBA4eXs1rzHh9waoeIZpQs+5K61k8wm8uEhV+L2PVnoMzzkmtJCsuq24iG3LLJ8liUKDykar1wOAozIkAm+DV2HVoaHHN0mZ+JdAK4ZmDM/Yaro+TM8zBkHBlCLnhQf5kSAMs5CuvNhZlWFVxotWXxYLvZFPiCOx4c5U0DzvRZC5MNsT+oM38o94MNyFTyQwqCNh/ytKNd8zrh8yO/i4ZqidOFDbnqZ6bNaNj7kzpZcTp8X4yEXfu4z52MAPORWdNBYv3mBh9yC3vbpqWI8pNhxqMgyHSRD5htKgGO9Yzwk1QT4AfO2lKci3+v5n/OFyKID3C20kk6nOZ/mZNOcI+Fpzm6j7FCMQDzNvA6e5HL0EE+zUVUCOHkr4GnOisB46R3P8DQbOWvb3nu7dJpO2TSS9gaHTvlIO/N6qE/xlI8TNiP22gVPuckmfI86afCUK1Q/Y8WAplNuP89q1fNIOuViAj7F9UOjU65Fmq/qrDGdUngLZpYs1oIpky9harSDPDrlZL1Zs9WidsbQnAqGbHNLazrNiT11ANMpD09zQoEleo4B42nm9xzPgCZr8DQbHqclqApQPM1502dTjSmKp9meqV09Pjuj03SIfhECr17SKX/WqGEjiQBP+T2VRCrvlPGUCzH7IA2zHp5y7bnPzPbzo1NuXcQ463UfnXIDB/poufXolIszKPhWA4lOKSZhwAcaHmDK1LiOZ4ppSqccfe+uzHU0nTM0Z8jLghd0/fA0p4TitbM1H58W1e+zHUDLfJo5ERnc7TGPT7ORwVtebc/k05wIZoqygEk+zeZp+zBeBhGeprOPYAzZoIan/BKoyYcXp3zKL3oetemJwKdcN8CEUqY5PuVCmXImKDDhKZfDU6rBTRxPucqzVo4OIDzl2hfSaNg7xFPKerzc6RkDMmXKr33zSmsFT0X9lokqTMg1Q3NSXwOdeJzgac7cD7sLD/X4NKealEaW6SM+zZwjSugcVMCn2UTfHGjHWvBpzpf8aCwQ5fg0mxh4DwBRIZ6my69lq8o7hqd86THSt2GofMp/JwgNuZ3Ip1yTfBToQC58Kj6ZNxgPBPGUe4axtQb8Hp5yu0sN37PYxVMuiuMRvSV9eEpJyISSgtWSKRPeE61nUCF4SoLgenzyCLE8Fflez3/dL0TmRGhA0WBA0c2ces0KpV1M8WZOOq9Hsobf8s3KPFXSZ7WBN7PdYpGTExPjzZxO3UoZqxa8mS2Sp7LfehvdTMcxiMOMO0I3+ee4Gi9d0/Em/1KGJ5Q0FG9ylbFV4wUFeJNby3O1QeJFN7mnA1Aaj73oJlfdleDBKT26ySX6GmoUCtBNCqSJ93RrIthkXqVXIPmB0U2OgEGZX7CJM8bMefbsyRUJKN3MqQ4eG95QgzdzoqqWYfVO4M3M8m8flIrB8c1qAvIqL1oTb+bMK8WMEmuLN7NZoV9EoaLSzXQPWtIr3eToJh++VdC1Yije5IM4Ug7P9uFN7r4IXONyG7zJdcpwJTCA0E2u7aA7j+z36CbXv9PxwUMTuskd31REaHhONymRhmbQI4Jgk5knil8FugXd5DQszVtwHXHOmDn5chU4u63izZwkFsZU+nr5Zs5wlzVf6Yd8MzPDH8J7Xm/4ZrZ5tV1qtoF8M2cXCGpyjRPfzJY7MSHxFS7eTAfFO8TUbYE3+cGx1REKPb7J19EUC8jt4Ztc7AfPzmBZ+Ka4DoP5jhXxJrfxxT0/60q+qVXnu3EwALzJFYby+an38U2JNPKrajVDm0qFWXQ1dMWbHN7kqIioHc4Zs+Y4C1rPgOHNnOh5VyliNHwzJ0iHdPQDHr6ZeSM6oCzoDd/Mxv66eab3iG/m5H9uKzmFxDezTSq/3VYexpvp8DCDUKUu4k3+Nb4EDUR2vlkgEjb1AWvwTS6MWHvAK2i+yZ3hlh7lq8Wb3MUetNisSrzJrbxUJeXgxJtcb7di0QEdvEmhYbyUoI0km8w0dtndBx18UzPQ5aE2VqxRU5iMw8wv1dCvY/yqmWjupSGzsSz5aMsZ3TRQXvs+TzejXzMwnra0eDP2ZEmBUnPHm1cuIqRKvnnxFpO6dcmQhngz0u/SAs1+EW+xE6jtS+ZJN1kevOcq/DrTZRerKveA+8TLRkyvgd2DiZfpTfDW4Hg3XiY7ZgZowfN0mcEAKmKY99JlesM8JzwnSJd5oxNYfLaZLiGkXgnCy4VgedCtTKwhOuky8iGC1cZEdIwxI57Ve+oXLOmWFMfLlAqgeDM2vSRkriuItzAVoZ+Mlcab664r3QsnMd6Mo82S6lik8UYb9nRlRk83WRulDwnKarpsDGeukTex8bI5wmXwoT3KF1q1yWdlES9TLWHJWOpBvErlyMhM4k6XyXkBY8znly5THL2Ht3UjXYJFtPgQ52ywPHDGR5BjNukytCQkY+1ZdJwxZsGo8dRSvBlnE+8R22bmmxHktBBA5mm+ee2oGmVrFuWb63TEnc/qLt+MVqSJAJlR+eYCJJ2zILfEm8yMaye7zjJe9kqvSPH1i3zZ+ZKCMSm28mW6FmeKPwTIlxkoQwY4lYyX+QbRBmieWLxMQA3JjXq+eJk7CBNBxJ3xEsoSF9f7NSTLi3qymzAsL16G1naNxb2HnWbM2Dh6JyJLEm/GELsKbFT1fDOGqJg08L3OtzBpJ57hUeWba6tt7PVSWr4Z53HriEyM5JtL2jCggRBfvsWQ3sGJTzhedsS8fpoNePmytcax9/Jx58uUKxbPPUctXyaQ9r0AvtF4mTlrmF3PreJlcpX3BOxDiJdpnI3CFwAZL+E1kUszeb9keTUbslCHMvEyplrfm0dNmOwa5VcLOHA0EbFsRO29+Bl+N5gPfsWJ3LzRpYRp774Vf4IiA0vDHIjjGQgA4BWA3RWM1SsQXFcw/q5AGF3BmLq6vV+w0STLhXkgQHP9/NetX/JjWcH5Fb9uHBDT/ptYGgIP3FsrBsS2/zbWM6eyuuCYAXHtv9P0SdTqyrKG/Oc//MXvv45APP80PI3cHy6OrQCOVwFmV8EwtAL5WwVDywpkahUMF6vTq3jiis/bZ6Kkystq3eG89iiiUc21rv3NkbbhUZRGCxlH2lY6Shgo1RzFZICri4aq9dERCA5RHxwNRh+OOh8AR1QAPVQwwqpAjFDBqKkC0UAFIqGKRTbp6D7PWyecCeIrADjWtutz19iRBcfaNw+KTYu74Vi7/Xqt1hADjmMK814udIPSx4fnb13PuJ/yifAeQWTG0th9vyze6IV5E8mxOsbw+2W0Ml6u8rBs78///TKW2D3IPkiC7f2AfllsL7ZWvxZ625z9gX5ZSFsgu8pUaNgvIGT8Qi0VZ62dSdHQolnyecpjLIjazVfT3nxIbb+9YuVlb3vPthTE7R0LjuFKVB8mSNonVvVty6s3LXT15v0GbactJdXaiYU40V7mqR3zDeJEG2sB2V7jPE5iggfqVc++YWU+3wKQQRn+RMlAjM7JVLDgCnkZq5zqrgRtCzEZc6pMA5gWCaTMaWx3siDsgj1QYwvW+9R56EDV1s4SrH6vglTre/1CXbSNVOu2grxemgeqdlxGznLSLVC1H4dJMu8TAlV7g9lIbzQXVOsfg2CuoM6pdiE5v2xhKE7N9bhsdA8ypzGfL7rcQ71DdRjGXxI611//BdM5/fqP90dvOMKbdovlph2DtmnrCa7delprdy5QyXaOvNqdY6x252iq3YGAIttAvt8hQpWtq49JqaXLvtHNq/JGz2NPZdZGjanHB4uqMmtTcpmWixipzDFv8N3Ll+eq1yj5MGiZ+nuBsjXSWRGcYZHQuOCfwuYAyIgEdghNaaXwlLYLT2nR8JR2Dk93/fDsx7Z5Vg7MCoq05YJPsu3AZu6xs7UWa4lAwi+2jWqkKal4a1pMwifblilPzZLVHlpMwmdnSkTcTbxU02ISsPhvdYQ51J7nhM5CqE0m7HWN5PwXl29YNz5I+9QDt1/0021kpfWYMMvoevCA//vy5nUU5deU8ReOm3efqLXERC5pIjubRfUuwtEst/LTPBPTZpp1tcL7FpFd72YVToZkKOkJ2XBig2IkaYKqdF6hKZsZuvHEAUPFFJgmt/yI4P9B8I1I0WCTUTLU+KBsuPlNRcleqRpt+lJTtjt15ftCw0TzTFPlvB8JXgiajhQNNr4oGWpyyoZbMhUjzRtVpRupKdtC3XgT0VCxbzRVznZkeGFoMYoGGz+UDDUJZcONCxUjzZ2q0j2oKdtn6sr3lYaK/aVpMqkeBV4Emj8UDbYwJUNNG2XDLUTFSKNTNdo0UzPWbNSNtygNE82FpsnE41HhSWHvFA02ByVDjUZZ8b5SUbIvVJXuoKZsJ+rK952GiZZC02TS4WjwYtD8pKhwPygZamTKhj+IipK9UzXa2Kkp20rdeNObhomGL02TyXR0eHLYN4oGm5CSon2nbLglUTHSOFM12vCmZqxpoW68+UJDxc40TSalY8BLQPOBosGmDyVFGygbbm5UjDQSVaX7TM1Yc6KufE80VOyFpsnEckx4SthvigabzpQMNa6UFe8DFSNNK1WlO6gBbcuOsnXHedHVICocFRcndOXs4YSlsId02ZaL2UOR0S01uhiLfsPGHS9BN3oQAge5ef61tuxexsz6+fr4A/mjb+LoOft2/h6NhaqjCoBcadn2lh5na4mSgisxPjSjHvfy8mwTD3bumaIRj3L1SNO4OXqiaNpBe/ykimf3dZzPzCXb7us4X5hLzt3XcZ44v828u+9G9Pl3hw99Ft59ctZcvPcNiD4j78lu+ry8x985bHbe+y5En6N3+NBn6r1PmQkA4Ov9SdwfJRYAgLX3rv3kUrl77wiGoIbge2RPyBSc6i72HlmDrirRAvM9/soTnO8t9h5og4gXOVzf+ytTcNKz2HrcDaKGt5tc07sUAQDw/N6VJLpov6fvTPQpf1+neu45WeLf+0ZBHf73+NDnAL5PtpUJ+K460MUDPv7JW5MC3zUJqtDAxyd7zw98V2XIogSf+qFPFXy/p2SsCYPvCw512ODjQ587+D5ZMgbhecRTbEPjwMav24SZXnokT5/ZbzDF1v6z+eOLjYlTqin7uZD1Grgu78dQ31DFBpa8cqYixtcQ89ruZcZFhYcLNnwMcevtMVWrctalWyfk3f+Dj2Us98V997oM9UChKGVJMfV6PoOv6/RWEHjb66bhjHj1p1It7hk7bYmSXTJkb6+lZLKkMnqzE8i7vVUrYeKY6LVAPu1eys9LBbWja0Z8+7OUCYhY2QckevkXTBuKUmmkhgq5RN0R2D6VGtmFLaDH6Ahqn8uAoBXvM0ANQ2zb11imu8T1naQKSTPP9aE+efP6yLZ/C20+Is9LUOUY1TbENqrOOKsnR5xP7jhShS53E+nnD0eqU1yqvbXdONJ7+Whdg3cfkFRvIES7QrKBpFo8D1peuReQVOWfZSttvAKSauCmR03gAZREoWSIyLqApBpz7+29uE4gqcJx3rouwocjVRSe2rcP3wHJNFAm91S3gSQr2fxYAgJKDHYn1YpiqXkxEyBSKrpJOOIrhZEq2TU3uL0pHKsSbYGSe8JwrGr2wuMV4CmO9Qj+Dg3dKIAsDPEon/MEkFVNKenJOa8h2XT04RBXuAJZdaDt5ZyqEpBVZzvFqbOSgKyqv6Gbr/sRkFXtcL45k2HAsao2Gp6EZReOVWtsw6XgheFYNdI2a7MPHMnDzF+7s6rQ+yJPygzESu+hb0HSS4CxKvMxIpm1M05UUwcB5B1B40T1MpgNOg4cJ3q8lxXBnjICRXWapWoFcBcoqoPvKjUeiQNFta1DjKeFBSiqnXItBNXPkGLaZ6E6fntAUS2hXrsYDAGK6nMer1VKGJyoUimacsPi4kS1XVhAsPgWJ6olyC8ehcQhZZhv0V1Ukf60BRw9UWKEjSQGrpA4MT3KjYSDBzhVLYIOqKVgwKkqfSbfF28FcKpXVnmkRwYBVFUYK3+zzDFQFXWJfpnXDVRVNNzktzhVQFWNsFnWxN4FqqqmNSsrYjpQVTVLwD0xZYCqmt7+rsKPC6eqb84b4BUf41Q1FQzqiYQJTm3B9EHKFad9dS549D1PuDZVs7vDSN1jIFWys5ih99ANTFWdy7iiSV3EpBryxPAykZyYVC+i6VB4+RHT3tWlpzIcXU6qdNGtc50dyUlVcxPk1jeHnFQXSIU53UvJSbU0RWIQVJGcVJvxHFRto8lJNTDbUArFSU6qvntYRzBDiMk2J1/3mY4Tk6rCn4nJMCQ5mQopB/eYL8lL5hh+tFQ5BvzBjiaTkRK8g1tygmNSmhpbHbO+0TQOVCkdndv0YUn1P/WazQNVlO72yz1Wfi9bdvg6rUdTTATSMkvj1AUWpwjrMK/3jj1mNOLdn8/tR2PEIBZkPHpL0xuBJcurVBRRGpilmaSbqvfrwppkzloK0J3KQ2rOB/AcX/fznFqmJpksvXiEvcxVP/2mDoECEko6aoiHLzlBLOMvSdxwwTqxis5VH77PhGqP3lcASUOZmFl3kUik5cvaGM1V9/rThhKwWRS+bkgZm1l3lmgwacZrMopr77cqzBkTU5tBLDUjPmw5fkQljQFsP+LE9/ynn4ow3MZyuc5hUnfRCZpl9uQFObRdfCLuN3xoIiurxIOQm8GEXhYp/jK0SArju8WY3AHtZznpjDA2ETWhs5LiZ2gytKYSgzq0k9XiyQxx3kRCtpLiNjQxsyiPuQC0k9VOxxaHaxAhXUlxHZ0fYE9AFNFMVvFu9wCkXBKyVcRyJbZLV8ODjptpzFii10oVYYZFkPAiHadi313Yesq+S3tznBMDloRiDCUM1b7lEi5eqkZ9QLVGmTstiV2aLqXbZxM6gSqvqOGHrhx+sCFbIjUMFult0862Qz3+4WfGb0e5svHi5KpsnI+P+kPscJ+76HPs4Ke/3xnB/O0c5b7BXrrB7sdO/CIgFNGRPGq8nFD+wsig+4tcJBkQ9mPgB35REOrddyTo93ZB+XNj0P1Zrsnpcwt0ww/0IiHMXHnh+XrsoRq/+MA4c9uKWJO5wbiqNuITs9FszatnHWoelX9jBPPc25P7nIc/tvFUfru+xag2/rK8MkteScPk1/4xbGR3APkE8XN8xzYO/78NCfMaMOrHfMXG+AK1wOGY18+q10faMEoxOfZR8pSCJaXv8PH+99vmSIzb8Ihm48f53plxCo99d6aUKiZxxMtfL1YygB0mVQ78mlLBHIx6nfJqDHrVwA8p1UtCpyy/jUGvOyymZC6puvyrnm/0YZyK8A82G6RULYld/tZXMID5v1cSn1/RFQHM9dsSJFzMoP1hEMh2osBNnSsTJlPOtmsXEif8KU/4B8KlKR2vdWCp43AAaZoV+pozTn98UVMyFSrvkrwrdO7oanD6XUwMYONoI6gzR3zWuW7Y3vfkEe/RHmvlNeItGcIP6r3f1WNDXrFQlq3C8F/iClYL4pfg5f0eg7HmROiyYfsbRd6zmnYloy/tstdYWT3yk+TeTeBEpaEuKl3KM9ReSXLx7zdwLMRT17bvNrjhCZ8ei6n2uZyf+a7ATgRh1/GYVafZOEuNjYUdhtz9idBzJDweNl5nlHoOHN174glRo5Oyk+3iQ4Gvxpdq52uMAh7ZgNt3z7Ysj3GlHZRXxmMbEOpPqdQPWvDdeyog1V5KMWcbyjrYIO7QRiZ66666CJL2UaINLz15IxSi+7MonU5XXJEj8fRz341KcN1NapCpl8R2+I3RUwNTU4KEuPbfKk3rPQgNGWfpZN9BKR7F373Rtue8LmW46AEAnL7cu2fnq+6NF2ECurosHOlea0hB2znhKCpHjRvKyzIcTQZM2lyBV1ZI0l1HNXDyY0ZS7JAQ3R2sIiApH/BF1LhsAkl5eq8XQPQOSMr8igBUFDmBpJxIg9eRcwEkZYfkZUgbApCUR3v6BmCGgaQ8JyNCu12HI+VG18DiFwg4Usbbm6/SqhVH2vj7dLk6/DTQQTY9rc+L5VIHAFD2blShuin1bYLhWFeeiKHOKgeOX1Oc9jsP1DmeDNydAHi8YEjWja3gE06CguTYK6nMrhMSQFZWmbcJGqUCZOV7gm8Re8eArPyCyd7TE0QgK4Ob7ENkNACychV0w+69NCArc7oYGNa7B2Rls4t5AduLQDZ2w7U015c4Vn5PHfeN6RWOtUsHOsGPuDTwQTbZ7M+L5VIHAFD2bmzDGHb7tgcnuiEQ9kiRT3ESVWfhzt/CFE6mRPR0wpE5IkXX/uCCiek6UpLzgdFTgnhAUbaetVEi5wCKcsc+C7QITaAo++U7hiJLAoqybY7KeNRVQFHWKtZHZeAFFGXxWeew2FWgKEuMNCoTruBEeXYRVnVQFCfK4kDe4v6qgWJtoZc1IHZ65JCalOLnxXKpAwAoezeqHOoYN0tROH1KvNsMMpspTqNSPS4R5NbG6WSwR00PEvMVUnXL5fwcn2sjNTa8lW1thligKsMlLp/WlgPq8xL3G3YvbQNVmfOiK/v8NVCVs2nGxUdMgKq85bSxrKEAVeHHQuMpIkBV1mk6y9D30nLcsX/ht7MxnW5xHkcqVvpvX03aVqxPelU2q639qdo3rBg/QdqsXj1w92HTnBc7W//SBwBwOnPvnr2v6uCo9YGipEy6WHsTUcE1lOmlV4hmD/qSyjQZHvZLz2QZplC65pptb/M4KFRsJtBgtYcpdVK+qHEZZ9ehTspPlKjy5FVSJ+U4YabXue7USRlFe6E44xF1skbnRENXWeqkrKzphouKpk7KA84k+d5bp+6JrSfyaLmVqwnf/dv+G1mGCI889SNWy639t/KZgySHhTd+tMYiyeyTpcqKnWFfnAAATjny+PQSj88yVbOneE4RRPz8/lHM999l6t3VUnbGNUP+gOuWwjfIL+LhuzJL1ZmnZNwZYn/1uHWxHA4e+cPseY4/jPY3VZ9gonfs4/kHfut38/40F6NKvaAdywb0lzw+g65jsVQTrh/7juOezYJShI2lxyBaZkEp32vA5eRwZkG1dcyX0HBmFpS6I3gNvmZmFpQZH9Rle2PqE5hScjcWD4SUv2ZAKb1Ti1QT78yAMou0EoXPfHwf8LdpDd18zI4TWi2oRXvxxpEqpA+ZgV6FC8SRquguHLU3M470bsztbAS5gaQ6r5Q9IeIBkFRHlblPKlGBpHrLJNkx+BxIqpLsL3deCwJJlevdu4tH40BSlVuezSLYBSTVs+aMl4RDOFKF5+TPfG4dR6qvHkbF8mEh6KaMjw3T0iayOhjN/3U1vZO6CmNw3QPHtmhZbHIvHceqZkXuEUtiODZ8CokjyiRINg0lqskNMyCrZg4duXp1AVm1HqREZlUikFUnwJVU7e0CeYeOKx84lhSArLr9dIh0JBbIqoh+mD5jZEA2hXI6lfMFjlXb86EOkNPiuJwW46vgI1irg9HeXT2EiFoklTduDZyopiMnFi2y4EQ1+nxq98ICJ3pWHTpG1jtAUdVNEnFvPRsoqn0KPE3JDkgxrWFetN1koKiSuYdnyQUCRRWKnLHszg0oqgPIF0F5YEgxFVB0drAjnKheG9s2sgfhRPWc+TkwyhROyhWBeRCsElodVAN/EdV+a3wgfTA4VbXB1V1k5cKpaoLbPeooAKd66MU+r6v0gKpazN3nrsoPqKq4C9CJHz8HqmqeDTr0o1yg7or1QUVmsi1QVUOvm+jKD4GqCnVNvKyVDFSVV0ZPeOohG82A9nM3EnrdGEQcHIFXe2n8TbkLtw4cuQ97uTrB96wDHnOV8LJoF1TlWSI7cULvNSRWqIZn4vKyPSUm1SgluKMZXIKn3uTovcft3kpOqvFCKJ2d65GT6r6XC9T7SgjKNIkhntvZkpMqR4a1nYc4OamWKBUSg8GSk+qJ6A73VRY5qbanrAN1ORKTai2sToLXFjGp4hbBuIpqJiad43ltqy3KLNFX9ZbNP+esAPiEbVvz08yzL5Te1FHmGeOAPtxMM6cgzcOwM94c8+tlczJb2/97dlpcru12LILuMHrQZoMJUeiDMZDB5zQviA6Q3RHmkNh0TGHAnLQrYGdp92VmZ4z39uaV8TBXzB/vnZhthwvS2faA20wZJB4ATQ2VBd83M+oaweiO8ZebGpaVtcO2BUC+gN/IrZ/J4NcITnedO2putrmY1pYpzIp/fB+NykulC5IdqLTZM/15m9PS6Dc0NSMKxrak3zt+gYl3xiu+b043tW+XfHSmUYLeT16k347TY3i+pvwXkMO3J1s3SHrjRKLJhcl7roAy/zy+/m6n634xj5uJwztPi9OHTCuo5Lb9bA9jH1IwsMfTLXLN1o2oWt4I7go2z+dr27yEZNqmZ7SUAMKpKciz1ncEaJDu9b1kfb8kOMhQgBdgeftPJ/Z5Bt0+2LXtfPcMpDY2WL1ZjlE9sZd2m/Tabj7HnkjtuNaOxSPMVI18CjhEt762W+89OQA3TZYxAzJWZpKx/6INDxkaWdzYhauDtuc3KXb4ojuCqACf+U0Cgvd5lEQdA7jLbFIKZEep6QAUlPlNSvTKquY5SgKW32S0K4+0ZQuoAH+8KeC3HcFMyU1Y8eL7crO78Fs2jHgj7blBCMSLizxvq5lnU6Qn/UCZn5scTCGF5C7esV9wwdNDuPzfOMZEydC9mMKrCSA0KDRX06Vb8aPh2Tv3R5z7J2SnroVFCJYiOAGCCP2HmkCsKEDAN19ur2ki5Tuz9GI8VBQq8oqoSBX1+9oSkCRUcFNFZvG8EIToO+s9ZMocLUz7pV9yV89rQAgs0FGjhb8uPavN1VvE0gmnaEIipuhxFg58eEbC2Kukgp7o68sxzrBYwafFZ2FITIUvl3XyUdjB5wiJBVwa5Hf+yhWb4XxqhkDLdly3D2CleIX2e1VmjH0XbX+SrXBRtHULb8sIpRekN0zfM17/98nY4bPuUpJoAgOlgN0MfRRjMHmweIMna4wVZdvn2IKDSw4PETYtilsxZLz4DsGqLDiAgQuNlR2m2GwFxkF2xHChcbXlExdoONRxdETBC6AuKEFHJfp9aDDX6x923BluMgDZiiQh4NBIcEKCeBIO4EArGUCzfjzirUoYCDsLeAWE5PSM/hLKsZvKqGs3StoPd+/qJ86DqPdxIUF3Kwn1IcFVFr4HhJkEk0g4kAQJDp+b+sVXhsC19K/fV6yFMEraSyDFgU1CgLaSwAMJrEmgjgT3oWAmY0pojgXzgMAsmHxoIBAJ9mYBCYTCgWssAF+TOcAqBGAKCXKQwAoFmoBpASUgvCTwqA1TYSXUTIL8SahkOMHiM2EexJcY+6MEuUjY1IMFDSggCj0KAwravkfVqzm8DCJhVsOPefFBc2ceVY34M8ATnx8cBRCsIiIBJAQAoy74h7AxXNLiY9o92XrTCSDsHN4+1K4GwM03gx/qg0mgiAQ2tOEMZwiybxYCyLmWYBgJhEiwGQmWkGAECdQj4VjAYK5ksvmZytLmMIwbCXpGgi3RWJAMAyIEaEeJQR9eduGq5RbaCQSPhNpjofmCgSMFqEM0EHQhoQcs6M0oWCCsCJBiQZTjvaKgCwmHxUItUGA2L9TeMgEmiMf7qIfXd/Fhc03uBzWipnAcLzs8L9TeGQDhej6/nVgRqLw6iAcWLEdDQaDwQqHyvm/6o7VN16zmUAQg2kX+3+YAtFv/uMt4Nb6Q+76CRF8uhUFnWJwj1jADrToA7le6IKtAr1oLWUv/Y3t+1ZbynHvjvdIcCDjgDqm2CgiLRq3oAsgOvQ4lWN5roxoWPzGdfzQPUoxWtcFQRM+fQFxrjS6+b5M/0/f+gak82u7PW4f2dg5HLXcX6tT6cl6nqFWlAR9UwuSkWd6EXx8FtbjvH3c79M5jPNW35gjyY6E5Ezb6x3xtap25VKUG2+UFAMnBO58AZVjPiha93DKNafDTDZhH0zX/1h/+2e58A+4EnnLGE/JDDdmzVEOII0bC5n8o1j3dPoTpqGeHi/DTr+h2aHLlCLo8DFfaPbpHvbUax5YDfAGRpyO8fELFY4nD1DEat95RoMpCeCMQRLWwIQueDoIh7Fe0yqbB0ZkgD3zVtm68MNb+IcxIRp+OxA0TYfBtnhUZSToyqmzIof44UAjkUPWcpOzcXPe4iKr1Omemq4kEX/I5CaEMEkNdn3ATD0/BTQp7BQEF9bo0zt5J6DtJqSWClihaR4PPi86uITd34UMBwGEN6kXLYgp56bDmh3pNNa61nsJnCRSFzZpIFAJG28IWjwfMtpKzJLoiR2OsbAqyHA1F5JM8Z0SLRIiDcQqLIrhClzGSd0hAxSS4bIZ6zR9/fDdFRAsSsgqaKWL6qAHb9WlpT7rnQTY+68WE8zg0ngp5JzwV8uJ5KuQP4KmQ14qnQh4vngszpGwi5Tw0yzPhPOLNM+E8yM4z4Twy8vrGzyixdHeaHmN+kot1+9L36PKTbizbHR3H31vQXR6F7tot1CePoj7Ju8r3RYX3fU+DW7WMOW816frVX+UP5KmQl8BTIZ8br3H8PEDb6M8VZhTa/wH+2SwZ1xtugVQeBankbeL70jd+Oqn1q//K88BzMboz6KxCJ08dT4W8+3gq5M3NM+E8NMcz4Twi8VyYoWQVJXnz8FTII/NUyJvMc2EGyiooeXvzVMi7xlMhj8Jz4ZVvff07D5x5JpxHrDwTzgMTT4W8HDwV8qx4KuQp8Ew4jzzyVMhL5KmQr5mnQl7+PBPOQyWeCeeRgNc2fnrqdXsj4xItLxf/o0JeA89F4T52Z0C7QDP0dtGbYbCLwQzaLrSXjtePqs+PYlOn8gPYVCszdIH96yfT/3nmfcdc973xY5e/RwN189FxDr4FnjwHnnzu9cH14/Pg4lieA/vAHLIPmcNMbvB7EVE2Fxe36JGXxEfjwd/Lirr5+Lh2mGG3it0t2McubJu/W5DbA5AbR9eVelyl9d/OA0W+Lyrk2fBUjG4PzydbBiYvD18m6jzIyTPhPBrmqZAn5KmQt5nnwgyUVVDyRngq5KnnqZA/Fp4KefPyVMjzzGsbvzqgwr1xcW9YXs/8jwp5W3guzJDj4tbZDJJVSM5DO/hSIa8Xngp5U3kmnId28kyYAWYmsgxIXlu+XJhhzSbWnIfa80y4B2jnuMtomcFlEy7noQ58uTCDzip0y/fAl4uaYYuMV0bNUDJ3Cb2+tqKd0fGYWd4y/+XCDJJdyOjO8GYXb2ao2UXNDF928ZkhZhUx+cPyTUXla+G5MANnF5yXSn39ywvz2sYvDrNwb1xcW8jXl//pG798zrLd0XH8zR8r/0/F6OZ54amQF+H1jV+Badnu6DjfzdfK/+sbv0jV0t253hj/PSwKgVsPaNl56/9c9q/hP0X2LJVTdbT4PWj/mA6Yf7Asjm/fbXoX4uTy28gzwEZWIUH35/qHTrGlily3caUFRL3fzfRK4z8rMFP+ZJVZBqWZq3HBcrAS8o4OvGci559W5527Njckhg8gKVnNM3RpdTY4MPI++8oN0nO8BtAtBnBXPro2Z4C2ydXKh/ywobNwIPbRChvCceQEs2Fc6Wnze/OtwTrzHLsrdvlg3DSy3bl2NexHtU2AUOKLWuWcswHM/Fwx4UcT5udVw5BKmEaK4Fx5NHeky6tdQvIhYSNwTh7NKk2DywQD5ZsrFnLc81W+fFSMgaee7mHvAj7E6AXP0WdHfFJPY7Ygjxnn67JLNyaB5eEA1qKHFg1EW2/+6u77dYgLp3pNuAs9FdS3NRHRGuMa3TMsApst5MPUZTjbrtkCRHgxsKC4o2fULty4PWY+zl62XhYxD8vwmolRoEz4amwipqApiNxrYrrg0/2yKuPebmaqp/IvJD5gKW9gMJ2309uUv07KkPsNqvuDLNsxKHS8FTb3GRENwf01fAGo1a/X8SpbSuRpQDcMt9vjJYzw3qxYmGSGXMaF9sYX/bLmGXIHHWwiZAtrCA6oN3919/06Qj6+V7axtjEJdp03f1mYccsCa8eUmm8dx83AswRbUDB9DOdr0nyh8hdyaRQ/bOfr1oiwHb5ZsaDI95E18kW/rFkGCH1fuGHR8+sAg3nhm7866nxU6mtiojBTYXtmCLRrIrAX36xYOB6nUQqxicTiS6FwXxPAWxLAQb25YmHTDyGx4+ZKR1Hrw4Ff418hUjDj1/AULA/BEZtxaz0RJao3f1kgoXpP2ulZneUj3M7e/NVRrEuOO69pFTkKgsQLJu9n3RU26/Li59IjZALAkUJYhqRG4XvdzprYYEYhSiTu11OLOTSL+l9hKo+ex6zXHBVD4lUPDeoq5nLZEV84bs2ih25sps4MVvxoj4xt+uVrHsGvHpuhe3Voe8Nc+YdmDocX9qKYeBNjMylm8FUUPuWokW9k9mpcMFkv1zLmg2nBzjSlm+oxWEuvXnDeCSevc5QWZyzb/nXZVDr/aJra+KucapOcLxNXrAaikY8kWjE684ceseu2THTg/728TeU14RbrFk7g28757M9+Xn/ebPR3xHPbf2nNxFVHvIjfbIwZSgkFCgdIaEOIpHVJxK9Dg8J6PqZXj4H0feXSiJFu5jO1pfFX4bh9IjC4CgxivfzuIOaFOuMrMne5laM+NmbgYk4h46s7Me6Oe8xAgGrHt3aPWfe8DvOy+/qPg0eWoydgyNGEnBy4HTaXrTThcK5R0fVDhUPZaCL0LdWOI0N58jUmJxy3PQCDrwk1LsxFt1tB5+tEjsSmh9zlaEdxmsnj2uiXy2YjoGOudmD52pSvQjnh3LwRM9BMQTlyp5PbJab1rRwly/G3HbXL5qpfiJ1PjAivIHM+8BgMuWEmgaxLl3j1o+z/MJYE04PEEdJsfHbiWPRfxMmlXy8fUyeKXI6TLK6HKPJntGm+ge118p7zKFXRibW2u1y20jyN0MCFSTh+v3wEOBo5jEFec5i9ZvkjwQglnPx18YkxbzDl6K1xO5m0ZkqjN19/xEwk7Nip74ZcmnDg2o1M+8GsoBsrrdE9afMhd0P3ldkYq1LJLgKG/tqCpaos+pbnS7mRs64EYOiZQqKERUSLEZuj2UrMIbbH0S7k+GpUVOpN/QG+1wS5mfOnk3NaZ0j9UqRKky4jGHwFkU2FrpG0V57qrGOXOMcDrkTy6w8M/+hW/Y9rJun7w4wrWKfrGyiyUFiUdgJ+iHr1t5n1qOgcQ98opodj7/xTUKsNvS/o3DuJ70PRfyqiOi0kbOn1Tl05B/cJrN+1Blv4F44i2oGUN/ye9vEJUJreZsPrCaLHdQVx5GrrXkUSiRx9+PKTwu2+F8Jt2cpXp7Hqq4HcxDiMNcapZgpOLpmulWuMb5IbAxe2JUjRsu+e5/Yf7wXda77k98L3CnmFnyPn2EgPfGnGfIinZcPf5R3Fk6C858zlGfUjMEoDBqPOcWz1hFwhuqz+CprvTTgAy8WjzAFjnmZW62Kl5fx5WGb1UtEaEvjPIOpDmMqeh/NF2ZygEg9y+cEvCOtB1gU0n4LqyKP4KrQoZdm/ZhHEyStQaczDXbQu5IzbvXXPDtOXXB/XtbAUiRfRvlwaa4CpxhgOLnmv4qAFf02j0dxMmRBKiqZjWiJI/lWkj3lxnqmSM5cX8e7t0ljGhRZWAeQMABGoHKJke+79343PURA4h+Eq4hQTXbJQbglVFje6y3QrWIiMAqvhX8dquctGAlP3lZlws1+lXigLK5nKk/DqmgABiMMShIBVHw+yefLycN/marca2r+dw+Tb8PmnSdAXUwf8YvsiiY9LDzpi3FYAuaNT4IZiOMv0mYjZ6+eB/pPoyHoFme+aW6LnzgZ1CDxr7ymjyhMpGFnTpBx09znHGmVnDlGWyVz9qyJ6hxxQh+r7TruUgYWKSIZJGQxQPrwuccU8kGzEzYdV3HgzR2Ztce+Zg2dy++YmjnrXWDxl8li285BMMgsn4sK54CR5U6GNpJsX5JMMcYllJmcou02xsttiegDkWOAe3Pzwv35rhRZNK+pNAzrLYbrxeyb9SgUhzOAkT2ZyU5D67zDxdHs0wF8jDwEiAO+K5uAtD1DPPzOonKkVm0f6krUo3JPQY/V+llI0vSDb8WrOOV3pN5kUN+bC832S9kyzcYzxkAyWsJ9eG7wp1xOIsnGIxEHFenQ5wd8s3RliAJzypctPsvombkiDpwfETztha5IBUzwCd389rT7DzNVoiOtLzRl2TNpLfj/V83bPYOAFKtnSWKObmpnB6SWFKsKHHpzkxsBlyhJcathSfyyEFY8yFymZI0D0ACAH8mXzfMmXy0zD34fW5degZVTM38og+SU/AyYg34f8xDy9C9l+o2jmoMrbTk77U6psp+YAUlIjEI2qUClScxf1LPHz1RbTwnjyf+4cb62LO8N2rqOT3Ow9FvX8Fly04LJZVtXk+8SOpD1dEs1aHV+V7KBVRUOLXyXaStIf3E7Lyy8Cx9ldyomqJuh4SRncLv8Rca6cqqKIvw5l3Db24opqPWKIN4dhBgHVTn3Gx9SD3o2tuj2tQ0ZGIHZSAAGdDuV2SdFqnTiat5p9zoRcSywosKSttWmIpyQ3Ppfrp2A41ngcmmMjNoZ0ZtdjBbtfhbFkCdV1bkFCtc5lnRQWhir51eZfT35J26oGEbokN26X6U7wUh7VIyKbSMrAXObt4uZ8kDJcY9AptJp19ZSovbRMnwn1c13m2QTWCmWTRUvSmuXl7O5sGimaTjKumU2my7L5XqTZCrJwqKZp6pBVRRhftwpPP5DR59ypgfIqFtLHJQOtxnUTxyrsNzsGLtOU5O/8QC8n5DClebFh3Kd4S6UYfh/eOvwIgyRp0S+Nksvx7QKng+EqrHPabmA5/ZN9ytSrafIF3p+Xnha9bFXXlEO2VKfE/Z1c6n6qsBEVaRmEd+ntlU+rUSirnEvVsJvk3EaNO1V3pg0H62Q3ScukbqfujMZZ00qNoLBJWtMqzq6TzZfR9QFXDtB64cXX21bWLxba9Btw5wB9vOPJdmxnWH1mX4ibDYFSDSl6g+DE6TksToc4bpYaZwMJ5NhpXgDHoTy54EZWdnAEdJ9CtkCRROXE1fs22dvLqgsaydFcXX/7WK4izyD6AEd3hQ6NZGvGh/xuFvB05Ai9v1JW9L6JHj5GjGI8cAjbxu06eIvtcwCeHnrTDfvym45sd/WO1G3CQGrDcO6ftn0JmEbeiEMWPw9/fbfRKnb022p+SNdGlztjxooe9RWQi0ebq6Q1TGqAVGsT+InIuNdKp6Cmyh1kgm1+9z6MNdi8KRNWzV+ptYPxF3nVczbr8G2JGzrQUdJe4j3f93jKcFmexa5a2BBTXjhJ9mmf3/IGoUrKwFw+d/Fj6APaDKAM7wR6X3giaTWvlglCl7lSjVPHhU4ylxODaeGD+V/Q38nSGLUOZ0xtnpearTkRMl/FRshFSuZYAhNsYEiWDfuSL7cbJ6gMlB7AlQc3+pb0J5AaddZq1N9c31aWpPelu7ac2ZeuekEyy7XRLsoP6ea2YailFk8nWiTtS/bn+VE1EgzapEtDwivynz+5XDm80xGoNPH6YRxeTuOWXYjPJDNCfq5Lzi+7FNaTmuH2Hx+xzvvmZOFMfaOWZv2tF3ukmjtkDQ0dMksCTMJoazH9jcKCvk2ar9qMDZHfVb6torPLRkYnCpRkJJ+8ex47kDgPc7+NYA41MaUPnoambtdeRH75jyJ+KOlykFjiLCikZqdxQ13Cbg3hozd9Zf2YQZuH0I5a+vHJkymjZoMiGkyaHGrUeHeObf6EDKStAhHKZOF1o+KJrXuO3xCuZN6MOZOsHK2QDQGgi0foR3HVUS0V6BCAydYajQmGFwF5qHbRkcO3ZcFO/DPsinA2g6QqoSCgNnrOHhlDOVQ33NIFpNIeWX/mbH0+tZBf1oTdVqJuOYrb3Ntvi8mNJ1Jl5NzaL7rwiwhfPrwD9NbPv8wpaHoKgoutLmNxUR/lcF/SELzf0fcewnS1tv4p4l8EN9ZvbG5t39q986ae4c6xWL4ihuOYbDaNZOVtSBVPM7kP7hPnzXwwgg28n9Q5DmFK7+Y0mvqEadDEvPzRCHdwEQb8UYLcfs6RHMnO7fcyKUAG6lTw7JQRdaFYfS5R/Veg3Yv1t395TKVvFY8j5+kcP8BYg+ZJSZ6pd32Drh0oVTcTqCWnXgYxaQW7+FzbKpFuRF5nDsoJHunwDlqT4VXnkG/eHyQ1CRqXmcPRAXY0xyWK7o2ieM4SeTi9jtnPEIZOnSXbT0u7DJRVj1dQv+YU0L/2qwajWzhOGaUKfAf/kovvZ80wUGUxkfeLiL6vXzC4H/1PLI6qGPBUh0l3puf5N63P57It/vl6ihdyCzx0r11Qn0dhOjEAUsc6fFKGYYl4NxwG5iOCQVVzV4HNNTUbP+lVaZ6dQ420URyi9f6Gexdh86tZv+xXb4TSZ31epDCd1f7ZGjBCxNAulX72PDSpl/PXG5URWx1Bv/py5ClGIc2YQP1rq1aSDz+p63q/G/fIZKs6Z07m4yU4QmNLdoZ865Qn1RO9HEVyMF2+/OUXJyfIVOpnR3J3XN7YqTS5lwNMXn8p93lr2Gx6NI5vuK2Al/N0zavLDikTHyYBeLYG3KAmzS+iMOui3sgWoCVOTr5Kopnajkot8sj1M/ZWgfpiPGxIrRBtw/yuGdWl1tV9szmRhnSSaVcMC5gubnH4BqDRGODZVx4PGiurzRStC3nljIsT+ad07RKLSfX4jH/zP/HyJE0yP/wzF6t6as2ppp7qL9Obc7l419yjNLgVo6SGIoMyAZFT/rJmwmWzWa+9LnU2KR8fdRdX+hFerZvYGuavQj4I1esoQ/LICGeXGlaAV8TYdmyDHzdWGXcg41TKR/dNfztgIrTpD4vHM0Hlxz5HSp5SVKTv3JaW4vy5zBrTizr1osW92D/PacMLxPB7zlxqU7rKvJX8YXTBKlutPhbw448tGbBKTQgUHSG2sEDz93GuH8ItUpZL9JQmfa2j5y7xgO7cJyHk8qtUf1wfLObYRLq+FP+NVYXYmuWo3aT+ygzGdWQBiJLn3jvOkZsQpjtCYtBIjpAa3HiNECA0ECOkCFfeIrd0jF+EDifwYi2azwOwKLe3jFSEjKLhEyGoOGISO4mcjcjNtopKzA+Aj4iUu6KJMYgQffxwzd6AQ4hE7iYfmnc4s/9QYksaSELIUSp+kDd0yNHbLBUFMBDClYYHhIDl++dM+PQYmVNx/kwBwv0gjzUdUE6FPbg+3r6PFGK0LnNZPB+kOB3Fxz1vZQNLtTJVHZ0PMp5G4oOc58Xb68ZFyN4ko4M+TfzWRMIZgLOnvxYAVKbb0nJy4h6kSjeuHiRMyW1b7muLfUXu4GH5bqsMVJxyKZFpPHA5U8VEOe61YFlu69R74OQgl0rmXRraRl3/uOqpvZqKjwtelhY3/TocKFlapJFNqhSZVEYRWMKgL6r5e5LDKfEUkN43K7yNetskfHa9x3BYd3/i0uDpLD5Lpv8KQoPW3hYddPoJC33ockJRnY4J9SEMFKBuEu03QvaQ1Y8hYggFnMbF9rErWtSxPs3EKVpHgNadViFHw3ewK/gVW0eU8Oap9ZaicCMCgP4YWvstgJ0/1txsvSywywEfbc2d4UeQkSX9ZIB4BqJQOzpn+NudSZ/sEHijapUqUYJRUKVioqrtETC1mfGoc2UMl2h2xoi32QIsBUCqnbBt+Y11m4Mr15JxWGhv+EWOtzKeT/tE6xzHM9gUf1lkanxqk0QHNn8MmXi9fyHCuIppQiSuDu7a67Lf78HH0bQ2EXWXIgFN9dh0t0vvY3F73sBbPVaoMIr1CYz37yK5c6Ov4M4A1Hqs2bDmoGmPAcQUNg5tsWcIQUEg5RLtd8XuQZgeHXpbqbhpFG1BVTVJfBWVNpG2f0vJhvnONDO+bbQLaFehpF5wQdM2NmCsHdVFTl+FRrueKDFmLddtOq5rfKljGJy2pu6hBd+wNN2dxRLxcQfZ67vU2wX6iA7A8LSFALIjMK62RwRqLbDE2x0+LLx7XOnHhAq2QxdG6bWP2eMjRgDjctuUBA4KsUFufyoJH0UM2/a7EUhFMdR2+hIgCMQwzcylxT0o3O3n8MAji+Ho3PBKsUT8LtzJw57okT4bZR8mTdqjU/oD3JJ74Me3qaLwAN0ENAGLDBjbYIU2wjlgMmu/7AXsbtyfpT/Q807ByNl7zleMG5zPWWG1RqsT1A1AIbFoY7sJColFG9stQyGxaCWqzIKncY27OqoFj89qioFeRDtl2619B5snBUJJwLWDxhXIentGEoEWB5tchpm6eDKDKGoaBFwYtjbDieOMPfLaEV52DexkCFN0MyDVwLy0OwUwI5BefSclr4XuxVrWUVJA2mYz8NbAelVwH6xuGJbbJDFAqTDvTaG87V4zO21fqf+dtWf6CXeIIbPdXTBSSCza2G6GQmLRxnaroZBYtLHdGigkFm1stxYKiUUb262DQmLRxvKVjm6NUXJ96aUbUI2BSVH7S04azz2Ebe1xe5j7wry0GfFAFIf9apOSBR8N7PJ3Qy9+7yXHjAleg7LhT4D99VsfDZEFS+7kWV8OHetoY96vthIUYXsx+Tg+eu1F4WQozsXD562gx91u6/lWJ8DSBMVsXyMZWJZNXtDWV/QxhWkFikYGYAvxuZoDkyXw7TzaQIPs2tkgHePtE0cVfn60TanhnI2Cb3iACfiaPrk0ekshx2Qs/zrzucIDgm3jsZEKt8fHDiY3U7WcBwVNtOYfd+w1ty4LOFjVKUNB+Xqjpsz0HqzA4u+k/ZMFTECoq8rgYbxb5lNwJfEUxGdGsMEF4NpIHc8pWK3t8dH+hktdzXQtGX6EspziTjKMmr6vwz3BQ0l7Mujhdyi7nqbHo1CSIFh+eqTmiWRPsVxmBwmxnr6/9tp47BdbsEnTdioXeXOD5AlbaexhdtC7O1SUJR5K6xiftejFT/j3YLZXQsq9SuhVv/XG2MpPVbYnbQeFXs9lSA8/qffCOHUEg0JVBHrSb6bMDAnKuNDYL6jKl58wDjijD43/hNd7OqxcyO0BBR3cCql/47jDswTiqqYQ59EKayUS3SBoiTQaDxK0xBggjnfDvjccDuQcC2l9hhTGLm6kEHsVcuSuh3VY4Hjb4xRDfoUdNpcI3glBf5hR6BzkDobLYUSd7JtlGOsqOJzTnNpkVxG2yFw2Gmi0Ne4zWzfHPvEP8jNb3oBxDkWyMTuYLR+LG2idsf7vG6VXicdmHjejmhQ7njZONvplDxCY4LIg77H50KKy0wCSEBTyTdgTcuupJc5lV2y+EqYEbRLgHDJW0QSPrAT0mcUI1/7otsXiTglxDG7T2Y7hWTeDZudPjKTFZ9xLFQFQ1gHp3dqrK3Ed5TMn7swolY3HNH4L1zQwZ20s0LKrOuGwbtUiYr1Tcn+JrasvadQyVKFv59lp12OL+EYQPBWsYuAPET/XgYNFEFeB1czmJcoIALKEhaGyJefeBajQ0rAsxBFAYTHm4cHFAuMv2Q6s34AQnZdsETZjtJCnJ2m3njo3W1YUbCwu8yDa9dgNvlEGQRGsIjO6WOK+g80AyXlE39IlAYwwvTroeiVlHbO6IjeCOdO38nv8dJtzjpLdjeA5M13EYYALDZuZVzpbROkGAi3ZTOLr0eBcmdq09EY9R93uA6kM1HgtUP0E+Cb2Pfd9ZI36inq4V8gd0qsW7aSMO2skbBlBUHhXxdjULjzj7CTVJp9KZwsldcNbGvSOA6rrTY/H6erkpIBECgwFO5w6h69wY1BZLo3zgQoO4PsiZUgykORBflHrcbm+dKjWiDvdIXRbQmW6gV2mZj4os3h+LANcfGF1wHNG8lVsIStXryCAYgWp4ZnUQfAbR8g5lGwI5hb0poy1NRLIBjFfWPdZ6ZSqOYuA1qRgph1rS5i2wkRS96AovVmoDaGYydZXYj1hBH3gheUC5il+8aKdj50AfJk1fRwOTZNcGcWZX7AC3N6mDDCe2abKfDs7DIOKlW2uU0KOMh4scWuTAFKqYYigdgNTphdTlMlK4d7RI+87qG4uXlFIA7Ru+mYQsneoal9PyL6uJ4S5ui8TLTPTsFI5lri2DAr+ZLLEy0YEKd1wBfVnyM0ICQQgXm4Yh4r2vo239u01eAAMIFz+FjWpeJYQWmWoI1BJZZ5W15qd9loiShy8ufP4WCw6NsiZg4HS/nHWdTY6I+IN7jAYqUPX1svQYthZks8n60K1Bi9ts3ug6mX6Vj/XI0wTZ3Otklo4LvXxeY2EzLlvaUhMQ2QrcRZhiKuDu9fh/zxrvMmVqz/psTrh/w7eX1h7TY9Q0SnLb1pQPxqvylNyO5fXaLmPalQ7NCE+xpxnEX7VemxGH96jHSKfd8G5oS6PDfZJGcZ92EibFcJ3Ogo0X+wSiZD2wNBkTNJ2BkmmdBsr7B/gCXuLrk6tjFHDuuoqT+OBtUGIbhcI+3TT0Cd08K38gAD9v5gMquhcpsAwzeYqI2sHz27coHCLMbunhCfpnlzheRtQuoaBPwiHs+SxYqOFcH8TYCl0rRUW30Hl7xOEa9D5QUbLnGjQCs3HOBNJfqMz4GkOmxoqd7ZQjDeIQ3sz42NsqB0O0VZHd/gpUL0f+oNP9lGWC4KPD6r/PllaeEE5Osf6n6srLOndikLfLB/wc9SgzYIy80H4EqxGoaNju3I+2dCiUJdr05rkbvA592kZAJDTYU2bLYK1KFQoSk7u+752sBklZ0p0i8Wsa/dgDrYHgtszfri5SiE7r299HZamRCtVojKtzfFzwIL2CXeEO3zfZ1rj3SvsSb0VCpAmiPlq7+/Lr9KzK6IzWOn01gBBu80RoLqIubeJ54xedea5UJBJH+SxOySBOCHuOsF9B60KHEjApmgEg1mMj200gEUF2BRRZ38vH+CJ1jVHo20i1kQbx0btKlmxStapstWpcIqaWvr/7elu3OKi9B3ORY8GrHwhPefyVOtijjOh2KvNqzsw2Uk19lFewt3tIOaCqPAV5GGfJuFOURnQ6PzW2/Kv2cBlMK8gf+D1MvWpfwvfm8gJ+QkSCkqosNAQoaOFgXnBYJNagaTu4FYZ6mOhX2VIifQocrmiOq+R7Ia9wCPGa0Us1/y9wwIl2b87PePv5H93fdkO6iQs2x3cWb2iZ/fzDbwCCEIJBQtGhKCFxgiDFRa3fbfCOQ6QGC+eLS1Iy6PiZhgLU9SfM2rR9ql/AS/IL36OQrI7ORT7MW8522G4UNe5V1YMvmq3ecyZFaOpefMYtygmIyv8lzl+LldIaFewFa++HR0dqOB6y7ORqQcAhp0fVGHuVsXWtYtK+n/2W328vOJ/Dl7uxajf4w899HwYQ/rcUcY+7t8wiep202AZ8T3Wh+7uqU08pg2KD9nLthx1v6qauT+vsUQK1Q7VyGzpI5v4ijKR+2BzZX4SMxIq/OrbiHsVUbjY1fGvNXMrAhrxmu+HP+MxwF6V7s+kK4Bsvldh400pGRVrDgIdM5S1OIzxBFGUxSOIx/ig7skz0s8YWX+JASk9Oo2kweYQhHUwjlm1/4jHcaPQXutt74wRarFA5jnObVjRLTH8uZ0WbXGSj/hwp8ig/ym2CQXltgOR0hIkxTGVY4yNhpeKD6HsOWusvqO+2U6/PGb+dByrh5BTVN+/ApT/wCDwrwYPbRWrstweVR7fWttaOeyWC9lVFY/rp4626mn6N8KoPj+IqO7bRqTS4BRmnb74d9ycl/u1nCoDS9hZaGDogjkoAAb2k71T+9Vl/g3+8voJIvuNSPzGLhabdo6B/YS7fbtTee331FzlyQZ2xQYqvWWvp/6gfezzusqNJHBqsxZeF72dUvRyXADaa7bnY/20xyYaEMBCkPXRysdlLU6XA86L21kJ1jvfeev02xOpYEUBf+zZRhOYM88FUu7j9+CGSv4Znr1h3slqQok+JeEObV0m3ToT9eYB98/XATIlEjiRyamn9IPrEyfZS1Q+sdop5mUA7PX+5/BK1zYBrAvS/AxltVfDS2cs3IVuL3b3cTHnz7AD+hNLx5LoFdzz3iVpGn4XqyjRHPeyxqGdYmRlbn+/t9BpGZ6g2QOZWazg2sA9AmjMmvNTmRv73xdWvhe8/4s+pwCf33/r7bipNMTbz55YV+BfjhI2UHzTAvUDshcwjZme8KdcnI6Erjh2PoEdDO3hSPgoN42JZ1AmfIziMV4uakL0W7evZ9mu4iSD4R8pcx38676P3GzHIZf4dfyaS+X7f9GQCrsnHQiVdmSzb8FtQwkBGJ78au1BMt/dDMnVl/rF7tJ09w3rLnvf05hn+7zL7v13bfA7eiky/Yamgp34Z2TX/0EoXeNXGr0thpHDtL5qIru9Z7eHlP2e0PlVOopUc+vAEH7vvPT9JDTcnHrfQP7BS5q6+au9Ibnmfg+3azABb17yP1VSWVz/jqkK3wrRy3J4Ptt5W7qxp9O/B1gBKrmO8+inq0hArKCNirH0DWFxfIFmX1QImgOPIgpi1aroOQR6+wMRHl5nOsIcv3EoIvhy4oebkNe1nKHP7TnuUSiL/0NKb2iiOQxyQDQ+8WPIUbj0gzocFQ7AjvKLDFo4y80f4s54yxiEEhEWR4umAGeGE40IvsBUXUy7JhFoJuT83nKlYMZjDE4BkbWSE/NKmogmUhaKlkOdFhmrZOneBU4her1f7q0Snu6hIRVEI9YELalZjM4+fYHuWAWof3VkJq2j2Z5ZNrMThS26Ji+6rLX231Rg50N2siOjOkUyput0VKNi/hZVHmLZW8xmFKPJtN4LROTIUlJyPeZE+xoiwiNOTCuKEriBF7JtOvUt5E5HR+Kzg7PCVI4bO3ZINEFwtOau2DBjB4nfSY2MBD8R7Hp/YCkP4BVL+XvOj9/uwUrm6v/WtLiDEDa+K/Gm7MJmSxQ69QP/qR/nAmmq+QY0OYBEmGN0qlvxrZ1e57wumhGKrNWEy4hQFkcixWfMZ5JuiHxMTnrch7hPDt0Q1+KyUvwdFZDwCPeBqji//WNKDEDYE1SxOTqQ5c0fWnW83XtSPgSQojTA5XCsI9q63ikvszeKxM0LVLTxubKJfppLHEKYpzycPF3z0hSsVzQZ6T7laKIspu3AdP84apYIfLFiJiSZGl9ygx4DVZKfVmifOD1aV56at+66irhoXmFhCC2NawcUerBwBMiIROxxiXixCADSevauysiE5tQPMZL88lktoxdNBkKBVEebtouc4cEUOV9858CBDBDrAXzRErw4yVlCmQABVwb48yidIO24er6SbKT83tKL4egUkiphCCf8KmW6vml8mG8z6RlnMISh+mhIHKMdIuQmVq8uoSVJh36mcHMd2TxGOYHlCR14JYKo0BK8qLw013Oji3KCaRCTWZbTGR1/ViKAJJZDDBH8jGSMIee5jbiD7GW0at36nAWyxPwoUZ/yg4YIoJi/bHiTAsfGUxqVDFUiuIc2GIyS9DYNIUsj4fppps8hsLs8I0o8hyFCsoercoGAgU4QlNxVwmlmJRa8LBssEYSK1EYUS9K/2G0/f9FbJA+CdRUfRSVPGMDMtoZn1Ck7sNNFVsOqydE5ykIs+cUc0lpFv4oS6zx5DjpRMBLxUZcg5NGuuIUcEgEHaZcJTLdD/Js/HNaNu0fypFWr5gDs6VktSrj102p5CkdEfqeWgyqbj4zUSW30qZCp1Zx2ZdxkKaMeTZYacnWfr2+hwVRlHly3EACwg3WyNTtteaIX7CAHUVl3RuIcYGdcx/9RGY7AEN8Dbm/yx1HG5pgsARyvSSk7B5vR/31+DT+ftCHPaIn56Hyr5PQZdzDzhJPlmspgOMBtJqHo4fuERhF3mxTPCh3IEvSsAmSLBQ/zLF6ruhXcHWwp9iILiLRH5NWTMnRwhKy61Uo2vvweBkTByLmftB4mVoNprEiXEDwLAfaKGPiUA9448h1f4MPH8MTiiX7Ad4ydGTTV2l2Exe+VeFfQhoKPBcTIyJlqJ4XNn34FLIX8rdLHW/M1viw8TrT4UweuZWQSQKqYubs2A6Sr911w6e/Fy16LVkY52f3HRhlh982n8b1ztHOgH4cVBMTkHrYxX38W5DRa3DEfEUTO70vtQ9kgHF6mMy5G0FkjZ5LMPOwms4t7sIYJoqKteQW/Iiyj4/prRwrHGKOwi3hgusmVv8RfG3rNxsaKPEr0+agpdXh+A0culYEuPtX7SdJv2O/iYU2BHNlWpEfshOy0GwKV7rKLP0pW8tKw6+8uYW/W0y7FwKrGinmOZdX1LeyYyxvFyZX1GiumV5hIiwiI8UD3jYrw/f32Gv5sjSM+HGFZz798+SnlLstVMsPqp7xS6z0tacV7qMGUCWDuej/3O2qAhzNDyRprgsx1NZ024qlKoEt7bv76XEv3FbTDmUF1/UAe8LF/MqGxpn+vvmW8EEFXEZBoup1GVmfIdp7JLOGngob+idAw6Nf8OnkEDKfY+YYwxaPCjJGRcYzMJIm8amSCbBcMUdr/6MLSC5M3kQB4woITfUNXgrBsNGNGri6YB5nvjhTxYjzXTWcNGBQE37E5FC8KD/jI3QAcKy8gkJCmjIDI2wcevmzs5u8dz6kRO7827Ckrwi589+TXgR2JnE/yZAM9CtOxEEH6BljQG+vtM12WtcFZ2BzsoIJK3V83h6fBCbLHHDLO2zchIaPI9K21eoq5MA6bA8zT82ImB/DXPigLEzGm/7ssoAa96expJIurKCnz2CFvKPRt36fQNPlE/6D/wmpvb6zR2waWTeFkU3W5U+jYFDA2VY07v/dhWYoc+rTBdmU/U9dWnLDnafNIHdqU2p+z54ZlcLC/cw+P3D4Ed32iAEj0c+j0EBD1Ywi9zdqVLEX0tCYRwJwBNDBDKURKks9IaV+CbrgDHmWFCYHZlgAC+0ESjsZOzZp+Xm0F7OZG1GH7zPGeiT8N0lMnDbBfLwjv1beteZKQkHQ66GtHgEje3xAt6DncH3N3Hi253M4INkDDGAK7MD+UyO/iL4tNHVkJJ1qjgD3JICUtzm4M6j5xFMguYTD4/JZFHTjqJHCZs3qCMPLYgxhKdMbnw0dc9rHdKW+m8Nz8qGMaRWDLESWx+B+FFJIrkMMR2yb1+N+YipUhfEIu1NCOXZgXiyU+3d/m5ExpJaX8wOaxZulXRYEQykGG1g52n1XL46grmbyfkjxGwGKyiEbju6ZpuFwvKTDEGoXv7D8oTw8/zAzcTPny3sPQZTcSmTdecCYBM1ge8fqmWGa+/hdsYGB79OGiagnDTXXMFt03eXC0V81jOBTZ+hbrC7Yd9U3zlL/dtOtDNWExg2NheWMNbQLZTixhPULSa7325rB42LT/UmKALUlb5rk4N3gJIfCsfpom7DM4gfNlpQ2NJtkHo/Duk1TedQf22pGs2kwJ0IYPqGB5AjUxeUA/Kqxq65eKFSSH4QZl/IcYRVWulxnQA/yrYms8fFS6lHtbv3U8fLIizeulaVt+DyHjRA27MNkbhGzEHaCwGriwGa3ZeFkVD4anLIVDHL3cbzl8HTFRHo0/evxkstwv8ggm3NaALG1GovguRbKHMHgCkF8v9rZUCOaogZ0I5+SGAxPbJxqaEjVKQFEi7qlEOiRbhgUE1qHCkuSVMwmRgrejBtPLNH3eOR93hDxg0RSfe6RqUPTXGXEp+VrzQddXvGJoAc7rmKnLLayRK6uOYMh68kWSV9tgHb3BAv47Mh/fgCu9fnwjLB+kVhwrIK32U43smFpPI4PR+x5ZHtEwokU7GU4hy2p4diNiPZoa/cBc4Bn7FaFhBfEe3kSqtaUwEob1/Q8U8bBmokWbv0CjahYbk+Iq9isX+q68LpOJ7o5IgDGaBOOR340aPYokHWGGxE2/VIaFf0cNHUJm2CY00lJByTp0KsmR81xdJb3f+EMK4ifI2h1tgS9bcsRBpfukyQMt0tDQ1tlzmFsK2v5I0VKjJfk8NJK8OVTtv9YUNzAi0JsvZMBIlKK8HoeNoxvx7t1KtFXYSmT6Uu62xAw4MSQQNH0zEw6tY2bvR2AW2+cChFleRV9l2yaXB7Y2YstE8M5i/blyEa89tHPcsJbsOlylx0s81ZkZhWTbZJWxj8VSPiYC1pJgz5GgWwydC7lc5aMG6etl4GeWGgEJvJZn7a7Dlr9A9PiRjh3AGSlxNmm2w90iPLn5tJLG6c5txvLKKlHz6A/Zh/gNw5fDFJTl7U8u+gOb+EuM9bZvWKwwib98ZyQBs8fpnr1vyAojynIGfWOIkor8dZ1spZZdU9+Yw3Ws8V7bRmBbLuSGjhxLtFcZeVg83k2/mIYFTuBFvvsg1oP96CB0sIk70FGrPYNqIIk2/5jzrv5ZUKx7AvMtFkeQOT9XtgE/5BQ2cvw7E+pNw/rct1yd9Bs2j7kT6p35U2WED49YBQ1ObvwZlbIHJchYjZ7dXApQnqBwgxWrZxhOc/AGjmT+gQYYDWkfivZU6A+3kIL2gseQb2HQYgj5hs1jIyXaS/LAFMWbRqCqMTBsTFnqZzNqoB3mqM9uAm1UO9FipgXXeA7JQidH0ZrBfE0sLQR8frkJeQGLxdmZoq9m8MXHMd/uAm1KT3hwlOKzPSUfytuakXrzgGbZsqQMx7JwUIjB/r2JHDdhbuoQE7oPG2R4kvtPuNXhlh2cOciv0kEFUUq7u8EtDjHlewkD4OhqG+vdRmLTcQh1igSlxNj2NKzIS1XNWM3xAxjsM4w1VLfpqod0AmIF5zoOLngeDmHW+Dbf09jhaErZwa5dzoGXRANyKdKoKwOPuGAdonZdZQBRq9YfxvqLY0jRkmxTZQIWsQBAIpxDIKuRyrsDCGFJtKJNNfe/pREAU4mdIUBTVh6JD2fXMfl73RsN2MPjlOkjjmktb9qk3xNmfb8xZRT6vcw49gs8HJfOswE7CplxbHgvm6bQaJTeBd/kWzGEOg0VFmsRWe7APwSnKXjhRcJh7J2km1wIDuqC9yDiC4Aggu17Je3Fu2WwBEFT/JsPFGWYLhn3bpIjvQ2p25wCqQuNTN9Qvq9WpCI9bdIrvuj6Wh8u809qIefPnOFPfEh4OGB9VyUPef0KfA7Mi6e/HR+sDw7WHAnrulUfEuzD6gMFq2mGPKeMKgXX4hBOEhMGPXYfaK7xgZsRIglv4EHR8QF3mFDShcBrAdHBOQQkxmz/h874pcvZVaCeN8nDwCAvXVQNDrvB4erAHAYsIWFMovSANAURKbYDAz28yhQdIS07rfXVI6xD6oBw2Mw7FNrmJhJ8uDdNtuqMPbGZ7sA0bHY+GYn8aHTtd6sy7oUI9RhunfVT6FMosB83lq2NncYSRm2+umPBk2ZH8AyNHJ3WYomUmZ4GV5eZ473ylcOxpCJiR1IJF5O9DY+8Du5kKSUG5zU83e82ztiIgx8GtbZqyGDE6GAY5yj3BDG9ajOThaM1JUIucjRHUqOvZ6/q+zfRF2f3t4JxvPx6yriHvoRkOQ9y0g5RwK0QlQC6T7gFLFYWBjOOrz4FFwZyJMZGV4IDQKZXcDbQp4sPC68TKazV0LABnJjCIaSn1baQMsgTbrQeEgtgKmxalkVXAi2BHQ5sZ4oXVjYxBQ4b/FjFTfw7kuip+DugK7mOJ89lqCeI6VU5FFI2IRODPELjAa7npw0snn496I9yp6lRzwII+4fH0JGyX3yggtMKg3V0o2Z1gEMQPHCE0hwhMQ9T2qHuFfwWLA5LFP+iYC65yPxdceoqUZ1DGzBiOoz4uphn/IM5eo1hQpD049mIz8xq08/R+1XoCRBqLPlln75VUvxkQ+DlWxT9MZACINWSAGP1eWrFPtZj+egJYnpVjjSEJkBYESFCnOrYP9rC5f2Y7V6iI34+/jMpzR3c2s8DWeO7Sr/+7Fmcg2Q2RNdXnaci/0Xe556DZKCYBXIpH4C5dp71E8LFgSIWNFDcWXp2xz8CrT/xGSzokOeAItmZ/CdEaABFLGh83e4JzVa9hwDsxtMn1jVelqo5UnlSf7B37SnNDxyKpqevXrehfoW8kOviCAwz8CSzOgkF+7BodoW7UhPkFLt9R91SCbnC2DIKtqMS6RBLmA99ONOBcVMjzQKJ5bsc6BV49BQIFgSwoYQMT7VhQkL2ARshXZE5jCRaiiJrPf2o9WW5lJDha8tUuGFXgpLDM07wLNi1zM5hDLesKOwdRa0rNEXP0s64l0/n8IWsQKbEphk5A/KQreKha618ukiOsF2F4IX5tBwhoM4qzFo1LdcfhKN9HLVSQmeHwXHJStX5hEYRmmS7lpkRAOkHObh+BbXL4PxrBpu9mmzM8HOmZl9mmgUdK91FuJ/slwYo36WZ2EiiwhfZzpyFgThJIxvr0smAgEg9MEJEZqvWbcLiCMdMJJQUNRMMncVHDMsDbIKV7y266KILKU9dLNPDEiOia1WVIIQ4oLzAuELTLLgiI4w1M0MRX2NDKGu6B1RcE9g22XHxbZoJllXlHbg7qKILwMOWi0NGgljjn4LbSrl8OUt2ABMppWw3W8ejSMckYTmEIQZseqQ02xI2SxRDnd5MwfQmdBkqmPXST6FsYImUxbEGdwW3dV8jCCcHy+QslPUqKgQcfH0KZYGwREriWCGjgilagPrGJSVDitQUuq28+mcgdWqZELJYhZRCt1Xx9aHf5Y3JsJBA0PmSOZ+l3ltmz63Frmvr4DOpmm7iDIwlxtQUzy0lkK7dt6p3xZKBYHKOZfe9LspKxrI8H5VnGEuMLLKr8ep5dr8SilhYWJd9vHXFaGr0vlzKJNBHEysL7ZJVsq/aVJtAQjELkiNREMIrmD7aUxtLJBSxoIFWB9M7HP8obX2JaRbYmFdILvCioNlu2ibpIc2W2Y/9KPifLzDNQknRoXcdD19zGUMoYkFDSgISbBPP2hAFW8YxE4QOPxa6G+NSCm8Wo1CQgR2qN0zEwv/gsG0SYVGEIRasdXwl2ARdCrnUXhlTB0UFjRpstEGrFluetGi9OR7qoudlTa8ypf/3VNN+53HFpNHSlPvSqAFnuvyBxURpBVkUoZgFMlE2QPIN89aNlE9sBfnnBB5gOm3AuOLSLEgJ/aNNQAIAhuSKdv6G7C6bvbd32e59UVzQxmM3n0c0P0SeRg/LjJhttvSD7EcRChNC0yzcH+7jC75h0brCfGKe1G6xvilmDdCVrL22NleTrcL2zFygxVaxZA/NrCQd5R9kPwpRmJCaZsFy8NQYFm25AhAcgh27ZO/w4Yx+ChBwJuYthpa6Bxv3nusCilnQQJea6YEActB+jA3LBSrNGKVDa4jRHt4Rbl2hKXqShqIYsh/lOfQFpll4Lnb1Tus/IdkNUNSg8XWqKTAPa56s1A4wMMzgCl1NzrHcIiCcouvvRHiEYiHIu4L0A+x0b6mwqLmlM8TOFG2dzpA4MopYXLH8qMI9mMD3xBQXuqBhpfEJ5FvTtjNXMM5fZnLY8FYB9cFyO9/+gUZi+c5LcD5O/9dcAMhDq7kH9IRUySoOCU+N4ZD3oZwL6Cc3PWREQP5IeZgVoYM7mCXqM+aG9MrvJsGQ8QWrFkBQl5oWbFWdVrG4jwfEzWDAnHdVHywkd5lHOaDfCRXPf98yMwKAlkfjKn00jZSUEi4WDlSa0Up/LgKFeSMD6BIqsBYO149O1LVQ4CkKsGn2FDEiwjFghXIK/eS0j3kYIJZEupZZIR3a9IynW8/UU9KntlgwMCkuNFDJZ8RY/4i2/vGZNAtvW3S1xraclMyGUMSCxtcdreBq+3qusb+mTZCTTFaiqdBtH1cBu51PzFPb3Wd02jAbQhELCdvnp+3elurPD/gwlhixksHE5hyaWupDJt5bZtl1fdwaezVRPla4YySx8SzsHusfJ6lKnkKGUMziJ+7CA5eAynIWpn8gNEFO0dsXsDUOWwek5m8HSWwssBuLaTWwFTaMZDZ/ivVsIGvrO50X5N+DphiSYuc85/XB/tQJ3O98cnRQ8Gl6dsc/oq2/hkmzWJH94wRi9Hp6lAxLg8VcsmnlbWeddUeaNue4N22DjdhwIx7Y8j5w5Cql1nHh3uoM652iPIcSBMyOMOxJOfiqix6Vbs5NMqGYhWXKM16xd0RbN5opeisN5Spl74i27iVFb804cm2wd0Rb95KiJ4Myl7IfZTf1BaZZrHv+GAbWPC2LL8YhA/vzAayQ2DtiLcsBgumttGfMmIfw9Fnry3EpIYMVPSncuwzuuYDzBeawQS4UiBv0X+F4D4zbJ1lsPyl3Co5/xFr/kmYhK6+aBo++kJovyaWEDFXBadTBO2KtKylJD2mxPK/WUz5K7sshSqXAW8T/kOvDun9EINmPkfMmyx8ZhdAYSNlh1TB57Fkpe5mezOSqFuTikDo3NVgYHskney7Hd8a+Pfb27+TjGYXrcM300isBMVi9yBKk8MHcBOr9jdF8DJm1Hx56KiXAuOTBxEuoCNwU7Png/nB7Jg3sBYqdVlCBXOJpDz0tMgRnc8h9ipjgS5vf1RJcfAClHRhwhUk7qElQbJfx5Yvpj5b54+Eyf4T0ez63NdsQypcwhZRPGZwlCSAzZEyXWtPTLz3s0L+OsBP/osDScwL2dQNJH5bNCEJ/wWTDIEujnOsguW97VQ5pyMGF77Cwf0YGFO+KIU8kzpS87YsgCTa0EH+Wh9tH7/L15q4g0Ad7D8xc8jmaw2dOqgPzRLUPk6qzV7/LlAT4pU4c0IezLTOEMOBdfmoseu6bOAAyHW4x39v5liTGYisGJmUk1WCCSZpyjdQ7dzI8QPqxzSb/0cEzB5NtTqrx0ZPyOp06XLJsWYJkrGbMOUwDRtEMTDPCsckLT1b4PRyCV31D4z5aGSSrLNRWpvsl2CXLFD2Ys4Ida8AAlBkjLGnj1itgOiZ5/BMDYFMOJyvkSyGZPScQnbGXJOdkmVkTA3ME3rK6+Dw/i5K7Wwp4/4w0PawaMvH/ByOM/HS1tHmAHwiVKiVN8opqF1UOBStPMWJ+l0U2QEYtOKaK4cJhgwSXsWICM0xRQiepSy3pWTCnulpOSjmtdfFfpft24xR6E3ZK61vmyh8QtJ5h7kLKmmVDnngsT8IEAyEEiDXE8yPCZ3inCsswpGPpEwOD3ev2KSZV+fhU+dYKX0xLVf7Zf3xmyOz3pwgM9mfb43/x2MFtfLS/5fbzIh/L/rdE77h7/egJOqXImonMlci/iGyHyDGIzH6aUy9WxKibq/gnZsLjrG7IoZaXv2y5uOfuapCtnkJpmPDPeNaEmxEce2vpOQM1C8xmdYXvZ4xfJmJ+hf3yV9O4FtkwEDdGavYbaZgVvMKy2eZkwJdrR5YklnZ5VoLgANKMeEhG6VbK1AvfWv3MFhynHqcyKmTa/sKQTiasc0NcxNB7Y2EM4gfgqEcH/WSNMS5DRD1Fzc9TQ7ictsqJQ89qWcz8fmqG2Gxt/vqvrGCnI9cXX5pR/2ga0lXGeKV8LWIxZe0d0XSBBHG6YAg80lCsHBKVVoyRiqseW8QFB+v9ThYcKUJb5e3rND10lXF4wvhaRIhC28vAXTJgVnUUV7ZBzu1KdtWYLi6qK476IryNCRHoWvqRY1xcp3yJWC9Fn3F1bfX4NK6v+Zssr6/TsbJhVV21WHL+Pi/UyrhGUMTXJZhc3N7Z0H/M7vJFhl8K1+OKqwf8yXa2/yRTjX8NmMPWGHhy8afAG4D/KpTeLrvHwJ7zf3WN8seHP12TDmShrcC/V52AH7x12pI4ci4YHrH4ovZO67voeqWN9tuv04l/FxwaOWUPW5mz8dD2MVgwXYsj2XrG71L+/8j5L2Ru2FodvvOipxa2yQVHygOlC7ooYj1rL1vuFKIq5msVYA9tH9Pz4LXU2Y35KuVmKG0fMx+vrUVYOHRdMQnOgk5UN6x98TL/35Lh58X4OvD0H3b8eH8P3eWS+0FrLgNjcGZc4r5ZdrLK2ZuX3Ahc1RLxO7P27l0PK3cujVe9lHPNLf213Cxs/L/v/qdn74vJ2VKq/tqmbVN1KimghTgEv1jvOuD3vPlqpPhz13MwLZyCPVk9xgaGxojXFlGL2AIsFYL6GKV5hhaNlTvz0+hZbR43vmUo19h1g1D/FpO9avoTEGcdd7LL3X1xl1U8xYQahoy4eBmcXxQ5nV9WJEoc05tCv6h+WuA/cyarmfBuAxcNuAZx+wVrbmQY0w1+6Xsr2TmedR75ymOD8y92/QWu3bSQH/MXmYZxfAKyxfpdVtta5DC+KZNSy8OHCOpoBdN3VekVtajtiUd2ChWRoxvItftAWmPGqU4m4x8Kl9Mex4FjlBtFPmTvy3RaXL3y4IhZAAIl7fMcPAZFJL3H3SMVk8s+YS8MftDoL8lqExmXCh+knO3lVKsS2kOepXMWc/NMC6GoOOeqngnT3nCyCQtJfCpG804j+0b5TL998xPsRZhTMsZFcypXTdjcU3rJZwsR5yE12wOg1KxDd9igDLFRR0cZNEDlHogq3kuNVjG58HCX1uByhZI7hWe+bFldhVwZw09zbVEeQ0xOAp+Zg5m0oXf+HNltjfJnyh8XpvIY7tLp68t8UZzLJ9IM9NGexTucBJXHvehyXILVqHwtc1GucHjvgdWnuxxdpqR9MqxuLXRKAV/HKD+9tf/5jXvg7J28JdpJyz0V6fPR6S6WY8uGYWnJwISb9hLsCa16+mbXzaIo7uYey1XR3PWQhedPEub/9rn7uccEnwUYIJW3abzweI8pj8rc7Y4ay+rr75IOBF305xmSexYbeqHim4yTEyBWqDxhwWzpGsJyt7+JLiu+YFksZwUzZwI0scQdxRGqqyoelb/wX7qpteEjl6kzQM0t6/LAR3hyhE/XS+S9Y/x+u6wS73NrGuNcqqOrm9RHdfJ/u74UVpzc1uejGOXTnnbdWfw0je0NCzK3guMWt+ymi4oIQVSHTM/BfEPKRAMVNSjW0Y3W+DIe1dlHQLF8xKdfnFeC/c/y7/ZHLZ0gvBTibo6prcWAR5aTkgQui8ouI9Pt9NIZdilTfOksAtvcE6oJq216yg41++vA7af73LzA/5UFU9KD5/7h1dB28G/cF+Aj3H7o+fFboyRVuheE1gR0C9pyzsyQQRHTKpD/1fmQpukehhACa9Ghy9AHWxbuIiztELGb0EuGU9XyhRM1jw9do+XkMKSC3qPQtZ+S5ilVNOliBWnwL3hXutnIAOtialG92mbntPRG8oeG4vMRfmsPJ5ku+3qV+itOWpnLDTrOai/7Wrz4RZEmMLpVMjHhhBetLvxWVz4LUrfaJ1OMzXVZ1JWi2Gu2FfR1xfn2Ln+vchrULvGV9oe2qxu3XY17bz99gT7PAqK6itvxjroW897uVVFHWOEEn3FX3t1zEIv6xQEqbHC2Xsa5GtveuXkVbvXy0RW4NZyLBHR1MxSFNh27JULWcheeMFE3mkm8qQS7L9vy/y+NRolQ53ikGs5K3yB7XXh2KThvUArXypPP9lcaoMfBj/Caj3ircCD3x2/ty2r7SFmDIhj8B3eNmyNdA1TjoXqsIFkyjgCsm1M0E1Z5Sn2F//4csN7MCe7/Qa/g9VjRIpfDOzCwqxyuL4f/CjfOIbsSnZzJbGe8ptA4DoWR4o4ruX3mGUZHhId/JISwRNTrhnWsRT4F32NvW948mYyZffwssn9tUeVbAIA0+EhuhIWPdBf7Vq1M5MebFwe7L8Ivzx6ligeEfZrFIQi51THYORmBidAg3nNioo2rfYG4kEt5IHF3g+ozAtXFiJ4TFG1WLUDFhZ3Fg4mzS+3XBCFaHcLdTUu+niDKlUN4ylgQe5hX3S90KfoN9M3r24Gqslb7U/xsuEOI2isQPMVfnKu0o6T+Z5iK7zl+ci92v0UtkkvEH7bFbl5WzLluevfsZNTLK/X0r5/tP/umDM7dAIZKCD8fhO9iNyUoJ9W83ny8Kf4fv7b3O81NWG86DUWuYdsNFtT7LGUKv6+5pMmbG2BSFfu6Fp0mNbeEpPH3ci3mhOorg1YOD9d7P60itS/Fg+HNWttp5FMGs1j9m7yx0Wq2WaVYQ1qfkTb/ZhsyqnDbppoSl2WQEKCcaGzNkToEV+GJ+lJ+dBAOKJltelDjhXKwfDNq7thrPc0dxQnik+2ZmHueZO7e4J6KNDtVnPu58DhXnKhyjfdVdK5I87YcFWtES4v0SLN7OYhPtj659iFFIjWIh6LXcOwSiVFlPU8l2T3Uz7nqNeRQThBrOHdDBPXeDo/+IY2qqdowBQ6ByomKvTm0KtIVYagcxSEr18skffdWphSHOI74maZ2bmNPB8CaFtEYpgshUzlR+LQOlWR8b0lPRW6G10nO9KUhIXYBepO4VrUGp7Aw1Ti9pOGwtzhRxXqxPk+adbMdLhW8kf5NM8dcvInC1lT/9BLzMFqcqNjDTEreJs28L0dNRfp7d8eowYuFUvme7eoR6/rCPnQEuolSB/iKNFWLE4WFYe4JqNiwpxzEJ0HreEOj/Fw6FuOTjWwutEEhFyvfSyPs/fp8aWqey5/Qe7+vd8pSCy/JQ6NtdCoS2U+xkpaz50cVYGWqQX1Z7g3zxYmK1TXMfmSZwLeugOJQ/uY+Z8nBt1+AwpiWBhnWrocE5URhWAsTDUuJIUwdhV26tRi92DSPy0HcDaKd+QOKNMvL0bia62dchCJNf+UoZNPl9ZkpuOoWSUBhGtj9ndPQYTkyM4Qz2OPuUVGnwZc6PHv4fxOghG14yF8j2fNJpiPFHwNqxxJVEa9NZ7ZClzQKB36bsHNaD3TK3CBr1FNpz52QWf2oonB5tivzoiX5TyNv1GXx0yHpBxs5OwZbNw9P8m+iYFQx6QY6Qb20tb/SUDcOozsvqpKzDVrWKA4YPtrmjfo2FltCLxBzW297jVLSKHIrw+G++9O43Uj2d00b/afy95RavzNZwdMtZCv6EE6qT/3N53zz4uU8gQaZ1HnmpcsM5gaPzHAZ3yN+yM1W+HyezciO1mLwpIPzk2W8Yto9g0f+3dCli3EfUp168Wgt1+Hwwxw/evTglbPCsl9iBCjL+8dnAHaxcU67VXeZvmb99D27Tfv10ELW+BpKWYbqrh7AD57KTFb7JvwNZylk+K3PSSQVhzPFMzMHXhzPCndIhvpKK9PwYe9ve7vuqgct6wVZHjo9InErnfkvhgPkgNlZ/gke6/rStgWoPEuH4zNXK3Ma16AmK0BxRssBeJVzRwBICnbZt85YZPL92Ru4Kt1HlHM3c5zivYcY8WQyJj7KwZgN9MTiHE6NeUSNfutnCIOBCUC6VJV88LHKT2hF1hj6s43yD+y9HiOgXS3+s9pt4rMEzkguD+p7RfEBIv77QIfRFkAx+Za+vd91KGZwmlYIzLbh++t5y1MuYn9qQ96+zl+LHx+5Szd+Np0iGXrEhx02J8Kze/OKXM+JiGs23m6i7NpanCotZTrNkpd+NdFfVKvHsMC7bJ92Y/ErA06MkGrJu1fk843TRjsGRYRNldkguNnyNtSkaxtORDS1RH+TQzsGBd5tlAk2JrhVjfhK0hEDeObZdm0tHy0RNv9HBwBU4P1dw/FuK3YcrySC420tdhzfCB6PWlL8V0rzRv/u5B/zY2aYRv7KPvJ3Jv+YHg1X7K9q/F9/e7DvTCwxPeaFYeSq7CN/V0qS9EaHhrNq16IWG59qaRyoO7ROrbC5N76YljZgzqQPDLi9TOv3vC1AwX1pkzflEpzj85BRxoUVHs504za/wcv7Wzs98dhtPUUT2AGoZNIz7VF83QP32Dzk1erm7fl62Gq8whFkOSoZ/bKeHQcUaAC6GiTJ4iUIyE7fmAPMDSJQTG7jbvm81b0Gd8I6qdDUeVGTzrfk7ToePxvZTuMCwvD3vuauuRiL4Myjxi2M9weHSkdgjjor1j0L/VIvU9x76smMnJSpxyuVS2cayPvWLah3CqOcSbow7kpDngPinZdoAUR04YEAIQaFwaEaBrOLcrP1DmXE1NStjouhyQK0oyiTYx4DkZxxZwnnBk9ixKylonGsSHKBuVY5+NjKoNi0VLXVpDxxMFu4yTFPdr63gbMVXvQ4z1NhTy8aQrHb0tyN+dgH/F47IXY371HnIfAw+v56W9J7rMXafeMizdKo9oo2z13x6L8oc7E0ASnE69obojxb42z0TT7F0TGxmS04ya378JyMlJtyzIsXWT3GvuXIXt6yB09IvEKp2pkmC4ULy+WUq3QZ1HZ8lcHCEuVBudEv7s12U+B1Q4S1iCbLNZAafTVyOQZ4RqOTYhNlQZmRv2X2bgZsRxpXK2iyECg33No8hc2ISihEK1gvb6hk9N8us3iPpFO1e/7takdftWfPM4FYtgkYVkG351XXQDfYHmaT4tN9jRCc1dSwSo38C4fPp63QNtaZGoUsDwHqyAuZvTmPolkIQ9bpDX9UYuS9f1pn1w3IXoZWFZouD4/Ec3T5KaOgI0MIaku3i/ozE8hw3G0TuaUbVT4mjLqBhgFvJUxN4wZ5GIPtIV1a4UbRVKCOt0rG5AKWv9owVJMXzA0/ZhHIptXtJPJQR5QLwlQ0r2TDO4zxJVxBgXSLeFhm0I5S5U543yrimQPkUu7GXi6XyrLnPFiHBjYOPF5pAoXKuMXpfd0DvCdoRZVseCDR2MAp33TLMo53O8tqporKfBk+Ie7iSDinkD9mYyxQhgmbxBnw0pC015AjJro8Z0aYVD098KxhmOJu3ELIfdu7JUxrgzYOvDi1rphCjmBxCc4oX+yDo8i4yZiqDcnyME4pfxFtk1+dM5qXrkB1BOVmEljdcH/mprARax2CS0rX5zzIDXdO/W6Qq7Bx0/HCbDXZZsBLA8OWIsXLJDd+z5Mwp43P2PCSvX8c9yUPaJf64rAGdrb4lCSMvjB2WgW7c8brl4Jxe6ox9vbyyp0jv9vNepKDeoYm3XV6S4UD61zGOKgz/2fWS80ied5XhxGkQIbU4iQjydEv4+37KGHm8WmUFJAsz1mZ0X9JSi2l3w0jShGP7NEj3Rx7/SzxpeLMoBWQKThNahwunObQsLTZH35UO2AEYSThpD3ZFqEqyOoy/gbpEJy0IiV2dBOAh0ve7uHSKs0aVJDhNb+vx0FlW63SrE5d+0APL/nRw0vLmh5kmIKX/CcVXt4ODFkkGHlJVyFkfAQl0t6pMOkGGQ48yBauuOfjHlYHauoEwsBx+H6NOZUdTxQdCFQYEpIIdLCUueo2daQwXYXG4bLVFVeOMj9r5Yi7CDQ3yC+/fG7dbDKmGgwZ8FBhUgi+c25n1iYNTO9kqG5vHoZAMW9XK9blczbgoEa68ERxA1icaqSFWfDgHZ7h0hKIY8ADyFkI/UWPDD6Bk9EvIcjmU28c5ix4HC5Wz3Ewk84RF1IJcxm8qsBYd/uN9d56W8bfTNjE6E4YSpdt7hpGt1Qgmh2K7hp0F4/IBtRZmKKCy6kVlZIDKzFef4NbhJAZir6OFIU+/DLt2E/S8mXYG4tF2kyxYxhqAxoHHmyS0FW6EC9OJw/wLbSiUnJggURLM8dtXr61UtVokiheKx09hGOLX6wjl+Tk4gu7r4qCQM+i7yZQ+aAwGNKkKbcqJVctIkLdKISC+Xyjdul4t5evFlNPIzir573rFpRQcVe19Ui1HhT1N++Guh4X7x7Xxf0E92Dag0ge0j6AVOUDyPx8I+QTuBrtuvL2cxd9TUFaVZD2643oOYAQ3sQsMU0Nu5Oo5bVd8t5J9XUGHj5jc5TBp0ZVXNkEUJMn+VoOn2/ykW4/iZrs1ARlf06Tewdhiu+g51rlmwUj1xqI+hqIDeio+BTfwZncljZ47dJuLahVF9T6N0p7d7DjZifH5IONluzbCqYl+L6c70m8+10mSDNi0eUpCpr8Qe6MFw8kKq/w62Wh4DPK58Z3nUW/XO69dwm4fGe2dee9MfZvZ0/PL69v73v3AICAgAIMBGhggAUOBMh/X6uNOO8vVALDeAvaENIjPHfObfyNxykY5Tgvutpt72nErPGcDS6BUPlW+bNl51VAT1Pxdjcr4wt7Td/G9nDY3tMsta15OkmtVsLNXaKn6b9A+dJheUme/FybAIiW1bZmcuIs7eXlxQW6k/gVSCQFY3RIoKHM++kHYYI+BrbCRcZGZv2MePGHRhr77whlZbsP3h1Id2U57phuB64d1m0wlR0+Lj4YIAWrTE1d4sPl70RzWYy6QdBJ8DkdO3ezw6hRyJyOl2uYfGa2SeCmbLsgV+i4etrk1vdq0ks/Bxyunkv1dAfP3iFwqdHAb9bD096wo7c149uhANDyhvLubHaD023li4vQDSo3dWZSPITcBmebrmuLG1e0sZytcdQKVgWL7bhH568lm2CuZXyEs7YXPI6tJu1Ez2i4d82plvg2j9pWoD63TtaNl2aClZG2D1TERRt2hwcLzbYb/pnpmMyzfaASzllXhsHNMm0jmskws+LbD4bNQQ0wjhyzZDkWgKl+8sqYVFa1o6yrI4rJdoTvkJGlC10yp7qQjq0DMNHYhc0VYwq6GNeKkVCM1nWSgIjR5xa5zWHW+QQPrwubhQwdYZ+SYWKwT9w2G9jPqEdUgBkWrRfvji0JOcRMTDv3a8gcEpfLpRO5PBoZSyPRaDSioPuEGx4y0Esj0WgkLo1EItF4PBoJC6TRgDwelkzDYmk0Go3GICCJ1hE54oguCtA6IoefykUBMsO/nuAXcVGA0xHJcPcWBWgdEcPWbVGA1hGxbcNWNstS7AaIWGqCyS3wRvFKnNaQruXfnvjK7L+s9WDk6xC6JUK1VrrAS+0xYqwNhn7tLr6nC/8JgJcsjRLLI6bGWflwqaBU3RtHAgQlaKpUWt1kVoxpXWUV5I0Ey6quStgr4aGX7mG0HddUo5v6MJVnA6Qa257PpG8/ktS2YB4dE9Tg7SgKohqfBqSDFF6pEkDhSmFjHyerJjxdRUP26WbmqJ40VgEjlfaDHhRtMfdQTd+AagxNT1MFjsdhmSORyvUDHnqwUNhah6ukx1iXKNz5ZidVsKOPwruij6KEfPZwk17AxZ3muMcMXIpbcsobTUZcCMBY0Ys3OQvx6SYx8dWoD/XC2cTFvwUmZVh8aRnfGoXAUaLivx29BseJxFeNWROnaertAql/e1zolVV/xbjoYfJDoE32IwUEEXcgQXBV93/hisBYoHBsOoDydKg4g9GHcMX2eVmMg8f39vj8K8JwCUV5e75BGrwU56UXVICxTPDRXockVcametOscBte0VM6VqSE1B9oeZamQkW9MgpXr+ppIFYQPXLlKg18Bzr3hVGMS2daM1qKtDYjytHoNDom2bSKJ8GZ8rRIUWhbipuqi2kFoaLgNVUzB4DXAkhpKtbmmcRUiZ6mYsejYrtxQyF2roiCkD/F4slU3dtUYhZK0sQkGbkH5EcRxux6e1bTy0Y103v2Z6raaKmf/Evmbw2oCcQUymCqvnFAwzIkOS8LQR4g5ZrjUk3pp0DJbU1LNdxcaRJO70IuaQ3kKsLQf9K/D7ZFVSZNqESXvr3470jwFSIozU4/2sJFAzvOVDodBlrn+GvFy0lu3UYzaFz7ZuYjS1zlh9TNvSwae99hDlxvbmUYu02q0VAGpZXvCIXLF7QP4u5Gxy1SHPFJR3wK2Vf1krYJFTltw1YSdVgxyE1jBZcMROsVvczkQdOW96c0xlmJiBH9kl1JcpKek/SeiT7q3IaM4SLT7XWlKUSNwTAj7p7CzKt65SimmdXOsUGqFbKNZtGxdf27pGzaAYhSUUA6moFY/yK9dmtAKb/9HgOy04fdpMM8AznDA4qj2h1fNFcLx6L5+Nw4n52e5XptB5WVcrxPgPd7t0D3N5Bg8Her0NlJdnVI3z6cloUDgo4scuPXypuPFitvg5vaQ4j3lYdK87GlSju4tUIvPH7vQwtpNIJgGuRo6CDMLIKMUV4VT0s8cVAFL+ntM+QoyBEFGVr8phIt7W3Whjs37UIsRhjmbEZL/DiDaHohAx++9Zf1qgwO49IguesTapSgPiFphTH48u0OfFzy+1b/t23YHC5PwKtEvl6SFfNqjVZnYMrQyNjEtBn7Zs1ZuG/L0sraxrYdu/YcOOW9Q0eOnTiNccZZ57A4F4RbLl2xXLtxG6Yx1SrFksBP252r0QxfVUhj/MvplI+c4zfDMjcMqw2J2siK5Ba4nBtWiyfIRSCUfnbjPw+HEnDnn4+ARQmsJ/EvH6UfJPh9U1IqDE6ZbcGlZAuSkmilSxUeAIBMaa6AGTbVGQeA+vfiLmlfLmg/H1kjVY8sAJSRpJboZJpDg7mFj4QecVLUPhWsmdIoyWgYpl0jL7qIoFWnb+xfg3Vjfln3zzkwsrw4HZuklhFxuQi8R0wBeoFuTkl4mDVddtCeYqhJNgzT2kjru9aiaksllGZDDz+Fu+gCD1WvrpQ1tYy71J3HbHWHh+lVxVrRJl3Xk1fcUXCcijTqXCe3mW7L2xaTVsda2SZd15NX3K8A1r8HtRZUKt0nt5py29sXRlUlawmrlN2PWHPsniS6GWD2WKOnPiA8hElNIaIqE90azN34Gw+13luDkXJVmoQo27JHG3n1IfGwTSKWuaogm4qFoUi0M7ipsa10E4FF2lyVLcJUXL06pRuHanHIla2HaGrENd1UJJG2V/0Jm4q5e8e+w90PCrhgSs3oa+f0DkWYj+iTflDQjxJsi7OJodZ16UKzKlLMlfJlHKrF4RfchPiRTipCjR+mWo0u+AU3zXlMAWlcQzEqesFNqJOKWm2bCtloVsPOvsAG36R2V6RZ1jrQRrF9EHUgKMmNh1rt0oP2VGSYGxWPncFNjW3dt77FytbKcq2rzhYemleRY9UpeZZDNDXiqveDBn6EUT/J4E8xNBlepM0ljnPxRQpVVWsoRkuVZSJU28a5+CJEFWuFbNKwqQ0JLXEdMuwBd1LBbEXM0o9n9USCBs0HLDk3EKPy0sJs3ZZ5hbc9E7jUHum4D2o4/fl1H9Rw+stUHTb0ouoo1TFOI00xVRX+VlNNAM6WgBTSGE85zuidUt7mBrIF8WpblDQI9nu6XC0KnUU0JDX4JH0uRRY5J5lzTNJHlpRna76cBBGipBIdnrpCQ5ehb9lvRRxKw+CT0tJqz/AYIhGldNgj3PiTksJFzcNbprXab8JEaY98DVrZg5W4k4aYJqWuh/u8Ak+t3qXPlofYJ6WqcYWAQx1yHJRWKbX2wXHPXEzClp5eWuf6uFnkQU9plOxqdxEqDwcglXKGZ6qES5H8zyhh1e4EUglD/MSbBserZMk3USWL6ZCTcu6XdxKiBH3ok9AaIR5iEprdQmxvU21oQxL6wIFcEvpPQMCXNHYo/11IJmHMmcGhJg3LCY2/gfjVwwMi6ST0t5AHYBL0KwWWSf2JNErcQrdESIKThCEQEOxD0+EjoV+ECA5JqO8cEUlSSKOThOWrey4Km2fpKpWAI/HKc3iO1bZLtaJrK2SECRUoj7MedhQRehNTo7BHAmPjAc5OCsFBJtK8xZQv0njTphTcrXNcONHhV8meI83xi2Qlu8vucNdwngpsCSPlJF00FeY+Dbely5iBcInmJFspq5f2rlyXknaf/aSjJph4hoqsG9Q7KHWz7yh+vD/jQW5Jk3Hu0zBcqpxVnyBSHc7ztdU0uTH8K4A7B/8StEQoJJgQqtUNCpMk7dwJD5Nnsdm9o6b0AZ24FuhjFgEfTAf5/JjguxFXJuyBm5DB+nRznzt1qaYKqE7/FETJfbjUBFoaMRcAjIEbA09asRcwOCN3iWGYG3/BXWWXfJONNENfkZxS6La26Sic5AmcXnXeaOo+h3tSn7o6QD2Je86Hbh7DNi3nrcOvb7i8a32t+kE/5qGb3zWBj0sTpbgDY8dx5cbMd/1AFanBSqQyuUKpUmu0Or3BaDINc0cE31tAtotq62AGmTQOenEIMXf2se0fVad1bhIBXDWPdxZyfh19QNy9+pILp5xx52ifzA5vv/qkXN/WTiIangcMAC/9tlEmi12WfSre/Tw3nv1sUvHcgWD1PIBh86wg0D1bfzdZPM/+eSudN/9iBnu0+OkRdPjV1QttE26EQ3NsL6bFUD2tkC18fiDyg0dEvExHxMSOuXxS7ywpTPGbjJaRzqRG1GRMZ0JjUoLULA79TWvL6R67B/tu2MGEN3wj+zcAe17G5MgyYnuriRd3YP9pSzBJhFp+Iv/2BV5aQGuYPIceiKsxRTYNpBg04jiRYS/nOK/z5y4FzMwk3sZ2igFWHxuEvuRZF1/ZGoferNP0fy358Bdwv/47VztMbNbOVsDtQ7OLQ+wISvFEvTdb/+uGgvvgsIIIft8t7Q/D/lrfKS73iGbq+JrofuQw9t3kpfvdQUV5fPQSqHTSxStIYyO/gp4spjzzmOZl8hJ2F826kEpvo0onPboEWdCrF3oy8DzGHPSdvITd8Q2W7FmzJemks0uQxaPtjj0AnmVM53vyEnaXU1FtVI8o0klPXiFdAJv9BaKXdQ1Ebpfj+/v6E0Nz7m3IRfvhkcun5dSKg9i0agnlGNktKlq6arCZlkCVC9DTopQUoygUr0OIcmg+cgzO0APgmcbU3+3kJexOtYwOSgPBpZMevMLM95CKPRBTnuuYEafJS9hdwtqHO7hNSCc9+wRZDMqgHCs8txGbzxEu0q7vjWrANgLt4kgvPk7cwAd+zHnuY7beJy9hd7oBpACqIdJJJ6+QWltv/vFj3WxA5oz+U96nBgAJnbyY/XC9rNpRYDD8CVphBLHJXBNF0GiLnqsoGoP5BEcxWKzm7uIC9ppQkhkT/G9CmDQpGU6yAGhPkJQJFiNBnY0mo8lkJ+gkeXc9m3du3veqZr0DnEc/eJu84iD/XltHGZVyPHFzA/mzVG4Lq/id16uLsHgIvn5pWpWa9knl5gyFv0KKBf9bdeRthlSTJFOk2UsYOPL6GJK3s0SUuauZlwqLnHMxO5bvKrlmpuTZq9gmOfsIY2leF1bzJpqKxFFNf1Vj5HZeTIXdmw5QBmaihAltkn68hEFGr483ejtYRpm7mqVWYeTgpXRNvquwm1lBQRnkmuTpIwzJel101luQOhJDm45tYeR5wsypvdkY3mtFGg3CIqXmJQxTe33E2hvJQsLaY90D59TguXQTMWGzqlXW7FJyNwkaBOfMwfcjzsJUUn4YwloDpZxQ1De9yOAYol2AvZKEjzCa8VcLbHwNcErirWaaazF2XMoJrn0XYbgSp+4kYZuEfIQRna8L7nwLSEv54TDnJ7LBYsoJ33Q4aCULX2a0SYY+wlDX10W9vo0mJtwDZH0HptTguXSFX1grk2uIik9K3UcYCPyrxQS/ArOm/EQH5ylynQpZ23wX5a7ZBAead8uk4SMMhH57TPQrGHPKjwNyXiLzVMrH6buhLGLuqspSzZKymwSGhbPmlOM9wg7ak7jbtO0LRm6X5TRtvqvaDVP1mSVQPJOuTpKD5UH+2IwM1NocQonvmulc07GxlfNK/HsJp5snqkNDO4kE3DQveTCZoycpajUko/LK57T4ZS+n0fpdjJd7hDuz5g4h3pwk2/xBOSrGa+utR7BUflyfk2KXdzklyr83CODAEqYW0j0k2UdIx4AdlAEF61P5/jfrNzAtp7n03eBMBV31RUqrpJuPkBgCHTwEJtCpxFHNkKqLPGQpK5ZveonSCpsIergkO/kIaSnQgVNgwbIqP97KWSLzXMgl7FtP56BNpVQySlp9hCAZ6JgyMNBpJX62OZzPJncAUyhpyfTb5HJ9iUT3MapBSh8fIVkHMseK1tXKvF7lhyyc18i5lnNc/PsIAXm311F7B5FcfIS4IujIRdCzjCV2Kh0fVzf9JOzj99jHzbUqjzOk86A7yicXIboJdooTFEhn5adDWafAUkrr8LshaJm1OaTczJKKjxBoBR3bCnqitfBsJM4eW1+pyfNf07MahgOFTDJJ9vYScr6gR37BjvZWfuSP8xS5zsupyX1X+bXWyARRY3gmvfsI2WewY9CgoJor3wGzzoFrKenK74Z2U6IjZwlGs6TqIyTCQQeHgwnqLnFUtcOJj8C8mJHZN71lbGkdYBabZOymtOTRBHPw3T81ke0ljqrmdtQl1Mpp8X7Lm1FiKEAWryTDR0gIhA4WCAvjX/kWjhUDy2KKb9/02qXjwUs0xCaZeAnRidBTFGHFHQwPcFkjtKcmz6WrOoGpN1HKaJjs4yNkTGI13CQUKIjlu2LOY+TyKeet/F3Ub8M0W+SowzXJwUfI2oQOuwkLC2P57pmVAtfFlPy+6UphIaWCcbNJpl5CdCj0FFHYsR7Lz41hrYFbIW/T7yqrMl59kA0wTdp8hMRW2OGt0OBVJqZqpks9xsaznGn7d0NLbJhDkDn7JUEfIagWOmYttJCY4VlbPPsEVpS0ZCpvqvacas7OBil9nSTDQblCYfHCzpdZ7m7TcvWdwE3TDwHQVdmrDZsYiDknfrlp3rc8FJhTDLIS2b2f5VNsrEvgXsqB+Zug1oEgJ2mFvZGaj5DVDDu2GQpw0PJLOVhTQJeSZvxu4CO1SlUurVGyyUdIqIYOVg0tJmm4x8bznsCKkpZMpcm0oigqpcIYpAw+QmQ3dPRuqClQw5MVnJ/Ic04Nnn+bDY+qRwn3qhYphZvmJQ9ZRzSHGoM1rDHWb2BJDZ5Ls2yD3gBKQ8eiFMZxsuXR/KT5+dQgv8MZ+cdV3RbFOxvq2fq84f1Zn2tuwJHXo5TLrv9H3C6dXAtT+bcqLlXWDdc16ddYc6vQuZIOL5hT3EICOg9ypZGcccFKP9AqTQ7IvDga16E/8cG+tuiozMgdS82MKfHq9CKuKmJgXBN7JjsnJZjG9SNQfLBvLT6q/HIMMhUPocTeaSfuiIFxS7wZ37D/OCylvoTQuJYLig/2Z0uOIRrWMlkHUeLd6U1cVcTA+Ex8WD5ilVLbQUJJXFcJxUf3+72lr1/cbCS7kkxJfDp9iKuKFrrb7y++T93cJ8U+w7CUBhNG4npnKD66/y4tOzBk10I+1Fp1VRIPtFJod9/lfSLNQ5/Gg2iAeFXMLSXYdJ7OeXhdnB642M23/MBH1IcZaKmFNUs80Eq/D1Ts5pPO5vqVdG4J6SJd8Ij6BLHfW3EQ9Ju0kZ8aJ80SD9QWrPdkZ+xQzTeWUmu6TJc8sj5J7I9WPib328mUOpBEU6NuINBRS5lsj1fz91H0KSHsTUZbm6hvE/w2we8I+LqAfxA8N38b+MdkrkAFZ6wFdemBQCuNXlueW3JlWbVqfd9Wek2JKZEL1gcphbfwQNQvHjBkzjZErx4I1NIuqyc3lk2oICNb6TUlpSQuVB+iFL1Fj8nVc7Rs7k6kS+1Ao6OWRFl78snyVFShk62EmpJTMheuD1OKaPGBgqKLy0hbwjXqgUAtvbLFLfdO2bNN114cFPupRqZGv/0rUARqisZod0YUkZVWE4jsMoP/o6qn0KpO3NIq2X9BP7Xi/Cmy3ovFc86o0XO7mzvinAbMR6fRfaYavh8EYWYMLFN61R5h4vptqLRiDUEHf/2uNnL3/YFaImWPoGfeC8+ZoSS0ShPXrgsQSucyHfz1bxC7ByQ4wW3M+8pzYagJP5snLbtxGiDWxK3/gJqDmPey5dm2d7n1CIpOfjSCnt2jry+ueplgqKTLb/oMOEdjuph/RsFUBgG9R18wZO+gmvUuUbHfyoUl38zvXARNpKiIq1Yc24WARD7D9VusnTOVHbFxaGINdRYOeXe0amTo2Gugvf5+n/zoYUR+sOgbeDyw8o7hjuwbJsP+Z286KmWoY7aaR4eM9axx5QMq7/CzVtU4ZtFYFusFhJTOoa+dvFWNuXJHc7P8j/7Y+V9niH54AfiYCJYPGyCgxg6/sgafmv9PSiCsgZDC0qIxC/mykC/A/0BYA0EO+B8IayDI0L8DXP+UwQC/l768e5r+UNC/t5kT7uCfn2fEtx9rjb8b/vG27uQCtyx0CwhU+kfDXTo74kcqKhtG/yiyQ2e3Jcvp65AZ1/RCfyjoy7paS8Y1vdBHX+OVk6xCn/+Pt/XoYsfpp/2niP5m0ef/saOPa/icxhD5zaLP440++icl4H8gyPlf1nGVMTz0N4t++X/s6OMaPqdlWhh9fDD0y7tF/6QE/A8EOf/LvmC4cgfCGghywP9AWANhjT61MJd5QSZfOR+w4/8NRjVVBPAN2nbfs3UJWJPdL6UxEP6/Vdk37IvFBeNtvNOsNOY+JKyl9QE9KF+m+lmffxVE6yYyJPCQDINIsxXc5/B7Rqw45tFYxmlYqssTYhgvbJVRPLQ6CjUzcfkRRns3I0kSm5FGiVBbUnzOc6bptA6Q0mBAXtccIjGvBEI3jRBXtXhSDO9P24ajMI300sde9UrjMkoG8jO3bKWWyDeUCifL/HM0aRyHMZ1zzp0JPHNBoGVphaqpcBPkaXGyCrpbNc7S2HqXS310X3/LieBZx+aYd8W0rkZqKGaEOIQnEdZqKu4sUb3uImjG0o4pXQwDStu2LqMJHAyvLgNG1v4Z9vOLbHqm8/JsAG1oemRZM/EQJYBR8yQ5Upw83o9vOfesWUPq+J3Ic5gsSTG0qDGbsQcbem3mUTs721tpeyBTxGc/U44mHtzlpVQ4kDfb8yXP4zJWJDxEkwHD3UNKhSv7gk1myGhfhQseZiQMMxUYZ6eMctGAVTKnfCb/cKxgcd00UnMzI2DIWVqirUlrBQWs3vgOlXYolUtPkpuzidJgUaQh9JZuMyNgBcuD1aUCBrZ4Wpxoh3+r+ajGM7rBRY+sEvlKEUXpjJQ5uXq7ApPyrG0biYQEtFa99DS5k0601nuadxlvgtVML9TkUZ7wT8wZ7WXkOnyXplWpLRtw0aOrO76SRVKSmiQjSe8KRFNTARzzOKXUeupzUmFgofsPu4+YGLU5u0rkAZG1AJ+7j+OO8y2bqrdS2sjY2GINF1dPkyxgAd7uK2o5Y4Q4FjQR1p7doylR5fWCSjf6qceQQY4YYpoWSsdDrSIASkFr/UcPCDRyNQ32giyq6X/Rk8ynGpuUZCbJvMmvsxOq1z2tnftGsQxKGCrIEANw00KrU+tDf8GTMz9MJpBNTZIZ8N6PLDtXubKQC/cwxe6SkmE4yqfqVYw+7hc9dX3Up2KrmqfFMO+9yCkBIvgiemyN+b2xOy+DpN3jWxyDfric2Ouk0Y4dqwxfUKljktq0JNklOgFPA+L2T5Z9xauJe4QTwJDS4XjevJ1JR8n8CMCny7wFiZsg2vRVVr8W6QxPhlnBBkQW4Ad2SCMhN9y81NJxvaSIqcpQlN1U+shA7+Z6NEYh8QuetcWnGclZdZ4aw//ms7cim/rezqreT7kdgWBW0oxkvce2yi51q5y/VtMp0NJTP9WYLKGCUdWj6tkVGBrvC8FBL/WKqpxjCRWaqtb0SrLrB2PJhSvVs/TK0SJtMvloVs5IK6iKoeUXfVct5UKy0asd72uiTihLWCuqpjkmRMqhnjVNVY60D6Ts6VlxVg0ILTlSAvWsnfSq6lnaq1FG4WJDmV2lOAs+1wvdRG3QxoRKy8m6Eh4vMAPTrcEuA5EQt14m1HFa1kxABpyTtCLV7hwhDmpSXNz5A9KGpwm604EGKnXRpQbUTkuTG8DP2AJQBKfe+0XPk7WhOoNdPDlGgpc1nulOsVa3ND1fXRSDs+u1I37hFQmc324q6X6PMaSD3ScDyNRKunG4aPaUrtR+hGfxqtl/f06Twlaf/xTHVssBq1Zvrc4aNr6X5oX9Lp2PhbwfdWSGadtpYUcTUMGUf6mxjQlgpJ1aEMuqrX7Cy0gfahlc58kxZfPwBJuSPSHW9WDXtS95SZftpJe/D9GxovfLLLxOq++aBcGja/cTdb6su6J1FHD+l9lbQmI4vdUvelmLu6dbLy2CPDkm43o/vXeWRht0A9MTowM9Kp6aKCPMzQcmW8FBB4om3CZWOoTjEE3FiffaKy8Yi0gDt1Sth0oZNyHsnsSAquF6qiBWRjbk11R4qqAegxUJp9RbEewNBJI9t/VUuPMJTjGVwa7XIl1IK+EYA4JqWvEcJiTEybl1kYznjXTMbigVaUqWEGW7/qemhxq1RnMldm2m4tWrf0Y6t+8XdQuK2bdUSRq2WfBDme+i2HLTg0GJlua+OdlB0ZzcvsKc0qCqxuYacyUHS82VWS8KbPSlj8LAsxd4PnqoAjq/4/F34HOu0UusOa7pUTbLT67N78W8v3/vn8q00CjNKnF6iy8bey6fWXl5pH5wg+1t6fAhjFJxks5klw6HMErFSTqTPTwAwpQhF1LpTCmUIRdS6UwllCEXUulMSyhDLqTSmVo+Xt2gYNYS6KsC8nyDaMQ744td/A80MSPIJBc2ATyt3UOnumSC6TFpbzDq1IdqbaDvSYkQRiZ+DRIV/HBQCX0/KChipAnRIQp6QSmUYkMFGOZUeWrOf2NhZWPn4MOXH6esNk4TgUgiI6egpMJsr8TMwsrGDn6yOWJtBeDn40BP3K2U890GiO5mcL/wlGWH74ciuqHBDxxm7pIG5ehl1T0N4G+LCU2uagC5ts+G2xqsKUS7eMb8yoLxnfG/AseM7nxjgQUidxEOeyHjFpqXTv7BIT5v5QcHEXyTVuf244CFuYHhAAAAAAACfxOCNSJcJu69vWQC6GU6fr9/1o9MLO4kv+SYqvYGfvz/mCif50owq+1Ql/17cRQTBLMDoqSjLQhe3Lzz4bSVo7mzP1dH3WJ6WNmraQyAMHx5blzS/0jCodlrgg7dphyoWdVJQ5ivGoT0578DhhHM/4yjD58Lnlq+EV1mefMTWWxXb98yd53pnoQTK/xcvndk3c+HE6F5F8xkuKRZEi8iB27Z+BPPe0vpT7LuEq/9+aCn5N01puv5qJcU3S3+1OPp2zhNUnb3eJ7PZw1S9Y/m+3zRKOfaY8yo8zCLMiTWzIuqeQXAD22itkYkliMJVAygJzc/TJbZ+7QjUWjAYujT2Vp3y9ANKkjiRKhAOU316Vton1aZhHHwElc1kAuTkWY5sJnRFt4RFS5guagKWs2Bi3EqofX6vccTloiCRrxH+NuPnQyQvJz3k/EuFLb+ruBBKIGCLuZ2IbIxCxFaGGHr7woOHmTclCNvIG0jYj8394+t+dRWY2hUbxvZ8Yig3wxJKxhb8/fV/nHjm59V5Rg4t71iKvRzjSawClAhIiH/ZaRz8ZWfSPM8l9myIvdQkVs1bSmqU31t1rbonLrH3n3mlQB4ERRK+lZAvASEVwDjTSB4K2i8CAavAtvrma66zJ8KryQACuvtq9+3ti5cChEKOQppCj6FCIUchSwFHyICkYNIQ/gQEYgcRBrChwhBXBGlegkpleqVpVSqlrBy6drCyqV7CyuXuWdFYF/JBPM0orhced3sc/q8KGw0uyLNqlazzX/NjuFb6S7vafZG+moHv33qNfjm3Xiui7OhQy6PDsx76TUk512w/0Br/eLoFU7a05GZqtnIXOGivRVZVq2y69gmsp3bKdxt7kUOVVfpY/sUOecuhdftm8ht0d09dVSwKgwSlhBOUuEEVXUAiKrZqmpf41Le7dvOeyrBgCIIsSSRdqKOiO5fzhMDytbi+OKCUBPvVchHpCoWllgzCUlCdh1EMldEddYQraUTjewipmXVdnSIu/PU3ugjQZfCYYxIzJKZ9CSaiVmSY42Zrsm4mVukzToz3VNoT+wlfWwwMzU1HcYRGbPJzPQ0dCbOkjm2mNmaFlHbdtvxF+fXOLJ3+1pYTESEMTzdUPSf/+/uNVLsnY3GGw2ID4M1quREg8gQYVgyohoNjSGMlYwzdcHOVchFwiUjl6Ereyagqw+AOOqao67VXFdz3Xo4egwHY91epbHGDML9ceSKgcwlzDOysB2rXqOC3u3rZjoFjlFC0RK0TFiRrO5YjM5Ph/puiHBifikBr6oR2LBWERlZR4zOVZvZInbnZPdpiZ7sJT4rWECKhmKUY5JY6TGzMvMaUvNe/tmDAMxy9XX+LOWUwQirU+ugWxtp866+RiT9mPivWBczMjXqxVTmRt3edSLcZB1U8zJW0Yt3Is9ktzBrFZWhxYuD2g5KFH8G1bjX9Osw22vxn+syOYLHP6AAQ0rTgwroK9QAAgcSdIrQzXyeiuzrVNaoJAKNfirHbaun4g0rdS9Nl7LQ6LmiWdNtAnacpt3tuUdzoLsKODVnULP6mRzA1ECmTzHb2a6eZLYMcaBbOiUTDbYNVYlFw2xiWH1Eo8G3LDZ09W2JSGPq2z9+2BuNKKLcP7PPgykojakKc9LaWgmFAgFzkrbxH18yvGCCXBxAyi+Aax6c8EnvQxhMnnm8AgRRvJ3XrHi99Ly33tryllDrfd//3i7Sutb3mlX1l8oYAIDx8w9F/vhk/yxTvIN2hp/bQX7j/QzNLBX9oMnkM8rRBQvhbwl3Hq1YbmZSBnK+wxdwQ2zn33xHPNdTRBz09fF4Ll3fy+nA2cItgN80o0f0mUaG+yBDWa8M5/7NqKxZhrPJMiqZSmv/3aisW4azZhnOk0NKPjSlvAgAAAAAAAAAAACAt/Z7EEIIIScg/KJcp8nneks+xXYQzek6TE43SnKq4q7Qkuvmu/rcqKsX3SJnXF8H8Qzh3gnC4X1WTnNYtwe+S3zIZG33H1c6q8R10x3OQTWFebX9MqnpkxEDR8T63kqWZBINeXq3/SJL+0ZjPDe8TpZkAbNKJiKTZGlvNOLZ+I0s7RfyZMaq6KIPyaY05Gn8IkvrRmM8F6+TJTnAnJKFIYtkubAUTzX8xt/R9VCw3IyLsge9b8BGWV91UMuleVjfw9zBgHQtjp6D6xsMfco7jJyrz87GAu3jtl0N3feAqcPzL9ptHXodLCUMWrm0IpGdad1RQe1Fd+0OmbS+knCIR/8p0lk0EIH2rZjIjehTwh+cgEuFOkggryBIoLEDV3mLFW/Kp1QqMCupGpT1aZCDUwqz3MNc3aDL4Rt3WXQgSDh0lVdsKWXVmAWmAvK2kGKcSLf6G6Lhd0X6TN+BJdClFYnshOqOCuov9NoFWbROSThw6I8ivdtxUUF8wydyd3Pt6Y4VUs/g1kxVSV2xGGtv09e63r5IZ3KU48pKfBdmrZjIle42DLSiaTtVpLV3GDmHiXKyJmPoFAVb86m4Vs6bndaKhe/H/wu+ylVu1mbc+4fSrR/3/zW2kGt3d6mBy4wq3u7t8yvhr4YhayvTR1g3n8g9KKJPwoEL/qp2xR1vV1JBw8ZleEdO4g2sQH768hMuqo/VRw5GWdCtjRuiyitWvL0KzyvQbXgbsh7Fxt1ea21IOCSXeGAzwIp0tukoSv2WYiJ3x6NOBdsD0h5iyh/6onuYOzD4SUTdLkexFU+0b3p+CT+triE2A1qR3jd1o4Koxu04XePOBtUfVBSpyux0OkUL2zui0Y3qfFufxorm//ykdrBnfOPJW92HExPE5mF9bXDtVODKu4NosD1MFVsRo6dzDyZD2ZVSFQ7Xoo01pLHpQtYn8hGQuvmwvYc9PeHGq/uqRtoe6WP7T4anc88loxfepHu4GSLZvNMzXT5jrrkvtJDeUw9n2ul3hdM5rillQ9r1LUQDL0W+NeSq8x9FnuiYn/c/hbV/JmBTy/5C83ZX0Jtgwr5iTb3pORvivw7n8HleaYniSmCP71YLdF52Y3IU7SBkjQOjOX9ewvQ0WFCDV2yQh1i1guBYssBxLxlv6W3qrWuU+1lGjXmmB0/3lPfKM/Vz3pI8EqRl+rKeJlxyDTy5BdWY5zN7MIazxvnQfvyTtdCprABfeeHwd3d9Yvmnz/gd7JZaKYrPdBtRFj3Att2aLal3pftzVd2i8MbOJfwgjCexUQ3OXSRvo2vcj1aW23HV+aTfzPPoFO7LemK0zM4FY4XWN8aGZt4iucQUlHwlHGwcBaVTlfOEMkePkWrQyTzxcs+pnhczpxSfCNQGh6mhvpa4WHnQ0ZYzA7xKLeEtpoax+3i4QqHftnxystPuAi9NLYDvutnnI3uQB9Tp6tpZF9bR3boIBFYAXfOa+L2HhZinbM0lrm1pRC8+rp9bzhHZZFQv3kLWFe4aZqsBYRKavqg/JJfccVov6lOvQn2BdRHfPdYEHsUGjzV1PVgLeGA/uQbnqbGrKRW58BoSdoL+aoSOztXDs+3r07y6pnj4SMHgJ+iKfEdOF+uULeJdPI2sUz/I9BqUsk7hvdPl0SXzWN/on/pS8hglJY/dAqetl6E97XMt7h5rCY9CwSPZ6UOm4bGz5te1o/CmX2qQt8FCfo570/KZKc0Ekymf/5iG8LaoZ+Dk5z/R3Ten/nWyyZKPm6aVOyPvPeAl6fchPrmCVQ6nKUXKit0ecyQoie36eHOZ9vl6/ffXffJWgW9q01kJ7VycrSxqn6LIMWc8RqeWL6MnNBteZfvVhT26XnXYo5vViD26XaXYo7HVi7iimDnkHLlWnUeg3U2gDMWT19bRZcTLtAynOKVGxCbpHgxt7QIh48nOc8FeYMj54+CvcIjaVMAunCvbI6LstHmCWVhYdg1jaqyvhG2Yi9s1RVdFvMtn0kTsjiTX4/d2iotX6dsmTFhxMvnxdqWDuKcX/OFOgp7JwXgReowtPLas8ODMa+y0PODGvhdn52rSfXrmJd7HhfckBTOVONklbh6PYinUncJ9QcQ13q0w+dltuLTz1/3WzNPum74z+r7HTZdEbVqrr4wnYxblux3fMf0Yv0VL7bzAWMl9pj+KdwvLNt27NV9uh3NLSW+f8k314XY+H6xIdOW3joP76t2Ux7nbbE3E+J5gmm7I9g2YZJ+Qn0eJqOFOQ9FQPlIm5HeaWnErlwS7/QAPQFOzjquFu4xeWSLdFREE3FfQprHdDZSriM+eFO7/PLRxgoGnhsnXbf/i5xZCOYvHp0208MOm1RiVJa6dGuHBU7Bv4MGfdztxWaH3C5NFc76EQz7g7of7SMHwJPAJn85eaOfiZsVtb5J+H49LydbjiDQQ11geRtP6KWBPLQjCDlCOmmf70OwaCwdXIbZEqceuOyXFU7gv5fEis3Nhs7K4+xVg7vzKrOShC+2u4CnjNSGzGGBAZoMBETsOJJz44ZJsYIU79au+gOb6A6W3IXdHYRBuUlxGiwmYBBRBAQPiEQQCAwMHh4AQaSBI3Ad25pMn5oNfkwDlNY57/sFWegm7hBb2ZPyKzmpz7BAfILo2IctTeN9YNWIyjxGHx1jAA4dV06goeeykuGKegn3Sg893O1GtsPs5Reb6UFB44Bm/O5nAm1DZfEwtR1ILN1C6hiYwbmn6TFi+EiL54j6TwFdyA49sKB0R+1Cx7pb4sVCRspQUZKjmWsZ/tqlyBzmazYCTWo4Wpk2ZatEgSlMNo4IbgY07EV2bauG3o43Qp/EMnbVBlzYepHLknTtnUjI+ZOR8ySn4UfPg4IADZ6Og5ORBTUnFRYXZvoAa2r6QhpQPH7nM2NhpYOyLSAtzNGtU6+LX/qTlQsyTloSWjC9f3Ng56LhyI+PCjIudFx133vQ8eJLz4wcvh+2FnhuoyZ9VJytuDgYGMkZGcjoKTk6Egh4ZmbiLaOFTDC+PlPftCCm8b4FppGUeIwOPsYUHE8uoKnnAFelyF019I748lvEp9CnoeP26A/xRONGeZro0RfcZdx+8Eg61+06KX566LY/UinveFuS2XcvWrp2v7W//d9+GywYTr/E9JBSgpmGtswXH0udosKga9tMSCZZNgJS6dLv/d196vb2S0lzmVlq4ylrxtKN3/2R4TbK7+2g2Dwi383noW+gmOeeXzTe1wF3ig8j17jrEe34M2iHQ7v1t33I3UNzTZd7Ljbj1MCjV41Pc9fflyeP3wefv6QZv/ly+h9I6ntc3TBT4NMxtJ2ng337v5PKu4mry6DTS7XFuHnnPizyfxockD4YLk5SGO+ausJPcJy2o3mpsd5m6Dc+ll9AgGAf1GS1cQbTFEu2fPjIs/qDvZFt8RWP6IiMJF5h9Abi2t8IvwdwkxmiJUMQklU5iXnYws3KP8z5FF/kU7keM6NDdTmIrJH6cCctyfY9uFTc8/gxuo7G8n/BdyXCPKwWPTdlcD646PK70n0ukDnNe3kzXfv8S+9boNTbbvihOVGfiQPHj4/zboT7XXdnvdsphBdQVR7dF593mTvButjBu0Pc8hNrg7o+T/RhEH39PZG6EE/kAvLavosPQF87Bl8yaCzzWAh6FhMc6ux5k8IBax4/pafmfW7Ymdbv5SJ+KdCrCqTsvj9mbdL2yNqI30I9rH5qUHoee95628rbedx7P4t+2hqDf8xTG07CRtD0WWD1pMdEPfD6G2FfUPp/ZypbS2yD10Rtxqvi16LG6hxEtepy86U8LWWoNvftkHCeRn/QfmciF+YT93vva42wcUAdbjP+0PjVMKim4wzh85i76ujYoJ/44wf3SClve3hVkbyPhx+ubOG7c+f7PNEmBX6NeyzFgfsODfC3gpxoQMj4admhhLYg4YE0yNmUp3Eyg4qqgJvitv3K6BaNO5ELzjR0YvAVPM4vRVTboSEw6acgheJ9hnxYcc1KWEo8pKKtNBMsnEGZpWloL58n05J4yb8RtcA8zOHYiMycLj5L2uO0yBM6SiuWZPnoyf7hmr9It5AflgpOho8KHgXUV07rsngT1giAUDKUFzQk4jtqeImur025deFBX4f7lS47CJdbE96gV6lkuzb+xuIRJt/Jl1Rvz8qGscPsXKrw9FGC1jbt2A7N1y6yb3P9s+Sns77+v77zg7rEB1OURvRl6tHUni7qDeO3P8Xm7Jj+r1xzaz1sfgA7PzuZrnYUcxxlj9mPFHh9bGjA17cFh1mlC0J6OQ89HG2DyZyKeT9vc3s+m5/k0a3wA/ObRj27z6lvMeQCyc9EiFuwbkflwjltL1H3j6iw/l6nmv7QUM5/TckPE3Xf7EW2MM7vGAMNSFLldkbCwEST1S0tfMRO9hxgeEX3DBuCF7Ir3ABT4aN28zgp2pe+KTf16kFUiHeruefuweO/DlUO/6LdqUpYUPhA6PG5QySregMFF7XzoXN/C0RqDET+qfljV9U+JH0A0Z4iu+bliVmss8VZH8zQaaTSl0fqUby3QLzUW9jhyxrkNVo86w6zrTm7YX9q0+KaFzAn97p5FlGXd2Ygq592UlGKPeO9KkPsayGC27A9ozuy8FsEg6ulGVX9FMHsa6JNjse+X/wKRy+nH30JiHY3IuhqD8jz0P320TN0uQd07GEcsysSv477pC+rNkIK3QgreDil4H0jB+2EK3gWPWnyY2Xl0Q3R0IFe+FDeJ1o+ZudenfTjI8ex3578GMAWrc2eHLvFN6i1c2JUdnNjJ643v5jasnBfPJVllsuL0WPnGyh4rB6wcsXJilXMSbWxiSxaP/vKmdnpkxeKerR6nOdLrDXkfR/n8aKsi9KkJ/cMKL1b4sMLECgsrAlYRpqYGt8eSvMeSdPGXvFXhDVThjXTgTShyUXJ+mXPH6gdWp1idYXWO1QWrLpOL/9WS90fDdLKxXBkg6sk7VCEKqG8+9NkutSJ4IAluCWpcihq3ooZX1AiKGlFHjaQJ9aicNJILg5SvQ9+YULd4+kuuIqHcbZ0LqTJwONmMrtt3kyp2kPr+tDgdNusyEAz+mpuK5RgVoWmdBhFfKsW3SvGjUvxbKXxWhvYBvKxOMVmk41x0ZVJkma6vffAnZV1fRx1fqgOcdZGPuZLVTdbBm5n52p3EfGl+9xQ1QQ5Cfth+ZMpnsCv0QApDLSDJqAsxj5UP+od1IDJjNSQfwR60AUZFBCQYvB/m8bNBf2PGoxNyQ/JRrUEbYFRMQIIBvWEe+SL0MDQj85uDXfEoMk3UWEDyoTjSZtR/0ANojUzfDnbF4sdUceUCaBiC2BUMIPSQBCOzz4NdIfoxLdSbgASjE8Q8HErooXJEJvMHu4KUZFqopYAE47PEPERC6IGRReYmCLsCF2SqqA8BycdsiOJBKSKiVWaD9xm9K8lH0Ery3Y/zeb6cijNoEa4rFhN0O2Vr8mBaqTn3jPP6HY76kGO9jsNrZYqhdj7PCOe03DG4L+7OoZy/GOUg0Hs/RnkI/N7AKAgv2NHdouDKxHuLwTB4Wluk9hqRWg/tcfJsFQVsd7yM4oDjvGeUg2DweYnP0hYs3pXfCNjXTPx9aIN73cTHF15tjqeYI2EKPr4Cnw1P4jlUnlM48xV4ywEuflPUvytNGAMmRi3Y+j/TeSNu86kniFPUhArAPSkWH9/87pniA2DinitAEDPuBYsLcX5sKWJlS6UObG5aSc7rq1WJzLTVTA5agJ7fpuQ/WaaBhMLTjzCUXr6lelCq8LSOD/EpNZX3oisMsYL9rVEPTxUG/fHZetJjVEXecqywFdVSfqCq8ETViXtomC09ib4MSr4v/YnegLmHSv5T6iHxuN6SXRpJzrPMfMYt5E1a74YBef6lr8VN6wS1Yb7vC9/k9JWbD9zk2NLCO0VPKjB9SU7YCWrDsu6ZzNkF0Rt3WyhJWPPE85tyYHiOmTDIOX4f1Lfomu6FmFIDTsKe51ByxNxOlEAwcSbMkIqBR0HCUiJZRU8VMWLpn25ha/odef2mp0v7yZgeqbM1NN3E6MkqRipzs5ygzsQcypYcqxLdPnPzGT0KJqxBUb2iJtsYOVfR6Z1pykMVz1twmNIjc8KSf2uKD0nDJGKGIlvuDIdPeKlxB87NZ9xC3oU1Q5y/2UemL8VNeYL6xCSHe8G3ie+QGNNNG1takK3o+UpGbA2RrY2rTeQFMUCa0qPgbA3MmTJqtpWRqxw6szNLyEXxCagpt1CXtGbx32/Cl+mLiUftMxf4VtIxLc7B3HxGjzTY0tOzzJC0LiNWxmTqzphzai7J7Ss3n9HDkMIaFtsqeu6Z6Stz/Jqg/sr3s7JVaHFym8vMZ9xCPoQ1g4XfvyPpxaMX2dLYlzRDx3s1w44dNLA1+GVo9Bea6Yu7IYSnZYcPvRaZZeq/5NGc59Dc7g6DiKeDOE23t713kje3Jm0nsHjtfiFIgaPcCVzyAgbt2N/BENZj86x7AeF3O5530u0K8miro932XRrTI2q29EREMyiD0fRF3U7p7a2mn8xu9amN2xTW9NBuYWlxsKKnWBrxXQEy3zivRFUQX4Cb0qNKbOmJnmZQhqgRC32EvY34z+DK0HP2QDV1Z6Y1PZSXrd5zdPhqwuAbD9c9Tc8zDzM6OjthzA1ktoSLt/h/GwqeOklM5kvDDd/1sHbwtS+PH9HJBFHO7Ryy3F0GoYV0yw80KMGReusFaNv+h3sOtkZkJZtBmc1G7JMg80+95LAqHuQ5hzLzGT0yxpaey2wGZVobsZuCbH5yV0NyI6k7QGdMj9MQlhZNKXpmsRGzfzy3n3TXM9NyCGKAMqWHCtjSM4/NkIRlIx43yWrjVFM7RW6FmfmMHkEISwuQFD3d2oh5iM7v7BJLQW3ojemRcWENi30UPVfciHURnd65vwgrqz3mJmN6uAtb2gPzT1vl+3R5O0f9qzifNx8I3cF1X54g6GRs1F3O7RzuunsNhP1n3walvAho6tgLQCmm9whSWErwqAxJAzhiZUe2NS4q1amIz2BMuYVXSWtWxqskgyN2bJHZ2XDPEj1p4RscttxC6tKat64q0d5wd8PxLHYH7+dS2IeqZwA56NvcapCk9WsOALefVY1F+RK46M+VAb9i+hrc0pqVySoB4oiNUjJ14V1DNji1OOty8xk9qktYSoSwaGkaR+7/Izj4j4XMYCRletxZcvMZPbKVLT0f4wzI4zhyQ5TMzEZsJfUpyR0oN5/Rw2XZGprDcAZlQBzxzWky1niHpQhr5x3KxvTwaLaGpkicAekVpy8sHm0cNb36KkS6OIcz8+m2iEVYj8xQsgmh/jPx1HL31IaHPPbV4XaQmU/vUWW29LSQMySf5Mg1NgH9vKRxSM41teczOmt6FAdbepbIGZRdcvp9PL2PZec3+xauXWI0pkPBlhbhLHpCyhFNRHfufKVJevgK3JQfBxZ0qzXGnH49xuGtP5unybdmzVIQPbCoW/LeUx4EA0+MYaSFBAN3CQnKRPDgD/dwp0UEDx4SEpQnwYsXHuFBiwleTBISlD+CDzOmMNESgg9PCQnKi2DijWd40m57zzO8JNawPl2kjzAM7BTH23Pt78Ph4T74vtqwhfWm4RkMnGa4SjuuLCrgSFtKyrkh321kcx/C+rtwQauU7tQXkw+U8zaS7RuXnAs6IzXEEyCeTu5IZrsLyhkJkFp9jlgfwtCs7QFGt05PFMRzqF/ED4SxWTsC0vT+kV4w7xm/dYWa99U8aEhsj6DmyfnePrTftp6/p5WeZx+m/7BUNU/ojUxCbNtiG/zIFZuag9FB4hZ7t/DAgN/QNOloLhYkUAgoPHmSsuWCmvEACbVJavPMRW4QsKjmSUCiqdWmRMZJSyYtL4xWElPoTcHTdu4ltzBRVjNAkLjN4m3mGvgNTUxH03CQGEodao8m2LvhlJDVaCmzWw8UxHMYJqlBjWB8H+FszZeicAEtJTjxTHI6sTIokeCXXPcMYMVwi9MlrNE+rk6ARQWWIdN1kGoG4mlLgqHCUJwnAvcpTdW9gXBMDI9rUtbntbkRkNBe0V60N7mu9AejH4kH7z3YI0U6fNXRXAtI3M292+Z3U95tAcsT7DoZG1XLuZ3D3RN3EPpnZ9DfP8HB2KinnL4OLXvzOB2TiJMPwxhVdqQmxGmEqK4gNW9PI0SVMQDrr1rTHdWAVEklNkvJWNNBVrEAWW14XmlMj7iwZeAG7ORtUYGFyVpBEM0ovJJJPMx4mEeGtPhxPpjsJNAL6D35kLK9+0sjSAjtCT3XSPjkCT1ZCK3ulWwp+aVqUGKqEs8HyfhsXGlJHjV1ftCaHurGlrFXtJtwktrskcDrIbYJVaMQzJ7nUI/Eh1u0m2iafm9138SCaFH4FdN7xJ0tC29pJ4dFBZYimxTxowKcpjxDULcF5b1dYUNyLZeWCyp9kdqPH/PHj/juzY6FJBuqZgAHmN7O4SdiChzxPZ6dQH8yHDOAI2x7hxdbSha7Gpb/rvoKb6emzYqmB8lvu6gu3mczMpDFZV7u6AcfUmNRS3VFIKHruq6ijaRasp7qD4CE8Irwgy9pbeB2MNpJZG1mPefITb5bWFPfINGW1pbHNKmq93Iw+ZJgfo95bwYS7l5kfrKT0I+iH9EWUi/jWv1hkFC3om7PRFIP4tQ8KUiotq+aZwrpBnNtngKExZwYiiVwREjNRkWerWjy3fKiIHqQoFvy3lNmgudqOfnbWgCCBznykFM+BOtagwuAFMOHagZp9C8Rl+fVN/jaHR856S6kazl8ONIgDXGnCSlBvypO+gLIpfDhMpCGACHbe8zDWU6aAaUYbjL7PdAvizkfVHBl37g4/q3wjD81SxJ5djF3odsJ3hTkE26fdnNxWhJvE5fq5sBEhyC+VIkDkcVkP/Y7H+hTYOxXCZ+AmNJDHdIaEpanelJ1E8IyEsXoqa7wtMR4hx7oUugROVsWLwJQXQpEVgWvckdd2xjDYu5Uz01vYh6ji4d7uQq5KuycQDk8h8Z/OXfHb/DmW8K2FR2BtlqSTZN+rEzm9KgWtgxeIOBO6ZmQs365yhOE9Jr3HF0NSPMmDhexYWOsoW5OAWPdd/nK5t+EmBRdFW3tivm8XMKtO2v3FwrwbEgq1KYLqQzlXSGloUwWcrd2z4fcrd3cQ+paLYqQZ61WG2SehyEY4xJa3KCsGCee4ZKx2XB85UVxfa3/TpY1PU4HW2avaODEZFHBV0GmyMoZ8MssBKIjdNWNQJSErkop2wPva+7MAaIfbXnfUY3QNisDzT3NIvkKVzG3DfykNcOvKlfJ9RsumpyvZoLGJQsOHRdslDK+beFBwnq0NmxcqwfnSE5Qn/iW4X6Iq3adVYzp4fbCGnpk7wOz0xzPMjHPJY3gSa9lMiEXc9viVIQ1/lUjqqNAfAlLlTvqcGYoqXxuWBKgE89NyPJsPEBJp0TxDbgtPTIQlhbcqXouoRMzdbSvme4K2wfORlG316s1PYzIlsUra4B7S8jbiOYeMp2dFs+GPEX3VNBEG15VI3ze09RzvaJGyL1w93TIrXA3G0W8yUxa81D/ZmU69rcgnM3ujGZ6p6gZIOrJ9uYWyZYSXqpacqkT/8WlI7Gmquu6T6q1/e17LIZbaElYM/ZxSXh1YtcR2fzkSw5xhw6+wmNKj2IWlhYtqnrOrZPuBOme17YITBUU8anKHIi9ul6dCERcXa+SgVsYWVhzdlUlBjuxeJG1ph/MpIOQzl9nY3pEx5bFS33AezXkZThT0YOyGvYChqvDQmexVVGDCUJGI3o9ZDSiaUNaz3oj5PCs2Si6Tauin+OuKo/eiWcYZGvTtuVRKORywjSlRzzZGvEiBU9J9DUTqvsCE1VBfILLlB5eK61BIZCq56g7sVODzM0G3suLqLrabePHmh51Z0tPaHaDMqFdX1VGm12XA5PXS9Yfcl9GHWa2BiVvu0G5307sTCSDu+KxZ7ZDGS+G4G3pIZ/CGhbGqHrGsesrQzRv2lyZw6Hx2i5moCsdXV1H3kKnzoAGc4aMhdGjkLEwmk/I7+xv8WxI4Hbduntgc2LuMfTVM/W3OTCHfM5++PR53K67ejkco/t2NXnIV3i9FtIJr6n6ZYvz/ZkybRijJ7o7uXQR9C/854xCok8RE3ZbepCTbkknX8prtxF4tZh8tywUxHOQDFnAHNRpur3n2yalb2vxvSeYqFCFinAc4UXXrrgADnsy0EhL4Jg4EWwY0ISGlhNsuEpIUBIBxR+u4UqrCChuEhKUgkDgjVu4gbUXwH7fKDCEYedjCxct4mPMGO9X/Xwu7+XB5Wz3Fcubl3rglY931raPenIpDL6/33EPRS1+gJgzMzTLBddkP7bJWV4b6SkZLuY+OQzLt7op+9FNzsJ6OOuSoWHuk0OwXHBT9oOYnOW1kYuSYWHuk+OtfKc3rh/K5KyriKaU/HUzPjncyueOuX7cks+b7fIqL14/USdHWPlWb10/ZslZWBVpLhn15T45sMrZjdcPRvKxngJCLXZAlyc5UMqH7rx+/JHPHykvMcoOLNMmB0m54Ntrhx45i+ui6YWDt9zn8+RDGC9XEfT+esUW+fxUQPF0QmyWT1ftC/hmvPxeRf8wBw85XwrIZYmwK9fJgU0uOPX6wUHO8vooY8lgK/fJcUw+d/r1Y3ic9RQQWskYKffJ8UU+d171I26c9RTgCyXjmNwnRwP53JnVj4dx1lNAGCWDjdwnx+r43CHTD3lx1lNAeRUhVMinq+4FnYr8Df0wF2dhPdR78UOEnJmxOL7V/9APcHEW1kPRih8f5MyMwvGNHol+iIuzrB5aUzIuyH1yFI7PHRX9GBRnPQVkVNwIH0/O42M8HfD+YPyJs6gCrrY48To+f8KywLOgL94XHsgeEM/Ugg4sh02OgHHBJU+NLXFWVkRDix+X48yMgHHBPc+PInGW10ZZih+V48wMeHH23rvD1aJGfL5AnmkEHViSTY5o8a1OfH6giLOwGs5L8aNsPDmPZvGffkHk/XKID3EW1kMyJSNs3CcHsfjQyc+PDfH5PHaJVXZghT45gMXn/n5+HIjPHyivZvoyqMZ9csiKszvg/U4X5+Gsp4C0lAiVcZ0cg+JDr0A/tMPni+Mlq7IDC7LJ8Scu+Af6IRzO8gooerFjYny+h3ThH/xTJTe4VLyGz/EOnAQ95Q6fHEviG38UrB+o4SyrhTYWP7rFmRlL4oKPoB+J4SyvjbAVP77FmRk04oLToB+q4Syvj3wpeXgJPjmqxOdOhX54hrOeAmpVhKAWn67HluPEw7vQj8vw33QXVF0Hls8mh474TmdDPyrDWVcRF1DCmVgnR474zPvQD8rweYPxM5cCCmPAKoVdGnhH41vGiMdewMNbfV7ZJ932HXzl8CE9kIa404SVoMEBT/CQXvs3eAUECBtBBwpv8JLe+3f4BAQIO8EABl/wkfr9B0wBAbpxhF6AwwwmhFIm/pA9ZC9A9xzhi1eJSV8AsRRuobvfA/NuMZ9+QS++TYYjPvjE8W5rVxvlbxdjewTT91jfDLeHlw+3f7lfm2PGuMItiu5Q5hTPz2fkTXwAqYBHm6NsXOFeAdquz8lpPXxGD2jYmt6zzbFqXOGWxfBIyzvPLnf6LAdfqg+npKFjBavQl1f6Tu9q5rm5eXhK/umnnIdSph0Sgj3PwbyJXtc2JybjKlsuodbH7Uf6TbC4AuwZM76vyi+qYgGlK388YChZ7JDUykfQgvjwrOH2z/IBdHQaV7hFcRnK8orbN1FvMgDRAFZB8xdeDtMEZRYa+lYFLvEXnpQ1HWleaQwwpdCD+diycQJ0Ao0r3OJ4WHnaC2vZs3vFIIyxLoGOXuMKtwQ6KSiv3DwU9cdAmNEmKmX6JceqBOWVZ6c3EKzrVnJjHZQVWfuzFd13+MOzr1pnvzkhlMKHL+MiWDlUOpaMq1w200992lu8s2f3wEEYY/0rHUnjKjcsYj6CGKBKYVfcIIzR7p6Vkt5AKaCgvLx3+vwDKBrCSWnXEfMVxICrFHYdQRiz3nTJt63c346en2QEWXn2F/WRwQBpyvabijDGupo6dhpXuAXQLUHaW0O0pwe2sTW9j6njs3GFWxbjlJZXU+dXfSMcZHyJk7JFn7uSamV5lej02azmzK2d4SlF1C850ymsW7dLOew6gTDGOpw6uo2rXJXHfAXxCaAUegiOrYm9TZ3othVuQbygLOfkaviM3QCDMMb6nDrGjCvcErieglrpSl0OPSjL1kTHW30Gz7kKfnnB4uXeH3ErMSfhNl891VdPyA6drwA9KHnV1elLJcBoENUyHSmcoLzy6vQO8b04LU/Jun7JG5a0bl4u5fChAdy+AZdTRz/jCrco2k1ZK575lEMPuLI1vdPp7djoj3DFtEBaN1uUQw9qZcvK49Tx27jCvQbcX4F5zeUQqy+mAKNBnJQufelMsQvKLFqnL5To4juelL060kBpDFhL4ddfPWzYeJ06Zo0r3CtA5/XlVdInVt+NDFu0DSclpSPFEpRZzJ2+3wbP2CdPKnYdKZwwBuyl8KFyZKvcLbZSrs9fL+DWtxI+OrjNQKcaCFl1wFvB+iGzzNB342OOlnlCvuiK7gV3kFmLs742Qxfb8aQi6UhxCWMALYUezGRrcj9UJ4RxhVsSj6xM+6F/9jwHs6IvV1QnpHGVbZakKGMAKYVdvIZ3NFoPhnTL4Z3BOmjS7xXiTpvzAriFIUBoCTh4uIOb1O7PwQsI0K1HGNt1YdLvFQJ2ZEAQhgChI9ghQQgCqdt/hyggQOgJDigQg0jq9z8gCQgQbgT0ujbp9woJe24kf/wIo4+nc+kgu/Fz9KfaP97XNELe2noeFflOo/8vfEYPg7BlcBjBq2C3uyxsYdK7tpV4Q9j3ERWxpSUD40GZw7ivbxUiuH3CFidLLysJ8fazm+Ow5WqEF64y6O23CmkVpnY/b1FvQ2QR2RHrUvrdjmDoCRkUe1UMNPRmFTp7ycKWpe2Tljnps95q6GI7cNsRlv2vnAEK5BYEUwq3cHNh/V24bKucfiwWT0JxcMJL4bdkXTqAYuihFLYMjrx3FZicZmELE9PaMttBfR5DFU3xVQDIAluGJpS0kgUSh+09TUkPyYNySbLYvqDb/wRwjZJ6l6f+sk57elSRLauPQCtifQgg8Ak3fXwitft7N5i0xjuuLgp0ONLqT6LSUEmZnXKl1ZdPNNEMFwW6ir5Mxv1J4laivCkS2mTWV5Ubjy4d4eHpL6WiTUGXQo/TzpbdG2JOWf1q9bYEY6mw3bY9rCmAZ8TzCI7jVRzB9TRCUmcoyuEWLi2s0QcCvIrJeNji8rxE0nu1IfU5CUO0wEUBjqJ3aYykbnlQDj08gK3+kzbENc7qy3M7/B3l2GfihMvGhZbW+mlbc4vTLazxHw9XxGe1TeDTPJLabd4ph2fIphxsOuDeF7F53sIWJie1Zd7xWd9yxxA/8MKVFn0TPvGlLa+3/rf63FbT8dY6Yh2wFFheKsoyn/2sr9lxi7bxwpUyfQWfxkvqVnMthx4Xwdbkx6YLuDIEw0Iu4KxQMIx08YaUV1n7xzyyS0rsfhytPk/VhMogFF8FzKHAliZ/i8t8UOpbXNjMeOEqi958q1iQwptuYW8XQcB8ffaCZRDeBCnuK4kBoRR6xJUti4/bK2LcwN8/ZLZOW+aQPHP175/hjDjJIDwJRCKrjQFPKfSIgS2LD+Yr4j63EcREQRuDNE/xCIpLuuWIeSPGh1GC90U0he3h82ZPRq3CeNUrNi+gl66+mMb1knjphM+cDEwRkzssg/AgSImKNgaUUihcdQ3LhauseuuBNjwvDv4s2h5pHNEGF4XpKWqXB5KkzjCUQ4/4Y2tohnoeluGexWIar++gbhrftdgmrQ3bHdb0kC1bdkfh+yKs6y5uFV9QmFc76m1Y6zBXh3wVQKXAXgXNk8LMLlL/fgCGaAGvAlQqsGXIBUmZd3rWt29xj7EnRuchKdZZLBbx4Hquae4vcBPZHt+fs+YWXietWRmtsshzX41jY4J6R/hd90a6O+9z84FDxdbURx4cUa++Dn9C3qCktWmbrByeoxoJxkeXBX10v3e8Hwontxqp2z+6mbE1KIkpD0uCymJDMuKx9tr1yR0uadx+8NjSg/h0Sx5NL+Gv2ejBruaT75YJcwogIQVUgzK+3/u7M6mZAci+Z6BEGchjQt8NBkOLMpSw24OBWloCx4RvNxIMN9ShBlZM70FavZNHEkyJux3B8EQbWpDFdB6k1zt57yk5AceMPvRgiunOMMtf674TeIba3zsvpPG/W3vjsZsKhg596GF/o9wJDzdla9L3hns3xpsjPqXUxOgUkXr0ftpnPJz9e5v1jmjYIanR3CLSL6S+zpXuYntEV0iRn19VA3W9nmf0e3ON+Nbrq0wr4qqt3hkRaKuJ+uWN4uvEz9X9a0C1eX4XcimTZFBy4NJsPuMBimbt9QPEOtDgWSqaSZuah+PZ83NzCbfsrN09kcct71I2IhRK84woDen9IgpDmjRisIJ3RyRWMDdi2VJ4DEio5wMy8blsJoLQy9zng5nq0MRXOIzpYXC2dJfdGTj7wt1N5PT+ZKNBTMlU396JbMSoxavjX8TkRRNFtIXW6xF5oTVFxMu8Ks3FekSlXvg9v84G0joqioi0kKoyIiyEnogoC6GZIsaviz+19hGwPEdF/4imRciD3WJ+Zi5xyp21+5uJ9TDiKMzmxg7oa9i71+7A902yRhBXQZ9aInrDeyaiM7y5RQz1QfQRQ31QZ0RSSLw5oiskZo1IK2nld7EU8SulKP+NriW00PW7v+1TT0VshcEcEaUivRrRKdJMER/v8XhE6D0mjZgqk/dE9JXJdBGtYb0S8TSsKSN+yufd0ehF0Uy7EHEzNq9F9MZmmojGM16PWDxj1oilsng2IlQW84t4GIf3RszGYbqI2tPiGjF7WqXsGO++/72FrFLOerevpwzviwedZx8xBzHM5jOeQjbNej6XyXH+bYtG9J4xfUTgAc+wVfV5wPzYgW6t2/NnQyWmiKW+qZAds63D7m/q1MOIvnAzR8S3/hVrxKf+VUn/SM/za08nT7FHbLWnekcs9WWeSW91NaIUiskidqF7NaIVuikRox0IzZIOWYRns9GCrmaT75YP5hQZDhExwBrc49ve751JKQbQvjEUKAJxTGi7gaBrl3YBWzHtHOSMczA7eKepvfGdSXneelpKgHGR/xOOiUCwX5vaBa0g2NHJJlEyAnbt1S5A2//yixCR4x3e/4TiQk53E0FX261c5b4p/9eDJ/rj2jyB31DOfw0STPOw6+9t/mj6Fo1+tEKsiXDn0R7C0yL5hj//UVpJKHGMyE2wnz4oSO8qeBdhkpPBXrX9ONxY91rLh7jgJIpanemhg/Ya6EA3Ob8xk0zKcwNbeQ7blnmMRyD9jkH6xMZbX8uf2XfzyVBxhXQ06b8GKNiu6VP/DIUni1e9WrvUtHaSrnJUt8xTQZnJPXD3XM2GXmdK5ylcK/t/F7TiIQDdE8hQ9aERzZ4MzGY80GDgbb/ro7bOo63z1EUEJJnJ5B4IiCtG8QQeXknYpw7RkwY8dswwtOCc+yawH89h/zIde/Qt4PL8sjycE8wRYq1N1XyCAni++PWbar9KEajrlxMkd5kzoXTlWE0Q93FdyosvB448lms/msPuFDgTJjUtaUCxFus+FKtvaK6cu+G5z2FzmhElWtZy2KzlrIATCUOavIC3AduD4cIcPFugcoJDPQfp+pRGdgO59FIscTfgDCMuJCxBsZrhTIkWglRxZY/3D5NZdvjOAF0h9bMl7fQorQgLAKoe2wFLiEJRS6XnW1oRFfpTva7bbkKxeKXSN6UVcUE/NamejrsZ7WUqlZ7wVQTMomCCWpUifgSWFqXx1IR652lHEdsqba9WZ4Irg/JiOSRJQim4w80CS2AlURRrsb79rFKH5L1h4dGnCMpbI8o5wP0n3oMxXBvaiqR+wBk+3HYilJTpam0I6Jif/qS4nDVXTnpt+pH3EN3Qzsezpp/W4yJ85N0+m44J5ZS/uXlPo9qtBoY0PJm8sJ4g/ajgDpsFPpCVdEOxFush4NB7by2LjmfeM8Q+Gund+eLylsi5gBPt7YekuSSjLGO+/dp71Vsecknm54AIkU9Nse84t4QAjXY2n60+fVKGom71k+pmCUGL9Cu7mVlx2a68WPKGUm+COzQLconVLwCribVYD8FrffPWsugyz7Efovg1IM5sjfObkp352wf78RzuVjoO+Tjy1YrU96jdkYlljhBDaCr4kwBmuB5p0wvZ70nnlOGUu9/jhOW9zKxFGucueFbug0d6rxXfQScr5P6yWQOaW/SKf66HGo9y4B4D4/soMwWtbmj0XFO0wgqcxFhkW1v8ufynPH3NMaPPmiJY9Ca7GqT2N5h6p1orR781RYy74IDwHuKuqV30W1MsuWsOHK9Brpp5Rr81RY+74kBw773XJzz6rSli3DkHiGXwUvm96LemSHI3wcXBGS6eNOD3HNKdeahHjhYb5rvC2ndWlxMDDm7Y3++UtlTmI8lWSHmjXeaIP4tBD/tIvkiTOeLPG3CMZEZ5zBF/5sB3JCu4bI74MwF8hVQQ0jtH+3mHrKaRwIjCOeLPFAgjQVH8c8SfGRBHgiPo52g/H5DEmDC93lvLI/JzDWlD9PkFwDRg4osffscEfkA4AHwSTFUw7RCAEhxlOSEwsEMACQdCQGRwhwAWDgwRiaHl8iNQjMCBIyFj2HL5KRmMwEEgQ87w5fJj/YwQXHo2pGE4rbvO91xwR9z6Pq2r0aAZfJaMhRVXb3uu+EEtwiHACY5xOwhe4RDBgWf8DoJPOOw3rvSVnVb8JxBPZnqdLoLxH2qefppfAJ0RX4+9obmA+a7+DXjFAhFDxUf9fuNtmiwqWlT8ktO3Apb2ku7owSAkAaW8FWv9wHi4b2xL+Hps/AFG8dSePI2RS/pOLsE8IV+NwmF3P6V5WyX24cu8mdUkOpaqnb3R4zCu+rXjL9xyw2qqCEBr4OKx/hHaYjH5iqk+WZESk/marDjGf3QuHNVUEcCBPqvAJABGpHWIi+JoP4eV3l3/yVPr0o6jBCS64JWbpwKMkZ8gpn1yIKEJJDo6Nk/opZFb+aD0AHwIdA6C6AW1f1EB0wd+A4HQhaQDhfZTCvUkawcD80BhUkxLtcok4qIlEi1ovnbFqeCbukID+gC+RqJYRcRHtLQAv1IV+a6vcvySCxDehiTxqySU0/mn1BvFvTaXVXB11RKFvJ2iXanRpHykrlbGL9luBo/YFkRDO5ttDJagbU3isC3GfP2yVpj1d+qhlhVx1pYOUJoi3qLs+WV4pDt7cu28BXSLD+k48OSSp91AO5hKWJJ2w6mJyeak5kzfao0sxxQ23TszC/NKWsxSsO10x36fvouFzXW2gEvs3xI7o5RL6swyHlm9JrDbK7tH8yD/rYDqeZor01PhfwTiLJga4VE3Ye5RYXubH/wn+6P3pf2rAJL4HyUaFVLP8Q98sWrLUa7NhR+S818l1/44ibnE2U5uzDRe2L4xgbmNOeafnuyiHN+915uP9QnsdI3wiscOxHUja693awuDzbqDUlDc2t51XfK7mWZXhDukYzXl4+plP+v1UQn96fwSOUiGRXxFLi45f5FLE5WyxP4ylyYkSfx1LgvJ6aS8Y1mIJOMdS+wRdm6+/h8521cbGN2O/bqq7XCV+ibU36nH2T45kMLXf2DVe++8czFOzb4VIsgJWsk4iBtyFxxvnNUYC/OFm7sYSvyEZHgsqZ+UDo/CuLF64X/d3HB6S1F0k/BQdBgcfQJXP/rfe6Nqk7klT0s2Zqp/ys8oj/ZmVahpyvlFnKn5BqLJXOCZ/K9QaBmxE0ybF8wrW9o+S6ZHM9lbGlsPbL1o5JHlbh7HR16tkR82K7RLsLqs0g3pictWOnC2041kJx00u9ONNTj8vqvZ0JficvluRfOYEGXdO+6N78irv+R7WhZdWEswiGon2x2dOsuqbBI9SzjxoFFY+WL+3YQ1bJvekJgmeEedAL7o6yZiN/W8PmdJT8iEN9lobZpdH9uMjG5IFsotfv4gfqIhNOT8XTgHRLgQpdNEeVBlp4XxwSoTOW8x0MxXe4eq9+l5addyMG93mUI7DcQJuRGOG2eTU8O84WYmZghfxM1J/QvpcLZk/qWs7YqOe3OTyWX9Rz/d4elV2sDNDtsQMB/YYlF+0rPDrLccO8cyRs5/hVtiZB4qP6qxIv8JqmMMhAexaYwP1uDyn2/uq5y4F77h0+vBIPYrrXvDatyPoNO0WVBinptM5vM3fnwHS9tlCt1ogl4gGALmgS0a5YNmr0EcP7mzQvWGqv136UXrSweqqg6miyIp/ObmL9N7TTGl4IjayawNLHdcgUV5o1OriFUDGCdMtqQHYxWDl+1jVYfFns4mXIaHl3aqQo6/M0ce28nyHEjuRAGmF+KGnAXHG2c16YH5wlaXXolfkAykSg/KiVopvRg3Vi8sCJwbTi6PPvbXcmeKUCEhNAXRV0AVRARPi1FyfheuBhMh9lviAWyJ30HmyUapwlJio2QKy0oINXie/5T63NvB9d57FZ7nUT0RTr1tCQx3jXwmWn7HJt0PjAdz1AXLQ+km+pGfHvtDj9GUfbFyLjPSYaMfEn+XZFjNghoCdNoQN1Q7ZE2DDcIHcbUFNQ7w6Yr8A9HOU2RdgwThQly54FE+cyyMTb+uDZzumfnoy+/Hq6n3vwNnW865KAhc7LAFyolmyyCOG2cRjDc2653SihslZn7BVvyL/c77IJrOytv14DPx0jsu38x//Dmtztv5wOMOJxcYN5Ydo0HeoMXAfGGLS3qpgevSRyXz3Ysbe+QPdz/67/XjzeS0/8iUsGzKXaAVSGr4/j8vZM8ywAokTLnAOKgCieCqyPmrcNk0FuaCa7gPCA9i0Sgf1GIxfrIOCKajxuJiAPsvb9nhD3qf/0cEHEouaZ+Sr/41HJna+/6vLjW7/+Nec/jOIrdL6YYeBk7eLDe5sjei/e/U+7znZEtBW6qg0sFx4pRKG+aGHQTljSonHYwvNl2tWXLySXZrKWFTtsldpktuT+0ie98mPnI0fjWb9I/w8L711oQGHbxvfKcPQN8Nm0kW7t99P3MmuupJMQt6r0R+t6gDDxTCF8HNYv6InuOhDqjjODdZWQxvXOw0dHaavPcFhi0jLMMQN+QiON445RiC+cJNXKwk/oZkGF1Sf1M6jBbGjcWG8Y9zk5XNFU1Fbc3ZZbKgBPZs6cW6EWlDgX0tB7E6mUICp3Ydpq+QwNGuYykkcFJ78ryQwJldZ3OqkMC5nsVM1Fxabq1dXHDrXV5w13KFuQ+AUu8DSldnkP69B+KzTJEJ3N62g5Fo+X2ps+FgVTO8/UFkPVe/2f+7/shGYNXFNm4GwGkgbkgdHG8cmVPDfGFySPFCkpaAxiPzkvoH167VJZl/cC0lC935zsnN/t1Bv9c6cfLgH/W6cj7xAZtYLJifeBgFqb8KdUGMC4s1pSrnJpNF9+zbZ7E0LLIwsLp1DV8qT0Y9vRBfaM3FzDg5PyG3CyttYj8pHjYl8dOSXRhBeaN1JncwvlgTx3bL+QvNrqTkjefPQ+4rCP0q4RYR7CSoqSISKLWV42UQx4NrpJMI84GdLMJP0tb4MCT1u9BYikGZ35K1tbmKOTeJCJswF3tPvIfShAHjsWu9QUwH4gu5Ozl/MJbmKsVifziW5vSBcqPN5YLxxuoNbzTnhlO8wnHXQnrUBNG8b3JanNufbZ8+10P4Nmq+Pjddz6QlfrVpktvDnz/U+lvWkhUddYzQ3xbu0sGAecM2g/JFs6+PkPMP5AaZwjixJkTAzbn5SrNk80Tp7GUJ/RNh22msNCE+kIvF8ZMLXaRL7N+CtUwT4UK0ThfKg2o7TYwPFrus6Zy/6PrXi9JT1MC/oAfeLl1R/312JRffcyvTbMmTB2453X6GyOy24ZNbr8zSZYRV5658oNUb0GmWPhaOn1wnRpzFftf4wok0ogvKjTaS5Mv8bix2wIyBGlkPSOyx5fOVycaACJwms8VYoT8lbBuCGQdxQU6M48Fp21iYD6xd4xB+kmY646WKlrppmaJlbdtEB52bRISHoCc2Tc+F60IT2L1bD2K6IL6Qu5PzD+QGm0oD5oTtlC6EG1ngHJEqRupwZIqR7TbHYNFXhtsWpPTx5EGgt98lqaKtGoyNVml1bbRdvmBXEDA3bBGUN0oubTn/QW6AK4wTa1BMHp37eonf67w0/7YelKV84GX3a9iklx9mwxMZhC/i8pJ8iQccyZhElz/UGEdpfaZkl19qWAnhRlwGSbr6diyUgxtniA9Ue73+jgHk9iT+gmSYVZIBiqBeF8QF1Tc/IpDbILwRl4PIrlvZZRLG3avwZx5RTeRnQSquURFuvf3hoiJrGpgPHLWsOSR+QdJKxRqCcqFRZk0A1/QVqzAJMiYZk1BhIfOtEiekUhlyu7LSeR4Rt3jQKz4JMCWhRBhLImnJYFZy0sAuaWJL2tLBbumRXuyTgUzhUEYyxolMy4zM4pwsZAuXssK1bGQbd2RX9vAgV3LEk5zlgtdyI7dwd8lwBxCHIg7kDiIOJg5ZRdWOgTjsiuYeKEBc1YqKDkFceUUVR0NczYpqHQdzBByyhBQKaWGQLRzhIk8EUaEoksioiFo0qBWdGOJCU6xhb7eLo189WJ/Fb8/MtZh4crNaSvFd/PmDbTubkrAnnvntcxJeft6xa+yBoY8i8gei0BTmCDhOnFZGYG64kSQR4Y1oxwjKF9WeMTJ/Y3yJLYrJzk1el68nY3p5cZN9r9VmCe44krjxFeKG6gQD4Y3UGUYhefKQu6Z8m3upMTs3XC6C/27ZR2XZucnU8ZM//k02hU88j3ZTL7ghBMwFWxjlQZtous7OzSOGS7MnimdfJPTPCnebgzQs51/IDbZlCOaEHQrlRhtMojHe2JxUp50bRu2JGcXqc7oihJQkh9xhh4QH/Xrx3vbqpQD9yeV33JQ2jBZq1iictVNLmY8/b0ZEihMlNxPjrj8mftbZcBB+SUYPMLZK19kXsFyS6PKA0Dph/IgC2RjhQfSNJFOtBWHlfpYVKswXxs3uMkg5lvibQjYFFnqrzn6WNQHR0koIN1KRCQv/rofuQ8+vbPbgLipoP4uehJenZuwau1jphfiJhkHI+Vk4F0S4EK3Tg/Kg2X1K7i2K8cFilwS6c5Pn770Or1DEvncg8wuyrapd1P4YU9d/APj+55t2h0SkkW6PPs7yvEZk0n0Vsj0f/N55Rt6VPMHo65fjZfqILyKbMa9eDYyei8ENMX/Hw+S+GOGSfI92pszdntV7/TIpD2T2BtdosbfGTzTkTqSRRiZ4hC+iuZBgXDlRibAA8n2u05N7csBfq6vpqGla9Ory5w+z3p/xeyyH8gRzemASYvHOTWKG9rsnVgH7Fgkvz9TYNYaQ34/UmQJxQfUcR4M4HlyDnWiYD+xwEX6SDhci9W9Jd1uKQZl/JZuXN75zw5XHdSkrP9F77HyOOR71LnLxc1gL/VfC3Y6QRiAuyKFxPLgGO9EwH9jhIvySdFnMlqQBRdJhFskCirFrPRPxd264L++1l6U8OOm7uEI12xRnOUiVP0wit08PllzR9k3GZrP/GJrRWnimVRjGQZyQjXDcOBJjYd4wGeMQvshceSlVUGpFmYKyLiiGBs/Nn/F7hLfyBAc9tAwjg+cmz/Z7rQQlx1pdRSmQs4V7Owl4FIifyCOcYLUKV6CqEzFeEr+EaG0UyoM20knE+GCxy4DhuckL770GQFaELz5G7DfE75nPEoBwy8yiQGsXGwPmgRcy6orvxfXhm/bWw83hk/PCGKHfK9ziAzsJ9igifyDypE5QsnQNDDuJkij2x+KhJAhvRDvGoHxR7Rkn8zdkbbsoWzw3ieI4DRolJ5VVUbVqVKu5NXNE+wcCt5VFCGrF0uFzRAn9Q2HbEZhBiBtyEhxvnHaMgvnC2jMo8S8koVtGoZyoVgYxbiw25ECem9RuTsnJy5dIBzs7aX3hIhGJYwfd8u6V6e8g8jw9EBd5zOTrq8MHbr+n7yD6ekXf04W4UlMvT0dcw7XO90bPSybjlwQKaVTs6Xpi9COZFu1KKk/PCORw3vvY2rDa0kLte/RCZVtTL2/ntEabawfVnnZbEBF7iqBDkXYHhcoe7JOPduNo67LlIaMstLlSqEogOXWq1bEnBmQQxW4mKipzcFk3llWeUyoKitTmcsWY5htnUo5hUYyzKeY5B3/4xg+35JLHFduUTrmMi86O0QTaA8oj9kSCivKyK9M4QDnI5yafoWkQsabYptJQodpcJsSySWlto8JjTwRoqEi7QoWKHvy9Nn4vEJRlx32pTIMqParTa524GtWlzUVFLeui2rFfKOMoqtvu1Zga5VqmszSwOGVpeKIRaoyrEND+jhIFWW33W+qx+A4AbFYSsH4imtf4pAbnj6QwfPL16avZz3yPpQf70pbscxYe6cjmciAe3NM+726LRCE0s3b29mKKgN7bj/fXkuJAnLX1ej7zk566d+yjbPbSDVGJJ0LtSaF9IIHXta0ly1Kav6HABUQ2O50/KnMVSyId93EuEC1dhvwFYtLpDpEQWr8oTR8JcaSFAL5AWu5mxLRxXBm4x/iMQQCIV9hmbUetoyIflrCfkSV+msgXerc2hdp3Qmm/lC5WZgU3WMFoi3/XMqMZFiSalVHIaTMhlGueMNotX4RSEWdWFNuRFcNx5sRxXfMk8Ard8t5Rtv9icI/OiKY+geVHvGo5pYSfSfpIY6eA1hNQknKizyST9nNpS46XYiq394v37cJK7XFwa/iBkeDIJZseG12XGgM4dceF1/Ulx0s5NUlP43jIupFcUkl9aKqOP1QLVVYyUrL7j9N4V66sk4Wc3UNLYiWMvPP1ZKrF+Rnv0XwGmYjZPUQl6J11zaz83Y/YrHqC0is65u4wFZ+8+FXj+haXRuHlGWOTXh0XNd20ONeQrlHmjr4nTJ32y7F4m2M52X3/e91xZauVkugNev0gypumnXOmhT5V5vEzkyhuZJTO8ZsBhCfWp2gWSMbWqqTFgakAoCoDa+lbYTFP+DPqQKwckHY6oxyYjdBJUFEr79YOzvPWfd5NwJYKDv+nqrp5HbUWOSOTrtjNermprp2EFLX2bu3Ked+6LzBnNRL+I6nQ66h1yBnZ6Yqv8pWb6s9JWFEb79aOzvfWfYF5q9HhP5KKfI4oAjkjJ13x1a/G5iYRRW17t3QqVsA0A5m3WhN+UxavI4qFnJGbrvhqWGOLSbSidrxbOhcr1DQDPW+1NvymIl5HFImckZeu+OpYua1SncQoate7pUuxAqcZmHmrdeE31eJ1RFHIGYV0xVetym1F5iRWUXveLV3nK9ShTsVqW1UIv6m5eR1RNHJWVbrCFanPTocXDKhffYDe3flOquA/Gp9gBxTQcbP/FT0BEmjQy86JjR0M4P9m44EXvvCDPxJIIoU0cpBBFrnIQz460IkudKMPetCLvuiH/pjAJKYwjTmYwSzmYh7mY8O//sMmtrCNPdjBLvZiH/bjApe4wjXu4Aa3uIt7uE8EkUQRTRxiiCUu8YjPClayitWswxrWsi7rsT4ZZJJFNnnIIZe8QAFNPuCQnwoqqaKaOtRQS13qUZ8OOumimz700Etf+tGfCSaZYpo5zDDLXOYxnx3sZBe72Yc97GVf9mN/TnCSU5zmHM5wlnM5j/O5wU1ucZt7uMNd7uU+7ucFL3nFa97hDW95l/d4XwghhRJaOMIIK1zhCR8ccFWhSlWpWnVUo1rVVT3VF0NMscQWjzjiild84pdCSqmgJ7V0pJFWutKTvhxyyiW3fOSRV77yk78SSiqltHKUUVa5ylO+OtSpLnWrj3rUq77qp/6a0KSmNK05moESKs1qruZpvja0qS3rhP4g8DYFb8Lzefz22lY7x1+HkK9JoHOsvlJkebz8iuzVI4d10D7WVcOsaw5qPh8aQf2+I+0jeB4BhQbCouGFrvv9hFFo8bgFtai3E79lB61jliOypgbjy94TADgjeHk3ZG/802JruguWAg3MExqu8/0zb5uQb5GQ7Y0Q2wMhfrqr2hwHxdEN8nEN8hEN4voR5MMR5NsOhCMO9F6QKYiBYG+BrO3sEzu7jAOKWwYU9wvof0WGB9aqDQJQnP0f6zTdXBH84zP706+DP7Z3P9JeNHiffkB6fnwNfljk+7yYjTz74GG76lPhEw/hVZzjHiq7PaCEPVJNujXh1WNT1FNbLrDadPPEeebxFeXhe8mDO8djO8QT9obHpoUnrgiPr/xOXPMdG9udOKo7voE7fOh2QNx2fMR2whjt+EbsTMwS7PiC6+Ai6/hQ6nA41LEutd1SlXTo+ug81z21zOHrlGPLk8OXHsdWHIevJo4tIg6fIBybFxy25ze41TdxHG981G5Qa274udjK197GV9umbpltcKVscGJs1ueBRIZN/zDY+G7X4FbX6N0vDn/LkgOuvms1deaDq29KDZ4brqDSNFSMaXBJadaLiY00ceNobIZoqN7QUJGhgWGhsXZnX/7IRrlnME9nRmDdzLgYmmkmHGbysAXLp1ucL7jWJ4o5zFdWARSzKwH3chyOVqMi7halZM2XhKXM7AYqWmSP1kqLokRP/WWfidMiFYVXSEYH4Y0hAFEMMQ9itNllGBn5CuP/Cbahs+3zA+5y1MGeSaTZZx9GS4iG4WbKewi8kr2wJSVHUhdERZABwEkTAiyVnNxSQ0dKqZFM3+BIQqM1IsMzyeRljUja5lOB8SBRgeEQQXHxIGGQ8CAxYWGQYJBQgWGQYJBgkGCQ8CDxINEAYZCw4GCQADFRgWGQ8CDxIPEgUYFhkPAgUYFhkNAAUYFRgWGQ0ADhEOEQCWoKagpqCmoKagpqAjPzID1vUYERMVGBASFhgYGw8CBhkBAxUXFhkGCQ0AFSgWGQYJBgkIjrY5AQMfEg8RBhkNDwYJAwUVGBYZAQMfEgETFxkWGQEDFRgWGQ8BBRgVGBgaDwEAEhASEJagpqCmoKagpqCmpSc6O8GeAWAwUxjmzEiY04chAnDuLIRdqyd+gi3qEfccxHYDykdyXQaw3otRbomECYO+fdneI848R5xh3O/z6slcB7uNBtOBMPuAqo6AqrgAquROvbYN0PRGUxoMWAFgNaDGgxoMWAFgNaDGhPoD2B9gTaE2hPoD2B9gTaE2hRoEWBFgVaFOivD/1hSUOkIFIQLUhA/28C/FgkAIHzt1GTcvKP09ZP/cxL/9/LgTkRan6DCzoUJBcIg2TU5F4RdF99FK2O8FoV/4S2Aes9Yaav8fLn5tnVfnJU9CqhT6v1reSnr/GHHVCzQjFNRUvpyL6uTzIY9NWx6NXYfOltmeL891ZDlt4ABwcuOKTM1pjpB5gssIlXQqC5guSISSpaSmgryd437vHKeHZVJq2i7K5Egx5TkHxTeSqaSjfyoX10DJzdIjMetGZ826b23JnXs1OeH+QNbO45pdoLF5hPXLx1OZK81a8qOC1s37wM2BUFKF/3pHoC8bI9c7vBdbffu8Ny3Ugp3ZW1ff/eunM/pwWc+8DQ9iNPbXiWmL5g4x1mOApS0VZCx/r2CafRk0OPTYfmhNksFX0g94VP7qO3oJJbL+h5lwJc5wAVbeVJxD/3vbe5jCs60N47VXBz31XVffQe5nBxD/QOT1SLClDRVDqV4e7Tf+MItxjGo6UZ35bmfasflrfFajz/NDfYxUHmB3A1r3R83/zYbitF0OMVJOElQEW3EnCoanPz9330LfNnpQR6v5tkLZAA3Q3qgIKQGTRH89/HAYJnpQwyAOQBIHuMbhRmADhzcwX+rWChNlssdjw0L1rYjqyrUfUAihEYLdSlRYUvpQAqKzdmqtyaqcVu/5ionU6OH6MGTMiExQHEgDu/waVk/DuhD4tTxFyHObyD4WPAhoisODr8NJ45aAZcHt+9kpvra3whZEysNAEZCMJEM+YkyxRzSybIvw8ycmDTMeXTFejkWRg9KPg6Jv+e6E7vw8ZoDBupK3PYkRy1qEfRK7KFxIGvL1zAbu0xulHA4djLTZ/5QoykV3R5Rsb0JQZRdstM5Q69nH8rEadc8dWxnhknJBEY3ajLcXr+/ciis9WznhzN82yet+Kb6zDMrtxNW+gn0WBpTbZrPEHcdrAEYnSjbkZG+nGaNa25nXp0+lSk389gqDW/W6+Z2v4WPL/V7/2NZCrr/KnxHGeOEsYRGB3UaStRf+SMXdyLp3anRncDXJTKvFByb4lW/57SJGEdHX5Whj31oex3MPysnMlRwVSTGz2uavIeQyFLZVah0FS//ieVjo3BuqC0MSGyw+hGocco+w9Ry+fU5HTtTpDmZTMCVWYX6oa22r9TCwGqyZmC+aR27GxV07m/7gSMHuUfCCS4LzFcIjENxzANx5gMeC8znXx37P7k5LIxXdOcVraro01DK5eDmcrhjGZcE20aXblZzFYuZ5Xr2lCziyPtQ/FzFx7M3dS9LLtlHnJfyWT/To+wSly4FCrmPgllP+7BKRS9da6se3CuCZjr9kpvRbSf5AEqNHdZICPsdA1XiRhN1I0st++usdCpSAjtfz8MPfqqYpj56/ps2NhNf76XOaTNhSHjU09Asba3LxfHkTqfy/cKZFQ7XQM4CqODgrcr+Neq+TkQXb7x/8zrvtBr+2iwcNsU5D22adMNSZ8/Eu8bUEVeemkSeyK/F2AORvNDl//M6u222HVuH4r+3WOroZAn8s/pK43bpmmx5bkzHvAYc//Z1Sg0fMZfIcWeJZUelGa1Sj5NIkYv6uZkyZ+U+dGZe1UgI0P4uX6P0YO6WaPxxzNsN/FH4vOYQUIqAqOJupQK+fsLFRyXn47WuRMd8gsLHDY9z/NJd0JsFkafkr1hWf4s9TO5q9jLY2LCmlua+Ov5wGzn6GRhvr0NPULn9wrPGa0gl05apUUt6diVtZn4m/NT3YE5eRZGLwp9juqf1s+ohUBgNngh5HuFxkxhaud5l8arrqI8t6ku6spRqdzhjAaQqQzvcI8OTPSvoz+TKdmsUPITTygXzKANFRnM5TrAJ6jNtUx3z4V3afwtAVUVeYpukaiSXSlnKZ57LH+aShIJQ2omUjWhiaXBSUtTmwidU7ZEaNUUtqUho06CP1JFMjTKZDFsiNNomx0jSCpG5KWrxqKQita/C9T5RZ4AtNQ36l1AfVmeAL50HmYJEDHFzLtA92EzfFmJo9KE9sTNH0JL4kmXtRTIPSJIpT8QQmR+EUKUlFxAdL4IIUZqLiC2LFj+fK4jB8QpPGZtr8p15VaBdIJakPuKumhv/9TYKzWVwQyLQic9tFUbL+RtEyGWunMhInZVzBjlxE7QLtwpxg1vhq3uTOSbB42DXyVrtI501okiK1ohFSfJ6lwhkZN04bky/nRRPgv3rZW+uS6cxJOSTyC8PVvWOlRep5s3zgm9D26+oqy8Yw2ii+Wtao8Mi/ONsnWXt3+0KN+GZJCuES2rZLQbtY1/mr11JU08lE3amVpnUVTblCidTH5kRVmLMiRySTemxmjGSVOUNahtTCvZRmsivT9Go2zJcNa7NN7VAJA76pFD719ben9Tyd7+UqNswep9GK2yJZez36XxV6TORN0E8MqUZFas8xO9FTCbegvUDzijdOrWzMG05MfwV6nWRt+krn6hmi3LTbYiN+k9Y0ZILA1BRlrkkd59/6Nwm9Z4EdtBTlDwbVIc5KTp3zvvf7jvBaOebRokd7fRdkFu//RcByjGXr0mCoKs37dNEUT/6Z6oZ6npgDy/yYBMAr5Wb7uJgHzIzQKERL99Tf9Dxn6ts99rNPcP89Y1749v183zYxVwtgl+XN98tckOxeMn6WzT+xhYZczb25w+MtfNEyNpzG4iH1OtBBpy/e2gAGNSJ53iGU9i304JLY3ME30xvqeKkTzKTpnaeCUWjnEq0yoky6ssgeLABuhKIhzYopHfgKu60fqArvSH6mfGBgXtlX5XMiTjyXaiwwGltrTeR13OkyItQhxQBp1eYBfSChByQN52PsrDlp9FYfdV1nP9sIZyYOeAcL1zt8ZIlQP0YXIgDGWlFZ/xnGkS4MDD78IqDK0zAxxSiAFqzgNs6p4SPuoNeFH1WVFRzfmdhrV7jzDBt4G8jaL017acock7K3FJZ/0A3nMik7AH5pIsHmbOj9o98AYpWtYioga7CIl2wtCGWmPYjJ1jpwcaByLeC+LO/XwfFppWny/A6fmFC+qC3ukAJWoD11XDVH5jvRmAotYwdePgs8sLrKg15q/x4xyKtlmAi0p9IKiduNx5StHF1uJxMXuIt38JXqYVS0rZryfTfab4rrqPrVXSBjGMLPhq+VOwrRtRKdbltImSNgiq5PzCDqfO+zk7PpTeBsFn1KSYE4n9/HmALrfqGxgfpWx+FVLHj1t1H7fuPlqnkyRtzqwPvozt89SXhdV9Wdjdl32n82ST5e04edqTvv/f/eV4Y2uTva0JmyGVuX8YcvSfeV7hf/2GvBAXybxvnZ46IS76sFh5dF49dSNCvr1v/F6+T9ojbVy3SMuKAi+pHV9MILbHhU1Sh+YYGHCjKEkt8JzaWsV8hNafbIpRxmaxcavslCDwJ5VSmq/egMJSTF9sEZuRJCJWqzzFtlkp5telkxdssxXLFSOnr/w56TIKvKa2WbHK2D4X9liWNLHd2LhjtIQVeEFtrWI6QxtlU8wgtBObyRnmngWBt1SKkca2yiZ5hxawqUwkrTiqPOOehEvaCLMX+9REMsWo6KurIu3vFXNotiz79z8O7t5XEoemXdgUMwoNYVMZdQ7AFlyd1GCrM7YYa52U6mOPzTg6pL7OpPikTVmVm9gWnJRPUyqBue3nemgjrzrRWRW7H3tdbuWOWW7rufqTShAsk0JGxRuW3Qp3S3lSJ/fyhWWwjTgpRYvtZUX2eOhLRHvKbtL3k43kFNr/xQBYL+EY6iDyNDd6DQxsVsK1stkjetUsovH4FMll0maqvSnK5i4J95TN7oZ3676g2jNPLXg0dWWjrU6H7IZ1WcKOn59227rOO1uxuFbwmOo6zInjC25PX6DjCp7q1/qqXUQd+ckWjEtbbG9isnFdtDZ+snk/jvCueHxrB0A3sMfyk6q1phWQe2LJ1dDyzD29NLJnr1uBx9hzmyMvYwLNsI04ciJQCztpPxGfxm9V7cOur4Qkk6o0ueuTmXTVuK3qenMb7hJqE/jhuh02N07ZD99JsE324yNxGNkeV3Br6nx+Ld6TMYHyVGorI/9J5YNwnPdkZtWVuTuULmpKJQH3qqRrohKR23oje+7P7eDmXiAfeRkTqEFtwdqCyR+xbViZnpBxKfCKSmW9S6BfLGM9+S8slVlng13BNahURlYCqajU5kx+jGVSDPdyaPW5c1vR5cypGeEelvguugbYltwteS+QJ6ziAi+3A12bFwGjzNHP95EZc8++jEwxkVdwPVQqSzcmkJpKba7kJ1j20loVr+mcd/ppMC5iSsQql2mJ0ZHjUlmeCNkr8IRKZd2MCbSgUhsT+QGXkTBU+Ar8hmVkLoGWVGpTJT/EMim5mOmruiS2BSeFaEokDPj8sy/RFeWe9nOtwPGrd9s1y70U4moWW8yJ+tjDwooXyN5PHDlj6a/gxlQq421MoDSVyvQikBeVSXHEYE7VVbhjoyuYUknIPRPtOlGJhG29vXqs6td1u8gKjGOojXaV6lx8hq4Clr1wr5mnJcJLMBdXKZW6sUwrG10ZLJURxNhgwaWxV0VGUmMCkanUpk5+zsW1xWVP7bW4o6CLWtPKm9uKvky3ArvuRbL2Pl0Xd4WxTAqltOLDMbBZ79ZiqUw2BA0Lrpe6VMZmTCANbRnY1ubfsMukiGLxsMqd3BZ0FVMqXrjHxD5HVwrLbn13a1zEBQISMXdGfuzj8DYBb/SxByXZWt5ld+ha2e3Ha3Z3iCbmjpAu7E3MB7crfYiOLfcM4sh6tyMXOIU9gh7pjQm4pi614SX/hl0qc4vbxQKnqUtlFCXghrrUpp38O3dmXgNr9Kn6AGYMZq+4NRro483Gp+n05HJFyJ2CufEtHQBbxK4fRDZmTZoqbx3YjHabuEOjy8S1Y62D2HeTYiwtm9h302qj28ZtxtVjr6bfBArxx9y5+rG3w9uEC7FnbNeguWzInrefyIoJpaLOuDP4KyHRZBvzphNsntYV5g6lI3kkSO7g5s7pI40xgXqoS21W5E/c72FgDa6ORXQUL0y5Bzuu3WHEWSfYzWy4QPa1xLWwmpdwriChzGVS4tVc1mXjw0R7yaYyuzu9ewc39lEZPmMC9VIftfUhf+Ye9Iwc8WNZ0AV29h4pS5B37KQ9VpGfcPclR26BdFkwGLYNR/IS5BPLWEF+S+UjcQURhVlwfVA+EqdUAmlpDGx759+xVJYSWpkFl6FSmUcJRKFSGxX5BRfXGWOaBXfEXpVxQTsC9WHPJfo2shfwVzK4vh7+Tsz8ruQPT+5Ji8nNdz51fc6vTWSHGXtqPXsQIJLdYjdCmS3e9Ziryt9GBxh28pkU/2MngE6wKfEHjifZA3kx82iEtpbFOqLZtbUsFhEN1PYyefwOamqpx7M9TdE/cnyWTXKfcQGbUtkb45qOfnOp1BbyZcbmhfEjwiibUm1LvvmdVp+/eQ5I+uQzqf6HTV06wSbrPFOyR+5i9sFIHT96kv0gmrEp1hoixiYFl33NnHfPX49es1TWHzbpNpC9ngXMNS57LcWjMcbq+BOkVguPZsbmhYkSoZdN6aqLtyF/4vM/HE3O0pVnHt1GJ9hkmXFe9kBeLCiYqKMdLmXZQgrN2BRzjLBjU7r14k+YjvP5HL2p4q3m3LONTIq3mXEFm1J+G6OsDmiyPyil0si9m+kvi8EHWdQ/KkXeGKr0CWHqf45cDljXo7cnSyX+USHL/cnP5Bdc0uDmzOviZA1HK+M4IJXniZdS3P+wbMD+o/m+mMtsKZzUP0ux5lCjnM8m9UyP3qn2h2WDnDnvk2O2VPrzz0ohNIda5Xw3aWe28ZNktiAevRRzmC2NRx7n0bHgFVvofBwD2Oy/+BDk+7/i/5MBOTX/Pmkbusn4p8lvNib9zP7/rQDP5Tvi+YdPIodyhc1/A+uclrEzc+Ulp0lkCEXoyubnxOcbXwyAozk/hdMMm/ji5ruaiN3sirfEj/k0AxevKXm7U26J4m3xc0TNwMW9pvdZBtEo3hE/qNQMXDwYgKDQEETxrvhJqGbg4gvrBYjoYYr0QfyoVWNz4TLITVgVBfgovgJZrsZg1fUKQPQqsPJ9hBGNyOuwqOGHKnNPBl+3leH2g8OXArE/6f7iDVvmLq9PbCP3NY8S7N8QJoiaDfBvBOXT9Ebl6UPA+IOXjQJ7qv/FTDWTo0SNTimC8PsXmZ2n4P+AOyb7EN2DwHroVlkyyVYcEniX6edQtBxYYBva6hHcbVHzh5pi+cl2xz1UQFj/8371I+rujQ+rVcIWj1NmejYYtYztKLfxWaCn+evIKKjRoDX3OwUf/BsiEipkFNQ8XUPD/gfWq7nwYNAwPApPfT++Oh9lp9HGGJu+vqIqr3wvPc9ufvE+67ZDdy0MP/DVvuaqOGhB9pCn3fmBOTfs14fq9m4t6PuL6PrdL/9sbi8puhmgho7x7JdeCDkYY2CmnwqhB2Qd9X8r9IV9ySId347VH3g/oDs/bucG/K21A40PApRR6iCbjrYB61J01JToNWB9/mKbikPrSgP2UjiqFN0G7EexMafWpgUDO/zOKJVoG7AuRUeNoteA7fnDNgm1Thqwl8JRVaPbS2AwOD2oSqIHiwTOA25W1zb/ACQzIyQvuzpVvXvsL1k8pvL5mz/GPOBkkW+dJbCs66/5QPMg06XVeFxlzo+YB7Sn3eH4Z31z+dYBgSYDIw8UyZRbAx4A69L1/BCjG/r9w/xDudl5/gGwl8JRVYmazeo0LkexivuBCPwfTec0s9lFbArRaaxz6uJo4aROY20/K4Q9GGeIXD9PRWfxfKKhMdp4KXUvgTwNt6aGq/57NcC/QZTiQf0/lLbYpzkxNqpf7h77CvivW0delNBlkdBpFKFKVxpi2V8VUj2smoFr/XUqWoZ9UoXYg7mC3V5PiDfQZ/J2rg6eGoXF/anf+HJw2p8JyQbmTN6eq4OnRmHtC7oEod3enpDewL4MgurgqVHY+IKpI814AvgOiH5793SRPNXOdXU1zDsY3u4B2qN1GhWdxXJWerGsdzCyTmVPQByoM/gdTPqX1NVlup6ffnSLYbbNa7NtWEDV3qyc7Q6GCHtRPnTxc95B4MVGyW8f7UPc9HvCecZUV0ctAIF4UV44WbzcYSv7tRwPDxm9SL6m4VTRmRIV58KFUdmBV7n8fFDJL7dSHbzoHgSDaPLJ5idrGoVUZVn2pShVWdabworoiuWrKouOo64L/sOU65frA13OKbvLz12WolR25myXLbYmjdk0CqvszI98Df4ukOxgiF6/LypHgsdU0uHgsDHX7xlcdsBT1OlC4dnBdI4I3l1fv0LDL2BXW+9ay/1verMto2u88I/PjVMU0HGG5Fs266M+g0h2UGlMtLE3aMwxd+2h3MFp3PrIyixlOa5Q8ODR3BCYCeQz0Ttae8HLuMDPgx9pYVzJps0ye90cBy32GM/g+nOH4wQWYZHvApkPHt/BNA9X7DZ3zS2CPx7E0VD5XxpFB8gJHciBb+vH/15sWGP227l++GourNnf8fZzfShSJSfW6fX3BF8LW+7x513DZLacut22By2uB4xcC1vp8S8bIcdWUrfb8aCFx8RteG7/c4vRB53MrXZQWx2WDnq7NgJYj4Wrp6397vfedIHtxSEsH1T2Luhd7bCBW7tZVPWNUgpgpbf/xwa0+5ilzfGHd0/cGN4Rh2xhTB5EHzigdXxfjFbzmcfxL/qE1+pfkg+6gq6hmzeS519x3UJ3MAgDow9MNFVvhCw/7hyrWI9OOsV/vWwAgB2Y3YREtqGfMx3YynhrFZlBk0y+detZy8h1NjcMnQ/OnPQXIh9UtAQAWHzgZxQ+mI3H34O5P8h74FHMPZDT7YH9d8Zttcs7QLQHJnhzcHWWfze4HtiqyGNVmcemam473/s36ve9/3tWgdtWRR6rBeaEtY2z2ZP7WBdgwRXWErXZs+aEtc0TIPfpvhZctloSW3FZtyHWTbJTL/g4R7Koi1yTYlWbug7Fdj3U9cJM+2rQ1kVjWYuWvTlnwx1gh5cxnWME2GKGsmKHslnY7TDlnu6RGMG2mMFW7BAb7hA7vJh3vVsJrtCWrNDWnDC2ecLKfYwLa8EVxpIV1poTxjZPWLlPq3PY3LN1403WhByq3Eg3clFTngTbliTLSpplI5ttp9m9rkgBGHDSjRSDHpCJI/8d9P6LuKABF4XlwXnTZcH48NL1L8kDkgfsOvQypj6JULYkQ1lJB9jI5hpmhlnGNCcRylZFqUBrmSDZwx72sHfYF2ghK8hSKtBaJlj2ycx0FrKfo5b49MZjfXrrzM/v3CqZwPn8zmXvdgCbXajpXgDRViDRKpjKJvSd73Xzott7vdtdANHWclqxrG1YsqcY1BA7xbEsqgoMtlphjk1o7mHNppY9rVsBjq3AYKvg0Daresh5jBlyh7wN1kLWBmcptcFYy2ywsqcaxlA71G1wFlV15LLqzLTpGjn0nHmxpr4OXLY6Mq0WOATkepABj7LAW3IodmAEciB1qgwMJ2ojHG68JEbj8cbXZnD54tPY4eDB5FYhcg0tyFxLBZ1rYeR0rJEzcjbW2jmIXEMLMtdSTWw5X+p2Ls8H3rs0QAVaTVFSUTeEseq6pEZqra4pCloNKakaUTeaxLprS4/11rE+iia0KBtTUTeBsenaMmOzdWxuhFFlNuVImUM9SuTI7lNPZMveU1/mUIwqsylHyhzqefbpwM0zkSdn81zmUdSVeZRNSsjtZaeE3H16b46maM1Zca6mqOd5y8/vdanX9ubze/vWn9+7RhTzqjxnHaqxk3qeMhJ9xgT1GRs1FjdG0o4rayjHSlpkGFMta0ytqqNAhUiFTCLZhmO4loeACpEKmUSqjUZqlQ6BFiISNYlxS4/xKh8FKkQkahKTlhmTtTkEVJRIyDCm2/TIXtWHQAsRCRnGTJsZOavmKFAhUiGTyG2zY3btHgIqSiRkkP95rk8j5sbc/uudIdBCRKImMWiJMViFo0CFSIVMYqpljalVdRSoKJGQYQzbcCRX8RBoISJRkxi10Uit0kEsOlrkYokIBwZEvyVpaxeGaiaQelDVwCPg8cFXuwYw/KShwZqCvANtaUmgldbZDEwGSW/LMNZBWpI/K9rnyrihtAM0FLNKds8PzkS5Hd2yk7ujW/bk3ui2fe+GUS0eypGyV45Pk+yR06eZ7JGzp7nFS/EOhQj1Yd203QSf2C6gd4oSuwW3vVoUTaW4Yy0m7fa55+64z708nYQ4D0YbtTZ2fyZgqI0sE6UdMDNnKKFyVsILknMSvWByTmI1rgJFXbQoa0LZcklZsdUlZY2tLcvWUTSiNeJIsS3pnTl3vg9755y7P3Cf61l4Sy/ELoc+qyi11dSQWqVDoNWAksjYR6eoo7usf/CA1sHXvHhPrTyS7VMnj2X3qSdPZO+pbxlRjGoZQ55GeSTHp0meyOkHZob8Mn1a5Rm5Pm3yrNw+7eRZuXvaW2YoRrXMMv6X/x0tyzYncLx9HjdwfC6+MQb//L9Ncz//7/JcjzxHq0bDuiS0wDUlsqBrSsyCrcviGjSk1bAuWVrKNWXlqeq95tvVpVbWLWsKWMsGUlJ5W9KSyRvJlpy8llzJW7YpRvVuzDtSWpS4K9WLJu5K7SO6ZY+iAS3KuqRl7ZrSse4a0mO9dVkfRQNalDVldIlNYtImY7Iqh4CKsEAiG8YNPsdJVLSkbacww4g3OBk8vvhqb41w6kALXe1GmTMObZQ54dgmmTNOr8x0s3h0kLno3DnoHHzzzqf8Edz9xkypqZeHYhqmdb53aQI4OwAA9vwhjkFRKLBcOR2meMX718HJ6D8BJEd7kuy5ramXt/O0pjbXDur5abcFFVpPFfRQRb+3faf46S7OganI3arUHtVnmHKmIlcrw8gZLnGGkbtFMcpnmHKGkavRMHKGS5xR5JCauCUySof4CKQmakJqAqkLNSE3ccvFKB7iI5CbqBm5CeQuGEfOeIEzidytFKN4hilnErlabqX9vjFP0cRptY0OaoBdUFNqQW2080qulukYoFnXhYVkZF3IQey3EYc7P9jvIqZ7XBlcubgyubK4srlyqF7PNdXruaF6Z25fzB1XAFcoLsesBcxeQJUReoQZYSc4poMppqMR09kEOaqe1CBHtZM6poMppqMRs3SXP8ee+J6eNnh2RsPUJBlll9Pw2blRtBqj2NTZLGo/x8q4VBbqsSy10CyziHYviL0k9pJcsRXFVpTrdm4J3pnfQ5X4TvYu6ztCt52mM2cmc2YzZ3bK7cFlrgiDzJla4UxnzkzmzGbO7JTbg8tcEQaZM7XGmc6cmcyZzZzZKbcHl7kiTGXO1BpnOnNmMmc2cntwU24PLnNFmMqcqTXOTObMZM5s5PbgptweXOaKMJU5Uwv2NU4ahjQMaREjXMQIxyghFUPiY5CGIQ1DWsQIlyGBUUIqhkTDn3LDT1pEo83BTxBwpDlwP84cLHs5+65jzIGLEeZgeZZ2ITBiy8FUwU+b1CgoxkEbSPpUecXTHgGGWOt288aMQxvk0Wz5820ClkAdGxM7dYEkd1kBf5BMyb22Nu4Y+ZJb1CWJ3RVzCX13cr96LoAm7v3OJxI5mRJ1/2dKcv8Ue94iKLndMiO3ONrhXeOOba0bdYNhSQ/HGJ0X/M7qFlpyTxSe5L6+YyQYPyu5cfGGcGwYgisqZIQc4e4BHtyOgUBeAV+44A5igXv9a18XG7hxK3BPdijgztXz2/1bcWP6cPz2Ty3552RVeCpmfcX2YaJvDf6zwO/eiR1OErO+OAWmwrMFBL4QrlQFobWHRSk+2e9i+P3jXbtcg11xaxrEzpFdu3zb6z+c6Dr4cKu4rl11T/b/+9o88HOqBNFTqQTxM6gE0ROnBPHzpQTR06QE8euK/kSvB/oTPxdKED0FShA/80kQPeFJED/PSRAdvUmc17X2efl0/8sdmy9bFGSMF3tBKPtSNur3DRubIKOf2AOs9vXppR/T9pwgo1/OC2zVVyfjeczAeoKMalcPMFdfn2b1MRbeCTJeIz3Axr4+4N1j1ssTZPSKekDd9vU5LR/DI54gY0fTA6Lv6yMfPkb2PUHGMq4HuKGvj9f7mPD8BBmzzh4Q974+m/ljLs4TXCSRekFj69pUm485t0+QcYHsBSH21fm0H8MMnyDjN9eD+ea+PpbwYxjhE2Tc4XqAefr6WMGPufZOkBEl6QGh6evz6D1GYDtBRnqiB5iur4+r9hgm7AQZnYQeUB99fRCwx5x3J8gogPSAeunrM9o9hiM8QcampQfo3dcHGXzM/XuCjBBbLxDu69vEdUoXfYKM1l8PKPe+PhX0Yz7aE2Qcv3qAO/vqLLPPHZGbICNS3Avi0dd3TO4UevQEGeGmHhBDXx9Q9DGi9gkyToi9QK++vihjp7iEJ8gItPSAUvX1wQcfg6qfICOO2Qvc1ldHTn9M/XuCjJ5aDwhVX53W97lXfBNknNt7Aee+9inzLtc9boKMEHFP0NzX90XuEJn7BBlTxB5gy74+/PZjdOQTZMTmegDHvjry8XP78ibICIv3Bg59fZHz5kE/CoKMRnMvsK6v7xfdKbHtCTJyXz0A1Ndnr31MhXyCjH5cD+Cqr893/Bic8wQZZaIeUJm+OvLmcyn5Jsgou/cCk/r6VvOd8qGeICMH1QMq6uuTnT5m/j5BxkWxF4S6r87q/XjbZUCQEeTwAZr66tslg1zCvgky3vK9IKa+vst9G9veXi2fo9vaWVf3tCXNX/vix5L9tBHNVz+t+3hqPV7zOlvO/NQ+M1/yt6eNcm0kfrVyGqdyGqdyWsfeTMv3wz5lsdcXrW/iQ8L2amP+6ViZuQRQR+ZxLsjcL/4NUiFk1tdElZYu00Y0rskhW5V97czpIXNUesOlsjPUOqb8NquCQ90U4UaPApsJG5RUPS+7I7Nfhr/UGtuiM/3n/1noNVX66iNzJrqKska6TCM8JZUUMoMJFr53dpv6Rt0Kx0Tp1Eq3FZObsC8yMyASZXWQ08RoC3BNxhiZy6KP0dWVbJEZZy9ifPk3RBGZmY+C/4XTE5lx0of+f4T+7orMLJ5D/yPBUsiMIyzxX0DEkJk9Elb+k0KLIDPznutf/NggM3sEhzwFrPYxT4AcoYE7q+M0j3nCvAfVPozVCadjnjCjQfPfMQ/xH49lb8zM+7T/SKTCMR+SStCjskrktVRJLPI/6z4Os9PYohixSEdzrHD+NLseWxwaVJra8XP0M/92amdmHAqRhvNvAlY+zcLxDdz3mTRR3TECPrXJmObHPTTpuQbbnooZVeG1ALm6C8J6rtIa+yqxnbRcOCekZMz9/N5oAS+TV4ef3F4E+KpkYcyguZur7Q3mLXTbmwAcageI8BwM8J6+QNTKSeBjUPqBhLcSXJn1/zhqc2Nmmv+1jb4xMzgx/Ze/DsfML/D3f1idrDELNVaJO1xgRTXel0cew+JpQTpv8ibRTMUtn1q2LBMeN0cXjsuXmi3na5/oVTHfvamkOUvFliFi3k7dolLPTT62rKjFYJ3219sZ6Q71G361HOjC//jX/DEeNfUe3eoVlUsprXCbv/f+i5Jsg7PGw5NqKZyu3bf1ceNLW3/V8G5V4jd1cm+spqre98N1e0ijeRa8d3yZPJN5MkTQPAupO0EmCWWekIks78c/EFD9i9Tl2JyJuCtTpZ9mhsGZfcl2hOdNbjAa1eiNR9VVe5OYmVKwlzmq9hjmsgOpzM3oXubGavJ+m6qn9LaI5deLLol1LbpO38dh1mHyzHprPGxF4Ooc93HO3Fzn9L2XM69Z8aV+q3O2ucS7jwW2XPys3hGGy/tquF5tyjfcXu6Y+7QbHu5Xw+PqVL7R+fPwwo3bN15e8+bLxjtFvtv44l6YiVmoR+cJIqsTKtHphT70lZmsAZMPKRENPWL/asBbp0G7Z3AMxmANrr/CW/oehoqVlabKsz7xy1jXy59gADOmYWnH2PEyczwCo/ujhNLOOGCOa3S9fBM8eXdoH/iN07iMG1rjYzzGK/P6Z6rpugK3ivijBMUupG382/MEeoppbD8k1NV8eHz4XovzQXoKLbVNageg/nWkqXQdPa5fHedA7KorD3QRCXlfy23epQZ1zDM8rfIMFaiAUaiOXlagjjJMsR80rU0dpeo07j/AYzRfkzr+byLnO63q+FO5es/RxK7vaiouyPRKVx0K6Tj9+X8CgOJ1tLjble5w+zV1v6G3AJ9GJzuKMIuI8Kl2qk2FT7aTbbJ9sp1sk+2T7WSbbN8LUveC1F4y+vp45aiRdkvkhjw7lks7N5TasbTcEG3H0nJDvx1Lyw0pdywtN1TdsbTcEHjH0h6QVwAiRP6Nd3qQdWz44n5D7B3X1HRHjGwi0A1lt3CQ9rzFm0TfHbmSkUAHZWv396iRX5HXrfzHb3sg3Y57p/ETz/OfFAnYng9nzA7L7mjHNhPV3lEW4/glex2/Cd7+WYVzzxuNOrwV5DGdqcs2cwxcJZMW4edq/Hnb/tSOP0PXn7PnMujSqAs6guTQaUwbG8KJ+H9VpxOLca6Srm7XRGqTdTKIoihKdpuJsHOcNDfAoyCWTkKMc0pa3dREtEmdDKIoilLddiLunCftDfgoaPVF5nxAyH/P7pzzdOMRgyobsZRAW2pPszvSU9tb1ifDXBqdIsykarpwpj0bmrNBLpKURBvT3I7sVO3m9whQJdKkCaTrcWemC5tJDp3BZLHrxOkgiqIop3uz/Y/t7YvaX/tdXy2X+U8pHjGoMlMTthIcywrZbU6EW8ZzgiiKNumGiahzmrS2raMgFk8sylxW3Ysv6ml6Qz4S3VoeT0ITRbD8XwMC53/+fo2s89ajKYfjtmCg5/dsV2R9RNblNE5ku2pnfbu1ew7IhUlJtJKJ8/NAlO+/f7p+4yLy6AQuijbZrcaSOHrbGn1TfO807a3oPLqv3K0XH53/1TmtM484TFfVrKM2VyeDKIqiaI+9Fub5Gc15xB3h5Lh5HgGqRB4m1Xh0GieirtJktZU6AlTZOLScxom4qzwJ71p80j8jntRQk5bKXWoM+W5J7xDMTWgHnRGaVI9zzGb47kzFZ3yIabHXvmmKi7/2nRePgy3o6BrSErBHNc2g5g0ssJaN4D3e6cNmMR2MhRaUahLIR3DADR3aWbo5pVqQZstxMAEsGLg946rQiJZQ0k58OHdMh3mUAD+KLS6fG42DBdayWcQ13GnnYwmY8BDqEPhvqgT7sfXB6S+I6ZLudPMG5aYvtwNxB4SXT4C+DWg+S9nlMJ1qZ15nqzkJqLDGvGIrnAQUfkue5q/01DhOugr+yExhPNbxRw/4S1lweydWO+Oef7f6/qguptT6x2KK/uerxvO9aO/TzbPvOZD8R/1ArH/KSMCNvpBlP8PQXUiXT/o1Kd5ji3jpmT4Mb8ZyjNdp7phbTOP5TBM0xpDNyQfN/mx/BT6yCffU9V89RvUI9Umx00cOQx+dw2OCzckxQZz9WpUUoj3nEOrBYNPrQZ6KHj4vuwQzGXoBgp7vKl3wr0xz7fKeS1J5zCUy85JLxJAzoYc0N0KvWAQA4JYv/AkATmZJgb4AoB2flcF3XVJ3APyAkFyO8wViP3zaj/yNz/BRyoEAPOWOQr4CAOYz7BNthJTBNFtdDurKCFgMXZKNEqBzzCGC4bmhW7ExkwBzGoXFyKWOZWMz1jxDRxzYm547eSRv6UuDakoYLmQ0PgYqWU+86TQDZqW5dkG3hpbgJNtVXINNtX2fTe4kJsFdmT3Zh+RFeq/0vzzxuIffcj9phuzaFmJ7+Kv2melH953AQerKvLeUBjHt9LFOxtdH/heT1/ybmdayc92RDbgpgVAqssAkd3FqzVKLqoXX0irZZERxrn4TYyywptdM9Q7TYAIAQUMZEAhFmDguVFrVCxSqYpkFitQMsmANIySwQw1q0SDCkQ8C8Zx+wgb4nZ/w9DnqhZfSS/h0gt/gQpP4L5gIEPeNdTjse9AOB+Im8BjhtcMHCQhSRoQqESImSCTSKhlEliAn0WDpQjQJWhTtk+kI9V/RXaeHskGMNKEZExjMZIYwjEkMZSJDGMYmlrKRJSxjE0vZyBKWcZG7Ko4IUT/MMEEs9FEx2A4FbIuLBVLVFetSLpNKVy3X7E+1m1S3hYg9ibVnkduJul48pOjfS4B0+C9S8S3cUeJGSVtI3knKP0udF+WYNUTb6WojurRmAJlnktVX9tRbnZ+cvnIPIM85yXuqfFg96wtwFfZVagCF56SoRgU1YW+FRjku5VnlskHVZhjm/fULr7zyiiQ72YoihQsvvfIYzcV9cCmOlrdlCBe0UCm6gYNoFV4NNjjgVhk9o72esXgIe8tLmYaB2YV5XRghA4UWRtgpMhAdb6Azz4S77KrrUVyDz4cB+3cmomH1Kyg8vKIJGGWbHAOuEC/5R2ND3EseSD+UuZuFWTYJUBT0IGyUMzmEwzibQzmTgzglysGKGRKbEIcSd1C8jtrLdG9lhwee7vhfkFr2aXeczsZ7MVCGBujg5B8CcJoCOhOyksomTDhIU/zbuyzrPFIW1xINWXrUVVvgvarZd+lJUlW5eE+2dtmtsr/uCtsewMy6rVtT97vt6f6Dzmi6M8BVo666UfSuTsc77uNAZZFDTbp5UEenOzs1hxAqTqS8Fw/q8LR3W3tp8EKMqm4Uv+UZfnvunQ6hEHUJRvH7eDq3nTtV60Clkws5GqHJTGencgihEuiLGyXa5fmkG7/fiwXo5RPJMIvfwrSw8zgNrFLkYs5nbQ3mZRA87OmQO+wejbDW5xx3nsfBKkxPzLEIjWZee7WO4D5If/DgQ953yzy6HSIV7cdrNBd553wMqTpgQczZFFufgWwvF4BRjL4Ms/idmsHeyT4TuTK5yXQ8y2xxBmevmzOxlcm4lmkzZsdmcPdhz0S8lktXrnNxe5tg+BoW1n0GEX7XtGgma60qKjwqzbCY4v/+e4t2CGFzj6sxxKJ0ss7BwIWbBDnMQLcemRApyh64BV2Ujd8LQaJsALfHLmLrL/o3+qGuxXKsf1p+k0ZZs3xR9l4z3NAm3m1WBVaULVf3l/lpbGi3bbysVT62aVbyKNvaTb8HuBXSWvo9wD+SAFbKwm8kjvGZF7tiTFnCr2VsIU3ZMq6PLmXbeUOYQsqOw0fZVQwj+6P7AYFyZ6CSsjHCKNs4CGv96FHp2WC5QAwU7sP1xtmj7B1cdQhSdmLgKNuf5MpIXLfi5ByfrLh4VtFqg4GK4oZPeXI+7F6w1iAZggkgG7DU/E+WMz1ZYvnVGfmebANkXuUAYk21XxinvLTxwtPLCZgA1kCb7HpnHSMQw2W0koufWgzMD1ntZKqfK7Jo92CXzwRVZ5c93V0lWUvq25FHNVItHomnenailTQS/422G9iUvWRpXbhGd313tBO+azjKRiY904A9iwkgg1AKYB00lMbSdVL+5YFsaYCY8vTWHMUv55z3S5yQdfAaZgPlNqrJanG+mx8VozJ5KobINti/tnOKYpe5hi+LW+uvZ2gUjJREnb/KqlvHhKoCAADHyhZ/19lq4ACAusrm74H5bhbDe5+rcHlX3/saWmVQw5tcRfZp/rg2EuaUJMz3PMzJdbBCZ6+Pym8SIiuuzgCwL9HVhIzEVMHAY8ClSUvSU4q0BHk3laH9h2q9A/swevzD3hM++eqBdXwRzoouNN2ms0JuRcVkZYMSFB2cs+bZO4nLq5O57J1S83ePN1E3lrpbxM7xVU9U/ZkISDX14JwzpE/TVd7JSDHCx7XjxglBIRiUbVmKeooLqv9g9PRguaAboxdtCnBXeEAgoJcseb2dRVgTZ/0LK0Tas+GtLbP+eyM8+q3pX1ZhUlgNC6V/+a9lksAYBIiXrv967PHg4GiGDO/vJIC4oKBwU8CoAtB9ZPQxhvd3EjDrI1S4GQBDQX3f+69WcwCKFIMxAwwIIADgojiy2gTrX1ohexsneY1/hVWHX/0LK2pv5oyUnr3wQxKwyCP8kAGzqL+30mX0WlkOwG5iOGbAjOHvQO9R9N7amQOImRg+ZMDs2O+9cP1XrjlAu44CM/aHj7Etv1C3HlTG6n3KC1F+KiWH/IsNKRQi3pDI2C0UnQJD5ULToKt5Mt772s1r5w0cvyp6bsWf/nYXJLmtPao0JtmpMD0GvmFZOqCTwCcFCRBrue/FfPVUDAWtUFVBrVJBmCtNTlUhtYyoVMw3Z4216yoEEv92GzpqUY4Vjl5jXS3GJDhXwvvxNMINaw4XVAVzY91rV8qXHP9V5OHIbSzQu8RVCCTEfouMUJkM6RS/aJrHAQrfqgNYG+tbnSyybV+FQEJudyAjW2BepJmLH/TY5QRXjd37sdhzLGTv287eY1H2fh4O4VLm7PeKUEgUu9q92fK9KsLbTwjS4WRRRSpFiqf8N0u8V1XbBrEre5/EtiNI5w9qjXUHsClNBHj8pfXvYXpgprF2X4VA6C/4+FTjHsIWMyeNta9I4OzPrEyqqM6bWM9tXHoX3TYK4gc9sxC4jbjRIROtLtxODJ5v4ewxFpK0XrpgeJ+GWmMhDR3blyEU2eCcOxBA6W6A9K1gzwrBmR8fVZvTW95I5WlAgy+fprRPxXb2kZ9foic0fBCdZvpCgBtbpisiprhv6yw6tRaf5uNyutyUsczpwrFhhzjGsi8NShVQd+sbwoMhg6qrUlTutBJuNl2/jiRrN75QqHlhf3SP6Y/UKQOIbreOId4QWrFO1aTQQTRlY+JYd9Nwgrn2XIVQ8ci090EIKL49oa/DgiaQ6nWPX7EMNGEwj4ijDY9T/8qLGAOq/6Xn5TSEtDEVCJFoICqf9aoKK5DKN/UjGpiqq//+b0CqK6WcQs0HvapY4PTPVG0cVVt7nMY0cnTAAgfC+UGvLhZ98kL0RHzQoEw2bokr/Brc18ZhRO/FHS73jvLq0ijcdW2M6nHTWO7kRhOWGqaw1Zt09ILIs940dwXydOVsps19BdSu2fv1tikHoJWeposqKxmI5q+FN6PzT1u/yqYXk5vYD4CQ/drJN1FWVdPZWMquzoWm26TnMgweH9NimFVxFVI0s1qIpq/OIbgg0jIEvzNc2WsHaeuCKFzP3m94deP1qxuXLTe9/k0NB93KeuPm19oASlQ59B0N54ff+tZwllTcd04sBROvC8BNmDfLJGyYKvNk7Citdljru1kdxW1y+gIKV1JayOA5exX/KEd1Qms7l1qNrAdVlt/BzmnkZ3IgEatVonz9TBC5t5nGG+rkCYN+lW2qxjb05mrx26cQM83Yvx4n4CQ48MER34z9XMfgc6pRq6QxZ+x1Rt7KvhtefscinJc3zA13AM/YP9RFANQzdq07yWesGfIY4RawcBt/xk71tnK1avKi6EuvVCFIh3jaYTT3eB06dPe4wLZ3gaC2bPFF+BgF8GFcqU2tJyij6hFDiameRgFy6wnX8vPkor5vFwZ5YS+qLyLssGn8daQJiAVAflmU5ZdFQH7xdcLX4Rrqddg0fjOy76O7Lg3QtK7DZnLhFxv6P5PrcH1KS/q66bf/09wJ1yuVEejw3M/K9b8LsfySG8bm+t+FWH7JDSwr2BOA3Kvn8t+9ej0WrM6P6BEA4jA8nbO9AgDlBh07U2XmawKLT8waEOkQ/3W0VoDNjYaHaiL3sIRTF1qD76yQm/JsHMoJBM6dPJ935HfDj+mzpnoHTVaHEM4F7UIa/u1vLNRh8S7hMUlWsvLL5GCh0OSRPHL6cGiPm8rCQNNUGOGlojBm5FBmCEQZphVtQGQIl0Se1uzersRUAItDLXtz8VyhBwBIT61XuJd5hox/9aAAIDe1Sh+TjK903oJnUDr6yk8tn/oWxeCvImvmGSGtFVU1wO7MVEW+AiD91KLs/ieUgcRVy6j5VvlINHUMXEVyJikWiT8JJDbleEj7MJjSKAuaidbK1M0251xQC1KTw8NkB8r7QdumlT+ISUH1ds7hJapXcICyKc1V5sNMvjCVLkaJyK4yqtaCD0MalfYgarOOGJZLNLNFbMtp3cxDvJ1PDGKKhFZUxzkh6S4jZnOONKSuXendRN8WDHZiageGOzL6Z8aSny1PyHQ3I87GObKwtuaWL78oRcHFe6m95h3akUht+u4C98RDviJH6ySe84VcWzf1bbq79wkBklCqQCSIECwJYYVGwhDCUsKdrEJYtevytKBzVVUW1HV9FVVVWcA3UNbMrFiSeFXNzIolSRdrZVUqRbqEDp7hR/QInrbsJT4rUFNC2EYxJkmXrjM5S3Jdw+4Sm7FF2lbH7hZ7Ll8L7Q3jjJxz8NgUPNTYBs/dr5SXWGrF1ZdYasXVF29El9O1dXe9slDX1kV0VbpT6zZVaxHb8s15MpQ7ZXsh2HY5JJ3BQUOE4URG2sa0XShcWqqlZWRnJrRd920iyJLMKLTMrMdQhya0nguMVWtjNdVS25NQWLNUyxW3b2QqcLYWgAi7Qir0GSbs+a6DR1mSOYX4JD4dn4nP/tecQm34JUysIJcwHXoqpDHWud8TULWpQbSYzjZQl2kiFmabDqu+IQ0ITVEaDmu0V1zrBfchegfYCRUOquPMQ96Ujg1+4UxEYdtUQYdrBclqtYEOwlVI2/ibcw26VqI35kpMMf2GXz3WkIQNRo1Dy+Vt0Vi9PPQZkSzyABrAMSWKSrIhejEAGjQWM1UlxZxrXWGYVmfoHnutTTTOY8TWV13Mhbs95ZwjHcbsxU9C1qmGRxg6HYQrZUfpdhExBpUbumdVnf7/B/qqrhT6Y0MOAmIqBwEzlYNAmJpAPvsCZrXRbf65+PDFRgsv41ClGYcrzThS6cGwrhxrItJRUc1aLyLP3Dh5/Yv4j79rn+ZNmRe2rYQxHtPB4XgfNcjzidd75m52HcOzKBROAnN/BDiTgNOqGsB+FJRP0O8QXI9Q1nKAMURJohSPkP7eU/Jc42yJBNQnYDREAiqDZIcE1FdgMEMCLe+hnj5k5CCnH4F6JJyzj0D7I87JR8DeCuDcI6AjyKlHwEcTVZkHAC9TEX2g+uVLAWwbf00PBGu0hLDOf9POlCdDdTHnLk+AaiGBrMMKcYTz3QtlxNLp+4xvpw75ahPvrP3891bdM9gTI3ubMV+Xhp7w7K5bjeBf4ZZ3kWebcIuXjuezVtNLZrore8ImG7nQ6JKfmuTYVCM/Mk6b4bhMY8AA/h3KoTufP2IV55Zw5TmtM4JfYxYePM+WW1dHGPgIhjCpRniJCWH8JQAAWslt9bPK3ovv8F9JuoIh/cfc4+T+/t3zMQTpE9DnL95a7TDwEQxhUo3WtfJIdSEAAK1kirfBm1mJYzcmsnz8B7XjzP4K7vMxFL5IkjCOs1Y7DHwEQ5hUo0AK1NjhUwBAK5mJPh4YK1XdX816eNJ/OF9OcQ8B0plDYgDU7nm8a6WDIWxOfiDTn5WJ3OSS18sBgEXRlS6dYtMuHmVYYLdQ4d/8B/XlNmi2KqY5B85alsdX1hqHQdWZ/BCmLatRBcc7z90BAJ6EVhpyCpMHk6ckBq+UAXD8x0vn5HZ6Ih9DHtWv2t8+XqsdBj6GIQyqkW9HQF8eMwBAK5nixYtSMHp9t/G2fPyHcOfMNt0jH0O3qJ4njyvWaoeBj2AIk2okoUqA9XgEANBKZsFPzrEEEy/xCCKe9B+HpVPcBZV05lBoFgzEkeha6WAIm5MfyPRnZerb6Mj3GA2ARdGVLp2CjrYPB/Pky8qCwJv/TFOd277IpDyHuhMk31t9t5Y5D6pPfg7TmTXpGVvnG7ojAE9opSqn2WrooKLdbQw6pzf/6e47uWuj+dviUkHs0Q4AdAosI7fyY5ocjYY2CopoF0cLoF5UJTef4ZxwcfZR4ZuwXT/h+k9I5inuc1FauJaodEFSpmolx1DF/MSmkGvblWqzOls1ACujK908LNlbtO+A7cq1boj/rH2e4N5G5aOWDCq2yFThJgeNZmKT2lbvMnApHxwA0JUMp1roe7Ln9fqSoY3/aEif8JZppcArj7xu1iQHnnihvS4d67R8Jdwjf0ogHQ+A/E0qTwVGZRWPdht1F8jM8R+ghBO+6sHn2UD9qQPTlkP3Sxj6kE52Ug97sOCpSmhBOviVDL0LIe84z1gn95b/QBec7+645XlAnTkVt7MHOZIqX/fz05zUPcyKIpuaWEi+51cyfIt9L5cX52JRv2BwZofiFsb6NWf4ucge7Em2rgLc3wR5TN1EH3qm1+4MYOTJlGyGCqz/ad/+vPjj8HH+R+URf1UYD+BevK4CjtaTsecW45PfZl4NHMOSpXmEt6ZXr/0lgz/gIuf/bDlGzwja9lW2rgKeNRBspsPR9V2m1+457JuugLbjdhswNfGfwe7zvJb3p+vryhWJj5zUvRSh7S6b3rR6nfPIUVXtxYTgcX6lv6eZ0019nnK7yaAaJvcfD9dT21TTlHOlCHmyyhmYFxFNC2c0oeatXA9yosI7IQEoNgv7SfFJlTF5aYnu9JD95Oo/by9nuO2sqd4qU4QexhdZFiNZMWd8oXquevJUkktXlcHIO4v63dtG+sni+eLKOuHflv8QEp3srYdyir3xkCvoWoZVuNCGdw516r4SoTrYpjsoQvS+duWnxmfoMVyJ6sTdFbbBf2CmT+1iW5VCrxruHZH6al8FRdDXGVC0nNvYhYrKjVYDcG8UVbRDy3480NFbPwfySavlP6zuZ7gtz+nc+sETbCmaMpgZtHi3zCpWv+Wsr124KgCAg9GVJp4mLfBUovnyqqDl4WT/ees+uV2uTvfWi6qhh/o6C1Oi6dxMJ9S29Ys7kOdm9DUAy2ZB/TolpGZ0t5DdbbQzH/+xhD63bRZPs9aIUahtVWG3fGg6NXMJpWYVWeIyl4gDsGkWlClQLNhnjre3O90J/1n+P7Vr4FfKtYJEBHBkhd/GRdO1GVMoFQ0uApoEv2AA6s2CMpyjBMwyRbgP8t7C9R80KDTdVvuUdOVRFMUT6tILFlrguoFOnVfCMD8ihprnMFTPrxT/8FkZ341f3fbzE1jnwZ9Cs34GSPXXJ8nidiqOlGg5ng1kpKHyr5fv7govMF8AOB+IYn7UPwvYMh4FYr3KXAmdCPjPfQXadY1BKr2BhFVrx9VhXCwdnTGlHhUt06OxHtFjAN6Noh6jCDJ4SwXyI6NObS//ibRCwY5TSCPXmGKBKIgpkBShFa2Z3hR1zTvqR5SPZxuAudGV/p6G1Xto7o1PyzVomNx/fhBQrcUgUs6VgvIlP8IB94ho+jejCTVv5VrR10QX0gtArllQrU6RL+G1NvLLC3ybCP7z5YBmV363fFQKOP56WcveRESTjCaUyiUtzzpZCgkAWVBGNUfMnOz698x58mb5T3YQCraGRqq2ihzGbliYzIsNWryacU39VrV6g8r3VsYAyBhdqeThTSFcVRLPy7ecMP4T7YbCXeaR0q42+W6L1cfigoUWuXSgU+vVj6C0gqtiBkD1IpXinwYInpKN1NQsIz6nAP7zw4Nql0+7dHntcKolncbQZUVT2ZlRqJ5rGSZfmzKbPgAWzoIa9zaYbsGbo/0ehidtl/9oP6Fhu6WkeRsIbM4owrrJDLo0s5oGrkMkKmZ0Sc/hF7/SxKMQwwzlD2qdmrf8J0kIFTvOJe1bJ8T2FD0hknKCNq5mPpO6dfJe0ngFPACWZVcymB1HQiLGKbrlP2JNaNi5MSnaaoHgOdrAuIqK7JERhVK9ViG651mGgzmyoEyDxDFHjIfXBTdi4vUfpDZUu0AC5qOaQDBYYIOkhkZTxBlWqIKrm0oabyG5JwAlZ1G/M/Vl+2XN8E7u+i/7/pflP7FjKNqJPGnk+lEK48mrvJQctIplE5tarmdYMjXYNY0QfMyvdPOQ3VgFOIGKdQr/uvxHEA81L8aEaehaojEM+DC7Xn7QnpbNbVLbKISg38EtQbA1v5Jpru6hCRD13lqRG3nbf3Lt0K0Tj1LOFcS7HplaO05cNL2cMeX+3gbuRjOHFXpEADScBVXvcJXa9B1mcr8sWQrXf2RKUbF5l46Fp6Aoyh6O6Cy0kDVDm1pucXkX3uzhEQA9oysl/WO8LGTgROLOdBLFf4Y1UfY6xpjiri8IybBhnKNAof3tHOSUeb1r4+kXuRgCwOkelYJ/QF1Iq++j5/47v/nyn55ZFG2kqvR6ZeELY3zXVJUj9NM2v6nzSocj8MqUBR6IJ7/S4tNQQifhI8e9fEUq+tx/FoLR7JInme6uLwRxcJjl4PRoHplaqrEL3inESMJIAEcW1NNTtC8DVAgjvGpdCuI/Ycco10xh+agv2rAp9wRt0qNJphZKvQst38OhTgdAFpRRbTWNXu3+XObpjOU/9sgo2sBkaezKkvloss/MNEfop21+092V7lYfFinIBYgnv9Liw34cXRqCmbotzRP/MXhA0/8LmhxJUVvJvsEy3KuFVrhsevO9zqEIxIzkvoHwzq98v3+XgqA9e7T/g7//bfnP9Tpq9sxbirzSXFawt40mxQltdNkYJ5XPD5tly2YcBLXzK7l02ZPNYHCN9XLWGf+JkkfdvqNLy1ec9uRCX5DmZKFNL53oFH4DJFittsglAOl7VLp/ehs1mDt5JO2T53Uu4D/KHajYdXup+MaSVVOHzg0BQmtdM7hp8kr3+kn53sEoAHujK4U9RYxDLAlKyj+nWBFV+w9YLsq1r19auV5MOwkrEYClRFPAmU6oeuuXOeHVA6FCAJaNwv6iXZctCqmixcP1n/nt+/Kf8BeU7dDBlHBTKYaduLDEKKG17BzhNHWVyWDKe49YDKK7tSt/ftQRAnNseca+Tvgflv/kT6RsgyOm4BtPUNJpqNPChVa+c6iTuuOetddgwwz6JMC6kmmCN8m35tlXX1eR0wH/sXpGt65+TJvXC1NVKr/DeynRNHWmE6rl+hXzmP3plhYA5WZhfzzYBGsDgv7SO21S6uE/nEJodlt/n6KtIIF6L6zVBuNiadyMKZWKNv60nmJAMAD1RlGZ2u8Ns7yHKf+DjeHjP01CKNfImKnbSjGDFJIDzhwRTcVmNKFUruYMt6GuCwBazYIyxYxaC2C5Tf9tOuE/4feo1nueqdgKcsSRU/3QNy6aus2YQqloU/xiEqutAag3i8oMzfj48srpBmrfC/+hZUi5m9L9FHA1oe3VCHyNFRpNDWdYoVQ3kgiayVhAADLOgjJ6aLx9yz5/nYSn4+/Lf4jm0a6lTdO5rWH6IfmpcmRDU62ZSSi1yoIe3dN2BwAGzYKyZ+JX9HBcq52h9R/3q5TpVcLv+Kc1a/W4KAXsHs/NDFq1nllN41YzzK4jwSYsNlGwY6WJLzSYj7VriT9v2QblyK//jNPk4rVZ7KcVxuqwAQ3ViuOrqYFe5NevCV7sXatWryxrkOcCsYl7WMHKPQf2FAO3dyueCf9spaUoH+K0D/txo34zopkV5YOct7TaPF6OxlNiaKwpH47JlIDW7sUynZYsD4z+ETzKtRvd3U9LjNUBVOv47dEu0Js1a4KLM1mt5D2weo0hh024gJXcjcJjD7R14ME/wU4pZFu/81//cKMD7n6g6WKdxxpBOwNRbeYR3NsFB7CSydRJXLAdK1fWw+E7rb3iZb0EXPHQqn8kWnLh5rn409DctXkQ3NtqgFTw1+ml0/qLuWvVaJ8+vUSlc2yy7i9e5YH3e5V70mxesMM/Amwp5De/6/dvu9KbRM2bKH4loRO0BxDVZ16iV9Ny2zTL4iwuxa71p/z9W0Y5t3aZcSN4dcFNW/9oEOWd9UVXIufkRXKinz8VFVYBZ77TwZIwoJfwdVT/i7prVWl4mkYugRmbGISFrNyNv5vz8WIRJBKDfwyHU8jJftdfwjViaTb3Jsf66oWW0FZDVMN5UaDNjyJdio+g6L9/QtbFefFYhdeuazcRi5seoLr9w/2ai/ezm9BnI9Vq8trr7ar7AdDGYf1a5KXdteoGo6vRXB6DTXzJAlbufbFbF86LsOvDg38gnlPINH/Hn3iviyqz/m4EUCxCR2j/IarfvAfGmx74kuOcTOi/l0XWh8cMjXftreOVpFkj8eSft9tcux9Qij4TlVYRDxwU4oVBoK3C+nXHS7prVY0vEMPLxjfYxIisYOUFC/3QslWNzLogJxnqvrXYWy3n/iNq8r9C373hdG7io1570eI5FxhbHOx84sRZv1+3eGbaD5ER4B/bGt1EKcixYX/7qKuWVHo1gTPEAu0g10LVZ++6tY09jhlSPAqbOL/VqLNvdU8i9L2tfqSOq4y0ICxAibDpnL/xn5NuO6nFx5vM9aBiM956iVezZb58xMLUt0HsJrkT3u0dUdvn/2/dOic74Uy/di2pE9H7BXsNHhIeIoSC97AcLcJG+v6866kni8WIXl2n2kVznXvmmGwoJasSMrL20R7Nle6aZ9nXriNRytXTfal4SHyI9Am8xRK0C539/rcP64n+IF292wKgHdI698yxs76Nhx8PVityE650HR9eS9JqmDaiacNDsodoPkHzWASRnyQEwXZyRp8ivNrTLprr3DPHyfpm5YmIr8acm3Ch6/0rvEj8KewehfJq1xDjQnquCrLQrq/p9uePJnNtQwy3rl7wkrRueLi+pjOSV2jcaPuZrEvwF4mvt44V5hsHbdEttrwLaXs/T9y4Hf7zO9sqRKwaOzfu+xh5ZNN15v7TKtxRnV7ZZdw/guTm+YBPbNPsrhr8na7hnPPcFfjiySin5d2S258Q781J4e/pDqcd+ILmKMOOX944FzpS6LoXxIkGvshAOhx2y1CgsdBMzMLfpyNOO4CFP9LhsFei5snb3qvC35EmTjuQxXjSobBbwh2a7ZW+LPy9l+J0A18gKx0Ou+X1gZ8pVbzC32UsTj+gRevS38grAGwMm27JARgg4gr48wGDUsprqy3JkNPFxxjPAWgw2RjcxBR5b3gA/u1rMEqdLhycrjwN7LmiB1M5aFBqOQkNcI5hENSPnIbTpjwnQ5iZYVJgeklBZVu1sU1tbosVk0lKqVRWTrdTWJrsorJIai//f8makvo2imw/YMk9EroAkaR9QKORq+8goJL0AkaR7ed7yT0augCRpHVAo5Gr7xCgkszO0dmj90hDtmr+8sNZwAW+F9llZElhUrJ5HBsr2ctvZ0vYczir9udPClo72dmDTLMI/zm97zC0F6EtG2WRpiK2c/AyV3XIXxGkJNoZoqmxrR7c1IirXLawziqdhCiLcTYeal13KqKehUnJbCKniyV6e/PybIlH7NnSufgiQpnKSUKUbdEbD7XapY22i6Io3jhUk9Pd5dhrBqEUya6WH28iVJPT3StXstdshLpI9mgJ2jhUk9Ozy2KvOQhNkezRkofbcpJyhmhqbDvc1R4cJROLshi9iaGWv2MbkMm954ePvMV2sjJaFhpNI2JUGW2DwbkoNrjysRORmXR/bBYr59K2aaTPUNa9ch/SFTtJCjc1th3icoRcBCmJVnKmtcPbNpIihlrt8gJRFEVpdoZoalz7dGNeosPlx9J3+WUIbXwoh2gv+FO7SYurv+kqF1I+wvQy6xOtuW9j+lMXMlS96F6sN20NX0m6B44JLdATJiLVLDO0dW3einGanwsf/bm+aB96bS0wkHAAgBqlqZ2Sy/QdMoGsfDnUAOIG4e35NNTn8XYngh5Jcams0cWX9FH9YKK8/9Wj7cdjxDOldQ02tzKl6NwpuDka0NqUwazTki20btRM+bM+/ou+QnI+aCkeEaolNRFSrHL44aP6siMFR+QDXZKPv+iHJtxasRZAk0aOavTuip5/PUlYOeQC/zeayBbEcG/xNM42vRk6NnBwjuo+3k5hF6e6z9mLpH39vyaMdjiUhFfuvumqAIwuSq71aod34Sk2p5VfBOn9Wd1gj982a0wZc/rPJLbthnfsB6+cs4H/hbaTbPnfctoJxeFHC6GSZCkqjebU/9zYUrz/Y57VLS5sREoOfzyLsLwOch3tq6nXO/R9twpk2imVBK1A/CgnhvqSXlmuy2OUctIpb3Zd8rSRZ57BgXfaT95qA65CdupqwECeth2JE3w2jtarnpixYjS7OBqwl2j9AJBwMLuu9QsTLZ6cr+qcs/C/3NuPO3/vR5f8qxv9PyqxKzdJy2ovuCN25x7Sa/UVg0VMOUPNL4Mo/Y+w521Y6CkxSZnF6eXe8S7WhSA48IbBS6+8xkKXdziSlnBBB6FA44vWBhsccAuFLt/OgF3uLS+xIAD9gf5Af6A/aMIgmuoHlapUZwX5lHxKPiUfGh+uPj1wmFBcvUlcesu8zh0AKshSv2l5nv7MFhyw+6Bms8/quR6oIHt5XA9UkL103lw38c+ZPY3STaolibRjz/2afrGaUnsS2GiPQbdnGvi0KZzPVCMe67+0RXI7tf+mcZLbPyNv87b2WvND99zzs7HXuYC32k7mbjOt+Sula0ZHjQZoyWNk0pCa4quO3kKktCDDkGQtIlpEnBKlumjKCpEt+4DSqh5eHK3AvgKfj/REuQI1q/BZBuzhBnmRgFURbACYFWUFVt66xGWupJDh7J/KirkCjR/i8I+otfl5x983RWVCYYGceQW66VYg5ViBFFgFFkOqAYAqUJpNDXzGSCowHz8FauYUmAOaAguNa2B4KZCipEDEjAJ1Z4ugPRQKLHv0KptIUOA3TvPOfwI56Qn0M51ADm8Cc7Aqg/8Jtj+opYM7D/lNYBisCaRYJhBBmEBKWwIxWAlsSVACP+694pHAEzAICUSsI5BSjUAMMALb0IlASCECOWII5PwgkMOBQI4sFjjWB/y6eO8EHxBYnEwZGcAHpKge0IqIFUJAOyCC6IB215eD5ngIuaAc8BP4Huk4oJuDA/qhN2BLwA3Y3oXeQLk2YLFtmE10UjdsPDlP6IOJAx7YPvwWYgzowrXInbhdBdgUmHtw4WkSF55m8eF+FUt9E7jfRFk9UA1awXIBsTsXGrSH6gLqR+feIJ1jnQGeiQI+1CzAnoDRzmOG6J+i97vqIJv9xn40O//86cqQq9F/ran3uSS7tjY1f1Xr3LY8rYo7HxlUGakiFLYAAPfyQqYCbwOmxakEjwgFoBJYXIAIFKcfgsXNh0Bx7CFYXHkIEOcdwlK/OdtYpQwfbbGGHbKwpxvmX4erBBb/HALFI4dg8cEhULxuCBY/G4LEs4ZQc/M7Dwf11+lMJsV+ejs3khb7pfvRECA69bP2rBI01iDA3aiEfH460AiAhAcAAOZ832+/AwACgYCg3sc91Z+CdzKJ9HuLCoyIiQoMCAkLDISFBwmDhIiJiguDBIOEDpAKDIMEgwSDRFwfg4SIiQeJhwiDhIYHg4SJigoMg4SIiQeJiImLDIOEiIkKDIOEh4gKjAoMBIWHCAgJCElQU1BTUFNQU1BTUJOa2/tfHSZ+zV0e0R0HHUvC3UO71JuHt76vwcci84FNNIIx9kpTySzdERiZIk8fQyJi/cOPS7+z7kh8RKwsPSbFc+Ud7AEsRCMnaP17j4a91pzHwbhcLc1kv3TltxJ2mmt+Rtz6dx8XOdRFnDCVKC69Lsnmysmvu8oVIInO9W89FpYdQHSBgcAuvQ7w5sqsExtQa1zM8PoXH5d984afyyJjvTQVgNSVM0vVX5AyB/Hr31p6U4xnNIixLDDN9XF15X5G6uXEfccJ+zcfC/TtOJcX4ggxTZbAdeWMSJpOU0/ji/1bS559GBpQuMAe02PGRVdePSoClc7BRLJ/79GYCzJ/HVrIKdPrRnyuxPEYvVmfeKHL/sFHBQqXte6CjGamiWKmrnzvaFxwMXUxZ//OkpcPC247s+DPNBP/1ZVwD8hAKdoDjPYPLfnrSFUX0C1immY6ybrjMQqRdxq3zVL79x8nRMXFuQgnZE3PyVRd2VkMep9ktcDX/tXH5Sj3CN68NSabJpMqu3LmP1hGpNUAtv1bS86qVrS8lA/mpuke0+4bL4p8fqydxnr715bcr+mrt4R6JDhNpn125WyAzuvZpw8T928tOQZ4TVMcEUJOU9mIXXm2hR+sl8rS5f59pbR9j4bxbSt3Ts/1bl0ZNYbDrR6f8ujemRUfDx8fDFRMnZ6ChrrScgKMzeUhsuv+ud+mxrOnuF8NAtppIjiwK3HZhMP0k2nS3T/4WJy4I8FaPSbg6WVlS1dGAD5DY+82Jt6/9EiQYKXAwjOj5GkqVLQrYx1tBGXJEkDvv5Ive+JbtsWH1tOrdIyu9NiJC3lGkqz988yj4Jca0REDBr6nmejRroTy4lnPPJHE8v1DSw5uqlNvZJrXp4dKq668dPFla2INM/z+vUcEIgbDGSqH66fngMyu7FRmRutecLy/f/VxaeK9m6RHrAGgmc7ZroSH1Flkc1KCAP/QknNz6VkgPTIH0GNeYFfeGg06OpBWn4B/r+VuDGvge/gsAzSXTN2VWw542tI+TQOBf/OxiJgIx5GpkhPQYwBjV96XtOaZIOLKAv/eo7FV7jvNfSkyoId+u67cfCXIkZ/xyQ38m8135s21kkwLD2iumrwrJR8L1cF5CzIE/9SS68kqBCZE9iTQc/ZmV+EzF+Lcs7En+PeejEYj6o4idyrQRMJyV/oxMX6Vjy1kC/7Zx+Vg7wUzGYmEgSaDCbxybnZ4hqtNGBr8W0vOAoWzCIxgb6CXbX5dGWE8s5kbAHwO/qVHQksyWBSJ1PBAs+kU3nHAcwOkp1Xpf/BvPy6WcbyV72TlEDQTlN6Vf2fg9MFeoDbCv/u4APjReVXi+iToKeq1K1vUdCKi3D7JhH9l2e3NtC4/HjdP0Ov6ya6SAHAYj750UfiXnogjGnI4iWSnoNe1ol05I41FnoclCiv8W48FhwZpJbxmhwW9jjztyhlTVFqZPqO18N+xqIKyeLytbLqgmfYErwTaaDePtU4cGJ5JJcDqvEL05JNjPL+3VIJn7Fa6lMnaDM9ZraA3ubWAfRrP95ZLgIrGSy67ZNrwXAnI8OXCXnQpOJ7vO1IBzx0mfXUo5/BcCeRNeQofcFk7nu+tlqCuZzV40N3n4bkSLE2+uhwDE30831srwRUi9K1wnQLEc6VZReK57kJzg5A/4dY7coPXqg2ntgqRj/+TRxWA3BBPdsw0IsbPQ+HpQvMGIputcL1d0kcG5UQcwR2o2kBeXl1JOQmcCRm/e4/icm5GmaqcC5XFlthV2rZTkXlRvTV3fZw8IHBts75TcdrvIF2B9VluiTu3M4g+Ji8wmGuPDItcES5sqZpO9Axm1UQH5AEBHnDTYbkYef7ODKCifj0RsXStMPR3JOIkZCZ47tqE4lrdDEddhX36OBnB4YwKfURWKHIwjshy0VbVAZZEbOQtS9FLZblotQc3r6nIyEneghxR68uRBWvEUSF50sUQJJJGPyfV77iQBsmLssjJ0LWCqI3d3pIBnMhHdJfYECzsLNRXhuCRozfQAV2rF/WksQMYACJnAWJIMssF7ja2hJBxojz1QQkaQ9y+FyROw4s81fgoKDiZ4MqbFxT2NsPR3WaGiMlD8Qo+prne2wqIbAl2XUQWahWkQM+F9SEqm78SQNUao245r+dklgunEA0e0GO5AbOe5k56+FmQ9GJNKjrqKAvIpSIivxUDGgJ+Np7fewgE9jeE8KlaFo3Flug1xj6nOS3CD+idoDwqOOqVkVEhukQXbrEF8oSEysRAuoOR8LMR5fIy6Uy3Idag04oOzwWfTUCQ0JmovofDFNeDzQjnnR3Xdwk2hSG0HJcAz4wJQ43QkVHH83JkOl7k5Uqzj6I1ZkL1hlcpWmM2hpYHishiSwTnXm8SmW3LYanUjQF41GY4+8YAEPmdA5/quXBvQknpcq8us43wXKawNmJf9vUd5z0jrLdFYA49k6g9yskpWToQtZu8GMRyCgU3bmHvziRozthPFN6xLpNNsC3Mg9FFpiLQrU0fJw84GAhPH5WLmJvg09VS8xBz1su6roatcFKVV0RUElN0MNWgB1TcaJadAYAKiAReMzhQ2SzmUW08B6IGE0kBsg4SNfzRcPZ7gVQmC+lsjpglupSLCWrlaSJqrZG8095CKiSah5ebQIVEQtH0yKmsFyNmK6fnHnhGj2gK1T2wrHLLM2uahpKHFcWyJI6XC1qXRiAPyAlKCziRZ7Qtg6uKS6ShmfC3TTKkodlgOhsd6vCcTPCCCnV0YiLUNvVH5kEog5z0x85FP4ap0R+dlDJ0f/qz2pbe7Kfq5OGRB5trKnn2Fr/3ICSAPigPQnbtSR/IRVJAxBqY3UUvPgKwoK/lRN4zJ8ak0ZmwU1x30ow3wx67xZH+yJTISyTWn/mm0Bm3HhNHR72LtInE0ZEHOWABdXTUBcbIQ535wuUoECOIa4M5ykowDeIa/DxR9YYdbdyceAbKKm1YXkLr1MnAoKhTV93GwNiRJ14pnKEhUZt3j52hEZFLIeRjA2OiTodaQQPDIjczDkby8AgrejSRPMtFMvnu7tJmFncgPpukjY7cGDDPKWNnAoJBuiljsiG5N2zEUXlwdLte2tpBLnqwKFR3eBa8Ti5Td9xM7CC8VfLgqJ/raxXy8MgVLytVb5wMlPKuhs5aSBa8V0CcOjJqDbipps4qdqOr89LfxbIZhaXvcRNmd0Pw9T2VoA3PyURbNNKG5cVQ9WVTZ7roAidEe8Q1nsi1BTWVNCIT8ZjOlLJWkI2exUyiz7gNCWFjvvRhuYAFUEbS2EzsU2Q3ytq+bAh63jJhJptCq2ehQBiRmrTEp/TRUQ9s8BB9dOQud8lLGpyJCE3TpKzVZSPBB9OJo3IipysBxJlsy3t+RqcGhkbN3PqaDcxs4cS4uN26g1lAPz9R3eGZmMuBSSODORlka24j4+WFT3HOqANyMjQgbtTx8pL0PPko48ftuhHklKGxD95ght6a/yyUdyqb7uhMNC/Krv5sbwO/7MZd/XFz0adVNfqDeejTyTjdXfW2wo4O7oy4phMJ0yUCUVeZ3wWgywNGHRSJIHJtUWe1mL1wTA3qeJHY9ngrcY0kGhscgaMORDKb4mHUmS7GL477MXVwJD13Go86s8UcirZyUYdFoo0s19SR0bD4XI17hma0b3bruWd4Wm1LrLEfks67RwzMA/m48q7Ha+2ux2ut9aDj+1IM9x8Yp7/yH+IGu2arxUHf8dq0/P220XyLwCOmvI/Y5N8xe7HDFynOL7461xVHrSHj4R5peCyW96NxcIP/C5pNxFgt9uGPrNo/bWOJ/wUtrJmF22H3x1vt7yrmWf7XuF7A+bhiyMpnsXxY6N1hckmf1aYJ1UEDUr6r3qbt6zyLcOtn+TfRerm1S9z6Ub8WbWvtRigfG/9STvtRfqvlIzDme036mazpKnEo6Wey1smJVG79rf8m2oAhBj+3/sSvRavw02vCf50vP+a5uIPPObI0WT5Y3zSOzzqy5OUsrufxmLwxjlpXxmHu9dj+ix5Z2v71aG3vUNyXPLK8/DehP6JRTWrgKDrWXCj+5PLuzVtu9XNt93Ntvxi3tl+MW9t9WTAbzs2HuV+nwfxPg/t1GMz/NNivs2D+Xffrccc8sdvhCRcgdLAAgeMfOMeOgnkhhIwio8goMoqMIqPIKDIKlAKlQClQCpQCpUApUIqUIqVIKVKqqZS/htoxVI6hcgyX48Wbw6CYDkb7oWwCoDfWNkqzjyA1lpy4Om+I8rlRy7ZGNAVhPUEQtJl7gfyoR9b+X2B19qMJwP6ummpQDR2Caug4+H/mnMX1j28t9ORCf+tre91qf0z49d/8KgCZITPmqjew3/zab37PX/9G9B7a7L/4SwHIjHEBBSAzZIYC6D+szb/YrxtTLikAntf88XOxdHsAXCPE4j+R8ZkYz5J2NU8doWzprwXQTmSJ5zipFuzmlEhlq08fXKkb9GZUn98MIqWgl66YZasdN8dWAZh5deyyxTEOf86mvywffW6pB2dpQVhfAIkGQwD3z6bCdbDSikpsWXpgsbds8bgVsLwFkJftiSig5+QobEtvpqIsW072GihVG63zldwPrhy3h9Lr7dp9mpgfPMgdITr9mxCjbdU3TJ2PfcfDYjmrCHezimII2VeaPLjuuKfrmMnkkx8Qb9hs1g9YWYPn4nFjDNkRthbJU5LhsgJlC2nIAtd3KGZfgbF68mhD9hV2Hjro494N3EPSHd9mD/5UXyEO2eqPyRPLA3ZcLaBUbUteslPY98eSKZADPuBmTUtaToaqyAKv9nnjSCla/k2gK7LAs1Y46QPPuolSFlngjV61MIA756MtMn2QQbD00KJZqhL6cCDKLPK5JvlfWUluJlbTu0RvQXXL/ulWrGAZAcvttrSkcEtmLQ/SmJVefpP4lfL6gdbnPaqPCZWG6msnDsV3dHPoupbyurspQ3HbCgWhIVe9cIBUgSUlikxKsHwk+CuhIAuKBsaelq+kxRDcG0sILY7QPQsBnsCqAC9l8d9FKbFeSVcO9FFWaq/Oh1cG15BBWftU69LZlT2IVprlDiWrfCahK9sjkVA2OJmsceVSdoOT1UT0T4b8dyc+W9q4sj5uiif7Op4tPdjUnY5nz3RaTjS9W0knBqYppdplhijbmUWQegg+1bmrzFKyvotScXOglfrscqfcKn2tB5vUwOegLj1sUHaU7f2CrQZ05rSMUBawh6YSLCkP/x5OrFCGhDS1o/2HRqVnQzcWLQTLA9wAAhRk8RcQlbSBGhRQQwe0kKMs0FStVszed191UjX90FY+mMovXJV8UOVTqE4Hd1/X8xedtYPAgbWp6xGna1dxX1mwuNceSxROPFn+KzuSuN/hKgX1pDiwbEcUugHd3e0rTndvQ3HLDBp8L2BlKCRGKltMlhWlqnbRbpV0bW88NVXYm5KND+a5lP62xQt6kXmvlcTelDq4klV4W2Q2hWlasSIBQXG8FRm3Y6Q1Frhfmm8O+QCm9hhBMp2Vb/43H1anKZ0JWe7F9YpRP/5HZeMvWjaSl51FHv32fEzpnZPzGJU7SpZQM/bN3VmUaD/4YEq/HGVYvkyvBMqwrCd7D7yn2QD4sq9BXQ/u77zVHEwt60s7mLTt8rPmhXIOvYKrfIk6LH5Nqu5j4NU6AAGzLM08V2gUSCCDAmrQ5O/TKDtfVJW12l742i1CZNHSuNccUdaxzBltX3+TahXK02aAnW9fktb/B/A/Ht31dxqHd+dpYDwI/m7HGF98LHaM8amPB+bfdQRd6zGu33C4XEb37szd2TH9WImSjB3XBGIW6oPiWp6I0RKVGbzjcRpl7HC8Xc3OJ7p3p8uZnMuqEuezMUsOdp8KYbQeFgpU575Vrq4O6/cdH06Xe1br/JukjNv3nB/EOHWXXYp2zbVa7q670eFddwu86+6A93UAGsYhUmEcIhHjEEkYh0hOmLrsFEYbIasGqnZLhcuQ5cMvLxMaSxEJq56QPO145lVKdZR6FGhAi8UxrNGyITRNQ9ZDVAZpQCTLYdKCTI4jpAM1eZoaVAAt+RwjFM0geMpxEkEkywmSsMCFNW0aT3yTp30yx8Bqubyfj8TprHGuLIJ0wQTCKD9Sfrr8koDqKoYC+oHqp6MqmhqnlW61bML9Z4f1BXLUxVoPt2qjec+scL89tHK7dgJglE/qDOTLE4L7B6wP2oOmmSHXPrrKVkuJXVBSkdxxL0ody3A2iqaoKaWOo8z5oRflImmiLnO9Kl4sKzc6h7qlaV2R2HrlGJnZWxRUq2GkNivRwuuMgjBFKXsctm5F7qFEwJlSlFVplZlxpWJZRuyxUfkehYPmCMsS4GdKrXylUj5DJoU0lBXAvmQy9s43mFj2HHYFCpz6Cr2u0YrnU1FeCy39buZ9T3lSlDf1Xm4UpRWFzoaiTJ6+yYO7VSkP086AoixnHy9d19oXcG8fO+En9Nx4NFlPlOssZDtRNri/+gU7z6OAhM/p5/Hz7Hh+qPKI3JhvIHKYKK9Z5dsl7at3dLO1c5O646lF5h2Z1OgdmNR7qoKXZBkjNjCze3FpGz+6mLyFZ4G3wJlVOe85sqFd12S7DtALsYA2cbND6aKnvSYwP5TaYeDCtW+4pLDT/z24tvDLh8SObu6gaStCaf97deVo2Gdep73g6vZkqf3hKrsibdgo8qP+4kZ/X2odx6LqlWDfNvSJZnza4M31NC1w64GW8h0c7plmLHHRO/F+Sz/WGNsiizsNq/enb3yn0YA6aTitYqfOsXiZsHw5cz81bzM6+PH5aTeofXk+20YRmkB74LhTVKejmteRRwSmMEBE8dxHDs+5lApYB2kFhnXaoAzftJL1pJYHBH8c3m0DDKFiQzmtHIw7H3KTN+0YN/2ACq99J+XvRFnZYk1bVdpaKOuclakaGOkDt1TTkPsd1n4orbA+b2bfxPmThnGvthsjU+Q6wwhRqm/PpoGqF7xLh6JVPpZORCcPp1WdE5+PsENwCK/PsU62O7Jz4aPrZPhoV+pPaGlwZnAa+ppHQsalXjn8db6tNZlj0XUebrOcEjDMDa5tbC9myzqfLTyo2IfANo/FyKcfLLrJrQgpXmdeUaf/RTK4NjMc5n9s1Uyir5+C2CtL7bmFdhWJLP8MZwoRPnINHOGsIWI5b4io+NEZrs8Mr3maxteIauLC+megOo4+Ilny2t3xiRFR7bp5tmrogtyk8XWyER8upWupstNfF92d8dRtxzZKVXtFS63S9SJkTiiClAxWbohS3F/5XvIoz7zKC591T7xG2Duy3k+eifX9x1QzenYxZWypapSnTKpRmTKtPrXD+e/D+C8iVrvtAvRczs3b9/XQ2db3/26S7TILp/Giy9sLUXctONur4lmo1geu0fr3mtpf3HZkb/CFKEcnsrgYoW/K8jv8+9+to60y7m8M/ztlss73upCtFvHoMLjfxkOe8yxT9STo94Gif7eXlX4z3+jn9saIqhErhsp9fvp3lR/O59uDiINE/06v3+PTts+GJ6s5+6aeaBePEgNaC9HyrJ2TrQcRB4m+BvR789p/IrWTzdG5yojRy6PDABcftDxr59XoQcRBoq8B/Z7atuU6PNkqBFwZN/p4VBjwKraWZ203cWD+m455HCT6GpBV3nHE+9tkz4JoRl5A8igxoAV4Ez+ci44HEQeJvgb0x2GwveXhyTJou1TwWvDoMMAVbxPP2vlgdxBxkOhrQH/sDNuNHp5sJjWb+lkWHs8Z4PrK9lnW6hTiQcRBoq8BWeUdR8b3yYL0qZTUnuBRYcCL5yd+/Dv7dhBxkOgrofYNiLW+4X9dG+KzMgaozQYYJJtGPHDtaSsJvCEXz3KR48zWNNoLRRUAc+VKdQmHz/5pugwzlwzMWnNiNb6tDUrffkNNZPUOcCHyENxUA3V4+AATRYiGPk0zhmC9fRtCv8iJi9tpNAtHlEjRnUhCjQtzuh06uuKcMM4CsEzhh6oLKBuoTXGJ5yAxovQUXN2eFR6a3vmM0cTgJvVM0qjywbUB7dvWcJM0q7MRDFXLInhYqe4F71y8WLJRNNnpAVgbt2Bzrg2SW7VYgaXqWAmfrT0PxqEz2UqpPRlSREXZUMQb1mqWaMqS1bg7p3l2r3k4jTGdRKs9oXp/eIR+kZMJd2RUEjxKZGhJLF8Rm+ekqSHi4N1VrGVThiHcWK0gZUOUbTGmWaoq61Vk9nMW07k7vVoWdstINafDCgddG41U4xzN0ktZqRpPPD04G1N7T1H2GhNqToVVs1JeDvmWEJolm7JwMS7vJBZf6fsA+VJIdqk1J8XqXV0blk0xO88gwS1MT2Bd1N8mHpqscnJYVp4Qz6PMapldP8rLvpNSZ7a8maVandmy+2VOD4ahuksw1x+osY7ji+r8KSvGfFvJDNNjWbhCNM9JesPAqij60cOA1NqTqjeySugX2ci4PNPyNhi38SivN0hiIhsFsJ6T2oYXXisdL3Z1riEs2UnjWRuxYMefzJJZWazAUjWrhM/ZEzWZp2eaUnsypJ6osqEIdrLILLmUxapx52mcrW+ryW7sNaLUngypKnptR4de7RgkI5GEgKb2DIKOGNnTE8+wgWQIPVYxV9lAbYQTMQaJECUmsOqGgPEIlDNS97hyaUcSZvV7rxFlvnsmZmmyrFrxmWb5jh5n+tFbwza4xBIogSLJ18akO2c4zNGTyEARK3P+RNso8fbOtudRU0whhyp/KyOlfOcjDFKXWLUa+3nh3zjdv/sNinPUmFoKKVQe/HrJ5Dt8YJCgxMLVuDun+1fsfoAhw8SzIRdCi53ytbXB6cq9/rKkVZYvQIlW8/Hw0KCWiRxCQa89MVJYYNng9ObJfFna0hkobtOcRDZM0IjW2ZAEIxlGj9QowDZWfXqNXpbydB5qlDnN4aMbAPmcPQNEoyiyghzLSyzfNe+yJFcWrhDNc1LZEKCOdTfBZ5Zac1KsZAe2YenXD+pyxCVSEehkI3h5KBmB3PJFtiaaQxGUVME2XN07nVyOCklGAqfaCSM6yvQxwbjrVowjubISQ8uP8J8WU2b9FiVQnY1gqHoEycPKiYAPta4T2TCa9a6WCv0iGzpuOG00PFEiR4klCUWsmpP8ho9QW6jdSFGO7dnV2xwr9ItslLBpqi13SzVqdWlZyipLVuPunDR1ttdg2nFqsMurPSNSA21ZgZRfTndvpn4WpSydjWCoOrzLw8oLSSvomNtkw2iSUmvYya1/hwvLEqZOS41L5vRo6NloXWrwPUI5iiwrPbhsADfDq72ChEpSU1x1typ5JLIKGMPZMt6JjFktRGxjmW1YWFFyLOuVZPZz1ty5+wzvreFMIpVAB5SYxDYaW+LhUUEaI9kptLov2jwsBW+vV8UsMI/kTMqxLh/ObNd5ypJkWa8iU++3Ez13j+eSLGEdUu3poNqs2EajE/cpypJPWbga85weDQNkzbXMfoGptSdFTmz02rB05aZCWYIqy1fjwpzm8OAHhNYsNEmvPTFSy3nZ4GR7BFCWksp61djPWUTn7gyfCneQJNWcDj3XiZvT6L/Vl8zl1L5z17SgT5o8hERLI6kSBfJMYcjO/uPGtDpv6SUHau+h+HWThpCNV9thdHR4pjBk58Ny46Pz1l1y4HgoPm7yEPLa0y4yBjOeKQzZGeLc+Oi8cZccOB6Kz5syhNT0ITl6eZFnCkN2zkQ3Pjpv2yXnjVvx9eOmDiGQo5xpaNg8Uxjic0y6MTC9Cz45cQN8MldZ9+fsdF+F7JERPZevyIrFucp3gE2AzvpKx5LopbEpzY9jGZXgTQYP0a63cfwlfrXNdDy0kPT6I4FRZN4NZngCLJhD7XmrTb9ZwHx3Tb/vo78d/j5/WV9tfx0PIVWlMba1j6DvkjauzJQ52v73TvX7NT2QQaoAxXhR5ph2QiSyZ9rRz6BfSdrOJz6E3Y/V3wzX739ArgDHeFX2mHdCVjgpGTFK0a8kbXvP/scqy3iRO91V3UirOmZZQ+GXN1A+XSjnWHZKhuni9lkdpb+qwO2Xc+y9Zr/IN974SlUe5VeoFVCN769TV83H+q8ecTJnG3IauPuHJCtJP3dz8diK3LLzvP/hTMNq66L7/Y/+tJzMzdUYQ5fzsbzCm1i+42kiXSwcYrJb/zck/0M+I8LpSCRmUQpvVe77kZk3ZfsCzfrxJwm1QxXlvy/xO2tRcR8U/gkLsSkEPn4HQF9CFP+SHyYlg6hQblL3pQyab8SH1bMzUeLt5O9LmfAYxcGgANOTqgtc5J+GlSrvkfuGCiiqUEcCxiDqSGFDLMo/KPDmG7CztP7kyjtfQfJOXWljZUj9CpJ3KvPGypD6FSTvAAgg0XnFaJ1KzZT3U9Ce6NysaeDfUp99pDPlpUHE7SjnniX/SvoFIe98lcg7KOtcsLdy/ButpyaIpQ79RoRiRCjEUowIhTqKp2UA+zpvoadSRnxMdq5qRCiwQhCCroyouaoRoVBXMYQUQ0iB9VX4QldG1FzViFAABIgEYLbcJRpMz4qMKHUVQ0gx5hQSKrLlGKUyb6wEkN4hpAim9WR95ikLwMm0ThTAr9Rl6HMgdhPrLXEQA5hhxaiY6UAyrPqlFnufFXxLVRyxAHY4oQ8SS4VNNE2poQnAjiYPIFcMeAA4z9IIyiqC6cE2k61h/lmZ6baQnjDtjDH/KRlm595Sh+RDqw5llGNOY4aeSWo/cZbXwpbZhQADH2kRgieAuSlCqQ+r4SIIwCwh0PHbqnnMHaRnzvlbNYRrn+1LXtyw49jTKAgKALN9VRsF5P/lu80mFBfuFTKV8XOwCOO93bT60TncHxuiUMoHG2wKRybqHQbPCLbx08J4WozJPhusRHf+CuIShxiA8+rsxIh9mGWYzvfXOOMqJ/lu7j9/Kj//w1p60If1U/gOrN5ptfMvIP94z/hE9wf1+sugrdSWrO1WEZOOWdOb8gU2gHl2v2YwtljGAVQA5+a0TjVcfWRca/q8LnQ2YAHYGTZVsCg2AAC8h2UJgWZse4/94SBzB3TFln29v6RHjALYrrLiRW9Iskl3YFXMaPivI5YeLCyXeBvLVD3chH/DoEs5xPe2KGuO+eS3uHdBETLQKPkhK/0bvvnpI1w360l8+SNA/5t6PkP1hOygWSXivqGBNDZzPvjPX+KMkvNgpdfGBu/SN0D47x7DJR620oO2f7XsaZXqUMORj7frPOKOB2oiKi28+Xefy5CAuVAQ5F89rx9hLR8c+DcfNGCresjur8OEEFXAZ3wWsK6q2pJ40EXHnPaHnNc5KPC/8gweeV368N7C98iY5yb3pRSD/scwiAfhcfm1m6mbTvdO8sGlz8xNO5Qu/4fMoHeRPK0Yc+e5H8ByfSxul1998/dt1P99eNVOs/tSCSrnH5V/+gWF6h18XX/AnQZYndEuPIZmWHb67sx72diUuBAoxlzYJ3MZGP1L2il2hMBaPojyb67HKGzffnBqPtqvrRGzm5iKoQsUa11SRaRnGyNq85mcOEPqVX1z1N9yaQsz/tWqhwdVvbSBgH/1GhqwVhxE93dPyxKCbeHjHW0qhCZhwxC8UYntymjFzRSzM0uCfyni0v8IQTVHdRXKKjrqRm5xqRE5Yxww4zhJFxWX+aObhU84L/W4rdn+djh3wVh5sXDvBLBT5VHVGIflInz22yKTdEUN8uVKS4LXo2JCt36dYuMEWhih+pU49cBWmMHTpHwxpV8n7Bvs9ooZ7jnC7iz6ZSoArmReu0ORNNJ3vydenf7dqiXEETOCp9mcdcZbIZDqGOKkSkpeSYyRhKxv217o/afgWgG8igER/ep9Ewed09RCTX4dcLSALlYAyK9DjiKwi411vLvUi0n8LklFBLuivTcb/P8LJmqWbHLSYyb8cfh2kVkGtMVNkzpxO8OL+K7f/YAh90P/xvz++nX/my2Vp29vHYK5N5W9N73IUU8IytOIRu47c7JADlLHVn718UCmTODIx+9ewlOBFb5/Q2XZ4XOQ0WyvufSXn0XVfOZGdEaX2yo0U/iiybZZm1p2bZS5Gd0k1KbfoQu9GYeG6gSa7EdojKbgNJ653F7roWW/gTbRCq7pFtp2dy63Vz90RBfwkp7QWb1C1/1NDufnfgX4/pkjLayeBaY+63nYCRcDf/18qJvRjaMFju6slFRhqGkeLuI3COR3LJDfIJBGqLUiWOD3O+7gwQB+J9ZHvuqDMYpHaZNafjPnt2T//5fPwnPwEt6AN+EVvIa34G14B96F9+AjfAFfwif4DF/B1/ANfAvfISCCQJAIhMAICkEjGASL4BASYSBMhEJohIWwEQ7CRXiIiCgQJSLBJiIjKkSNaBAtokOKSLG+yT1tCj292VOnQ2+lu3SK//y9Ti55ADuxOTa+QvceAGYEDpUW7padPKRXEEnVGThSdfc/kEjwH5gVqTAfUmEmpIrmQKpv2lu+DbXOvHD7/5UVb+kfMCRcz+/LtTiT47jJAs3NPBVhHFXGqnrf5iqaiZQz04dlVBhGTjCAnADoOMHkRIVpiQoTEhWmIipIQlQQFk56WN/6TyGHym9ZMEO1WJ0yQxQpEzMKFeYSqm5YhKpb/qDC2pSJOYOqMVtQMXY4wbKTiaQm81SWYOj9LdBaZV9q6h/eJleVTI4DJ9tG+1N+Ocl0SkgmlI1MLhWZfmKfcqoF5t/if2Q/EB1UxZjPxVRKoxYkplmgY2/MTu+1TnPPgQO6CHL7V+pztLFYJYJ4nn4ujDnoT0CY+NSIQkyo5UkLAMdA1QM4RnHxrmHUGeafL4P04nJssa/fA4yAtmNj0gRa+cv4IOUWb7tAQFmXyUQIiqsHfx1crASwC9S2KnUxcLBjRoGHrDv4LNNOpEjAFgkGGzksM00QHSrLVDM7YyKJMa62zMkIcSaJMFlCaeKJVRkwAvWI2pp0cozrnXj9gVD9OD9SNxQtQZTe4ZH3BSVxGKAdOfQBFCpZyMVxRJ8dWFTmUosoF7jTuIIV2DvPcF42XlgE8jRIq0JsIu+pwh2ejRC2M0cNPY2sMkAxUOmm+KQJuLN0hzTGhWGgQkaArXVsLIVsiE7NiEVM/Gl/xp/15/yFv+Uv/ZW/9jf+tr/j7/p7zkP7ijzyp/aZv/DX5A15S97xsowOjUAFIkjFHV7/y5GuU5cVAHMWbXRzKWVwSxe/jlv0oAtU2oAqdaSQIkJ4sMr0OVWsSehhVwZWTM+BpXEGs0BdJVsa5EpMXycwvUVVdLQOJvzFFKXK5ZOQYszPZKOElcsdyU/jIIvBRdx1jSQkmfMP9gM2M0sOnXTdt+RsI0Qch5uzzYoeIk65sFUjAH8X4JsUFzOQBcQp16yCyLuA/jrkHoA646gywQOXpz1Us6KEhQ7SwaEeOmgozoZVP5XskZJw8cHZeOUW1w9XfIXcI9C6dfs349Lluo8ZXwgH3Gegnw108T7uEPWYBXeQ+c42x3s8VXyKVlGeBmk6c4u5SIHisgf57YSRjOXCTNOVT3D/tFYJtT+lkY+kpPGMnB0odOpCwupP3fYX/PPXIXyWk7+rmmueWPnC44DvT1OVbgA7eOhMY4s+ft/cyjZqf3qszjG5e3qmrzySF+GSNTfQYGcS0MYvKYtlB/KFW4Ys7ANdWChop++CkIbM78AYppMifrTZXtjlyMENANgVahnNxWemZYsEjI+8bPyUzVmRxAe61RnkM1fK8l/h4gZGpeniqZDM/cWinswA6dxSZxMFHGs4gtgZxg/MPJzF4QCn7xlZfQFYD8AGW/Y3bG/TbUtW2cgjK2FBtvdUPkNzscPO4EAZH/hlnBTmQlS6H5scyqO6YsATlWNA0/ecuXzhuL7JzcUu05wJxrcA++mZuMMVNQczXAcSYCzIay4EMzjJ9p7KH00uHUBJTRkPor4eEyksTufiBrbA3i+gY5sQ4Cx55eKFnaZAFP0JOPXycwbwpWEpTkFo8rRVrRBkXK135P1HcVMCu32iVQSbs/yfAfxpRh0p6Zwc8xKUWyHJ+4/ifsBOIxxzOhir/KIBfGkmBUo5J8e8Cb7d+h8+RIACimTCLnV+0np5qr66QPXTI8Vpy6aDO+nTJSZpyvhZXf0Zu9r4BSiLd/oOoJwAf3zZnqRrLO96cLA4gJrIUmrgIgVq1hTxofmr7LzNpgmu2+Tbam4BTnBpBk4m62bKZQq1C2KOpSvPrQHa6ZuNTiEZ/8ars9Iz5eZhd5esL73TaLEFv09Thbs9O/DplktXlNngps61yXHcV5sO6hRtc32EKSwvrseAM7tk8VNBjXuQ9+kAOmAKB5VNJ91V53G7dCoq59ENkMb/eS5KoGdCjgkeFGqI+/RMuuGW+AeXOOAqHFU8mS/DgAfLBLjaIs81W6bPBjK0kWGyeJhXkOzTI6F5RgdzfQAc2ZLlgheVQ69Pj6+AosKoo5LX8PJ4W3LXR7FBX6vYtyZmhN/NBIy+vgvdk3v3QMv0Yrs5/pYierSZy9tPbhxAXNnG+497+fdO6OWpqFz8G+OIDmAIz75shEuLyaypMDUhf8DcSyx+CVsvsbSu1XSWs4O7aOtZvc7nghC+Ha1ZNU7jNElbrKqomkOdZSnqGUZxjHku8orb+fRGzb29iBMY6fle5M9TlVT81rLxpZkqIhTSNp72amE4kozOprLOYs6Iem965zvCPHTLVPjCHMsiH82Bm6PXpj7cxelIDevmvfPasCCp4zhxhe9aZX6AvluLPn/s9ZuzcT5vhluMDmMVo8P4xKjHJEaz+Yl0ALyoZRIuF/jF8xRsTiDlU0nCyKdyhItPFRkWPjVYUPBp5iUXe/TZX6VtATKlR40oCntaaA0AMplHtRQkPU0OgJ6OAzpPsy15uqNe0popVRbtqJqsfx34+EY9Bj041V0RbGavIIDTBfYUAFI8RCM91J+hfTVfA/lLdrK7LJs1KO/ezG6auQNv4N56t8IK8d/y0+VuGY5q4NylpF80LTMfwwTmn3NysVqGlBkBAExElMcViCRPgjlqFHwAgFx8z0cMIEPTzqDPogYOQcEQJSNUjEENY1HLOKjDuJgL+lk/5Bf/2nfP+IeJKMacdoEBQrFoLBqHBETSeBQOAABCwXAMCgqGAwIAeEAekAcEACwaCMWiAQB8RB+RBaNgIBSJBULhgHxEH1FiMSg0IA3IoHBIKBgQiQMCACwaCsYhyYaz4Ww4G86Gs2G7noIhICAUi8aicUg0HoWjL4BQMByDggPqC3hAHpAH7AssGgjFoukLfEQfkQWjYDggCEVigVA4IIsGSAQSJRaDQgPSgDAcg8IhoWBAJA6oL7BoKBiHJBvOhrPhYrQYLUbpeAhFYJDZIBSZzaJxSDQeiaUvgFAwHIPCJeOA+gKcr0/oC3jCvgDDkVggFIekL8B4PKK+QGLhgAAECEVigVA4IAABQvGILBqRiQPigPoCh8QhcUgklmw4G86Gs+FsOBvezn5AJpYMZGLJPCQVDGRyUEAmlMtBcVBYMgfFQXFQHBSQCWTiiBwUjMdBEaFYMgcFZAKZQCaWzEEBmVgyB4UjYslYMgeFI/KQPKRitBgtRovRYrQYFaNBJpaMhGLJRCaXTIIBmRwUEooFc1AcFJ6QJXNQHBQHpQ5wUEgokAlEclA4IAcFxWLJHBQSCmQioWA0B4WEYskcFBCJJWPJJBYQSWQSmYrRYrQYLUaL0WKUDTepVC6ZzaIhoWA0DsikomBYMJeMgqFghEaZjYKhYCgYg4KCMalMKpGJgvGIKBgUS2ajYEwqk8qkktkoGJNKZqNgSCiZTWajYHA8g4KEIqFIqGw4G86Gs+FsOBum4wUGCsaicUg0HoFB4egLIBQMx6IRGDigvgDn6xP6AgChL5BYIBSHpC/AePoCiYUDAhAgFIkFQuGAAAQIxSNCMDggDsgh6QscEoPCIXFIsuFsOBvOhrPhbHg7+3m0V+aHiJrT+DqY0yWO2/w6mE04/hdmq/lwKpucUfX0Sb+/tRqMtzCfdtifXzZfx3KLDpIxVzsnSc5wwUfdsbFXO/n2W3NRdUzr6pCzVYsDtZQsoLL9ZGGyQ3+62a/zf/CWkn2v0cxCk6NYY3BKcAasMa7GuBrjaoyrMa7GuBrj6pOrT64+ufrk6pOrT64+ufrkapSrUa5GuRrl9vy3rwZH2VeBfRXYd4EDb6DAWQL8+dg6Nt/n7Z34vV8/h/C63+IVBFrG23GF+K6c8PXvhG8sRIK+hzHh2sPlfay+s+39XnRcLAJ94PZul/lpdpgt2jjn8Ha0S33RLmwPeIEubo/4kC7NZlnAXJxMqnv7y10Qq7cvA08QVBvQGwZTFPPNglOwUe5tNNAH3myk9/D/4DI4SzBlxXGxU7cF/DQYNdtWo3wOdUJbxBfpxLaoF+3uI8tEi+/zi8ew7S/v1G/y1jsu3wawv8YDHu657FX/hz2OeRr3PPClU8eH+WXL79IoPzQ6fNX0b17bjz2aoKjohPlr6u9Ven1TM35yp8VbD3+B7rJ1bO+/rZnlhWOzS7Nkw1Ncg0AaBLMhJu+/JefwxHzYOXpkyA/qY7G/9y7+JJ1pIpTcUiqUWj2Lf4t836u4VLdYFM4hPAouCHIEjEIXgjkGjsIWYjlO64SCki+pEz+gc1SdvJ0DK6Oqt2tgzeW1HK7bpSUPaWvtMoonuWXqIL3LZjnDbpmdcnY5Y7jDeBuusBrGUudS1pCD0i4PHJbbgI9XrLTl3ZoUH3n5elLi94umvhGtX5TNhxnPPNzOgVZbKLfRGCd178pjPKfunzN3lQZLODT4HwlctRvmKbEHal5aD5Z95GC3o/hRgttu1R+9qLHKttihNhqQN8GI1k+0My0p7Ez3tnTXbzbPKCW/Uj+H00EtnWn2iZ/KTFA/lTVZZVs8OL2nA+lMZcW6kPyhEQuSbykLKQVYvmLJ+qPUmuPiPR+lTvecs05z4+uGr+w+yPOO9S04PZPznv0L6Kkf/nCnupD8SB1W8dfk2QKKNLtbKG09066b5hC9LXg8sutBORpdGeNW8auc7YhhzyvbqqWTIleHuz7gq7LGDncD0UfsrTU/2tl2uJI/dGsETllV5ntikABJf6SelfUdkzw8zCkK5FxwmFdQ9BBXlAvNU9uuoiRvaXsKyr7lKdNIAiJdRL1rOnelkeZuxHKLjbQ3Mbum0w/Vt9rfqGuXTQJzn9gVm7R4xgLnodyj5A4W3YzoI3Zo0c2KPY7sV+7xfmG6YpMTfcHRzRvAK7aQveUeI3+gKQrlPehg714J8j5hBVygfErqQMVL2e5Cmo/WoVU/6vmWkXO7teqhdqxNQw8u99rs1I+C0cmi+qjbuxjBj9BhJX9oxIHkV8r5KM/UadOdc/lx8bgsDWXu015vKdiCewosJd9wggvNU1uhQfxCeEsrguxbnjKNTXKjlk6B+qqcq2KShwOLqocNR/W22a0srLin1dO9dlpYL9Y/cp3iSppptXFxep9QzkJXIEXxUoJuS/VR13QA8DDlbGb3drm3sdwGb7N+WfVxwnV3A3MVfKyY5o/0Hj6U3e0YZZh6bwdyDRim3Xy4n6LgXcPwxXKXtorjmy1kezidpT4VntYrxY/Sx6r+6CVB9O9wWGrvK5CHYFi09xHmMXxkQiHNt3aOGZ/kV+rjcN7A1+iC5E1yjdZM0bxNL+lE/w4ffIj3j+K/G8Fv87QY2POVXhdN3n7HFdcKzQd02NQ93x/ZOvzL1xkEBmyfv3yTYWAgc1J9zY+2fW9a8oceu2gd51t46JLkKyVq1Uc9cwfUDp/PO1/89t3AgbtX2HOF8gO6hSvFU+lBqre6IsG0w2f6+svfvU0YeHP5rb73vpT0fL77jwPoJ1d5eoT2cMLAGt05UC09s2l89yDylOlukg+qrNiZUf3RaxWiaIfDqj47ZpAXwbDSZ6cM8zJ8ZKVXhTXf2jlmfJJfqY/DOYET1tMoD3/m6dTDNaiZokt5uYQJnx2OYX/x+rKUh4u4Dtsj+oO3JrBcpXViuyUvqTcrPkqnbo/qR12/gbPDg7rPb/Mw47S7Uc8PHkLt0cxrr/nUuaeA3AYXOC4k31KHUfwqW+/fABxYHrAxKdVTnW2ZZHF1fc0gQIJmECFRM2iQpj1I0El7kKGz9qBAF+1Bha6n5nrwXp/PU99YoH5w8b+LI4uLABWgotaiQTXlIgETMCsXBViUiwqsykVULvKJqkUABdUigqJq0UBNtUigpFpkUFYvCrioFxVcT755KoDDzVMRHG+eapB2y1SCpFumMiTfMlX4efCpOuNThPpUZkiB/kPxdCQGdbhbAr5rWiEXkrfUIYpvxVzbLB+wEVOqpzr3kshi9ykLBgZ2n1bB7lMWDgzuPq1qPH63rIb5bpXp3FStN52iJq//Lc7ZGXm6FNUw362l07lhrTedohrnezVN54Y1Tadgw3yvpuncsKbpwIezMvR6OvABx2gwYA84wACgA3RgATAH5oACQA7IAQcKu8KuSKCIK+IKuKKBoq6oKxAgcIQBQkfoyAJkjswRBYgckRMOCDthJxIQcSJOwIkGRJ2oMwgYOMOAoTN0ZgEzZ+aMAkYuyAUHgl2wCwmEuBAX4EIDoa6paxBo4BoGGrqGrlmgmWvmGgUGuUFucGCwG+yGBIa4IW6Am6b521q6qKodkwb52yrHaJi/rSzqasekWf62ypKTD500yt9VWUQ5Jo3zd1UWRY5Jk/xdlUUrxwQ40ACoA3UAAQAHGAB0gA4sAOaKuUKBQq6QKxwo7Aq7IoEirogjcKQBUkcaZUnoWeXUeNPhHg0CBFH+mHkn/QreUKFolqqqnIVDRLmEbkXGuSLPM/EkIBLWO43qj15iRMEOE9cuB+YmvMTyIXvL68IfuLcT9kStDx9+GHKJJ/Z1eNi7K4DcBy4IXKA8JXWg4qWcy4xK9lQgT4NRmT2R5Vl2xVwfUd5A47qKInmTjGsVVL3V9WFId9LzqujYarvirgQD3TC72civrNZUOzgfynHJx+SLymiGTo7xJTWLp517orv8wBct4kWH6OFrkeiyp1Cq4Z23qqUfMIWq4dI46dSyH3npyh8Mo4UX/Tgs3ODOO9TSpeWrTdFT7EOat9ZHZN9ydNql+FW234336oeu7gxQZU1FiQ5HgfLDJqP6sGl52cs/HyRHy5NqvzPaoxNsaZbjWF74ve/Kq/R9kKUvjwsVmzksA9NylbPEmexb/m7wYCpfeP4npB6OG7Ro9T44cyjldUXGEKOUMiBXg1GaMjDXwlG6Miw32ChXGZSbaJRVBqd2LZ3zyUK8K2ecWVT9qusvOHM4MlZGJWVAngajMmVgnoWjcmVY3mCjusqgvIlGtcrgvI3P2YkEmvTZNND0SU8mHxT5BU07ltaR8kJRdNNnZ1x2gzszqaXvb8pueGdmKmvWh+aPJYuiUL4lGRaUveRJc0kCSzotDSx9svOku7PX7m+Rw3PmSv3wWWng8ZEnym54Z861dGEoenI09nCWfsl+5egV/mVOR6mlZ6khNr2zYGWNgjOHtwaXjXIEJZiiWYqtrDkfKC1UzlKp3S+2gcVyQF4CA8vlwLwCB1aXw9KaKut3iPfzHLyrEOCUVdM8E08CJHD6bNGUqbKmIzOHCefVNbSRGyScGgk43BuBgEBUe2MYEIzKTFRPNMcQJb9S9OZcylucZ+JJwKQfU+9aOmkJWvGJvz9qcnjfmkl01i+302zNL1B5CjCJyc55W3znd2YRj0fM1DHf/LXWHoZXqRtP7H4xonwHvXhUmamYqKenZMIwY2XCTOMzvRttm2MW3BazVFbMGt88o0a9Q0OjbXfMQblijsuf3pUA4v+FD2MmSQBEOdHj6SXFxAlmH+rLjVlkyG5FHWLxMH3+YcvpMhrmjF7DkMlqBrPXgMVrwNprwMZrQHb/asBusf7DgUJtkdGozupUW6k5qrvhf1ds3PR+LgrtWH71s8vMFlHttqVyXTI6FIEKRBXtlH51Z1Ml+yDHIVJATR6HSQ1a8jninQEWOH1RjpIWRLIcIx3IChEtIUot5HGCVEoriY3n/FJXwScvb7DQJ6yoCLDc50FdumQtFx3FAjjuW9VdtnY7qNtlPbrU8uWSz9jtITTnY6vcJ2ldsTXNWk4ioVAZ9iLyhTQMlQgEDdtEYrUghl74UfB9NnqntJClnHwQfh91FLdOyI2iuX+5s6eFXdQx9i6gfQzR26eFTWsI3um5hLm80msYG73D17A2DqL0nqj4zSRniqUeyTCyLSl2ZxSnUL5JjzOVHKlWuw2BwjJL8stJPWe1plVR7buVu9VjulpDqpfV29an79wqGy8agOOkeqk1KjQlU8TLPzS6fe3rh2g8fdNbS98vg3tIuwA+MzxskRbTd7zeCUTMM4FotTVzWG8E4oXbWVhH+KeJ8qIGdYRZ4RxhJ2EcoX0QR9gb4I1wO0Qz/NIWrBFuqQg+NwWqr1WJycoxsqiJrmevhJUyiUDexXvsALy8wh2hR0GRpq9uN3SFusxW8fcqYcvUM0gTrVlEhXBlkEhYtXGqjvQO+WZBdys0wtnIgbGRG1P1lpvY5RYNwQJkEXtMDnP192gfg/BYqNDwDfDGgqjfWNW1ba2uqJ06o8ZYYGCwMjgLrQswZRrJrkVDPg4N4yu/T9ohDoD6/7doJ8Vq+Txxoidg8gZUOkccjcEgLjggdnVIRO1QXN88I3BYDIFsBbiYTBDm8/63Vtdf9BfQE8/GNQRsPgRUhdY3Rf4fEKD0JvpShjfQ9wQIR8/w7RbqbOFNNEa1tFALtdAt9E6G2xmquIU6WxjFLdRCLdRCBQLgTpY5bOhDW6eJQIwxbB3QQqbjwJa5MDCFVB2mQQqqe/HUE4uUjlf43Qx7YFSueCgkVL6dlfftjem/h1HOxSNIfoXsFIfDAvJOBjk3awW/tJoU8j/Cca5Ayp9DhaYglIiI4hgIwiz5HaSwMrhcoAe40H8iT46m1D29SqTJooDThDJYTihvLuBWWQiWQDtlcfgE+PprqeIurDogo9rHdUmM155F0X6P2sfhR3aQtkOAPm8I5QCYZDEUjjV92NfYn0NA9MTqZYNXdiEjYeZkEqRBXkgMxvbCDzHdy5NhrzwqXmRDRbY5eNqt+wXQojuAhDH9Iflv83fCKowJx7oV5E/npMa3+bnUbtYMfNDFrXtstz8SUU55EBtYHMaDYR7HvFK+gpdf2zVba4WAnHfCOAwZ8Bg5uotCLAYXglbx3ILTMK/irsqt1jX7PNQtLgEmHsf6eONhwDHsd48YKwQwWsximngTehvIAFfxAnHRELH9eYQeF9JFGZ53aN3PBr+4TXaXTGnVxXMULbFN9gv36aIXM2wC8d1hzq+q0mMbAw5YzHpQorhuolTDK/SRmIUVY0QivIHy4zHxe5Q3AYTerYCGutL1F7WvvF9MMbTBKU95gK4qjsAPaITJw0hzjPJc0VLiQ0U5pzjYAKlWqoBqnEJLky+3GgkBAsjk/vToSvzhRfqvm9mCKh6nnvLFJ/OaBk5KKvc6A8uzfBoCt70Iue0YrvyveuH3UBmWF0aPw8sXakrRwLz01GtlI33Zz0hD7ItpXGjTXP2PbtYb7lIIlsj0D6/esSZ47wEYdsP5fycF6iRBiLHcH/5B9eQ9ANVxTHUSX8eG9mPb/6YK1nsAquOY6iS+xsRbGqA7slKZvrftWKTx9tklmANJzJ0my2c7DzabWNyWufDzYdXitByMfIWmzqNyO1pWA2dTOVuFnBMkMwng2OqWH8wDXpHN/mUJhfBwlV49MTv/8gvvMWoDnG+zEX1e9JMdgmXqsNVevkxVEdkr0BNM9aTq9Nw8YfUKGB8N5iJ8iW0bMPqAUj2IMj+JcqaTclBAYutLOuijR6AHlOpBFM79XmPynuFZO8v9eNrws1dgTjA1J1WWS6IVSqvUo+O9lWnbQge9A5neaDIv3+uU6HmIMaVP9Rr7IEANKFWDKNNydVGTWtiEyKd6G5uxtIPxd8LlT8kKz2xMcHZ10zrBlldlLkzaaMQAD+ZgXP1UZLOk0gsyUda9GjVh9e+2fW1gBXQgM+5Gk8VcmjztHSWjEKvP1+0WeO9g/CvS1U/FKp/Zr7eS1+gL3XHD+rD6+pFN6bbAesjjM9T481FkWo4A63gNSiVT/cr2Jlug5nEoquajyPSkuuTRhQ5gOT6U63zPIhlQqtpCWUKLkjhVE7gYtIp/vpsfDNtx1M5Zsq50BJOXo80nVh1xGAN8Dii1BFFWqk58grZwVqwS/GAN+Ow4aucsWXfymFv4SBwxyZbVXSLt7YvwIXMY03ZBMiuZHfZjp3J65m31q9cN1+jBHPDLn4KFt5lZdUEsDSraRm8reetHFMEcSGbuPFk+qVpDJlUkJXkCgnS5lb0Cc4KpOamyXNpIREt+FleMHh7GNun9YBUE/sonf+yfkH/Su8bf2c1djZdpNvRBJz0lSaqT/SghgMS1mXgpVv9mOekGtMQybWHKrFpdb3b2lInV3+9bjXzowToIyrVPxWhgFq9lftQjAu2AMtXG+VSoJpapwdRpWTbmqoGL4LJwqvd+2guogWRq58m0BGsjvg4kcpjW6iP2NTSSB+tgX1tedcU0YPadTpIMb+I7bPSgmprYmTca47tnObQqRtb+OviaX3Afd50lI89XPPCIdoGq2qELn0z2bznjEfTEMn1hyuxV7rEzL7ylz/PsTOlK4tIn0BLLtIUps5IOEsHJhVaxIly3bj4HbYDzbTZ8jx/g8yOSObGOPDbxPFOV6BFYBQGlhh9EmVdNaQTB/dbC0MhmaIfCDz4lWrEUMGN/+ax0uXjvvHNorvmlSd4bMHjHcc8vVO7bq9aBep0ENsTKvJ1VC3oHMr3RZF5VOwpyeEsWbVa/Zt1IvwwsDr/6qRjLze57mVUI6ggu1lCfKtpZ0aB2IFMbTaZnE3eoa3bHyNGGQ96Z0NG8A5nqNJ1WTxyk8MnBXh6rZ4qLFMCoA0rNQZTlUlNiinGUnFjVRzY4moejX124JJm8zb5pSUYqEGtDSqx+/GoXUoDagUxtNJmW+x0hadFlju1TZVwqAmpAqRpEgW5fbrF8lx/rHytnO8V1fAs2r9pAt1zblR7jOdeHfArhX8cH8AqR/2aDNx/jMC16173b1RaryVX7RzQwry4OpebV48jyXyHe+DYdDXsVDJ+ofputReO3xod8nNt5li94ynrkm33b15atN9HAkhfEUks+iqz8Fc647h5tk8Y/1HK+9YCVNF2d3UPWxOpr/IpCsH4dR61aZ8lqtbSvNOUQUoM8zdfk2wxUaCkKH8amyiGxen2K67fBElBqCaKs/DVsHFagD6RFnppv+YFl/yWIfUH2mGfNni/jZj0R/nejVpRZmF2Yjz28crLmYs4NFCo8qCZ/rvt1sF2ayi846P4DqiWg0ru+doUfXHvGmibJcmcJ+w8vMzNc6KTUvY6vbqEZBIKyFzQ9PWuItot7ZgPtar81Mmh4/McHv19/cMA77iHqv7nl4BJzSO+57rsUHZsxpYTouPuEc5XVBuWeydsuCoqKCofqJVWSg/Kl68Wna9e236kUY1wZeCU5E9s2vUCFjePGo8MgurJCv77rptGXuHZ+m8HkQIicKJg994TiDUwHtcieF4FxZ2JLdL9VyQVeJdys6C8r6n29Xst86BvPy4Mp7uEtLrozbPt6r8MPriaGiSYbSnnKVZVVLJuGtJs6+bDu8wmrjguHrzgPP0gNB1nDoWo4ysNOLbcCEHLSdDovTPsHXzVADCmJAIhvlcr1dYGgyFb57f7VVi3XVPaRjlKf8ST45UafvFeY7aSsbgyVHwH+oYd/9Hf0/0uyI3PMVzvpzp7eRQCtvdbP8K2MKlztjgk8vOxZpOMunyXuiBl9X4kGM88oVcuNhu14YBzLs4VYk9OBcYIb56EwW3qawirrHjhHsvmveUSDFYdR70gfOFfKAcR7174Ta187J3jkKV9M+rx/WXjqEf/9Xirakrstzcm1hrROZAJyu148eaymZGFnBAWeyWFqy2OGSFAcgFiJpViTVvkzTM4HRhAI+rZmsEIrYdjNpWthg3l7+z/llfOTNlMSZDuuEGfLxSQO4ov31KsCgH+sgriwJtTx35gpHucC843wEaueL4Ek3V/zpJYnWHlXtaKyX6C1MP8GUA2maWmtERARy5K/8lvdhV4SoctT73dFsOOtel3zRovFrJMIQwk8Ntt8jgMpvZ1d1UalcqpO5SF3/MWyBjxK3n/iYgiV3kd7xsxFMuS85LI+DsKoyYFsdFTTe9+euYWvhCkIQum++U++LJOfCF2evrPNGwvYQAOdImydgEatTazk5VOSVhktkLeUpr6Sr7jsqUOFFRERpEl0Iqh8O4B0JDxT1QeoxEQeSEPZEkUyEkKk74dFVskgOtJhL9HyjkjHZVYBSzlPZabzdo2mowM9rjwxQHoGQyYQPF+CcIuri3C5M2IIhy+M5ws3YBvb4VSrPr1ny45JeVymYGCr4C9T/WsUXl7K9LnxHF8lO4G2QYHqRSIfx0whZ8Fb5KWJmo11ELeTDEy4lHRxadWWbgusjCazxdrGlm5rWBlNZou1jS3dNrAymswWaxtbum1hZTSZLdY2tnTbwcpoUsUZw+XGFX2opOjKwef4tpjbgNvpm7/vu31snMTsu3um/37kXxYAioe6eN6SuJn9TJK08a0/Snua9ziHqilcB/tdIa/c69ClW2RcbM19dvfqgbe2oLd1c1n5LZ7tz3zHzTBQYlvNXOXukn42AyPt3mrfPVdDIbFoY3MNFBKLNjbXhkJi0cbmOlBILNrYXBcKiUUbm+tBIX20ncDPNJeCV0zXS6SoV0/PTXHkagN5IRBdXmKMoTHHGoNEDBu7yOtnIWxpGFgEHsf1EF9HIQi9eexNsedUZOrjAvwa9+4Du0zdFlDTbG2foB1TGyjQ2/Ulf7jrXQoOd2bKcormoVYqJE2HUKOfW8JH/SAfqCUcGPO4itLMWBFrnVfeg9K6oFTX7quY5GK6TEe73wgWJXKjZjiBx47Idfn+k2M4eXcxCU2N78j6XcMPSzN2Kzhmagkf79jjutzfsQ26lEWWBv/vTENTgxd4Hv7fyY1Qu+mtQzwATeESPm1BIB2kqztvZrWp2VtAZYDreNDvxRz7Y5KaGu1jdOz1fQp38DBmXeYSJ/BIxb37eR7hsRqKQ/BmUGnGyix4cInjIx6sizH2Dq9ok+f2HWCky1Q3XMKDrS0GuGKS/zrt/i6+qO9u4hnU2AE8CF5quWgHkpYasQfG4L6dyVhq5QtxTQ+Lad6V2msQLtynRtKpPLXroWo6Yam7l9J4wh1+D7gzFkNUiodso8Y99JlTsq40rxlNuYCqEgOmTKLo0CsCfL2ZgE31QObtNHDVCloUkUkJ78RnjvA7/RWHEEV6rTvRmX1V7xlkshiEIjR0QsLIKJySHLxiAKq6vdYfCfUdQJID+NHnmR4cQGSuNzxu2R/DzBh5J96QgBw00FAy+NeJC8QidvoGGUgEHRiv6jFn5T2zfdYdIfhgSJwkdiLN+V3XIKrRWDXUmwNsICLczH00xngnyQd3YDuxE5n5NO/MkPLUZC3zRDFNFPa6OnNMXruG6yjsJHIaay8N32nGmqSVZv3aC0+MlvUKLvz3ulaS58w/EPbTwuScW6IFVQ3lYB3t+5nuqlLYTsjot7fH993wdAGkvpA3LurYfmsnQ+82ndo8dE7Sc+jiovX5AnDLVvqrdrtLrEKpTf2r2PDyey5v9VQzXJdflPtB76x/Ud/femfbdnbt/oBjP/nDe/mldEMwgmI4QdLoDCaLzfW2cAgpVAhGUAwnSBqdwWSxud7OODJSqBCMoBhOkDQ6g8lic71dcBSkUCEYQTGcIGl0BpPF5nrbOIwUKgQjKIYTJI3OYLLYXG/XOGqkUCEYQTGcIGl0BpPF5nq7wdEghQrBCIrhBEmjM5gsNtfbLY4WKVQIRlAMJ0gancFksbne7nB0SKFCMIJiOEHS6Awmi80pGa+baO3066DMaaw2aRbAUrXEydiEGJUqICE4pcoWce4QsMTfao7K8vt5Ux9hRjAY2tCURC6lU1i4v75+cTyOOQStPMgW29Jbs+8Q7VPM5dclg4CJQzCLDp5Vc+5iZJ0HUtXnI5Q5zn55U2qaMVWe/XxPvsPsIQ4MUlfqXOfH/XF/DOlwWf34H2F8569v0RqNrn+GRI2eCi54LtlPST+6lqdZa3deGj8BKnngKcjHrB8ULnzHngkEG3GsucsIb+IVzmR9S49giJw2ypga9P3U4DKmqrbtJR5ZT7lhMwRTki9WC89zgD+7rvAARBywF2Kav7ExzhhmYsfEtFMub0rt3IUzrTpAU20qL3vanaHkMPgE+mwMpz/Nn892H4HdpcQ04WQYL3UL1rDDhJzNVVT0SGx9akIzpIThTLiEjaZYcvUUW5/HhCLbBGDbBIWbT7BnrQOEoBArq8kQMjYbhTGKu4y5ubtALk5j6y8CI5wEwTbBYiI2B1eS0rH1qQjNFGG4IlxSNHVYE/6x9blMELJNALbNnGxyEcnFiWz98Q8MYnN/ykZOzOdkK74fB5jCIpY+lSGE9lCOVtxl6fHCE82sdQb0KW6ZcpQNWZPpbY5k1ndpfUvQtwT96N7Npa9sZPFperp473HRZH+m6FXrc9zLzsoQaqMzjMy+m9Jpdd9UtZQ+ghkTjTEbUhP3CKwmPYfV3bxynTMbwDH11GAOKZw7aOghQfdc86aCl4lb3kh7U8aQU6cYo6i7lJdcXEoac7b+IjRDSRguCRezkdegfw+7J3EJQerYnaqXOa5yH8rl+mzM4CcIWScAW2dOVvd28rYelr4GLzh5N0JI0GQlcwfTXA/R1l8ERhgJglXBEiLyMsu1G20EjYlFTAjMJio0d8BVQ+V3YPl3h894/N6/+Hg6/CivvZoipq3PZ4IQJhOA2cwxhUQVXmYnx2vgV1iEgRBUuULFRY6P/l3wKndgEJv7UzZybB5dksuJ2vrjN09PhIWhMC4aaO1B2tP8Kf4RjCsTT7UhKXNnxVLWd5hyB8BfePex2O4fA0ZEv9oJuxjz6CcVy1no5xcjvBk7P5+aUNVZLHcvrqnL2vrH2h6OHFsGos4le2B87jDP6FwQ1wbQERipgmBVsLh6gEfSOoLhJRP+tSGcIn9yjFnacYnkk35Y6wjkUyhbbEMIhk7xWAl7DdkpDse+x90abhDGxu6UbTmxiuDIbLd+BJ0KzWRhuLrDRcWdtv272PPIA4OkuT+VRg5T7IN+0pkNwONqbODt2Fi7N2EaqG6+2j7zjc1w1dUD1pLWAVoeRR7RgpjB8Dtv74eQYu7S1gFmWywQh+EjFGgaaJwqCjszrV8F7lxoJguD1R2udlN1XSStA0hKoUS9DUlhtBSWwl7DZNGZaesIodi5ur6tWHHKHcr3zuC34OLVpP9l/S8tnIxQIvvf6IPBQayYSnwM+o5cdV61i+zT6+n1GnaLbEOSofD03OXhuLnkwY2ioytTyOiqYYZJ0X/+XfAe2MAgZe5PlZHj4nGKaukC+RGMR7oEN4SCesMO6ic8eBB20joHGveSS8fZGVZ5fCd8JvscwrYkNDR4n+h+hZiR+UOAPPmpuajP2i3f0+Zp8xpKKGhxQ1IYZIulsNfaM2VPu6fcR/DpkhbHDWGZRAtzh9IAQsIWVJyrgtz6dK+wCD0hKE4TVTrJ/kfYFUZs8mj+OSM7pUdtXT7+K0IhnCQVulZbo0t4sVCoJzcilPXROjIEyh/QxvaDrz9wddueq2PuoNjh5tmR909juqUtcu/0kyJXVLfbrnBll6NjI5Pea/RMvXgovuZ/dMX+neRs0LEth6nPPFkcHMswrJT1tL+/6xfoZ5szXkrhWhBXTXhMm4+afI3U/7jP9XfiCKua6rtA6fbdJmiEPGu/ONf/jF8YpJp4H8jrjxbIQ/4sqvR2K7+kMiWRYoagp2XPlV9y3Sr3oiANxGqVO6d0uX/v00HRD+NZdnVQKg2SledG3uRSUrWSrJgv9RGrOfLD8fPz5wpl7t5sDWkZvTiudWzsiZ3WOppXWluuadg021qu6QJL+Zl2+CRMoD64aFeUMf7RBbt2SWnKDSibBPm47D0pJI8fthJ+lxuKAuywOzHvcn+DoLm6UaJNvVScaDdM09MFn9SOYjQmdN0sylGOiTYlHl6MQl/hFB5GtcMGWXD/0ifdL5MLnnLo5jQj05Ewhnitk+/xDALMFPt6RwaNNPH6fJUixVVaao22Du7KUyhVWmqNtg7uqlMoVVpqjbuE0g9yuwuoE3hqKSj7AG47RV89uX6iKoSnkB3w+SzfXwM/D0ueL1LyXYQF8t7Ly0GsQfnkcjT5Rle6z0nyk9+ZouOv3GvNiti6/VF7bZwDyyoR7oW+WrPhxiM/W8d4DZL+1eIlGbkEmtvce8E5AFAlcwZadJ9FEIqKYvpWwuu7N8CFpj4M8h16Et3oMH10EDPerw5sK+/Qrd1DT9k9mkbdXB12jcthwzATjBjiCdqRbhHZDHXKnSk8CXq4tLIJey3biMG6Oc8GKa5PiLJy8xDCMcrTMhPivG/d2nyhuRw/lO1GHWYnHraK/dHbxfGx0zEPkns0kSLKGkBBaodOFVySG+mDMFldpJQDx+O1p+MQtJ/m6Qm5rqhdt1eQPRHs3RhBpfmENKFbuR13G40+q7t/6V0iUoVtuaGuSEFh9W7vBfZUYAcDIjnxQNOkLyh6AxOTUNDn5KE7Bo6kztCmrQNCE3IYHJgOeQ2HPGOhGjcCKzDMzmttTUdADWtTyQKJshqSsgJ9pOO0cz+8H94PVfY51qDDDAhF+2iVRMjzLpe/LnlsSM9D5waDEbxDi8+eyMi/ocV19k0b4DlHJWXMgYhcc4dckDAABSUb8rMnTHgKcorMt7IgDOwgAV+r8hpO+rBAZUPxXQZI9zdDJyKeYzcsOkayc86RVScDl0MjHRA+hkn6DsExv3q6meZ4ajb6tgy9fsz6XVj05djq0aQ3DwV2rG7lAGc0ru8vlr3nTDnnZxyn2862yZGs7fybMhK0nZmToza7uTplpGCRw5MjBh0IcOygK7D78F2x6FzZ6sCkb2CCiz51PcL73HOE6EHX8znd0qHkmaK11/lc5sxaVhYd68PaZqxQ9yS7goveWT/D+9wVB5nv29JvDgLERstOmONpsmUfto89yih1TfeViPfaVuvks+jbXsWphDhT8qAl319h15jbYe/pYgzwUrMIX5t1OR1+vpVLU8rxbRAZDfOp2b/lGLUGCEK88Qczs5jImk5nWzVLu2sEXa9mFTmRs7ltIYOfiT+MmeOQPlO7/rRxrO3z2UMBIJARSZt7T3WNBv/KOd9ljyUVLTHkWTWUuyCBsb/FA2t6LYHuF82YdFE2Z6u1TG12AF2Etb5R2QAQdFwiu7p2Udwcado0HpJ2zcC06v06xUfnpnz7U+UYsfHBHpU6lQri8tWb88l3zZhlfFnbxy67rM2bzdvNu5v3/j/A98EAEyywwQMOuOAFH/gRgUhEIRpxEINYxEU8xEcGMpGFbORBDnKRF/mQHwoooYIaOtBAC13oQR8OOOGCGz7wwAtf9lj/SoUfYuu5E3pZ4Vwemcw18a+98NHzNIkaGZCXIEJrV+BAC2iUoD0xkg9oBCGMrcxYwbncEVwa1IHbOgygQVhmv7XZH/zlANyEzAEj4FCLVS34Ru79Dc91fOCU3xgnfmPS9o1R1Dd+puegTd4ETNsW+ovgibe3Pzv7wQzfGmKflPQYF0DL/P6CW+8bj+CTN+I73iyP5J9YaBY5DJauHk5l/wShCAfA+Q1P6X8f59oF2U1uCqDWO5S7uCHQgvHzQrkXVdntzAsrjT8zaFdx9bO0Edgzp9pd0SL3mG4mdRz7flZT89fK/aVOkSCEgxwGfagt/4ygeRfQ5ckqdwGdllkWKEUGR4Mzq63Nw/21NPJ97SlmZUEdvAGPVggUDnpkCuFUJRAhnIjnC/QdaCBcCES8oITVsAsFMDlsrj1Mw0TZq5jMgwNpBzcJYoK8pZbBEazGHuyhlsFB/HJv9lZhwPbggkpOUsAkBbc+nSEPYx69joZK+QG0B8nNzTsDbahSlpl/cSHyUeBvhuAkyFugf1uNFvHe9NG6HEPq7I+DmGZaUz12yhXO4AxN93RRX3kef9YTSiDfeiQAtsEFbj/+VRivBgNYRYRrvZUn0FcKvRNiQ91hjNqlupq5vl+anGDh97WgO4NGSP9tNtXjfe2oE+v3Vj2XD/T6CsHBobqaukWL498Pu4tZackyRlDhwm4Kmpb0J6FFXeUD/xRFyTUvnpgCA1envxI0Z5gR1o9VzmFGdFpneSavNN2JAhNdk6Kobo1eYqjXu0YGMYNDbqOjOjWLqjB3p/Wp50/4+N/tHuZHEyIGB3ll9iooTzgRrlHoTXMi+n0sZ/mBGO7bFjgBmpi3mlprqEd/HPSmmRQdGiucwbTo7r7yPB7UVuqmSa9V4c7gbuXaEcNBQXVHegZBY4IJ0UuIJiUTj3Wa1DdihXnUyCe++194RdNc1b0AUA0uvJiiGLZBI56HggaxBDpFAWtyXR7z+v1jaEDP4Yx5wRnrgnOsEgUNdkSzUGOqB6WCgydHY/gkyFvAsa1GCzilXxbUPakqOF4uH0MCcE682GOg7mF9RJgZY7ywJp7+Zwayz1KkEpwQRmjDq2zghy+JYkMQEYdUPQMwRnnznVrD8Pl/qrmpBzsDFwo5iQyGgcDA2efEQMjZXDWDK3A8cwAK1OB9B8yAKs58BKhggucteKgI3OwnGQIXtc5ZloeIpRfSkJ850PIyA9lLohnX9/of4xBjGBFwcySCJ81ADDwZG+V4IFyYm0ZsIRosNcX4NOf1/4Rjy4hHsZdkl3CXmEizeE5hKTFKPrvaa9Evk4XIogKbXVEXQ7BxvLiY1/VBJrvycmVmF2/xQzv8G935Ynagc8ZfdUA988Hf7m4+7RfBmHAuPDkBQPAfkF5ZlfMIx/Q3+Ix/a6fYlN8GdwCGue1vB5Dv7ba3A7jqxKzzreD87f1n0gEFvqoHu+rvE/3+QjDs9WM2F8NJbPtIz8N2S+MIGIRDKLoSHsGsROYwy+TIi+fWKsn8jb3zDaFeolvfhgA8DLUngYUEaR+HWdwr4RvMSqSAWUYgLy6sVZLieVRBUYCglX0cnh4URAwvnJtGWgcPsLUTeYRh7oi89hHtkjy++pSJJ0aCyn+rj/8DBggQMoh93Ep4hImtyLMzzpxdXvrsOkPyvPj6hmcH763MfZ2tdPhjKWn+iu+Yt7UWngKWInOYJnPkxXO0TDN/qW57l68FkLIDSDPJ/SI6//GxcSvhFWApVsA0KZAXF2iZpDgXV+bO7irxA1f3EFMx5wy/xLnZHSvhM2ApVsA0KZAXF2iZpDi1cZmNKoYgC7G+ONydDgMFxnFeoxf7XrBObq1jCpjc22LSSf34D/xccBdNE7SiEAtBVbkm5oWgq5x7x05s62wCz9vKuereWZ0xym298X0Zlr/J4x6+9PhwcC2T3O+8nbYndnivNDku5w4Oq4tzVzwT9g7Da5Tl/ERglvEYQT2Vfce4jZJe5GKrNX0wpQOgQjXbtix/vMUAdMXFXH7jfn3iH6qrQ2cjI4aJ7AdpR1cKVZ0bX9VP0gg6RTNschJlM4YdIW/3mcwknIQmKwAnZ9jLsKs6qApuWulVePlZ4EuO6d+PpfUhLBfZLP5Id9Zr+gBm5Qz7h9hVtRILMnpNWLCy7EWsD6k8QxWvEbnjiVuXQQmLPEEZiKp4a9WrIhr3DMpY7AnOQDylgIc5gxxnuTDUosdhErE4F3k3HGWN2CZxWOj8QhFlxwk93EWjMOlLwQBZZ46Wx7Be9bVp6UWTsXnknOEZiXhBTOJ4EtFrxMxK8dc2xApTjTpruo92JrhVrPwa//yKQqjkDhIQrUmjN7WdzaZSrpEEhVHZHSwgXpyvxRwlbsn/fgH05m1V6P9IORpXzhkeacSrdhI1oteEKlCKrmKFqbQxsth9Cs03IyiESu4gAVFj5E1oDCt2E0FhVHYHC4jnDEJp66N1Ty6F4TnlL6Lqlkd0hruEBrDziTnq14RZIpU908X5qpGlEUKeMEfHAFiQCJl8QAJ6aIS0BpbLBbYRJEZmH7CAHhfyykAWdsqcW9rnb/ABUV2DTDq7Kt9AI9Fidk1oAqfsRiFl2zhqvfwPybHn62MNDuGSP0hg1PRIbSlNdXfBYVz2BwuIp0ySRe6cAUiMIluY0kVNWenw9KWf57YlwgccB3dMSaYRlMsBpXAePaBmer2dz3jcBJ3+eymRZVWd4EMSTrcaf9J8cON403Dt11LG44kKiDNlm7HyPPIarwCsC+SGdU5eR4d/Ce8vN9Q31uViZoSk7oZDVJ53jNqTLDsVrzfBUOOI5bh1kdC3DnOQQ3TWo8pHYvFeJpNHsp0fonbn29NMr92iA6IDCewrQ9nNZxLshL6wDlk3FsyPZBQAQ/EPbGnm0ZIk56903e7nqFvQSWwxE5hRyNPqkHU53/qRS8BwCdjKCS1JpnsRvfgTNW9DktdP9iUkKnYTxfp/+6gw6xsnUvcznei/aaCVruCWyfs1gey6LZqfOCaIjuyMpp00OwUCTrsrgGrRdwCwEaMLgloeV2U236W2JIhQyA0EomoemXrkEgUHYhR2A4O4mj+TY3fclAYkKOIGAcmUx2wEiBhWMqdKil+XIKp8u82e85Q2vJ7X7kpaLDCYKh44vJdX8lljNs83YTHM7bcP3rJRDLQewQ160i6IXViU6TPQyL1q/6OG/HuOT16WV1/yHUR0oFAj/LmzfI4GqtX5EZSyD7Xo/X3hT67Gwme0tRoraAcQAjmBDETVGEdUgzl3xQCMwE5gA/HKBx8ykAtq+N+r0ohnCmR6eJB/3CELL7jhSDIOACJjAeDS62loSrLfmYgocmvPCa3KO/oC9+0PafViVYSDYHCJLrlIGCGpcBgOUTkmRu1prry/VkjbFmmQ+E+CeNUwj2oX7ZB1w2HrRy4QgOFCANjK5KMlSdrfu3WgSO8pKxyXBxum8y9TC0VcfhhXdhFcfcUufKVVQneBqhoPUqM7l3Ung6kruepgVPXwytU1JlkXkSDQIlb3mNeB2zWNleN2loXZNzdyzAPCsA5oacatIUm2XwvByC50x7pdpol5kSYEz2Vd1qeu5Jh3MIp9D68cAa4xySh47dKRmoXlBV/M1fcTDkf6zTvLutx3L3K0G4JiHMjCZFs7mvP1M+6atPhNMy98wWuakcvgIQuzDUdyFSCyAly6oinN+hBkZTys988FjIXhR8cwHdUdqjDpGydyhBuAIduAlYnuzWjucH1r6LWb8hrkfy/8/4TCLu+LD48X/SpM9+RSZ3OcOxRDvEOXZh9tiZ6X/5Ipj6OmHZoXR+E1DYRUeG0hzHnjkGO7P5zh2XCVGW4/RZLbt+dNRIXbcHD/vRDcM3LnO69ovguyMPuBR8lYuPN9qnRY3RJ6LRkXi3GTKEfIOczrk+9SorM7dxnVwvzDkSTtAJHkA1w6BNCU/J6V/w/7P9+gxNwMhWP7XJ65syjnxjuuFquLlY6jigq8nnUng40TuUnAAEz4G7By6PdmRE8psyPOE8Ag0h4JhfIysqS8WIKU9x/m0HiIt60mGR/xAGS8xAMWjh9IvPIk7xZt8+XdE48yL6rKaxqKsPIs60ZF9yIXBoageAeyLtFbfyXLaVzKhy27VQK53dIcpH/IQxZmG44kK0BkBbh0RVOSdedassbBDVGxoCOv38RikDxkYf7hSDIBRCaASyc0JZp+DdDyVCqcAu98zEUPcbq3POy1eVethUvjkCrfLADBf0+47E5J0vgudexd2Rwqc5t2JH9ETLiTKh1EFaurXjA+qLLIydfYlP2EeYWHXrv+2VgTomdZePI1N3KUA8JUQEvPpq0hyX4Rwu+FBE9i8yLOvKax7DPPsjDb5kYuAcIkQEsna0gzvW7uJMMr2PLBn7dhBhbE5SHr8r31I9cBw3XAVu7QkmR3avPLriqxQUlqcPOaxgrePMvC7JsbuQIIUwAtXawhycKoqg3vZFKA1NgZ4MEZj33BBuKlxScoeR2d479XTe0E/6mw9Eb/+ZakjnJnWpTleUHwI62bJDvRfkw3cszmJL8iiNi9LltQcazX2emZZXcP1clkCaq/hAiqZZ/yY2NI1TcGMuQ0MSGjRAWUsMgTZCBawMCVa/it7Qs6CAUXN/NNwEDSaeyd//MtLRD4ppRaXixwb4qycODu2VxErFn6ZMYPwByplwU6e2bpHoRyacEH0C8zeC3+kkMeZ8rth2hgGPuk1u4LGRzCJX+QAWkR0tYIdpi3PaddWr0V+WrULaeOZM9wGMmKX/6kFB/gmjAJteiJtkQDZEtOOAsH5pr65dXvZD5ELnsk0pg7ox5seBUkuJF2uOHw9MeUkV8m65py+vZ6X50ns9Tc5oT8g9/Mxh8zsQNJTuWoaz95Y/TwaxOLgE2wub3c5nXne3ce5wHF+p7LuhP51JVcNDgYdefhlfeQdo1pHhtkyddPnYLvmH9V5kei2r3DX95jboTp3zixHrsszStJPt95PY24I0R5bLou98/9Zr1n5uuGI3vUde8xYtiesVU6cA23OnKJfxChkBvIQDTtNkdxQAtc4aIPPrrSK0b4DM/XmS+p0fAx72//HuSWHUf+wD8uy7nXJrs1gaeDGZtnLwQ04gI+s4EwkGrJwOHaBQSvpV9OsCcoy+Ki6eFzikwSw+MFgzDJG2QgmlLYrucIugtBXsg0HpHY7oVieFky+XxqeXj+0bP9rNmmXA3RI3F3hqDiaJpEKVngo2yX4+BHIs+EUXFN2J7mm1oyyfmMHuOiO+fJxlVDPQqtAp/h2Tzb/vc0zgPumrBQLfscnY0YFf3VGYfdUM493gYiFHID2bBJfkHeLtp7XkgdvJePknq1ofIRU4NI8I6etWPSc0kV5Hip8L/h/e0o/U33TCjn2iz9n/yRRq4qL8vlU54pzMxvZauOULzQlugbnYrQXtgfbkP3+dKHsOs9fYqJ95uNvd80/xUchzjV+acFpcpnE1oh0uc7asX7fGOZP98/1l/fLXSFQV/4Z3cLT8Pqz3z3cjN3iYIc2Y8+rBX2R6+5G+BFLS1qahlGyb9aZpKOvkR3S9kev2T3wkzie+3CL9m/HfsFrzbCVrd0RIj06pUSQJA9whYoLnBhzRJd9IMkhY7Bg9GAMsZfHXgYEH/NAEjlczP6CsN1a4eP5v2XcrdcvuhWz1c+bEIw73v8Of4QOjwsAsHVYmKsYkx9xatVJvsjUOvFBc/gHyRaYVnHyoi+F64bKBmsISP545KxfOoAM3mrX8uV1gPEpTDjHN5tgC9YqCH/+OOixao+A0lNxByQlWYH0r4Bxn0XChBrlx+QVFZwwzqQAbI34sG7kpOXeDnsBA56YypN3xeXycSnPnqvB+ZDW4xEs2by5tONhkVVKKEJf7dC3rOWcPR6/7sbELWxa/6sKw9uPccaxjN9vWJrqO8JQSu0K9TEmJPUFwU5NWLMs5nGmRAMK8uiuf4SrAcW9+BJHw2CMlnXihGIpzWZYfaowUMzl3cZH5zaejz7gVUsOwXybQ6eOeWx3HpY1ixbYPYwFC6Oc14XHoKbH5s4/5eERVO2LJJyVU80RwL7AkxaXjQhr7YWpv4Mk+TkUKzFmclFBCt0x0BzFPEQppyCCStBfDGzkEIavYAGTGHHObxwLqzApiAn3/nc1nl3lMO2lVrVD2qrOlyu6KJr/FuvQHTzcWm17rgDTz0z0lWUNREgd+mgnwZGkdR4VL7SHWU8Mrcc2rhabw9h+oIholCnsO615IpeK935qQOYMTQBpUklU9FYxqNNpVJpN/8O6KTHukERmELWU893HBF4ceCXNKu33aA5HnGZ8XKSX+VoWyoMwaaab2D2tnjkXZ1P9QjrvDHJ0Ybp5wtFCk/t3rj7Cx71uwU0enOlOs6IlmQ0CxnQVHasw8N+K2Yq4Rb8ull6PFe/vHHKzVrMCeT8NCJucrU5RZs3Na8FzHy8SXLnhUB139O+CgFhTgNLjEFlS0LmWiwUPPJyA5O9FBiKW7uKWBfxRGxMPdmPPUG2MnmDTWDRYZ72dXQpzDm4vgS03ORqlPHouMXoN+8myg3exMpdLIf6esnnpRLpyGxR8ObjDZTrjZn+FCKkhRRoKj3W4FGlsru9N++mz52Bh26Ag81HX0zuSmhQeI3Zx9ZupOZt3wGTWxI8TNejLjdGJR4tV1y7uTw4pwNn7wpxsEu3AJU7mD0lXvzBT/RzlzT6pRUULOLMei45WH46NrrX3i+MkOeXgFJhzdRookt26oRsiTcqZDOnHxJP/ycDmCk5oY/OxmzX/9MCgkejnofyXf8q85rHC/2yA8CtYeZrn6+p1in70Z5svIvdlWXolgyw+fkvD0e3Jh/xbHPSIdhgJrFU2LpYJsOojOln+S46DSmBpENCnMpXuqOMR+aWX1vYbw72x3HW8pLjrMt4d6k+aL2axKOAhzMHg/O76i9oXR1IhCl24ie6tNqf7EzSBZLOrSULygvb8f+7AIH8Cn29j0HbQ83tvZzYU/y1wYOajMFsqTYQyzopsEZEdnJYLXJaPtbvU1RbpT31sF4QJ+KGdwFjNG0/yzuHmYo2FdrCCkoBUbuFJ9hcDZsKkeavHSBF+6cwsFFo4buigOjc/A+pGm66VEQkYrIezqnGDJ5R1auss2QqtFrkNWUYCWPweleKzNvqZ3N/SqE6NRGjDoNjk1LUvGwqfKxsA0vkpJyFibqMjTGsfg4ZqEwNS3uy8WALl4R3Cq568iXCNn5qynUeaIXbBjmlaJzndXbYqHJyqqhBLGmm6pB2jWxVJYZcuhZxCVfx2sJKx9HKWmlVzuHcVKtMFqn8wf0aLbf3vO+ea6CQWLSxuTYUEos2NteBQmLRxua6UEgs2thcDwqJRRs73hugkFi0sbkWFBKLNjZXQiGxaGNzFRQSizY2V0MhsWhjcw0UEos2NteGQmJ5+TehGmYq+EN2u2B4XaCT5WjZc00c9VA2NcRx+nwRJSDOFdwaYpgUdBE1YoGMW5y4z5tL0+GP95qEpzXoBYSmX84+hUvwKQT0RKXfkVnytnRwJ17kVvVissNsn1/NjRG0OF9s30Gcy6/mvgo2dJsbezE+iP/3/vng/behc5HO7Q9rjkHkomJCyUerRFjuVLOyjWXE5P7UrlO4GGmE1Ks6A82beuPXDRRdMnVCo1CCC/Z7YuSthOsJpZN0mbFjPwKF/Vw02O/pFCXUAuBBLErFGwDDSTjtOamgQASgSfHlmLi4slH+2sOWFf3uRQoBV1HC7cCrqLql3cw687RCe7qwMBoo9KaC/R/+N4Nyl9B40ipE61BIzAAgFjn1Mgc5TtE+DH+JFFjmdftkDiZPiZG8clsRvFmk8l/9ECcWXBn5A+hah7RNpsUqMVrsR2uIh7U1qaLqVpfBrUhnL82xEIaAyb8LepykyYaoyvsW2e8xI2+pZS0Xu5B6t3Zb4X+JUd2Xv5PH2QnMFd2BA6tDxUfif3rPEDntBzToD9JPft7/C4H+Yb4Af44NHbraDxubBChOlcfM2t/8GConCWu/Fazz1jMVFF3SnkQahUAJ5W2OdfpAP73lUAFakK721WnGRiG8hrOUxgqgKv4yE42Z14TzTzGAEg19yaMmJov9wEcNYveFhebRV2oLLwLtD+kqX41em40GsQmNALeL9e+u128jUuhQG1n3bmpZGBZmUe/WbkNbWG9vYSSP95c31ld5eajKBLfql3lQw6roNwdb/ePDWz4rf9zfqo2LuYvM0F8MxdvZDCjRCM2G9aysPxqqJk0qnnJBu8lIsKN9/yVfcSLuqZQlT8R9k7eORPr2Pgl+CuiuxJFEKD1VuuguATEHDbF4s06GdH3ZqAG5CFuaROH6h4Q3OD3SvnCpoP+MSOtYAeQYACaplKOBW+JIIN3nNGm+uFkAIXW8Ci/DGJzWtD121dZ0ZBMVsEEVrYkK981Ob3TLY9j2XGtdMFSO25GfrzU7f9Lv8EHtqXLVomBZxW1Feq5OTWkbfJ4mjLQFPkenRhWXeV4nRnVDXsqgj1Tp9vQCKf1RsKz43M50y6Ao5Y1KI5koJQsCVhFePk9OsABWIDTI/7A3fNU40E+RUNR8yIg5Iu6EaVNepXAN1sMRkd5kbBMxRUzmcYOEdsYLJ5pcpylBrgEj/1Biuj93WoEnDk7/k0j5UpKL+j/SCQAkCrU9788CwoXLu0BG0Pw1uRdN9BgfyDBPOfH58sHWNkjxMRUWU69wqjSZNvfzc7/Y4VEhVN8UL2q+3F4gPoRVsNOl9v3nK7D/fd++T9etyyqQxrToSMKBJE7gYBAUxlawAwqsVzeNLwfHfqT9CBFglInEcMC53rgBB9Ln1wI1V3Tv8QqOfDA6MAgZxs5ghzKwvnxpjZ25S+gTCYdsSQkURoLRE+ihBLA3XWvVQlGo2CE4GM54xkd6NSuDQ894E2MGrMuuRc5LtCFLJzhezVAwCB2M3YEdU2BdetCSI46eswf2Q+zOKBOJMcwB58bduBEH0uUpfya2XtKO43mNP5/mSBFB55wzZb4YfqhYuKukiE8EzACR1UGNH29bjzAxKqJD5NYGToOJdcC6uhtbX0wA2VF68Hj00/FcQsgNzY1zYgY6AF3dsKjh3Qi6fiBb97ETYu3wFhi2h+OPA6xLh/Vuwzs25Q6Cg5GEAgK5gBwrwLrKsK+ZyFyhW6IVZCWW4TIetXdqnsrTFkFREhkpkhTyXp1tMvK59P7L86vXsItfWu2Hdn7nGAJ6tlM79lNdgQtVcfYQJqHyTGFPGLYHsUq0eFdFrkZ6YIXmMN3ohVmR5biI12RAdsBrsERYFEVOimTjHbUlz4/TGYfbKQ4K3UGPOtAuHz69VOea81QRZTWW4iIe/ruaBE8Ne4qoqImUFMkwiczugN0MF3vSDCl2S1xm5a7K08+nevq5WpCX2LwOnIhegZVY5lfRr9XaF8HcqnJSFERJZD6KPjYRTk6+ozU9OKmL5qAt41U+fz3V56/VYV27YUg+EnFWYpmPoo/VSYKMtoqXKeKiJDKfRZ9pLXoYhxrcdsJKnNn5kgQ3DGrkM3YgWbArDfWeeYpqAMUOGSnXcAEv8l9mCr3yKvjosD0Kjn84aZ1gIJAN5JgB67LU3KsZsIWVMbrGJ205/50R/TbaMtN0lYSnSkjRSvGDUEIe8jX2s51eT3DAqd6oAQfS5ymRW6audfjGW6O5nbrPSMBzU+OGEqC+dGmYttoQgGbqfki9+rtsLp5dNKOySPSuOFRplzQQ6gpwqjVqxIB02XBhwbDaqDOiFGMVluAiHu6JZm1KpYGIiYpISJEMF9mc5GawsYipikpokWaldswhCXHv62fZ1TBz3Q4hGw454/LcmAEbnqGl/k8NIPRGRD8l4NvE3udqw9I42Ax174H0rlEiVGGnW2jTrcrsU82uXnYqeylEVg2osBLLPBQ9rN5Ero/FRoCoiJLIPJY9ZrMuWRBt+6qvxD97TR3BLWkZr7J/n2r/pscQc9smeOehEmquHCSo4SykMv+K/v1PNhTVVLKD//HBQolXwEQihN7Q3KAnZqAD0NWNGGG8rtu55zSKzwavXwRePwe8fhS8ZmphuO88za2ao6B7zVXohKANZ5nR+dl+/gbWpSndzBzbTqPoH/sd2xnT/k8dhfOPtchTzzdVAVh56H66KLSeUotZl0u+Suo1H5YaX2ovjSckS1poPizzq+hXhnUukiqExH8U/PjRbgBAiBxwasyNGnEgXZ5Cy1ZC9yod2jX+/cL1+hQHhe5zeuTZol35yuerW/gCYMR+2B0YZSIRrKG5NjEDBqDLUqEBMBHHRqXGw+P8DgQENRSu4v5BMQfWN1FnMKzz0QUcqZHcbgfASMBzU+NGEqDeoZ2ES9AKBCs13uE7rIrCPXviRnoa5g+yoXwTblYyUykDukNUQnC3BMITCOQCcqwA6yrDxXTEWKh4ud4ohioogUWYyjLmBLt+IDV+YLubESFewKnaqBEF0qWpsTc7TBl+pMbLQ+f+SYTQO8xl5tDP9ucPsC7duPAdO9mRdBT09me6ARTBG5rrEzPgAPqWRVnYOSAniRYJwk2iCAkEcgI5loB1pZSAKi5WrULcVeQZt8FiJDDYCexgAtg5bl9BS3poj43gPVDuOcL1FcLrcOn54y2K4zbHFyMVkqAi+h2sMOoXOmQDROInbiJGUVDoCnpIgfZreqrFsBO8Y4enBJvbohHMcMhm+KFi4c4l/i2MPamn5ChYXnEHOEYBg13ADhaAfSUt2Qq5coQ09CVkduc3hhkK12b0iFm000arZ5rBie7M3cRYhSW4iC89ouqVvBKV+u9hY9+i4G4aFnMZoKjyaWk3AGUk4LmpcUMJUF8aNZEFjViyRSrHOizC8VEj9X/ycg9eZtl4gvfFLcOHKDfSKDnuKLjLLKcGweHXIvjhmgTcVZuroHzKo1VgInJZ1mMxLuLhZsVMJgFBzULFTMUkrMw2lJYgbt+NznsqtL8WfZcOd7bZkd30XhFzFZfwIk/jQCCRQhxbi5L4PrstNEENg6ozdkQtOD4r3Z07wYyoEe9IBWUm+tbx1i0/6l1La3sgSgcCuQM50gHr7IZtqxbrcBRPtIKsxDJcxAexhlIuxV6b9+Ngd6wwn8C8Znt8UDvw8GGNCu5XzihgsAvYwQKwrwx9AUMhp6wzYknWYiEu4ozmAoVm497i5ChYv2Z3eSe4YVB9xg64Bbs8HX5RfDSofQki8TK7uztBDYOqM3ZALdg3lo+K1Nzv9AbJ+Z3kCQ4818+5IQfU5UM2GwTnFKCOVI51WIQ/D/fYzyT9UktIESmCY8GzFWMdD2Spo0U/b4rwUUiCXEp52gUsfW1HDZIpQNieE/yp2eZuIpPLgAGExaTcRuvYykU/1sjlgsWtfMmAg/P/jO0jIxDmi/+afu58+RdOaAKml8Bqv3rqnb9O3+6tuJUX3liMWQiRZmHFWs5C/dlfcEng0f1145W9yAaEtA94ajkLe/ci/6X1N33/GzmprkhBC3sdEMeSt02No9eVtkwasDoNCEi2gLW8wJ3ahRPoVcHgHiiMYUbi8b1YwpbPFA23uw8BrEduHa+895TLxUuu+BrAI5Xk2r3PuwwYLPLlN29XeQTAoGhwq85PjZTd5nxKI4EFPLq58Xl7ulLA0984JPNNe3u6iHExUHTyiA6/UPakEmMke/Sq4lI7+ZYX5UWqVYNTCcqZ1fWLw30FoGwaBHm3nuq20aXukmu0eUB/MS4M0ANawjf5DOUU1EHusuJct/6AB4BFLXnxQNXyN4GU3KV+8AeQOE4njC9Usvta4xbfgeLAXN+ee5XIGMF2J+7VEwWBIBVuqJlnIxhjdat6mU8Ym5GYm0vARbV+w0d07BH3Oenxc34Bnt/G0203RClnt/zOcTIP/06NpALOftXz08V8O1qwe7cfKLa5wAPCokr6Ocde3fyV7KpXnrH64lL71cFTV7mfOQA5XnfopldSP5le26FilOHl91GClV49d6Bc40Ralr+Wbh+61FE3idUAKlWR8FPbmN8aUUnmVCY1jMsWetiIy8ybMmjFGcaVtJfszk5VI5HyScKgbE3y7ZR20aVWwQ0SLddhZm2T3Bh1vhsP49YONYxLk66Qd5pN2POr1us/4iu/rG09RJ4EfhaUexbM+QDxfH5KAPskNi/xLqGQVRQKhXaq42DeBYXPCuw58NVEGRIs88j68jc+PwGjdicTT2HKcFymUD0O9rmUl7cICoIqjgeZR84Y4/dCAuhIGpqXA4zHgWv97muM363UEVMCdqQOHshrja9K+bdtnn+XNLqg84EEfOXr/FRVK4FPMwiuGlGITSHhq0IjP9hleUDxfOZjwVEI+LJQKDSqzpynKBAL44lkKg1UGBYGtKqNe8GWWqu9Y2hK3W7D6Xgj/Qia1UE0XNynrv+xvKOxfBno7y8K1z3KGEInzP5be9Vd22nX2HqXb0j/9HVt6PxoEiTCW6E6hoffGwlLp3KpzsraxlbuPYEWliazlbWNLd1GWliazFbWNrZ0m2hhaTJbWdvY0m1FC0uT2craxpZuMy0sTWYraxtbupehK2U+xy/0MPIXKs9POAWLjIh5X8EzPeWYUj76eiY+QZOTt3DLSGTrdl3ZOkrlhYCT0rDIgF4zU8VpoPOcbZsjNCNc61AlgbKtQCWkVEEjw3T+T0QLDYxBehTW5UsuhJSG5CegKbkww1lc2VvM5+vBepFbrA8bYhPYJDbCxtgUNo3NYLMoic1hS2wD28RW2BrbwraxHWwX28OO2AV2iZawE3YWAkK3vivsGrvBbrE7fCA+BD4kPggfLAiErVwqgQdCqcl9n5moj24ndw+fzoKKSGpOetmmtW9b1QXpS8rj2a36QWnSqrdLLBp94nIHd3Qnd7ZKpMzamaL5XJtaAgBAQIA5F58J6PjZ99P5GmmUAMa5P/62SpRDAOMXyAMCREiQbd/f2/VbYqKvo9WX6/6n1pv+T+fFr2eAkKyLaiFWKpl3lAv6Wa5ReqQby4c/Jef8GHm6yL35N95XBILRWT9O2B3mT4kOTUsdjIIQxE0KZCeroiR5myLVxWkYRd2lROvG0+FotHsp03XHp4dHR3ef9Ja1/Efk68YSerNv3A43Gu2jCg3DmDtQ321ycPke5m2mchiDVWzhQvhP6WogxsSU/VCHCof9lHdkenBOMjLovLMUgyH9Y7XoVGgjUF5lgKypS8KUA8xJq+Lf3BWW52/aU2AQiqJkMoIgAEC20CRVVc1mRVEEwVyRRWmalstJkgRBeWsVRqqas4gA5KdVGKlqziIC0ruAfyyg49rIogOLxs7/+RkjP6PFX7QG7+iq//QWfwP0pb3+byxOY5QP6aVZRmlmxGYkZtBspEEFwwIaQSYYEBu7LflUGQIjBCGyHUMrJaWqmyKnFGNabxbzNI3jdH1zcT6djqeArnur/FQ+L+8Mh+mDPEnEsiCiJaiizwvGn2SRC89JG/Qq+4KegvxManeNJEDQFEqWIcXlMI2Xh5PEBefOHKOi+lhkt8RYlRS4ee4Pbo2XC/g0f/1p6TZx/Nv57z11/WRu6vZc/YFhxKj3J3PA/r/Pb7IKoMz/mTn/nNqAMvh1FlTdKNUzY8ftUz3Pm/P7T2I+/1N0yoIyMXFPhuIjgqZSmiVBDFgCGC/5hNevzNE3SUQZTgqSAABMAGAwdtt73XkYCNMIQYjcHofStlJSqnankXKdUoxpu9xnyC2Rei73GXJLpP7uZudkRHE6isIwsh2DWBOh3BOpxMDP1KT4f9EyfSD7Mp+KfVQ2iyhpCZ38KAqNiRjX67S/zPtu/Hq93M8HtUovAAD/l4GXbKNAof5l1mHq2x0GYKZ3R+z9qWBvEQEzMcrdlYDHc0txDyE3IQpkpJ1sxDELiwCRCQJMxn6TPlWKISDEGPqWY0ipteyrpogx57hfbRbjOM/j/dXNxfF4PknsdNu9//c0s4B//GAI/A59eB2EXqdRf8JNtwNlwy6iEwSaAA4hacqC5ZKV6bq7/LKadjQgBsMwAEAQhAA2oibLsiBIkqQINWEWx3EQRFGUBFujQWNmACISeBoNGjMDENHzN8l3nvmUF0aRHUx45cDw31CwxImeAWVX1ORcjOosE8lEZqJmIjtRu+RuUHf256AIAOj1GF8pTZVoowBPfcvss3z7kQcBLm5Uyfdl8Xxd1pHHr5EAOXiwcnsPjrTVGhAIr90BzO3yEsAP44UFwYUFq/rDFLZP9w6Bv9w/1Ql34VI4+Y/RUjiThjkP1BLk+MM5JyFoUsPjlBPbdRfoz3engqYbp34HwvFd8HgQCqzzeyCdznpFcvJThOfZMHF9w7UQltsuBVH5mezsur0zGRThoBQDN/puM8GWoPy85wCZY+smlFng9cwdaedtodSHQATHouoTyoOZnMdig75OsmXWZrG8ROS3ZgDxEg4xWFp7Jm6PjgeEcRHd0bRfDm5rN0CbGgRyz8gGAHh9Wiva0xSsewZBSp/Vh7Y0i/CemTnVk+Wpo8fzPDMuS6j1ovvWuySLvHUhR60GzOu+b/iYYAZrMIu1uu47hu+fOZGexrFZ/5ltsZxDkxwUJ3K1aNmsEQNAg+KXtWEPMuP0TMiDRy4XDTolQIMiOLsnPrIJv2shQxOr9+3a1VF48daSyCnwBTQYpguPVn/juB/tlQejArpHGBICgeZJ+FY7wwJTcP0TnjGcYcdb0+9G+AmNRU9ekS/Mfcg8Zf//y9TsIJWaNeSjm5TcUcELgefmlQkix5SePVyFYnZbKyDJW2pbEvr7XMHEXGFJPujwvqtfKWK2+tv366/PSQNCC76Bey7JLLEInX5sl+aXrZ7eHi6aDGyEFnwDy5xoLIEdnX5sL3sBry5qAjDI5YQWfANryGgsySkdfuyXwpmtfvNwsKWllNCCb2CBHo0lVqXTj/3yQ7PNu2fXI/SbhBZ8A/frfVsyVzr92K5uN1v9XGVsIFdDQgu+gaWlNJZcnQ4/9suJzVafDRVo0oNEaME3YGsQuCaAtuL6p+tL+c7WWSFpayIDTOJ/4Dq8LCcsIQys9C+F13XoQQdVeOTquzpur///15BOfv9vLYALfLRlgyVIrbqSVjTnR1vukRH39FNBTO//t6SU5lu2WMqkBlWvUU3asv2koxxvYzbcdpVmxhvvROJHDXEa/dsIxo9keZn1DrXUbfhftfUvfXEaQ/1E4EfRg8RfT6TcIsGKE/l7dqp/xaba8t+X8mS140hM6qkrjQxs+a9T3Hi5+C84ZMMCar0pRhqaaOVAU3X7fTiHfWff+XvNa58du+LX2/lf+zxa1K/x0rz3I+9e3KYAAzD1VqhbX3Er/+v7/91vxaBkiPUmHuU59vuzirD15TM5cIjp+KdmYa+qfBteC5d/Vv8KVTEDGMAABhiUulfUfAFlf38h9YXUF1KvLtzrv3zUKyK7LwsRXGw6++3TzPisAyJUeziEf3MnuKQpZl9owBGW9mbybD4vpcRLgEwUITXRVeqkk/j9+9KP7w+qbDyaXBPXxinkOj1uA2QKEBkAXYwyN4jfsy/9+rcrp9oIR1iLISUuOw3eAWSSFqmHLl4Xq4R3aniGGjE+HtIzdTT1cYwtlQAxU56DXlLwSD10rUppJf7LwDp/02hOuyePFiTrYcpM9fj09tq/+AxLwq836uE/cbn4z2yit+fmTlFvsuuZXHZ7UDSQea5kHHR2eckPv8PaAv3FL4821dtjqEodj1OjZU6CVwCad0xGQZchh+yhfkG76DbRm4WoHCP0daLMxfcIINO/yedBP1aOJPmlU/P88Drt8SoXmR3R20aITidogG+6UOAVgCbok3roIpWISvze/He91K8HFZYfTR3xqvn6Zy3ceA2QiRdlAHQxuokhfre+9PGwq6zlCEf90bXuhr2VBu8AMjWmDIIuQ1LjQ302vBg20Zs1OXi4e42J0dpvH7gH3hYCmKJU5MkBjqjPii+ex3fmaz7cakrR5awUJsRTAE0vKyOgS1E1AXG/EW3x3aZ6t5DEwEsDF29ffq8ANN2vDIMuSANLxO/E+3XeMvsC2o4wPbGms6vSzIiHAJmZWWqii1SIMfF796WHHw8qOUGaWlYEn1OVcNjxGyCzbksd9KPfslKiWFSJ/6Murvgzm5nbU5i3aFajchqiz2PQS2Z1qYR+8NuuapQcK/FfXtZ4SCOU6Z8nlBrHlD4ztePT2ysfMOnz5ei3DtYoXFfiP9Z4Smsoh13yvk2SHn1masent1c+4VIkDFi5UEQg8K6h+yyFRbDJlo9Nrbzn9lsHghR4CJDJLGYIdDmqbyHqN71f+ld7cguPsMzFQWokSkuCZwCaZWQGQJcmvTmi/vTHxX/70s+PcCzbQyNwTZoQLwEyM8wMgS5IqteD915wFfLMu3qtjrCcKbdXAo7eVfcGQPPyTD10dTIJJf6XuhdfHzfzLUdT794SityIpMRdgMyvNFXQj1f6WErW5zzxv/Hjind9TPgiEuqk2W6HDHg4/S4AekmzNVXQj9e/WWrWfj3xX6rWspRC/aD1AkAVnFNvAb5lWFfp1kaY4DCJ/3zs8nvtizFCwljkEd59JjFHngJkqrwZAp1dXi0kw7EvffWOQN0jLIfD455HSrz8XgFk6sIZAF2STsmI+rOIFh+LuZqFY3wIfgbg2NLgHUAml5wR0DXKDJaoP9lz8edmvuVTSFblkh3f+xxy3AXIJKEzALok7aUR9UvqxadirmYReRkQBe/upsEPgG+vecLncR0pgr0h6vPjxY/7TM3C9LTQDCAUlAKvADKt7tRBP17beylaSwNF/cUDM3Q7+fIx3CvuVP0gMYtP70EvaZWnDvrxQvdLvSItKP6L00qeRrjre5/xoqCQ+fQU4NsrHZBXex6txMD8KtExHVF/bO9iF3O1h/D1dEcZoc2hxDuATIc+VdFVaoOR8M4MrpCo2RfahTQ79Kx2PcQQHlwE0Nz181nQD1eRYcrXOkjxn+Vc8f3xYdU9SZj6j4gYo3qA0e8aoJf8BvSZ0A+WVGLqF81I8V+cVnxKI0w1t+4kaOxh1HOAbxlPsCQYpFAG1MR/rnXp5eUx/QxJs29AcA8V5aXGYwBNaULV0Wm1l0D8Tmx/p/t2+13uQkq/F8aZbN9ccW8ANKEMjYAuReNRRP019y7S7/tUzUIybTL77NTF5fcKQBP80EDo4sVXUXj3xpa11jyqBSwJ1yDfzIblDsY8B8gMTjQMujx5GRP1x7MvfmynaxYmxw1td9wObjwFyPRbVA9diAjhiN+TL/3mPSmKSFNbsaodV1JaeM8AMi8aDYEuSKIWhPdScG1/zbuar5Cw9IeeT7XntqvuDYBmpaMx0Pl1VkT8L0sv/n26T/T+FJbBcz0qXz1eeY8AMjkgVUB/sNYj82tAUUfE77OL3+4TvVvoIoteApShUeARQOZupM+CLlPjG8X/Lr4rfn88ILIm+bByHSlAzwPAh9egl4Sc9FnQdcq4o/gdepXPNJ76gNbmUHA1H2YKB94yPg+nWSWdSv0o/rbK77Q+dZqgDa4KaT7MFA68Zfw+nDuXdIoxpPjbKl9pe+rxwtWdHVTDh5nCgbeMr8MJkUmn3kaKv63yJ+1PnQ0QnHAkw4eZwoG3jD+Hs1yTTkmVFH9b5W+aT70JPDwzTIoPM4UDbxl/D6cuJ33SMiW832rIzE5G0XE5SMqHdXc+3rxTGph0DkhJNU9DoEuUpjHxh9A2w1JDNRIVSt6RckWNDhcBtizkBpkYoDSri6T4g2eb5da7Ww2+3QuMEbjxGYArfW7guR5KmgRQiT9stinNm8OxEdwl/XIbBa4BbAHRDSwNR+kUk07xvx66rMbFe1O/taY2lBAmkQOQ5DXo5WZ0ufNRp7J4it/117Ekmvp2rN1tO6UkeQjwLcOwCXNKjoKoiD86toSFI0fCzPmo8sxbcndAN4WUN2mv3HJESUX8gYUlNB8NVE/QUtK9C+8O6KaM9SZ9rP0YVBi9lPVGw3PK8ow4QIZ6SVjMl98bgI8mrB5zeZVkjdQUfyhhSzRvbuoBJynhYgdeXAbdlInfpLqeSpNDLvHHEDaleXI4RoGvYfGTosA1gK/fv8HnzSs5quki/uDBEpq/hifvsxQ3owPX3R3QTfUETtprtE6F5hN/1GCzNOdtdj3dcX0nRsnwEOAjBhuG2SZLnlC2iT/4qikLZw5Tf5Kq4m6dZsM90E1VDU662Sta50rFH3XVEs23mzrfAzf9zaUx4zSAFkrhANK8FjziKn7tthD/e+/+GAQv5cTtKcwLtWIJEiGZ8xb0UmbIk0FgrE761PhR/BeTNV6TCHO6mVb46IaZ8wzg2wqv6WPtxxCd9Mk5pPjbGm9JDfN81YyyGrsz5yywBmcBl3e75An3nPhjqpqy8PWmlk+dMYKBdPkdA/h4qoZgbvTSJYpZ4g+makLz2bBwxRGp0yABHgF8IFUDMFt9SZSxPvFHUTVH8+FwvGkPEkA9LhkuAnR1Ng4+tYAxq+aJFIVP9ULz2LAsu153G/T9rbgroJ/SeJyUs1mrrlWKP26qeZafn9XQRrgMQ+/S4SuAVjbkAFJyGCDCJpUK+Svq2I5e929Cm7w9BPr1oMk5S+j0HvRSJdaTQWRgTXKFF1j8F6a3+gEJhXrY0UPLlZxO54E1ODXdpeMxmZLwKP7wqGZpl44wfhYMD7Sshx83Abr0LQefRMkkSbyW+OOiSmnOHJbkiD4DXBVL7wzAx0Q1DLNZmRpJ/BO/817+I/Zkv8M0hxqkx8mKDfcA8ubiuwF4J02p6cQf3teU5Ud0BWMOAYOcEgpcA+By1Rx8MjjTKmCe4o/ra57m0CHpvqLUanKFGF8Btto4B5/Nz6QJmp34A/pKuXnZHI2wzECvE0yBEwDfXvOET7RoknQVTPyRfCUs3TZKe858CiKoy+8SQFfj5+AzXpokqX4Uvwf/WzTe92VeKmHJVxZrYI4BIT4CaI2UTwahoYxJ1cFl8b8v5trPsrnbQ7jbPksyVS6HSs9BL7cj5GUQGsGYVm1lFv+laKVOItwPRvxokvOl0kuAb69sQDJiQ4Shxq+3/+F/nrL8MMfgOY0BmKrR4RqAVmLqQLNHm0D5exR/8GlTFn7c7P6bkF56rMmBawAfeNpfgTm+DWCSJYlb/KczVzz/e1Tw5xKmZU2cUEZzyfwuAXqpO/fJICA+Mcmy1i3+S9EbvkASITqbT90B5hYyS9M/toYnBp8Z4PToWKCo38568VlsrsVTZBYkObgcZRpcA9BKkZ+zUq+ez4o/SLp5br56eaMJteqiGtHiKcAHSFedyTeOWWaHpCg6uheWH2MQhOILqe1gq+0KQNcp7uBznpwmIX0Tf1h0CbdSbZfvE14JT7Jeem8APiS6gZh85mQLo7X446FbpPl3uF4CuEqd8WbLYYCPhW4YphU6mZqRKv5A6GZZvuk8SLRUczvg8uImgBZs7+CSQZ0sbfUTfwR0E5r7NrVOxxOdmTKL7hZAF9Dv4NNzHbPWJUlR6HMvNOcMS6ZnTa6Zt6y4FwAf9twQzIp2clQbTPwxzyU0Bw1LfROqfhbde9XdAd1UkPCkv+v9DreNXxHCpCTYuYTmrKEbL7PdfITVy+8OQNf18BzPFngSVdlZ/O9bvuLPz33Vg8uHVQ+V37bWHCo8Br2UlgCtQo3a5Sx+P17ldxJPfSesz8sQLSrM1A28Zfw+nMXzNCp8s/jbKv+S+tTfrZCbs3c/KswEDzP4sh7PyHoatRd67E78j/Lv16+kfTibXZGv2mHjwWPQyU0dffmUKKnR43fgVT6S/pT5IQKjumMuD2biBt4yPo5lSz6JSik9/rbKZ5JPubBrM1AQKA9m4gbeMj4P574+cZI0KbirSkjrfcbOUTWuzEdWHu3a1V8HCh0DQjKU37cAdol6Eiv+eOTmdPr7Ckf9XSS4wUHIcA7go5GrqXzyp1kUv8UfjNySzLWb3OkR6MFMQI23AB+L3DBKEYCqNFxZFK6OLsXpeUQjBxMm+yDnHRr3MOUs6Kb8qQef5QGlqb2o+MPxm8q8OxyVEGrZORQUOAXwxzBKwIHapONY5C+5r3mocuL2EKZ5esgQHiQgyVHQSw1hz/HUKXi0+v9UqLKIi/o9lofOXDYzt4eofJ1TfW72pcpj0EuVXdD5JUhS8sQenF8i8+dQnC7cRHiofckdAfhjFCUnQjkqlSf+lqg444jQCuC6/QXawjsC8McASg6FYlRCVNz++m/it7d+n+n9MRyb5r4jo2sxAZ4BaNlv0PkkWfDSxR+g35LMn5tazmEEGdYIXpwF+GOi1NdzbVq4Knqbyjw5HH620ju+eyhwCuCPQZQfD6mltE+aWiLz1/C0KcBMbLped0cA/qiq/ISoU2OYxd/mVJ4At7oogM4MD5PhIcAfwymrJOrSXGJxO/fF5z/lbO0hjFNc6oOeWOT4CKBVezPDKAkoChQCX7HHojhVecoRpWOaJh5MyoZjAH/UU6JWlK3N9WJvCyrPSFoqZJfPFHeYcRfgj5GUfRflqszB+N9rfcWvz4fE5jMhe57OdH0ki0DvQS+FmULnk2pBTxjz+fzF5EfF2zRNTd+Z8+r9hSFR/gNo9fvMRCllk0DNABf1l2l65CSonK49NbWdGMK0cFo6fAXI4gWasZQVHQVrzcLoz32yftvktxa6PV/NA7NrjULvQS+l8kLnkzxRLRZ/HJVTFQ7f1HH59YyZN3v5HQP4YwxlKEhB2q4r6u91tb/i5VxvLTRlz201KT5Mg2fAGmhJ8ckjUozMt4r51clLj392FHkx4Qh4CHlX6/Pl9wqYz4KWEp/OIyXqIrT4gwCdk3lwOPonlALhc4QM5wD+qK7cK6lFsvXEHwDoi8xbw9DasbcvC/ZqewHwwX/WU8qbVCuH6GJv8yo/ZbahapP7LhKiw0uAP2oqZ1FKlmmM8b/R7Yqf73traGGL/0EHdM6uYu27AOgkR1X+U6POKFR44nBycJEL0FZH+RKCXXFQphFqS+4I6KRCCAiXFixlimu4+KPgnJV5bVM7Fc03N0OJcBDgw90cQcncUpJ4too/2s1U5rQhGZqKnqxYXHlnAD7YzWGUVS/laYq0+NtUpftG6ekmnl2LhA3HAP74qyvzYR4t7Fr9mlFucFF/IuIS7us9aEKTb5V0250BjLgD8J+iOI/4BJYpTceRxR/B6VTmx+E4dCB6sMiHAqcA/hhBuUVTsMjliz2I00Q7agGbiOyI3jeMl8hxFOADOR1AOWJTmuopi79NZf4cjr4A6451v0yBUwB/TJT2GZpfjGmlx1KZ24Zp3Uwjx5vZy+8MwB9/deVRzqN12qtfM+JjL35Pvvz77MpFa0Kz79au1130EOMpMB/HLDI+N3ZKE7Rm8cfQOJV5czgW1R2c/ewECpwC+LgZh1Ha8lSmFORi/pJKi1/lbO0hTEFnexoXkTnxEJhnw9YXn2M+tQijo/ij5nqROW5Y6k/bKbE6vOJeAHzkXAMptX/q0VhocX8S0qLaXM3CFXa08ybzEheuAWTSBf3WoC5blELGH1fXoszZw1QfS+a8s/flymGAj6prGOXTUJlqPi/+Nivz+DD1mcMqsOjLi4MAf9RTFhSVpYrJ4m8Tmfs2df6iDIa3pi26QwB/VFdeGtWiXJTij6jrReaYYShrguSG5R2r7QXAR9NVX+mAVI7oroo/lK5E5YcQBwLyno48p5fcEYCPo2ui9O9Z/spR81XxWyLz1NBF+uOlvAx3+R0B+OPzK02W3n/t56hSTqW/FL/L2t/m7uPt9+0IXz5osWcPgq+9KwBaqly0ioRKmsaov3Vvxudm5mYf1vXjx6QpGVR4DHopOi9aRRqFP2P8frzK3ySevXpnzxJbpMJM3cBbxt/D2QRVojxmjL+9yV9K6zOXXotDYnqpMBM8zODL+kkyQ6pGscwY/7HKSdpTj8iOQ2nsUGGmbuAt4xzO8qkapTNj/G0VT/pTp9eK2h8UMxVm6gbeMvxwxlbVKKQZ42+r3CSf+tsxKCN7z6TCTN3AW8Y9nH1XRejFt9hiQZOTc1eNwKPCKp4Pa9UQC7/nfFj2ChhfXgJ4kmTVoeif7PryiC8+GdrfpdKFIldgdhUhczJ8A11VzgzhU1irMt1+pagou2b79leIxhNqMPr8NTkOAJ7Auqp3ynHVIKyY5HfrK96/vbslbYxEYGq9ahZEgU+gq3KzIXz6d1WlMawUFU/XXN/+ClGRmRJpJyIvDgCOELpqd5Z+5ZWuRPI78RWfT5u9jWIYzq0VbXmncMn9AF3VXw7B0yIssUApkt9LM759M9+bhWcng7qXqN+F9wN0U+s6hM5DseJUBZfUr85lxHbet8dQ9BsVt9+4fqhxE/RSfTuESh+y0rTDl/wufs3j63bit8dm7i7qk/djBFpcBb3UTg/B07+sBon+JL9DX/EB723IF0PRH8LuDtj7UOAT6KiEfQifimfZlfCR1CfKGc/fzPdmoWl/n+d7zuCMdfcDdFQuQATJfbRSxHWV/P6a8baz2RJsZlDBHQo+0xS4Bnop5CBC5aVaOVoTS373zXkpZ317bObX4eiyB67z4B7oqtaGCJ88bMVoQCqp3yGX8d3mfHsMUV9HlKbPk0GGW6CXeh0iVD631SZEx+T36iv2Y38rNtnMXg5BWK4QvPgKOrkxgvFcLU/Tlsnv41d9/9rfsD02s6LBANPUgRx3QS91c0So3IqrTCCNye/iK/zZbu4eW7q93er+bA8pjoJ+Kh6JMHkxV4wouZL6/Drj2eZ8s2Zy9Zgdwj6r7xbope6SCJ6qdPl1wJT8PnvFT7nN+PYUinKk6t59PLz6/oBeql6J4NliV5F04JL6DXMZL8Wkbw+hOFNCBp50LzJ8A71UJBOBc/kunxZQksBp0dXLROVmyTIETy0rRuuQL7YPoJeibyJUzuRVJrfJpP4otozc2yQ9NvN2Yo2BAB02fAS9lOgTYXNcL5+aM1JZqB8/7ttfzU+vlCNM145V/lYDoug+anUK8RUl7b+kPl3NeC1mfX9sZr8CNIhmWzy4B3qpTynC53lfbnVCJb/rXvPr93azhhmN2lC9pNN55X0BXZUEFeEz7K8aOdIl9cedZbzYnG8PIfrqjGSnDggbfoFeqrSKUGkPWJSEDpP69CHjba/q6LCVs3KsGI8ED54A/JHxBs1NwUrU9pbU7xvLeLlP+fYQim+DF6wK4FLgE+ilnrEInieExakqNanfNJZxt/O+P0bimR8JIwyixk3QSxFqETy9C9OLiC5VvIjOeL1P+WbNTbM1BT3HkwIz+oG3vFd8qh3mVx5YUr99IuPrTyZ8sxDNtsr57iXR8vsCeinALkIlOWJtKoZN6g9+zPi7mff9oZlV0ofbubUJ8RL0chsDIjwzFSsR715Sn0NkvN2nfLPmjiJV4NrzbQrM6Afect7wWcJYkXwrk/qtbRnvxaRvDyEaDWK6gMlHiW+gl7ISI1QON9YmaOLk9+0r9nN/J/LYzHmqKfXY2uPFV9DLzaiI4Cx8zCdGqCTwX3QJkVG5H9EMQR1YKrY7HIvtA+jqlmpEfLZD1qhq56T+wmkZ7+/N/PYYop657ckTaGTKW9BV+ZwRPmkli1JKaVKfUWf8KGd9ewzRe5ZGFcd3aHEP9FLhaITKLMoqtA2Y1J8nl3FuM75ZMzdzEHGh1Sy6P6CX+lIjcHJX5tO5VlI4J7YW1ajc0XWGYE6G3nxdyhfbB9BLCa8ROokuswsdLqm/PGXGyzfzvVkY8jkQVEqWd8n9AP2VSxttsxYzJKYMYlHLJb+vZrxut52SUcNzVpBhi+X3A/RyE3/i8fTRrEq/m8fvq1f8/rmzC378cN4UQAgf53vnJEtvXgpuNbrzy2bhRByr/PpxPKWiOI6ze2PhzQQNvGX8OpaknWXp6fP42yofP65PuSnNmKt/ehfeTNDAW8bHsbz6LEsXocffVvn8cXvK9tf53nghygtvJmjgLePzWCqEVqVv0eNvb/L148f9KXsxgAhoui68mchhhl7E49krWpVOSY//eJN/rz/OpxyZme+9/HIW3kzlMMMv4vGEI02sF7Uj8EfWfRDkX633npAfVmjvBDZoxjtn4EpA6pf+J6e7PN2Yp6aQH+Zc/hi+EIkae4GZtkSOD4AoBIhBnLWnZcouPzWFAzHr0vVDNA1FvvJQgixfAFF4EAM4A1PL0qV2agoWYuLS4SNSX2aVIBDkxAHAET3EIM6U1QoFnp+iIomYdXlaE6Hb/dkI7jhPfgCiyCLqO9lZSxGhbmqKMyJx4dyh2DfkEmp3Ew58An1VtCDhM8+1FPXxpqYwJBIXThyihep45yFXMOET6KW0CAmWBrDlKcBA+d36P4D01B/6adappT/IzKzsQ/S4C3qppGA6u5VKr0E1heMx781L9UjYm3RGSSKq3AFE4XnUco7OVqv1DNUUqseSS/9vZWgl5dFlo8klQBS6xwDOv9qq9NKeogL5mLh09HBs1dCw9BvkxAHAEdnHIM6T21IUl5ya4vxIXDh0eN7D6Z46mk6ET6CXCmckVNLilij9B9UUCciMS7duZgB26iQOES9+AKLwQGo57XQrFJyDagoVZM6lgzdzqva3jKZ8efECMIUOMpjzhrdCsVMo9VlKRpYz3/h9BO99n9hRYuPLV9BVSUgSPvV7K1O4gWoKqmXq0vlDlPaePWkQi+Q4AGiCbKnlTP0tVxYwqinglgWXbt/MYdr9NlHfy5NPgCgAl1rOw+CK9VCjmoJxWXR5CWjmfY4YA9JVyHILEAXnUsvZNlyrUFlUU6AuS96KTpX+MOVWMkAxSQ4BosBdqjmLimuU2YlS/0Phz73/Zf0DTUxT001bvbqmS4m3wPwbs7ygfDiuTKkUqikunalLf25mgZ8CD1tsNhwANHHqDOD0RS5JAv2pKWqd1KU/h6OBz4UsGHh0+AZ6qSBPgmeXcnkyElFNIe3MuPTvUETvEnHgvkmOD4AoxJ3qzgvm/Ar9TmkB77y4cOYw9GdPMQd1gdX3B/RSdKGEys3mMgWCo5qi4Zl3eSbdSuW5u0nhKDu+AKLoeGo7z55zK2Y7lcXK8xMXThyCm1zePJtmy+4L6KRgSQmV4tAVKl5GNQXSM+fSjZt5Hr297NpHeXEDEAXWM4RzVLocGQiopjh7EpdOHZa8Y6MrnjNy4QDoO/KeQZw51KVpm0U1ReEzdeneIWrx9mFZ1WXHAcATlU8tp3p1hTLVUU0R+sy59PNm2sVd73tvFi9eAKaIfQZwrl6XpdcS1RS/z8Slc4ej94kOKvZAThwAHAH9VHdOZVcqXifVFNzPvEuPD8WtCo2I0Caq3AFEwf4M4DTZLku1Kqop9J+JS28Px9yy92oBgXPiAOCIBWgYpzN3OdKNUE2RASUu/TpSZSZdxy+ZD79AL4UgS6gk8y5UelaqKWygeZde3sxnyuCXqs4lyBtAFEbQAM4a8LK0J6OaggqaePu5BsEgqkO5mYcTBwBHlEGDOLvDy1NXkmqKOGjGpaeHqI56Z5CTA0U+AKIIhGo5L8fL1duaaopGaMHbL0zYyLba3xib8eQTIIpOqLqzrjy/ohNUWqxCLy58Ogy9jsVg0AavvgOgz+CFBnHmmxesijnVFMjQkt/7kX/qe4hviHUyc14BosCGBnFyo1co4izVFOTQrMvXViP0EVywC+9+NLkBiIIequfsVC9J/zOqKQSi1KV3N7W1HaMkLnMWfAO91OsvwZOHPb+gJ1RahEQvLh03Cg/gTJ/BnavvAOgzZKL6TuD2UvQjopoCKEq8+RZqjb0XHBJzCwdm9ANvK7yk/2r/C+uHXz4kqim+osSFK4fu+p6GJL5WfPgEeqmWYTqe8vBVqgRQ+Z35iq944Md7nQ8nXQKuM+JVZHgNOin7gMq3TAUIKr8nr5JpPGUOe91dkRtkmAkceMvIYwlKX6W6B5W/vcmfk9anjFindRiMJsNM9DBDL+zxvLMvU7mFyn+soml7yrtv1dpAbybDTODAW4YeSyf8MlV5qPxtFZv0Z5xf3RJyBh4ZZgIH3jLsWJbol6m4ROVvq/gkn/EFbWUN8SHDTODAW4YfTP79+mQ7pXiPVZHc/P9R8A9kPR/OlyMjaK2yLDoHdKRr/28B7tok5nGaAk+aSSlMRGpxIBIQinkwY41/fEH1PEQS7L8mdfSbpmh7pjH3bvp3BbKnXuphxAb1oIm1Z5jsfwDkCUPnRIXaMxvz9Ui91HtKmoBJcgIQxdmz9f00KsT/rlLSBAR3/BeA/xD+sW4zLywsUEAqfvJuqjwGvRTtRJ0/OlQZa5pCTUpizh2K0NxxujNd1t8B0GmYSaNkfxigQ4qzpinGpCTmvSHa1+BYbpcuFhwAncaXVDV79AClmg486jOPK154O/nyd8tb3fop1p3Mk8+gl0rEqAFyJ1MnYKcp4KSFmPuHo1xC85t998eTL4Ao2qR62UALSFW44WkKNmkp5vtNPdahM2YXkCN/AFGkSUNkTzQgT75MR326c8X752bm9hyZZbtTyxSDIUdBL6XdUYPkTofQgk1TAEpJzLFD8AQOHzPfniTYIBtEwSfVy46CQJ8Qo05T7ElzMY9u6ma8OHEhVaQ4AYgCT6qXrSCBPKVDnaa4k2Zjzt3UtKDYcXrSIcUHQBR00nDZwhPoU53VaYo5aTbm82GsY4RqaydDlhOAKOCkYbL5KpAlI5nTFG/SNIXjh6LPZmyVJgVmrHEPoud62SIXaFVT6GmKNWkp5vJNXZyEeX/NcElyCBAFmlQv+x4DuWqgPU1xJi3HvL+pLwxNzILGmfIJEAWZVC+bWgOhUqM8TTEmLcUcv6nlp4MGyJhgyBtAFGBS5exRDiQK0e+o/92lnw7vebrN9/bU7N5hEuJw42jxF0DrrKXOF1laADpNkSZNs1HqLTUGooI1TIAKa9yD6HmAbAkQ9Mir4jTFmJSmPAGJBk5X9d1WSIUDoPP4kgbIRg1Bm7S0TlN4SXMpP1ClwRcXE7D3Y8Ya//iC6rl6dtYI5PrfNWmBJb3E3DgM923k0u7znZV3AHQYVFLFbGoSJGpG8DTFlDQf8+amHlpNzgNFTo0jgCigpOrZlybwyljTlEWT9JOY+4aggyNIbzfnJXcA9BVJUsXsBBTUyafuNAWSNBvz4Ka+5+oi3lNEig+AKIqkEbKDU9CigIfTFEFSGvPmkLQnyyjPMl8aHAAdB480TLbTCrqUgHWaYkeapnDsUIzHX4fe/aZQY418ED3XzLZnQZzK+U5T3EizKd9r0tAU3boWvqT4AIiCRhog29UFTUJlOk0RI01jbh2Oug9VPR3nCB8OAIJokQbIboJBplBCT1OwSPPZ6s6fvj8glERGkidfAFGkSANkX8igSaZRpylMpDTbF+nBIFw8TGHlww+Ab3mv+G07gxaRfZym+JDSmEOHaUfX97Skc5YLB0DHsSHVyx6qQaXiT09TaEgLMQdvahg3kp5zNdlxBRDFhTRA9sINmtSVdZqCQprGvDscy9/9FazODB8OAIKAkJJsOqALUkngyXueizl5KFgsWFHsHn6s8Y8vqJ4rZm/pIFVJ3KcpFqSlmN83NcsZHZufJ0kOAaJAkEbKhuFBi565jv9zvi59+9pTXT6FbFHtGrwRHDZ8A9CbdEuHyZ1a2cOfpiCRFlO+ZA/SEThoc4vT5hIgihBpmOzTH+TpffM0BYg0G7sgRKqM9uYKrXLkAyCKDqli9lcQctSndJpCQ5rE/Lqp21DpyslIMeAA6DwspDGz64Vglp7KCTk3v/jj4z7T+1NoR5e0CVOakeESgN72aHrW6FR/5OE9GVxPGrWveolq9oW9TRxVhphwEmDrYqPw+8UIHWL4OE1RTyUx5w1F23UIygbQ1t8B0GnEUzWyZ48AGIHSUUzecxLz4dD1BDDxbpPiwgHQaahTI2U/JSFC1BjHfTK89Pt9Mf1TxDYzrbwe5svvD4CWZVatEqFSHz/q73Wd8bGZudmHtfD5qifxCSo8Br0U2FatEo2CGD9+P17lTxJP3SAindMQiAozdQNvK/xJLbXEtMlG/PjtTf5iUp/6C8nebXBgqDATPMzgy/pJdg0UGkUkfvzHKpK0p06f4VDXW5aoMFM38JYhh3eAFBolJX78bRVL+lPXyQmRJGugwkzdwFuGHd7NU2gUmPjxt1UyyacG5GIvREwqzNQNvOXk8Z1ZBb9c2o7AXbm3bBXGzlHRzNWHFZaORecGTKFjQMj+ueKfknTNaitA/itc0ZKlD6fQ5NNRAUJx6FLjLcC3IeyJLKSJJfH4r29CU6fQ9NkjvXfPbCHBBu3o3SZSr+DxLCnUZwFSvyH7dfoD78z8blH54ohz3iilymPQSwWt1fnJUaPM8V/vfhKnEI10a/fXZ9BL7gjAt4l0zjv8Apc5fkucQohy1bRAz1668I4AfKtqQ34hSjbQx++1/yb++NH3JddUzT1KKCfJ4R4u/ATQmn+rDNirdji/ALiM31KnEKLxSoMXPbpafm8Avk2klV2SNWGB/LbkFJo6a4TDj9k4L84CfJtIbXXjl4XmabKpUwjHijpsavo4BU4BfBvEfjKDWkk+p6klTiE8hlmHgrf1ujsC8G0E+/kMXon9HL+TFn+ru+P2+24hKZGBdwWoZdndAdiCv6t8R4tCmr+SZMV8/FcFoTmnEBoH6gIz25AR9wD++h80jE2xhjxt+x5/m3EKYarz5nsizUjYcAzgWz0blw3RInRB/rbkFJo6SnN1nViQGXcBvo1kN7qhV1dRyN9e97HkFEKWPm4E092pBDoPrMHJAO46OPSL2Ar5j1c4haZ6XY6XvIsjynWAbxMpZqNWTQwgv807haZeeJewEq5Nh5cA36raJXTolZUF8v/7VJqwCd8em9t+wMCBvrG8+Arw/1KV6tn0dchTdPPxX1ODpjbvIW9ovbcbH6m7/I4B/DGAjXmHLmluHv8V3WfiFMKxBq2tkvO15fcI4NsAtkoeEnUNfvxtzimE43DQQaK6XclwDuBbdftaD1pp1Zyo9uIUwpB+e111Ek+vthcA3yZSyRatuoZAfpt3Ck3NC2b7KstZOrwE+DaR+gquWYVxyG+ve1t0mqb1dlSR9Cw81sz0DzM4A7gNAIhMCQIg/1WJZ9YpNLVsOwPlbltEOAjwbSK18xq/iCuN31KnEJJaSkJLvpUr7wzAt2Hsn0HkKS78+NuMUwhT23Wsqmy8YMMxgG8T6duqbyLV7X/8NucUQnNL+pat068YcQ/g20Taqze/wp1Pk02dQjg+e4Na+16hwCmAbyPYRYjIlQQM8rd5pVNHpGvGiw7kIsdRgD8GsBsUkaYH6eNvU6cQDhFPf0bjS4FTAN8m0rv2pZen6Wmy1CmEqY+cjpHXBpffGYBvE+mPVX9IlWkK8tus8iQ5MJWAjGfjxDgJ8McAdsEj0qR+ffxt6hTC8XZhq6S1GgVOAXybSGft0ailAuS3OacQpjQ73+J5xeXEO4Bvde0mSZRoRvv4/fj30rPbXO2p6a9XOh2C6mf5XQPQuhKtYdzJVkUf8l8rcxaVZ85BEp2dFKTBlcMAf0yksDbIlI8I8tusUwiTfo50LYp8vDgI8K26jXcJs2bFTtF1m+jFKYRhK46f29UXq+0FwF+vierZ75jIUgL08V9ReFKbNyM3dLrmgl+lRXcI4I/qdqAmtAotO1HtxSmE4as9JyH1TV1tLwC+VbXxN1Gp5hHkD3tozik0e7Sk2G1+LjDhH8C3+nZqJ3JUcnn813afxCmE4hSfisqUzpI7AvBtIv06y5cc+V0evyVOIXT51Ed3ucO+/I4AfPs8djAoOvUth9TfgTTj12bmZh/WudA+A2sNVHgMeil12FqFRhXIIb8fr/KVxFOvT3V4ZdUAO1SYqRt4W+Er1VQT1aaVOOS3N/kLSX1qQ4a6IIZLhZngYQZf1k+yS0zRqJw45D9W4aQ9dSkaay/kFirM1A28rcBppZWUOB3FIb+tokl/6s0QRxdk6agwUzfwlqGHd28qGlUVh/xtlUjyqWeVP9U5ty8VZuoG3jLi8E5cRYQU+O8/WVcfntfp6/cpPp46YTYhuQONZTNdw0wmY5/w1uqvvZrA6fuhUJmgi798Qkp/RpE/rtH9BbNF9g9Tv/YExgMnGXQIYLk4e3+KyvUtxRI3NPzl47gC1Kyrev6tn7keVDJdfdgjNxBR1JeI8+gTUBT0U8vAdYUL8FJJlRwjjflPGGyZxdaNsx1dilXAPlr2IOYl0jmApeR8bcnowhcukci72+AvRZCK4jSqdURcjSuoJbNayo17Ss11bjjGvAN0FK9i38WXXXFxr4teQ3XJhhGJpSlh3RqXLf4PlYxMatu4GlcyqbPWUv6+0zHbXBHODGYZwP8Zr4RFgVxZDYu+oaWWK21nGtF3BD0cMOrhV/t8X6jy/2ldHzWI782QBqTMm0/ALH5H9aNcV1r49wDx68rRxD9Pyi4ioXqMGQs3RUWiZwBLx9n6eJUxl3rFhlt/7/VBSXfWeKu1uZA3Vkj6f7WU83uWbclsr0PMNkBG7Ur2XXRROxfjQno2Khfl0Ro5NR0sB+iyxf95ORJJyUBXYyUS9mxdfqDc1cje4Xs6MOcAQvqupoMlFl05jT/Ywzdb2QK8FZRRefka058ld4sYXI+pd5rWifU8EZdOllV9arDE3PxOcOOmrTQEdW/wFygo/SUb3aKnrkaERGtZly0yNMn9hHs6xGwDZNSuYt/F14Z1Ma56ciNyUR4ve14zTVV1Xcbmv6tFIqmw62pEIs0p11Lu65D3/e7UPg2YWQD+B7ppugXn1pTagkLoN2xHCe/eewaNpv5HR1qsl7OlXeBsNLseKrR/CXR7YiqHcyiHczAHdHxDB7OtfPXQ4k5JFmuJPn+FUv8Hc8jG9OlisNMn/AeC8vRPis1t/BaIQCG3VNtm0b3nEgdAEZc1lWr89gm2P0XCcRmGb63gSNLCVMFK5KOA/0PuttzXI9fFpOsJhEJ+F0ZXh1ewg3jAB8o9e2qYQHsdS3kW1r2fEOBawoVG116kx8R3fZIS/0ZuuTp2WkMxiQNZ0IeG4fuquvfTF1w7L2G4IEny7bzM/Z2L079dqQFXoWyHUWrn9XGsnRzTdzDpv4H3HRGslJQGPzQUvoWCojp0En6Aj1ejQgT2s6U8hw3RI8i2iZhtDsjq7ep1kATJTDLOmwEl0jKPZyJraiAInLSHC4g2iTyyzKtRiWg0bE+lD/dHTKcxuX88sxzA+6waCKYnjb2EMfYkgTfwkvsCrvmXq/qx+NjxJ0uRUqBma+dQGLvSl3ekARkl95wbTDphLN3RkvADYr3eZ4eP72NpZRDkAS/B00R44f0KX299SE+SIIFKxqnFl8Q2YYZ6pU6DqEqLuHjUk8ijsr0aOxE7Um0pP4+YjWjO7sfPLAfwvrVOY9NKcy9kEWzlsZ4QNowK4A7blRy2oWulPxxvwmEbs1Z6xeEPh28c/zc53oQj/E++r9K5fUn6L/Iz8mK5SuvsJhhKlVm+yTQDsV7SAQVfXHldnAYi79hDQXxxZVtxGoikQze+uHKdOQ1E0vEmX1yZ6pz2IQkhmS+uPINOA5F0ZM8XV3ZLp4FIOhzpiyv3rtM+ZDxD9cWnbQdqCToXIBbsy8nyaYCCWoKSBohp+3KyfFrJoJag1QFi876cLJ+mPKglqIGAGMMvJ8unvRFqCXojIFbyy8nyaRSFWoKiCYj5/HKyfFpuoZagmQL617frZPk0L0MtQZUFxOB+VSk7HKw8nK3VtcdAvLu1aghAuq92/Tuwu/4pvk3CVcAVWRswWg/RR6lMvv3WVcDUBhotR+nv8qiOPG8IxSN49XfHhD7Bq/B5+y8nN5x9jIs/pMFvlSKfP9GnAs3Axa1me6oGc+pe6yPF2+aZPZoi6rwk6zdZ6ToxyQq/hY33kCsT4L4ptHX8WaaKAJ6wz8IPYbtwNpEbCdiLOrShvnIoqpMH/PzLMZdiDNrBXyL9TcAyARnpf7ULCmqRFEXaGrKtQ67zgsZDKhN/9r3M54UCNrdixB51TQEj42pybMtd2YAsF0m5TMbW5My9JhltZu5JCGKLF7YlbmHMhW1aFHtRWxbDvdhDGtOT9oPuPi8WsB7n7viwa4wk1PYYGdh7xshl14cxsiCloHfG7h67Z6xcdgXaG6Aq+u8v74TSGsX+4eFTrr9Z8fGKVeHaAlbagqvaWE36S/i9lN6+U9Phct2VWqNwu86Ke8G9DXjF9b3pxkLSwtjSeocLOpHYW2xprsy1uVHa5g7bbXurA+B6QWFNQDxnq67q/pP8vjpogTs68UpgUciqlxgqlNFYlXjsRbbq+p0p0VhJZKvhGqC28bkJN8tNSpSbZhmY7efQ3NrnFtwqSXRLrMxzHKi8Nvhek/tQI6VEe9GgSJOdadp/baU/6rAsXOjmi5vGY1+6+Wu7EHcrXiN+b5IDcSGzD8PEgVg4msXopmqLkIXjjVOO0TBfWHnGSPyBJDBlNMqJLmSeyxSRNR5TF/dAWujnPksbm3j5kIr6MFufIPF3Swbp6VMJ/b3CQfr6RJF/IOpuSiKOE2clo2Bu2CoGEd7IApeIVDFShyPje536Tuyj3OKo0PuXfp3VvD6Vh9+WcM+Hn7M0v8mOOzXN6x6k3mN1IafolFl+XYbNfv70YJkO3Fy8nZnAnba7Vl7ufvbkp1vOf5Bre2Um5v47HN9Dj+a1OeEwzujR5pmtA1s3uviPZLa3cc2LiR8CnkEu28b2pgex+8+tOU2YLX0J9wrI1WtA+sLFc2qwXki8JaH6YN+BNstz/2HCPLWfbdlX0sd1XLsaQFu2RxMOnnZTA9OiclvDw3YVeuyuVCjOUOequTz2wVJJMqIqWT2aqkdUTdaMptoRVZc1o4l4BbFEIZyIUulGuVFl0oPxxpoe00r3BeKizzunvyJOdWm4RcTFEI4LZ+PThXlgmz49hA+yoLkvVUjqyDKFZV2bVrLuXlm4MDhMNl4gRwTMG7YYlC+KK9U72s5TNytdYLA5RefhzVkgMNwlkoFwIzbBeGPfiTFddrcrXoDh34hw78u59Z7LP1jaXTeMnN296kJ2DlMTL1BLBMwNWwTljWaP0Ti+OLk52018Mydw8PWO/bfbgQbn2esZHjjqeCwW5UEru+Tn/MM089wBwrIvcPbiuY+K9bvzuqd1o2iq1ZIjEv3f4istfJob5vK91BuraXwpvQfNYBQ/9KjpmUY+1pqZo8aV6a9hiiR7dVz5vqKvsAyTD/KV/3ij0xvj5n1gVPt9sJ6+//x09PMqxFzi1/4b+Va9G2tgdqPGGBxr6PKGCzs8DXqHhyYbu4hxk12Y3VVjXRztklz2V6RquUaulev8BM0KkWnsVJoQncbKpFHYaRROGoWbxspL8yAhzaFVJIuyBMg7HYqrGU1c69fJhuySTb8l2Yd3aHgPnwa700fxgEnFQ38kx3Iip/0ZKSvn5Ibc5W/SrbE7s5svI4L8TPSmTvXJHqCiixx5/mX1YASL6J1gWjahBomrn58FmI3y27Vxv0YwSGCaiZwbwXCa0MMRDK8u7uYIhtO0vo5gePmKrVE+qKOd3+sR7N3Yn7+bvbiw29KL/V6JMA7ihjJzPizS1xGsvBIwX9jiJP6DpM7NRqnipNnXN8gUJ/v/cDEEgHf1OViHFSbwT7GEAm+6uJW5/E6NXTkKXWdNi4aKinFHPsUQ7nycV19am1tklhpMORDeiMNBLBZ0aoifaOcCZaTDKpL4i4hDIRYGnzbEA9VuypoGhxC+iMOT7Cee43hY5o42rC8eMvNGG+oFQ4uAeWCLRvmgmdv3AcdPLliYX+Nae8cWWPA/bqSns8Kt/ra7gfLuisxpWi0dFO78483sDNXEroiClLfZIENCvwu0IMwFWxjlQb/mNoeD944H559vlkWgdwffKPUH0tVRTOHOv9wMgeHq0IVfh0zy0SI43rjsMQLzhbPPaIm/IanTs1GqaKlNyxQtuyEutgHfcYHpvu9lmpvR+kl5NW+xeS7rYblOg1mvoXtmYJtd49vatxTkhazlhwl6TizwuqgFh3f+F3wdZyT46mb8DDXhrHtcTOVMokkb7YFYkTbpMMx8/ENr/R5tJhatc6bf1WfBVr0+S/3aZl/Tt6Rffvy65tkscmIb3rHv1j73QbpyH9ETfCYu8LX7xn5b+cYsMPOillxw0kJFN/PC/U1apOhmXHR/qy9mrL6/O0pnLKRDq+AiUYLL7oq72l2j1dY+lIBZBAlTbtrNuNkSx85tenPPtXUuuHgF1Fmg7haPcDoLV0DYecsE88DKThfKB1Vumhg/WeeG4Vn87LpwfiKfQz+3Jr7md8499D2NJlHyXO7sLb3s94RSj6fkKcHtbaszJ7JC4zE1i3l22We17jI5+00TyjNab4ourqW8dtP64tljJcTxBJK/WGP9up5NVQ4LtYj3g5J2PWz4ffZcItZ4UFci31xoW+08LHw/qKfdDjp+sN5OGRDHIcRufsQOcfN2s10Hnz9eTCR3jP87Pa445bre/e3lHXVnI/e+4hx/+pMXstx2UTNkAqtoAZ+HJ6qkgc+MbUbwjfHVW58+FLWByXuYdic21+7T6dPIUTZ+kZ8a2pGWy2PohNPe/P1/TWbwuPzdgu6uKu9xIhaNpx1J7edmEwvMuauuPHRFNzbEiFMZTccIvsgPljn7ArF4qs4J5Tmfj7HkRtvFPgAYbbdeY5eyEC5krcMToPDauzEsj0fb7c0A5lcO3cqFGYL4iYZykPNf4bQ0CHPBWhtCeJDFzHip4qRuTqa4ZK/9ANsA+ZCH0vBY/gEPfCpkXXm7aXDgwzMPFnYS5CgQD0QaKP0e+PAqD1tFmJ94KAWJv0oSWjQs9ZekoWWjZf4KtnjDDzn01beBgedVnjFro09qxvmJTQWaqR7YTbU9BRerUyDZhpKx/E51PB2MB9M3VuKjMXZeTBjwmNDzeF5KFPA0To0uAThOHNEpYW6Y5FQIb4QMuAgN263y9GVe43p8962okrmsDP55fOrDWFFBsFsD5TKwpY0uHFkwb9jFoHxRFyfzB7KuU6ZT8uu88NmKrllmN6Nc7EflojUwbp2EyRmQbog3tGZKZgyOL67O1U3sb4iH3SXxNyW7tAjlRutk7sj83bKvtRsOJlu+xn7UrkKBfVsGwk6CO4rIPwURHmMz8T1w1Mm4imL/BHbSCB8kcoc+FspP2slibsn8W7LG18ZRHujtRhCBb1/2NhLTgnhD7gbHF2d3Kc7tHBm2OEI5UTulhXFj78joVH6dd21iI1+z5Ivr7qag4xlU/+xR5eLSs8XBk2ash3lA5f3Cek+UJy/Sn2bsQ7bncCEn8OA5XMgJPHgOF3ICD75D5gZe+a4yN/Dqr/NKBr7yaFfeBx5Gu8qBVy2rV4D4QC4Wx0+uC6J+Yj9LPAxS4qckjXCeSxWUOqFMQVnXXOts+dKb+mOovnamvbvyC73NbfrZUvNNUp8oXj/38Xh1SNP9Qr+X1g/faW/eciYv8dihJfrmH8eC0XMVYjy1zGDmZMebuXsombfGzdbqs7uReq9wCxnHtlXWL93hdEtuOSOXJcuKX3eGjW+b2gF3DXvSwXAFH7P4U2c585fOcO27oW65u+kBnhjU867BbZC3IzBzBLkdQTM9mNmCXSi4BVMwVElFQwkuZ8UqVRKtTonVVEmsNsVXBxApICtGpjyIeh9reCsiz+4sHJ7bGXg+gVKBokGSZIMCq7N4TWfR8rrOYPhclAlaBltyDG7Yk8V7O4uPDzpDyhdSERgbEiltyMDZeRHlQJxB8HTEZoiSPfDE/Zpt+2dnFWfvtdqcZp8K6d/wO+d2UGz2Jhqu/W/hpktaICMNZKRB3HRJB8dIw3EzJS2YkQnjRunf6RM6g+bo35NU/+QN0b+OwkoGKsgyYEKfuQhdLYtl/j/ChefI1ssxyoKSl9SLdT66aBcl+5GjW1DxR4YeiqL5lTrPjGeBY1c9W/zQHsZ8/kzBvQyNbRdVIPe1fww9yxJDzIPm7SJ9leWxBcLuse6c3Gc0lG2kPprkOdRGe+Nhsh/684zZdpXvDvgPCMvPv56S5vTuTi1bZwrVXjG7lxLSShhQJBysuMgOLF6vkEQcN84uacG8YbtJG+GLLHCJSBUldVgyRcn+akpma/TWlpej97TyP7f06Ypwf3TGvSNj301HdvyiT0/9+69/dj0rL3vAxqaWh8xPaTOa8GiteUFrRcD8xAMQUj8LJU4Pjgdn0Rgf7DuwNoL07qUWtrfFqwvBaVG/xCa3/HL7v4bZGYQLcWnEIlBfAPGG6o+sqnlpeAWJPLo0kNTy/bC9MeDktASau1teV4hu7b4gPIjLRizmiNKG+EL1T1ZkVroNRNIyRZchyDzrclc+j9mYGl89dD3smZyq1Yl9vczMSRrS1GLfzjCbopZME4i0/fyJPVXqxL4JY/ZK+kQyeOI1TbJvp5hD0Si5CLNj6hwKelBaOw24e3bBTqwju5BsyRJXspYNbsuO7OKeHORKjniSs1zwWm7wFu5uEg0AgGYAhWYAZHRQbABg6EEuDh0bAAz0ILcOFxuAAnqDWpWNUf/GCHNw1KNc3HpiKWYHkSvS9LqBpETYSHRFyRUHHVFEK0Ns4iiXeCSoikSSSFaF1KRRLenUIBeZapFNjrrJQ171UUApDSmimBJNU4aymqOGdlGTWtqmDnVrD/VSnw5oioY6ojFNaFpnaJbzLDb3tNa9VtosYOfdnMy45chH9j6T2ZHh1GwzsEJDsEYrZ6qhvHHseGqjKdhZsUvZrSjMH/mOHCjJV5R8bhFQJY5KN/JcoyVfaGVf23fW/wHc4Du6JPj3KcF7rWZ/7VG8W6YAKUE6Fwohplal9z61WJ9/XKSB6rTcpVZFHVdT8EPjzlnU2JXIU3X3Wp1+KIrGDBghML9whKMmF6jXW9UG4rFMFVGN7s2XatVyVRYaGhwfXLQONcwPHOOi/FFvjwgNLZmF/RlaFdemmQE4zbFS8PyeI82w6d8O8WL6OPUHXH9krPgdrzubAi9MscGq+GTvAhTh7cuZOngH+VME79Q4LGTPFrHbEmyKJ0c3ocRJIbwQeSPt2fsC2g3xDdlGSmbq5L6DIdkrbhBlMjdgFfunt7SqZob32eqHOvd7+97rTMX89Ba+EzNrqqUc9JMtHabNipGeSIvwR0nXYONQtOJWCfQLc1j7FqSCKiywIBU0pWJp7QXxgeJoHD+4OBbhj6LaaAc1uQsVc1PAFwDjheXvpoKPmapfduW2OB3/zFTjBxa8FfoF4IIm/rsf30c/0A3yJPH3p0jy5VcS0R0//9/UeNkjE3raPuOfrX7awr7FLukVsqY39m37jn932NkP7FXoWLjmU97QuXCNl7zHf81Xf363tNmKl3ZRAgsTtQTBhQnNSfgF1U/9/qOh+Ylte3QBqaKL9pK9bK9o1fYauFa3ZPNUKgtabQiJDSDRsSY4KssUX06G+1n+ci/VU2j+VtpMJXFJKstKmAdSWeD2hpDYAArdO78WUOX9FnQTu4i4bQ65OOlhB9PA4TfRxAd/9OC6T3pZAWrWHBoVRx2vALkjf2I0CfKJ6kt/3rN0OxRGyejOwHh2YeGxkFjKFMKJ/zqBHZ2h4svHqcrqVGG+W5NFHBJ2qcJ6nKZT1DEmnjV5Jy1RDqKTGBExXMQlMGZHtmi/u7mf6whBqQOpQPhU0Vt+n9+abj4/jngdoRJHmsgEsoFcoEF0ac1AK9AOdPBuRw/V6+gjBoGpwDAwIsba5CjTQ8mU7I4fxRaZ/q3M2DLTu8qU1pnSJlPazvTuZD5g9xUVXOAQuDrxIzlO1NlxIa4DN4Fb/W4BAaOEGi9wvKCrCKadDs0g9ELCzCDsAsKNV2G8qiaoSJS08lEqVNIls+NLLvz9657eUWTS6TpWZjnuEW+fm2vtaQpvsyadNsweKj77CnBXIxLqvXBEtd2JfBRpcTqBOzvdnKtL6RaRIfQgQe0ppGQXNBnLGSJdsoXL0VUnJztwjI3wg+S4hPJHLTGYm7TkFO16QgPx+2Yog++EMk+ysZIwFkZZXanTC7WEpLvEJuFSE/WYqk52bqIeEyGpKc9eQFTnpjyHaM5DwVxEE79InUZPhRW8l+jnyhvRuIhBUrxbas3QPthglwizQ2LNOUR1dsqclNCRkhek29nC8cQxCi3MG2YSOoRvZKS5SpVYaqSlSRztWq8aiEbm6oi/WcBqdMK5KxaeM+Mgl7d/E7Tv23//t3DMwY9bJwvaKNULi2HrO7UxMjRStisiz2HVWUP6LBfNVulEMVBHA/1k1ypbSMF1NNinXEQIb0Q2oUL5RnOZimL8YvlfK+LIP3Lh6QKD1SxfDezSVdUuxUNW+stQtTxLRQrMNzwWMyu8ktUvLV4UK82C1aw5s3TpOqujIWZVWUOjIeZUqVLoipKTGTiWRvhBxrMIqBKkkkaea7RkFa1s0XoO99g1LO0yD+SZvArejJDcznK4zdycL90Fx8vMcCbX2Xt3w5ndmINWZjif26zjTmb4d3dmD3JwrBrR/miZDb7awmUFoS+Qidvjc/Awo3KCOuNw1fmzqC0uZIgPFEvj+MHJLuk8qfpKCcpGKZqiUkKiJkdoLMb4YONvaiJZiTNuPGYvOA8cN5xka+KPVmIjviDj5Qq9g5umThLwRZxSCwSGQMPknU4aXrsHaBGv8I1cSZ8ldjbXlOXb4LE12wzmrWP8njxcFt6bfOhZjZ4lqpVkMVYrvgUfGeZbpxZu36MXmL9mLtvChqzW7GwzoNVqplBxppsR0LNEtZIsxmrFN+QjFwpUlEp1omZ2tgj1TEjUkm0tmMmnljrROsnZCtWKb85Hzp/abn0W2NnIJj1fDLSWyuQTTU8T1Uay+A7htqTillJHhUKsnxW+bna2YqOz3ugFVgsYPflUiBrGliw21Yo3AMhnhpskUl2siAYmsLPVoC7kUlroMGnyKRMNTJEs1tWKb+JHbiuaLUEWbbhjcmHRBok8FHa20uP14dZiTf5iPr/CHMlJsBW9XDFPs211YECltJCK2DjrJl312vuR7yuP6+LNrjeGHOwq/xBy0VJva+shD7uazsdrad/qMHsqCMKbsNg1Op/odXl1FV7T3m68lqU9eG3sjdfBPnjd2BevB/vh8zLdwOvDXngDMokpswhvyiyyI8etu2IfuRre9IPP9Xv2g797VSMhp2u3WFAmV3JMc9/DsJKxrZu9iAMSRq7FAxa23IoPIhqlxuldUOHKUSyY8OQsDnl249aIByGsYYynihgOzBQ6Np0YcLkg0SAMaxANnaaickh8LoltWTfkwuFKltoS3PRmDDZVtIXKe2OCgDHCMRPMMcqEYQ3iQA8qsmOHGsSFHlSUYl0N/Mg1iAc9KKlni2KruW3Uoxj+VlZ7wm77higNX0dulYuhU8lt10Ms5euWUY8HYYom74QV9ox6PMSnnix2hU+9ZHEwpbEnHAsTXPV4GrNFrK5THtdNXbshCouhvy/vlEUYki2oNKkBx6WzGGaPlPKSG6MeENNxuCY/28nNLeHp4C1B2KoAzSEEUrVGdsGGqxZ7G18uO3onIbSWFr+9gfO8dV9g+aq5AM0VBVK1VnbBRqoWvbc4X7LbdBJGa2nz25ty3rfuCyxhtRSgOVIgVetkF2x01eJ33BrLTkEA6/DbG4pdnI4Atl2A5hS8qaUaCAF+sQnzIzCWm4IGrHu0Nsq2iNPRgO0UoDkHb2qpRoUA/+DC/GjI9b7YKRjAevitjbNtxekYwHYLMHLBm1qqwRDgF7swPwZyvftzChawXn5rE7nd9zodC9heAZrr4E1tqyHZpbpQtb59n8yG4ShQrCDXBcrsD3Z9F7GpECR61hf6j+mysoZ2kZjvG2X2qIt/c26tfyVV2jg+3Mxcu2pmXLTKcUqdngc3lIUYWtTvPNcqs5HssMi5W/ft56hE9GpeVmb/o/yeVmZrG3HfyEVp5+poPon3jYV78dE942uGVPqdQ2+mcSL5vjn0edb7ymww58w3ox0l7s4eWxj9K1NLSvyXU0ElVVRTR3NKfKiGRUoReezJfpfq3d6NZbY5fZbrofeG5uX/WkXmrZSpif2sOmgWx1jXM/Xt/Z1aZte/Hf+rYSe7jJbd7GP02WOc7GVf9mN/TnBy+JH8Y+/UMVWXK+glpl0M4dtDesU/nHjY+AqN+lY76FgqFc6M0IbeSGZSL3ayuM3go5FlBv6YMoPSXtltX4MhHXZzEY24Rgmp6TMh3d4WAHf0aVrKw/Sa2kwsxX2koxujGx1bDJY+mD6lQIe/RhocpWjivAx3PpQittJo3yMc3Xyj5DbGeCnFOYuj6/cC5TvjS0uVal+jG/mp8tz6uolSCsLQKEW1YqgUg2oEyYVFUByNXgjL5JQUMWWtfFI+kTmFhMDS/V1fugGJdRt9WLQLlCuMPp9ipW91q9lIfNvsjoTQi316HnebnZR/bAThlUvhk6Mw5YpfJot+0fGx4o088RBnPSXrvFsLZECnP13UF1hyylRfaMqsvrAp83rCn901uonLGqizBzbJdtg340axIcx1ugkXxjzwrziSzz5ISLCGzxDIuKaNwTzwrzOLz+4B7O92CCQG08ZgHvhXIcxnn1Sw1iQRyF+ljcE88K8/k8+eE1jjaQmkWdLGYB74Vx/IZ08QrNUnBLIBaWMwD/xrUuZ/P+gP7CdYBJLWaGMwDwYOB8K3oBgXcHNhkUIJpFjRxmAe/PGYdEWzEFrA/ciBRrT1EmEje/HH49/X/CE4KY+D++bfGlDvzW+a97A8W6kRwq0a74/6x38Gnmck7823DmxQaKsMxgny5g+razbnZpN5uxCvcco2Y3ECrSkQbbrSezTP5MZqhtyrgRBkGG/+nIYe3T+P54HGb5zPYpM2B/YUrfXEumKrDoSv4aqUHOH3AEAoJvQ2Jeb/nUHd2ncxB1ZTIQrW3WBrXZOSA/JItWCrFwNW06gUB3EKi6bQBhe7cHbFw2dQXwXhptAxCEV+6XxuL0zDCpZlNJLmN//GMu1A3n0WIb847Cvqu9PcFLQVoUQX3ZsdZjQs6lnqxYOo2NMrnUBKiG7nWC4cgcnwDMdxAueS4KHm8ZtQKEJc5Ycl2oJzIiof2kBzF9FQDA4alV15bA7mjJ7gxxw2LgiWXcGtT1/dxWbQ1IeddCe/iZZFIAAsPDNanAL4lyfbZUcEMoJlVhDU1ZfvrymE6fqC/jLfeCZPgGtP3nb95g8rmfFEuRyWsQiWUCE3LyhvZJsCZh6U4p9P/H2sx2Z6Ee1pWmpgaUFSRbVwey8GeKZx/Z+/NYMrU+x4IPlW9FEg1AtLuAunMKYHbVu7twu1hQNhp28CZlN4r/Ml0GW+YKWRR3ke0nCLXc5TP57kkNW68fuMOQ2YStEAqfUJhK6Ezr1jeBEaF0hLXGj+mTcHhjhfRormQZ14sm8tVs35rOYPwx7Bn49HYMt9x51gWRX2z/StsWsO2mfQxhC88NkXiV1FeaWim4KmIpTll7ecHgWYvcBcdnEKFXuulGocUTIKllWhxkxfj73mQGHmigLUYYmqYFkVLDj1nflrDvWb0O4Ne7vQUuNcgcXip2NTsAHzhblsvhlMkQf4rb522E3h99YXRZl5Rol5iPchjbfW1yMP193BFw7ubmHw5AY03FovS4mBMxHnNz6HotBMF4yZC06BlQ7acKQX0akICB3LW6zcFEKOnXkH2RdKC1ZTwTbN3WBrvXD9td9Lvud14/Tr07RdwUUp6NwQYrl51iv2C7jw+MNbePzALTz+zxYev18Lj7+rRaefp+W4h4UacKnVyFtyQ3El1ciMb3fCXVYH//mMflMW6tMEqBIPa7T1GPh9TtH753/vkA5k+pz1xI1tt1lejuPSxfGdcuhrDSHa72KRzpVekO7vbKm73dPnh0md0+3PnkBEZe1D3Mv7P46mRyliM+QncCt68wx7jqA+QMd80/LSDwzWmcJWAygE0DjOv3b7iw+kaLmWOubX2Kt6+Zlru+yV1f0w5wP/qgmvZbqNi0AIbq/GRc/VavYSrBjqco/XpZEtidIqhqs2x1p0qlAIPT/AzccccfYFiypm+dS3xjluZbw6hW/iFmwmheO6dag9F/p90QkknKoG1DjcAn+AKjdMDimTMDnXrTCCJ3oTtFJJAtKCWycAukOlokjcFY49RU3pNCAe1dQGLQmNuRA3rFS0Nn8ypYM4QBgjaHqxlISIlpTqC3mgzNBy7PaSOGwZMm7wZ9po2/VwK/MhlO1ev9a+gPuuaHj1UWE8N7y4ywVnwDzB9MrZwjbLwL3FSMI4/L+A8TPZppP1+wVFP3S/wVd4dEpTtHTwlh+s/7lyjTAUxuk45LWiPyvRj75oM4nLySqwQ5ELfewWNRh72UlOtiih2jIsYbXUYTtKVXNFEivUjt0OOVqpNVoRmDwhU+RNLak8OFdEDsN0eW26oUYkW5VWoHEtj0gm1JSP1jjbt0NZwAJQ8rkrBF51PDicv4v3MkdG98VB0T2bGHnneMM57hjGyqGuDjmUrRf9VIilyynDauKRbDFZ4kRqo55k+2zMlbvLiqDhC4k/Qsx8LGOfv5KMV+saFLVlpL129017zWEWtWVrCuOqTqaWaO8MWs+Y+jct29r0ZVnbwnlgW3KSZqbYrxzA0zRWoRbAOEEqUklRS7VW1FZHa5X7XIGSDK6XHPKnj/XEZ6/Qoh/K7+BbPEtEwQ15gT8UV0RJTq5HJ6cgCvZI8wPpeHE6Vg93es9ZmAI7wnPezNFcI9gQj+joE4pco7SLYswP/81o5YJeuDue2yjrlL/TFfqIW7Iui9Mhx9XVr/gSZHIeVPgHFt2e0EzlPDSj01/L9TOyfEOwcFHGT6XIWOByLvpBFg++xQsETEVeNEWxEiYnSq5PAuXtKEtsMm0LY/jP/o9zjynFA226Neav1xy3r5GzWtGgAwaRmepvqDKOo5CailzhDvQYZD4wSZAt677bbIG1yhL3pWPW6F7ahhKk7AEysPoNVb7Aot2kBJ4BBa1pNJlz/eMkLb29dObMDKI242jeg8R4WjcuyyBW8nMfXjOX6QldIxafSJju3KuYwctT2WOCCHdJ8prxyxOV5ml8Dm6c7M/Ors5mZ4u23dnp7O7qaW/H5ySsEHyKOxEr2OfRp7tmPOs+2kXnVueyc3UMazHnKF1Ugby77dH7pleMTfc2SRzF9brSrmNPvPaQi1jl0B9KK3qvKHOsmvJIu5fRu7NoY3NdKCQWbWyuB4XEoo0d7x2gkFi0sbkWFBKLNjZXQiGxaGNzFdTLKwQ7U5LEhHWJU+/gCD1wUkV81aFAWC2E+rRTDR2iqp57zrzDa7jYRccUDsTn++hNBD8Yw7C0Oq1DWBGl8ucFKZ8xPjg5UAFUZENnlu6u8e70CbDlB2GXoh1PoPONKiFHGv8kcULRh599JKcMrCwCxT4QU/HV7N80FWLj0cVCpVjV1OGkCfAwlY6mYF5il5EfHJS0ZbQ8Eb+drlciAi7SAL/V9NW19T2utBHpZnlqrHseqN9YWRFcuZDtxxcj28I6T6bbEI5pYPxDaimg+8HnudxV0tVATEczj2JcWF62S/ldhn/s9wYSS32ue8QhsIbqV5iD8yCutdTojbvZpjKXo9BQ944ibHby6J7pv0essuXnGzBlHUc4WbBnGcIsWRBqHW04WZBsGeksWfBuHZM4qbHLu7+GgDCeJOnIF3/DyDjtS97j2Dz1XoxN2r0oFcfGqS/HxIgSxWfjCcfjeMT7HLg5h5Bqcp0zjKmmQk9JJdIPqWTZ9P3mmwM3ZG8xHKdCHxKaIuGKyQnjgqkila9TTbHgX/FIPJ7DxRQAbqQ0iLf+1ozJPObodPQVBH+XB98GqFKBh4TXtHO6ff5fxlFpcQCIHY1sMLk9UH881vve5b8lJYZK2ywlyQEiL0gzdAs5eBXL4UMULA9FIJgeAJX1Vo6POlRyytsfUKP1drF1+uIoIgis0XrAY4aHW3F0jT57tHOpBiNO+qxjT5npCqH1FgsVXg+d/mMeLR019Y0tKcl+QmpOQnn2hugS4EHQEL0HfhBkRB8BIQQd0VU594boFkBCEKedA0sIOtACzpf54f80cU4rt90BOiAkGwXE8WyxOXwOIZf8C5d185xoDhd9hL477w1JgVD7ytEvw+4R8q/Ve80tYMLnB8LDpTM7jYxStYPt3tOlOGWIP0Lp2dQz2h8BGqeUy3f9UtUXwV6QQALEJ9ksGEqQYOq9qIIEnqfSzQ84hASXpReSkMDzVANfEcSQ4NK8GZ4hgZKdWh97OCA+VJ6qFYTqqT+FHDcAUSQIR2/mGH6p5/eYZmj1D6ZFYnuQQNlXWQaow13BL5wXN9c9brxGJW0PZTvIeEpvJ3MN4YyMWIY6uzSwiz1qeMq7kq69Za8THLznREwboApALaGgTsOGG+6XvX2dkEZCVBGuLQLwIx+iZcR2QOrWejVTLyg/9VNaWG0L+LEP01JgW8KJnw1jBFgUVZ7S50zmGlBhUXSpg7tBusUdLiVwRRCdLmkuBKPNXeFbYGne2FFHhE4T6wQXq7hCRaeZfQYK8JOPt0AJygrlrzXjvET5WyVMU3QqRZ2ijKMMbYrCXqVIOzW8xOt6EPAKlyPMNcA1yrheoRfYKsWQi+sjrzDOIJZMiPhvI17fxuvNw/cwLmfYaS7eQITaaZo3MBchP6Ffo5nOyLhFxu3u8Y9jQm38cI2+kEja2A0Fe6mRRhCebuQN6HBkDAdMsJRbSR1vVlMuyZL9yAuAuaASZNRgo4UYzr1g4fnG5QuvMfEZ878LCttkA874ph4mS04Z18M8ZVIPy5RpvaXfMM2+Nv70sl30652LUNqLCpLXNULmhf9ar/oSXOlkg1y0soI6RRZ1m4Ghjx/p2Hqgf3hw/z0fgh0MGLCtoLRpg44zDmUhdEb74/dReuUA1HBmIcMV3soHX5ZTRa6L109rBZ7IlXWNk3jBIAa/LtViM8dLvLTmc8LTOanUyVqNIrLqEopKDhIh21vwLre4jWOcbaAyIq4dlFYVYO3ghGf+IiNoI/d/xnUcE0LtLfCR/uOy/PK9aH79MQicPukKV5/uitwdqS4eRHjAJ9IJHwsdtcELacH7xfZ/MlbPJ7aVoA4jzhfETAjpAUIugR3VSC/Y19ivMlOGMaYpirqpfRIoA/maHJDXIgIWo3AhInZBL5YeIuRiGFKN9IL94v3q+O2Q7lJh2CeDMpKv6WF5rSJgWSqXAkcZxALpAUIuiyXVSC/Yh+OvcurOx1HXzD4JlIF8TQ7IaxHhit8FKsUghAaxQHqAkAtkSjXSC/Y3+quEcPaJcrxonwTKQL4mB+S1ijCxqywYo0EMSA8QcqlsWzTSy/Myvq/SZh3vgvQt+yQQA/maHJDXKsKkr+r4ZAYxID1AyEUzphrpBftx/lWC8uBdeTtsnwTKQL4mB+S1ijCJKyJOsUEPSw8RcsGsqUZ6wT7Hf3UwYTuwzTD2yaCM5Gt6WF7rB6Hp698HnnXCIXeJ5QAuf2nCWvK7bfGW+bbzTIN+0SWLiYiJiAnIxYLs5Wax/v4vl4h3liJE46JcjccfVfgW5WUMkXjJI+fT/99VF26fvy86/0UiOe4+N/LaCA0Kx4RfaD662RoA62aYGwBg3QpzEdjAeHopul1DCeUxMrVBPDfRFKzfEHXZ5rlS+hkK/G9OgFV6MbZLZEHaKIFzFIP5m36w7NYPWB0FtIRorwJ0nhR5SIBDMJ8BRn6Yl94d45AxGNvrH2v3pnhH1rTzsMF6twa6CP+jDSSHm/WmrvTE+diZdvJ8nFoJ1CZrJ1HbthOpoZlMbdNMqAYj1VH9VeaHP5dP/HY1flyDH+1Pglj0i15Phlj2ll7Pilj2IdexX8tH+wyorbmY+J8vQd+tzvvPK/sp3aanT1L7YJrQTc/6WMDuh8rHQXnYPBHd/94J95I93q9ieyCn/gg76K7b9zjKy0fKwwId1FcM2gMSHfJQxNImZfVXG67v783zPSgqpSErnkkTeD0iNvfs9hvdshql84CeD1uB7DHM7UFPsU1BdQ8ZKcQ911fPr7xDcVi1CHNQpaOmMVNJruM7pnwATSrnjvEPU0FPWYTPg55ZLVGC6EuIyhXUU+lyXOfomtUtLBrI2HA5ZNGBnVBPm5b1KgKWH5jG3D/oxRJliL/cwVxHPXOaQvN29UaZTDMYk8ZLIQZ3RP1guS8iYO2ZSAwIhFwgUYr4K91E1dQTKP/8tMGaJ4ViXeyUAXPIoMM7o34wBUrnxS4+THVZI9HcEHIShUQBkVeCjeulZ03srDZWaXIxoGIjxlhZJMzhHE/OkJDjIgLWg4VGYkLoxRIliL0CLUxBPVWyv735Vy++zi2SYmi4FLLlwE6op03Leum8ctCkM3r6+8EOiXcPtViymg/97x5rE38x4E+YhPzkE54UdX6MHw22/4HDwLOmeW2lUru97FACGTIsr+Nc+T3I9zrissvgbWkdY2hQWoSYMZtC4CKirpsMV0o/U4kdlcMu4GhO5t4UNVTmCHMwp9PPRFp2q+iOcaySIgkakZALJAqIvCaLXC89O2IHRbLKA6oizZ47Y2WRHodzPPkAOS4iYI29aJhjhF4sUUDUFf3iSunpEf9Gyl8lgO/dsTVDQ2WRHQdzOv3esltGjwqapCvuUkJPlF1jQSXyUO36burrqZb3qCJ7cu14a6KBmz+L9BuVK+uJuqdi1fJmjLeiBXL9Z/sJ06c7FWRxpxIWAtl7Kz8egw84lWOAaeO6iwmKxExt+aq8D/jtf7Ehp8n4NiDd8RSNZ5bZ3VCey+kteQ1baQSxhJhfm+KVJaKumytXSj+Di929wWYobKSjIP0aKoHUObzT9X+V99+V4D27COvlSaPfJfRiiSLir9En107PkbM687CJqnDxZavpGC2PGN8B+/Ol5buK7pAi9QKGOJUJvUCigNDrFMz10jPlE2Xm3SaeT91LPNNqrAxidMfrz5CQ4yIC1tCXxClRyAUSBeSgar9cQT1VHvSZh02E0uFbCnXWcKnE+E7YnzYt61X0KFCs6z6JR6KQCyQKSEMd+bmOeuY0hebtJuRlyIGbCWG8XGJ8R+w/QO6LCKQxTDA8iEIukCggLc1nwrTW82ljFymxiWl3MGKE00bNIKsG56D9edb0qZ33qwKZ2Ie2EIGK+b9xpr5x6/ty+4V34UQA+WgYFK6snm5Bp3m/G7ckV5QVKA2bRdId3zvla1CjfMAfGfqPVg89CEpOdbVw8r6tHcUx2ITuASePcXjD7X+xr62sdKi0rALy0ap7tOhrN946YCRgxkIskCggE40KxtXUz9me02jebcaCiscvE92ACSTX4Z1RPyNrClTRm8+Rpr3ByAALuUCigJAbBgc0OrHbAc51hXsbYJSLlxfPSKkkytN3OD0nWl5rpzQ1H67mV+IxKxZ6ZnREy1jE3opLDgXldPlUp3nYFPo9R3GdAkyYTN4c3x370yhkvZTe2Zi0mhqGHlvIBRIFhN/ealQ7OXvS/mZnA4s+8xKMjZZH4hzfAfvvLd+lU5y5D1lLifHQbAs5azqCwi0S0tJiDq3VnMr7IpjNOrSfl+2dNG8K+TU6V+3Pu6ZPFZXBgV5wj/JmF6MaxviKxkpfyEkZUnYh/iYIBZUHYeRNjio5eaQ1mzaZm/HdVL4HZUrpdgPSDqkkDARDT7uQtAPht2SqQ185555XbN5tcrmCw8fTyKyZ3I7vovo9aFJKwDZlZDGEGHqitTQ9j1xpf9SK9xErAz1wClQ7MUAARjeOIGZKInGO73L9OdIyXUUvk4Itt+eIPcGQU6U7AgYjIW3A59Vdz6v8M+oTewOKuvzQ7zF4Ckk3Ruftz8pcq9KpKNGHqBv+OcoWbzmdGzArR1glhpy3+QkAUtHkoj6t9YzNDb03BM6eYRS0SuEuOqftz9Rcn/p5tixrLmFHDFCGnJPhBLyIv+2FvVrrxdQzbOIVJWYsW0lDZxOxOW1/gD6lBDJTdRTKMvCxuWyr5tjmDD1R8/Tbcb5FdzhwGgY+5TjgWp/sDcjH+5zZyJrBhHNrssPM+aTp8V1WD65PFT07l7Q3JgRIZegFEgWkopUyqaZ6tuXdas6D3RvztT39XCNmkWPHd0g9r5oOVVRsKmyjahJ5oCEXSBQQe9NWM9X05El6NKctVD6wyby7Bsshb47vfP2J0jJdRiXmxXbJ98Z4aeips1PUmUYyWjzfr7uebfmnMjP27M7l9l3hM30WSThCN+7P0kSrirqh4P7XfACibTb0AokCctDkslxBPfE+1cf2m6ipc5A3c47hEsmx4zthfyKFrJfPC3jzpYPgDwvb0EqnQLWNnCx0BP+ZoKfftr6RbTdV0fFeRMx1gxTScqgu3Z+6HepVEZlP0hP+siGncXcQzkZOmlHdq76eulHDA3YnLAFoOtnQ6Ckk7TAduD9dc8Wq6C0gcTlgkMD1DblAooAkLD8MpqOedWmnWbaJRb4IO4GzxssgyY7tiHomtdxX0UwuLs0GEuy/IWdPSBSQg0XgwBXUU+dBn3mziTN0cisvRMNlEDE5oX9v7lVLr20z0Tv699E5Yom6cGhHxQbYBM2wyQYBV1AP3sn+favaIWdmb7qNl0vqjMkRDX4XKyWQpZvkDUnoUPMpnBIg9MWlxPXS0yjGt8HuNdY5lindsWAGSXV8b+zPpZbj+nmJGrbQUFwRSB1qDvVHQnWE1471/bnWrb+eeHlHR7dbZZixrKMRds8g80bpw/0ZmmlWSqXnuP95OICB9Rxyhm4K4+eIfHkucL30ZIvd19QmZr1tzugFGyuDtDq84/WnS8txGb1DGS6mKlcIfIeeL/3B+B2ZWe5VvrNBT7bNn4su2RPEhl4M3uMCWWThwN3ZSFvkqFX0UNlJXI4YIw89WfcPdfJIypL38p8nJ0vmpvZht4VhyMTXwobJxRUyR9qhu3V/BvdrW0ukfsaf9QMOuWMUPPSUz0/IfYFYaMRkjuXJOPjEQ7G8/2zQE/uCpjN2naIXzShK2bwhgawfuGf3J3pUsJa4/RmB3Q55QpI95KzOTsLt987vXb6PTOOm9ykSOPm+a9HU3IGg5rB3Cnk7Tt/tT9SmUS1RdNMi+ZEyMe8MvMCRT79P8IquVHdf8vX4wjtpr1WU4zKrg9xplUdeHd8Tq6yyiY7F0uPlLbokjGQbEaWeLQj5vOqLO7hYz9C2SAAliTXtMYaeAEE/JOoa2q2RApNChBaMfB4Kxh1cbGd4W7TbJMgxkloZegIE/ZCoa2i3Rcp/CxFaCPJ5exh3cPE8I9vCqBqm0cATDT0Bgn5I1DW0e0aKswwRWijyec4Yc3gQ+/2MbosslFqDq2459AQI+iFR1XBv+z1SOm+I0MKQzwvJmMOD+C5nbFvwJbNaGAF06AkQ9EOiquHevku8sPHA3zoEQyw/q9KNY5SoHnwq+9ZaFjfTNNtSZQjHMANnM0JMcekHXWTziDPdubYIpCQ/Iu+gukZ0Nz2LtxFJO2UxNxHDcV64cNZCYw0/Z/uFFd5loOlP4PJxbziKKrmicNUa/7ALHtco8rxegBuzBUa9avMDNg1ry35+s+5l076Fkip029CXUB8nIV0RLI9zzfasIyA5oDzeIl5TARYCH9+pVftTw8dSAznqlfYXgWFWz8tYjYThheiNgnlAfzbzs+A1YuWZ+qt10+l/XE5OlUA9SocoxVLD+ySwVS4wWWOk8CH2qoLBp9isiga/YreywYrtygYL+3XB4FNsWEWN4f3YhBNLatTNJeOnK/yc0yBfIIMV9FT2lvtq8OH+E+DB/Q3g6apXSa8v3X8ATiONuT14TJNHGfd9drKq19OYo9+ImfGppB4fKGcg+HJpt0mc8VeJupwvCh3iCo6qvJ0i6MACfCGflGmZjpf4K6CjTv7/ium+Ql0P2eAMVcq8+phxGC9L+kwM7Wkq2FAd8kxadDsSgYtQBC5GEbgEReBSFB2+ICglGQ+HOeNvzCcGYTCGADR0hhDoRp5CHp70/uAMl+EpJTix+CpNP+doS1CEaJxvLPEZBV5sxuy+IdKDpPDq+BN/5i/MKqbL7ff8z1Xlcg0/dx6x0CZE5l65MLuYv22baCMic48cmFHM3+pDBDHa+fzy7s28Ov7MX5hVxJEo+MMCTMWfBKdegEWiM7WgHeks4iJRipi0lmgOiYyIOZnNXMKs5uPMLxFd8P+8tCtIusCUZCzUGGt5aVDNRIPpePIoaZg1G7Af1Vo95kyr80xCtUJGArR1klWyUzpKS3woBdWSzCFpX5HhPvO8s5Q2XqVxkRocPlAjgmV0QChESfOoFtEs3YRqRYwEOOykXWVl9mymtUCuRG1ryeaQvK/YcF94Plhqm67yWHDJ8+Y7RopgGR3Azu3ssyhpHtUimqWbUO2ECRDaSW7JLCmFWfy/nnKv+3jIqZ6I33ptaDye7eJSI5Mxu5/BoXfjMNHhhV3axWex0jy2xTNLOa1aCVMJdjvJMbeusbNdQ0wg3u7by/2ycNy6eXzbclXHKokXquWku4fM6IBVNYyUTQaZx7aItqGbVj2HYCondCf5pW7MFO4ILJozUUdIF1mk7E5yZ/yXfx8NeVk6xaKhmTafoPUd+HvDb2ZLGkf+laJa6Nye7C1xR6yvfT8WsDXSsTdSMNFhXMLGNpbmgexvFWmGbuLTei9WuJw/MyLnTtcm7swIoMZ7wHmKjLJ6E42c2hrE3ygRHcbf7o2X5Ip1hmdO9Pn0K7T6yoWyb1Szsm35nUQ7eYb9jn9DMMd1zYW4b6T1zwfFH167nGzA+0ZDRGpbdKeTX2HKVJOK6P1oSHN6T1fRIl0ziT/7Ahfh99c/ZqSw/CNf1JL/wniqxx3r7bFZUoA1pKXl2Ym+CVr3x/v/+c/Pg5+dE2ZlY3O1++fTJtXsZXgztL6LIIciOqhDjnBojMSQ1pFt/I67ozs46mNTLNQznKFVuUD6B+x05KoZ7KI6ds94xFULO3KHXdP1zl8aAv1lZ8vGmOYPpLgVj3fEbHK+r6v/PJtZYDiCPC9hREmDMbVeLviGo6K7K8/FGDIleSEhTUMy6MaH81wbabYYahlFl3pAfyo+0eypVfm+g3KeMwNgxnJ5L82D4g89Taqs2ae7Q+QJfmtDvAOvRtlLHK3qCYsRnSaf7Zn30vcxnILhBgiiqJVtXeoh9eXSMd6uDC3zKBAE4Yzh6TIP3bQ0B+aJHKgbE2pN0HCWNlw2cyc83UPrGm5RX/b68kjTVLecXNlhMFI51XjWZnOph2tKcpNSm2HUH1pEqk2zF4NSvQP98hMJnju2viQ2VA/f9+xFf/5QXzQMbJx19uGZwPapHkeMmj0kH+MRxVSc3NvCF1+0Y2lK2i8WqS/zHTYaybGsyKcsxyCG3qsiwphmfRTjHQBOTFeUCs20mxyNyOUezZfmwDJHp2uyBAlm6J3HHTmgxhaKUZNH7Vn8XLzaAFQmUqsPHo2BCaCZ+/rWnX7hFZ7lNNghqxQ+EK9bMi/tLgEOE0uLGjTJPMEAbv7nLkzkNxb0oQVNonMo+c5r+GzNL4wvqeiOG7zCqBb81tavV6q8NmhDrXW9p+G2KenoX3pu5z0XKO+zmGrLKShbW9e7tinbbafstr1LwPctiD+vQUqeotKeRda9nsL7pWyvJf9lNPFbmE3uGor02n+2rE82VMvZs0ZpanlNHXhaIIAWCKgFAmnt2nWx8WgFV2pJy1xVV0u+nsIhxBd1n1gBwH3l0x/NulpGOP90sGue7rVNWp+Ys8HgEJB+k1AnzKUvZ4vBkaFOTujE88t04NlHTqanGdX+M0488zDP9LRTy1VgJXSKGbi52ayyGs81A95oe3n/cFFIt/TEVuBwL927cE0W1rzGZghumZ/Cye73NsI/x2Z29MUoAJmSxIIhUhvkEg0s4QA0TZYcxJkNy+meZ8Q2jUlBZdcB0OWe1SR0I0K1c4W0hpTuwrlMcSx+lrqhhWxu7BjhXnHOTohxVwCd8bhM8OxlKIAHXZnaQTFVJ26RIvHo+Sd2L9afWRLToIvneZ238bRDi3wOWd0xKTiPYDumJY58NO/mkLeXHW6W9AebmCSiyJYTfH4kJpPb9TcVlTONZ1wTWCdHByGn5DQx/m2kNYS6A8ubbkpMEVTwR/N6y3sBM1d59sumAZtJY9SXeql2IuRmYRc6LNkkFpe2tsLy0ipNoapLb+KTM0d5oS6RqFGhpoMW3GsCx/VTCfF6O1E3gAGKDplJeleQad8LuvPYMacVzA2q6rixC1rUxofb+3ME/3ww3UlesTRr++TwszxvzWYPokWqtFe/QS87hva2yHra4Bj0chWfkbGSiWdFJLqpfE1R079tBD2xk/fna7rP+b/zy/O0XyoTStFIn+wRFU9ZNDXMxjORzoJnaMof7rx9sBQNGmp8EkpqR4mhi2XJk2sKbpwFIOkTdUFtsbQPbMAP0Xwy9Ztafl7EG8XARBfMge9x7QT2J9NfyREX1GbMSxM0Y/VDTCs+cV/nfKewyfQsWFJ6U+aRBPr5hEWHollowzsQxlAMjT65sSQETkFZaNpsfG7QZzU+VlEhz9ok3gjlhhf+vFFn64qmTZW54xSijHcBIDPesCeGuXWNTNK5alNWO/2xBq2PNkG5GFQOSe/i2bnXsDf2PeIKi+G9DXtTJ56xUi8LvbsR46jBXPq0vkuf84LpfuNpirMoOeorCrfQVQasWdAinwfu0Jp227nCW+ocruYxtu1XEvo8MpptXsY2BZnc3JQ5p/+n1j63QajfeCaAXLCL+YrALemF1gHfoRRyzZkXf0le6yQd8LZ9uiEf3iHfasZ3vozhUSSW9t19Hyj0JsLFM69K058zNA0vXMF1oIkokmdirWnBXFhbr50y7XVLXpVJdCHdA1rIKfVJWjHeG13ftoXnqICcPZbZ0RTuQWkEtKo3aJqB0RQgglTc0EyMpgGN8gI5owWgArG4oFkbbQC16kC1CzmjA6AqTmhORmdAUW1obqhuAbeRAQoX3PshJEyzVQdRohBOGGyxKZBAVkyF63XGRkanpzQhaCFXT0ERNP4mPizIPdYxSla7J2P1oEy/y6ozVjeNUctQHbuzaGNzNRQSizY210AhsWhjc20oJBZtbK4DhcSijc11oZBYtLG5HhQSizZWRH/uAcBOIbFoY7sVFJIJ9NesNKcq/EFUNG3q6+HpQOrjb34fRdj1lTExFEhf6K7gY5dH4t4ox/vqZTaGckP6XaEh/9ozP/WaU451yE7pCmtU+2h6Djk3QrchhQ7umQSuNR0yZ1NQRcNCek+AsnnrBcPPO+phePV6CM3w9eGAdcA6YB2wDlgHrAFqgBqgdrB1Obtc1BeYMqkvZMpMfWGmyPlQy/hamKsX/2/Rv7ts+NrBNhmnj9IaHnL4wN3FrXB3DGTx4etikDPFJEGdkrIO7wUG2ASRK0wgycQsWcqynBcYQGNEdpfJwlxilixllb4LDLBZIlc4QZKJWbKURbsuMMAGilwhBkkmZslS1vC5wICbKvJlz+PdaMlSlvS4wAAaLbK74gnmErNkKSv8W2CImC9yx4yYJUtZ8NsCQ8CJkXtgciMRRZWsFUzVSAL+jOyDpGWjVzSUT49gCFtL8iV/9c1ZMGF8Ovza60EXaNR3kgOLEpveSg2jHbq4hwCF/d+mI/QqZE678Y2gzZ6BLGrLyIGFhDh3SYfRDt1LgZBGfQkpdyKpm+GJq7SmwUQ9wDg0npuqeMpg1tmn2+HECSXtsxKwC6NsPfOs85KxIz0HtPqZ/VBxMMfgHeDbtnh8YnaspwFb/+R90e/nhMuBhXRzFiAZzdDOZgRmwK6aOse4wua0K9AOYupY6OKe5tsts+dkWWPH2Sm8+l86t3+sGKnzviv8yVjWkJ92UPfUQYr7EVCHS1f4lEqJRlBhwAYHOkDPjz+u0Jm06qSvKgmADbZOoSSrV/gcrlqn3DdphQL0D6WOjK/QWerG5953KQNQ1HycA4tavrxFZEY79MUOAYpb+lBH1Ff4k1BKZC0pjo0G97+pzgqxsEnrKiT+z90aaFBz80n8jKWvWSYlWqAJRzYy0A+YOlHHQqevG5+4sGoGGtSsnDqNxkIn7LpA+k11tkChphXUIUkWPnNSoQUkLzGBRX1jOqxQyZyOOLK0g66lHkLYF4Tdt/L6eJnbDE/81PI1mLB5NV/yHamy1z0BI5QHof6Pn7Z97eTpB2VZyITqMuqZf+szfZgB43k6cWIWPqtSpQVa8uKCC/u3ddfzEUjOSlJjnO1oqn9Pf37fmGnybhbcvrGsR2ctuZ0CEvepJ/c9RWcEWoSrdmintoMUN7CnDji00KddUSL3vsjbmAIm9+ym4SnX+tKpN3/lTh1ouKsndQimhT7vihItIOe0jQx0q6pe22v0wqCUsLZ2kODFhgvbE1PyOy18SjfDExcYSoOJ+oT2pfF7DJyf12xphP4/+QCjPiAdVmigUcf/WtSjHTra5aENG4T0VeiPUTkwvREUrXcABkzreVv877ub4VlLRaqRhM2luZepX2LDlq4aDdHVTdlYhbwt4THlkkzkwt6Y+v0BeUMntDHF5wMCOhpTOT0goKMxxcADAjoaU986ICCj1eSYA/FQAMmcqgjqUg33b/yjT2eAdHe0yXQkmi69fYgn/4DSHFKYo1YnsTv0v/GsJ//YQpIbDT35nfX4HJP842BIrppBZT/54Z6ac57tx6/eoG6dbV4WVHJuiiDq1tpJUC9E+Rd4L/t2m2nb7MHt6VxiYtNNMJuvcaUZvTIhdRfdoJr9a/LVrZrE1mQD2kxC03Xvu8aGhxGxKKXuosrmgCrcJtB+F1SlurQqCW9rTGhYjC9/2qHkrpRvdWb03pTXXIi7T8/tNoGlM1ZNiXG7E4PjT+FlR9ZMmNZEA46ZcIFTS0ZPV4FVfF6qQ6O47s6bSnlG7SSUTTRAzJg6L6SvSoVG6aiLdD7zMmnTqHuqIS+ir6JRo3aarSbS6L6o3dEJ2pdO/C2Kd3D7+LadvG0892tKyNrsJPv83juj3HyNqneDdLSDc4m7wJhzNno2pVijAOeWsmNssgmfFgrPjn0xqR3RujVqaeYvxu/0Tn1puWIeo1ajTmrwS5yhfKvX6JSVf4VRrNG+ULkTix8FgrcdPe+OOXVjMujWKJnugol2kH0h2RHhVAxwsxPFTbHk7f7hyKc27HZwcI1h24w32qz82Biam4uB2S52P1mx7V9wrrGms+VHFXohfRpNG+XHi3khfVp1Gz3Rn9guWwv3Qgpu7zGfIoLPDU7rRkXcydsWrV8Lg/tI+hfQZ+reKFlr1WYVcFTwfz0oiGv49cAt1uksV+Bj1F9wn61/o/J7lfyJx+OILWveqP1MCybS6b7QsLMj9bdTyyMrjqvoCkx/40X1+ZRwFDsFxewYusCviTMo42iWlD9nCnAybMhjPgksSoH5qcZ0+9E//wDado3t95t9lcN/Pj7Fd+kX26bY8kH6YVEcnpYYnRcfmy9gu/KpbW93pGiWBgXzLV7o6dO2wCTwnfdbvICYD++3MdbDUApeUWf2pZ9mKyTymnnLQyBkzcWXfAwjquxoJxRFjyB+klMmMyId6BliAclH7aWZ99Q4BhynlKNaYwd9CXEPhtP6UTgccTs+qxvOUEvmv+LaJKMOmOuuQk85Z3bb+7VsUdgy/fqQbo8qIzQrLKFQhcFZOwllQKnaZvoUKlU3qwpV6SydEOVkF1I6yyikdAEzqNJZtkIULzbeZhR99NA+ZOJ6PWrKcS8sppyOkIdn2y9wJv40f0HlDdrYboRCYtHGdhMUEos2tpuhkFi0sd0ChcSije3WUEgs2thuA4XE6nznzlyV/CvFFGx1d6Qs2tzKwPXxbzw7DQXLb1SRN13DfauYDo5XW+N2CRIbdIpL9QvQPQGFPSXRyVM1TF15NAqKSECQ8w3TzcpD8U9A4k5BHZ/TMNlpakj+pK/MJCgfxSadepmpyxd8P1jUiQGoE5iS8MCLTi6HEOcCE2KLiZvCIGBQNJjpkfuTZSkY3xqy8RTUQy2lBQrxu5hGJFjL/zwihH8CbPEB/xYm0eyAiRjMDZFad/N6ZgT8xA0aXxdIocG35ODiJyHwPltKLwwxep8TuPkJ7FyYf2sF0E/Eun/5E0n3dqvx9OD56eWg5qfvdKD85JOago3ze75TN69gOmd+1J3OO8HzJ8shdQbew3m5EP0JXUuwh2Go6wki/W8aoz9p0lwC608gcg5PgdufpkDsT+DS8pryrG3NoSu1d/Vy8P0Ts11h2KzNONmhUac4NPHowQj74EZI4zBpzACl6vBrV7G6GTxAwf7Mru+ShhVQSEf6MmTxnwKgAwo9CERZKAQKduhx8LlKwXcP6PojRF+AsQwU2VCfIOXk0jhi6mX1hH7C2wEMQaHL+7aGR1Bw5m5nltNuuJuZF1EJUANM3ceXAs2gYMfdRHZBtxE3dCNPHdlBoTPnW54/4T8o7mhNjwqh0NWJUdAs7ilRIxRsPI6BcJ5bkSTjUwJOKEqZe5SLRbl3p/VOSN/GJ/soJv5pK8UJtCoTxYGjUdU8ZVohTTCHbpkSq1ectfPamXVoFa8hhGTKBqn65yD3FV8Mn21bMxy//Q4ocucgxnayrLas1vE4yno5cseJnM4VlAznazuBx6HiwEUQlZoz8IHsqBqv6qhbuSqvt3n/vFsAAOTjVLw7r6J8dfVUrxuf+mqummZjwdaZT9NUdxVnWt/API9JZQJDlhcfHw9EI0YcfjPnLwB2LfPrwcjPMLwVCOJCge9CwblcgiRjmFl/pzCQ2UvcjYlOuwqSUD1OIwc9+jb23jnteZ80ou9/9369Y3gmOcnLw5J4Yt7CY9M+oOyeOdlXe6QPwdJ9WlbTsmxhwyUbQALIzdHmNIKczDIelRm2s5ZjKhFB5KXU4omlyjsOKLuXcpsPiDUv1/WjTxm988lZnmNLIQQMmmwECSE3R5vTCHIyy3jU28ti3GsWGRccOnkptXh6qfKOA8rxmUHSmuPMx5bu+7M6u5YFEBk02QASQm6ONqcR5GSW8ag80rrvPJQmIjhc8lJq8cRS5R0HlN0zd7dibvE7sXRnpNW0TJLAcMkGkBhyc7Q5jSAns4xHJbqJ6dgOWEQQeSm1eGKp8o4Dyu6Z7kVUcjoN6/oxy8zlh3S+Osf+JzYFDJpsAIkhN0eb0whyMst41FvGPZ7lbyIuOHTyUmrx9FLlHQeU40smuC2mp8XxK6v/DPR+/eLo/aDJBpAocnO0OY0gJ7OMRyXMnTqmm7cRweGSl1KLJ5Yq7zig7J5Kb/fRDB3zsge+M3pqqbM8x5ZnGxg02QgSQm6ONqdNp+SniZZ9HvX3JMjaDfUEhsdOXoyEqVt4iLlqiiCnF46p2GXq86djTHtZtzQ5zM46n7bDT1/3eHab4fyKr5yXl5EgadQlhmKTpIPZLOmB95V/Hlz9UWZWn2n1c/FapWjYnMdg940JjYzM4rXRVMbFJPf41BvqScmBkrU0lbtkvk8AxOfl52AwxuAXKe71FMEWNjBD/nzXBBXpzEk+LDt27G4DDuutZDVfGr6EzRK+sD0/SUtL/Y0LxlPmAlDdeYI+ihxqlDcuqlXblO1l+zam+hsXOK3NpZ5SIJ+UOZndmGbAWG18ZXv+Jm109R9cSLRzMCxgAX08ihvp3SPeI359NNiPV9IM+pJRooqZskgZXdePwc/Nt7iawXdOOkwM/uPNIbNIXZHEsyKnY3cbPIQ5yB0qyMWIml87if1xBpDEBR482ay4M5nC1gdzV/Muhh1f7X+X7+XhtJGpfpYuyDtdDidLgnwypqa5QnxxPczyflxp8ZT+T2oa/WzdaJMdIdCDF/Iq0zBI78HlYbP49eNzfZfHdACgpb/zsOhlO7LiYB+OLK6jNT2kwaq/mvwu40sJ/XABfEcjVsMb7IMyJda9ttdlwCzFP7ZXPu1eRD9JF+CdsTiVciA+/WYexhc97nmHrpM6hGzvz9ILi36ibtI1EFSCjwH99ptpmZyM2ksn31DCubIxOe28Rj+8dL2BHFD2JBGfvlgj2OFh8A7f4K+eFtq0TIDMuOgzXXK4uy9T2H1kyn7P3vcAysySvPG9ZN9Nh/7ORVBwL+LUPJiPH7KU73Mm5YKrEVeH7/ub9P+kv3dx2vVeqi9CoqgPr0wbz3tzzVzN0Q9q7K+UsatwuruYTSUsjNTKFLY+ZcEBDxXQYFpXl+/7u/Q5ph8uRI27vC0KEkV9eGM++OZwgCD3vS3vfC+373dIf+eCa7Add0hOmpiPn0qM4bmPXtdMRZw6Pvx4ussvL9KeyJXrO9OERyG/lMoTEazB6cfvxv90yCh2xA8AY1GDbfAnilMLYY9A6DT0H/V4l2XFuSXrXjMtMAZvV5GvKI97J2gcuxvfDum7bW8m5wNe121QkUOao/smJKaPtH/9/G348vMp/S8BNvoFhBsFEJZghvZkkR9MadNjlVjQfS747E9bDRzAd1GcoDIJaq51krDzw259KI7nB8NYBaw+8H3/IZ3G6ocLgHOSFGGAEkV9eGeu2ZjAijS4bX9Xtg9O/9ONjX6uLiBdj03AbAP+8VOulE1Wyi6Z4Fg7bO8v0h2xfrgZ1YKlpAxOFPXbF8vK5T7lTtcc/WC+9x99n7v6724UL4USWjrA/P6deXbGS8Uqc+3f75/t9Tye9m2tv3ERJ8/4kGteiE9/FAkuJ/fYdfLTkIG/fHlI3n9FTrHL9FRcJTwGj98VydgSu8y7bOgvf9zlAxSrOLmWHnz9+N0Gz5GlhjE2rFLzzxisOtvLY9//u364KKwu+AxnZwn55Ey1t8hG3z30Df6a+UyN6yDu+3W+A+MdzIWrTGH3skZxozPgmL5li3K+uZ99z9/64aYKad++Tjx5Yn5/tjS4sbuf7zzJf0y2WVh/vt9/V8dYVmDjRhCKSrZ8HeSvN5awIOS6YXN61+mzvTw99j3D6z+4qCUt6xtlAPIpmPKZSTpcP/P28CPby7e+Y339KD4CMMeZQQXkUyry9ZcNgcKoVY2B77tPpt8JlzhVdaPMqY1B/FBk58XzhxwzNn8dEousIwIplSwJaPx0scFygezOTfqtF3tc48EolxzkS60vH0V+cloT7JDg4R/3xx9ODm7IQHm5QNFdaY5KhkomCB807XrSTC3XWO6BLTmz9Dm/HZ+fnobwLz2GG1XPX/GAgN0jC9ThbI1habXlfnmfANGnmxYEO9buxhz24TA3zq19BhSg8+eD7a0WbwdUP9yQsS9Ug58C+/guVGpUnjTLXWrMS4YKtr6jWe3sKmbYQWpA85nb0dG/bO+Pcruz+om6sal9aGpaCfXbT8YYGlP3lszRn99sb714k7z6WzclDL0VgsJgH38IkSUinFWtmcbmZIgYS7MR7dBDhspb3uV4G0eRoVIVWoW9RVbFHI3jmlaXeFd9+934/U/lYwJMwI1fVm7NeNsD7DwKmQ0+bXwTsJtBkyFDhTAGwjQXGSLal4OOEJ9Chgjk4aNsMytIU+6beBw7zczh5yvT40M6WEnTX7mp2sWvKRwHbKqQYbnpyVdvvAE0GSoKQTQbapTS94hxjRZz78YgQ4ZvPMPvnRxklmqK2njX4s7KrDHb+5Ms0IF+om50bgIS3GgA+u2X8HieC9ZcLN2cnAyPlbvsWFSQSNOzmSniOJDmqaOx77KsD/orN9vDI1o720C/fQqPklPbbZP3igyPy6izHEOZyKUuRXLRKt2l4+s0Obn5fp0jK5CkG7FzDeSM6gJ8fRAyubc5EuNmNconQ0b9QNcwrxgyTDaPH+xw8EGGSbIBncJgEWQWzPRZDw+xSYS1f3xvIwt5sgqpetkTV2iPXAf7+JO5e11iPJXCOg8PTM/f0xGEmn646XMLnRwsB7smy8Bd6JSe2E97a2/8j48b8IObvGilWayKgE0TJrJ3E+NyJnbFkW6iJcdCvCDSgzT3Ar9BatUQyH+/B+lik9jNfFhoLbF+ES4yocEdwxVBhotKObQ9MyRkmNx25wqKkiHDpNracpIaXWSWV9I4aWb2FZl1a/rbBOg7cZPbcIT39k6qsP4qPOY5yp7cPm4SToYHZenbfY6oyHBJ3bmeGGhFhstFcILzoALS/LVoRtftJxNd68T3jrIkVvprN2qGTBY8dzJFfXpgilOONFI3wjdEOPWj6TMBfA8u2uo64eYkB+wm06wq9D4bfP0d2PwYdSGUE4ulXhhrHDm6wGHPJUG53rFhf/01AHZuhrFBSzRtU4V9+G1pjo2ys+W6ZAgvtp7t7EkX5Ci8MZJ+spT1ekWIJHDaHE+p21iZDJFXQjI36uhBhkxdEVleYDeQIfOWyulco3JkiMihAh8tA28YSoaIbpPi7UJjZIQEHsVqqNvI4BB0URIGkhaM1tuSR0aCQ+eZ2N6/yaI16m/c4DpFYzaDJgr67cOfrrvI6t5r9Hfro2VQ4z8G8E25IUUmEDU0SRX3QVnvfZgzoHl0fvxi+/GvX5BG/TTdlMMjuie3DeRzMoeOl8wGza7znGzvr7K8kPpbNyotrQZ5WGB9++OCbXSvk3RNaplHUQvlg7rj/0VwO2akkSETkgipWXyoUsTA0q6+zHGUaWhou17YiybBQe/CQfAQWxcCBQdTFw3gdOpK7Ijquo+dU11vflj1FsmDq7fkw+9A+Xep7SI4K5TQxAd9Yc+Bo6OXxn0SIQY1ZSKfhC/S2z/DX//1xZWkMxTFaunIS/kk2kVJeu4uO4WKilIEJadIGhQVpRCueN4pm1RUBhHq9FIKaUnITtveGJMhGNf9i10igE0MG+rAs4tjRJ8qOTRIDhwIxNjpSxy7eEXu0EcI+vEO20G9WzQfxO1jx6dAfkB3TH4YN7bPkXMJO0JlQxMxSOt7LGjRB0EpOXZzQxh/jldUPMvBIUsNFZVmZziyAh9FaRWvj5MWZnT3ReliL9GpmJ6ipO/Kpt4hmKIEf6vDUYJWkZlZaXpbuq3I3L0ZWcOiU0QePqRrEgRSRFD6AFPBSdRpEWENMnaLgXYAMM+rl3o6PkvtEmShy/vJZ3S66Uq6wjNB4DYommcXbeU+URAkR5rIYtwiljhuCCvy9u8IwdBhOwh3iZHbDmZWWv3xl3Qckw8+Rx5K2BHqmlOSsWkreOTg2TdLkYk/HU9USY+nFJl+wMpGlG8VmfJ+sqCtLIqHaO6xtfVMbSLFg7rGcSWFXXF5TznseXVj0xSKC5wRDwN/0oqHg2QYvBmeEiLC62+AClNk4mpBPUTGTJFxOefOM2lRUuzom6E3zYoJyTYiYnuR4hLhbcNEWaO4xE98TnmtpsicVVaGB0wqMu+5v0s8X1ZczG+CRhrUFJdHuEx+ZS6KibSfxOA7KMXk0UaWESqQ4kRXCt4ITIXiBOMdY33EoURF0dtewaeKk7clQ56IlaI0jis3aOmoKOX0auLzLFOUqKVgHrrFKkrkLzmuDG4Un0hoSttnGYqPPEaxtRAaxQOiwnL4np3iYUQIrzicVFxqLIjusasoLjHbyJPrmYoO2Bi9pho4pcdeeu3TRlNc+ioluJLZFBV//Bg6M3vMaxSKPOdsHcvM3a+yQSjS7ikel76asahLiof3qDu9tlPF6WyqQVhfr+LEosM9spCiOIkpIsZ1nylOj6r4qXSoKCKkLR6+d28UkZcv+a3BolkSszdrmR9CKzLwSxIHFIgUlQVzeQ6upwoMNOC8ODFF5K0SBZdDgCIS0ziXeJeqaJilyLjNLJsHIUX+0JcAOiWENN1rhWsUDiNwP3Fuc6dpg5ufKYanOC2Nxr3VyVOibKA05OmGErU+qI9Skz1aPTB73COpCJrnaNv7i5BLEedTZDAODZDrEQgZ8gDLiLBSYWPBDXS8gNpOhbDRDEww6SoVNpgL9ewI4CzUiMaJQA+TUAptlw4P96uVJJS4bJJFJlxE06xSgjjwE0piBbIaz4+FzTFQutuhdPsqQqYmpwOUHp55/wqFCNok9SKhwl1Bz5pFSLhYBnTBUwsSLlCijZtBtMIGk/zVEw5SkTNTpa87E4VIZLM11M48IYJ3X6huN6FQyYQDy9gZECpq29vahc9Ek440i0zLnJSHUPIvwZicDieU3ppqk5BeCKV8EE7mD2eEjVYlapo8i3aBhA1rOCphI4CQIVHZFPNVEDJufvlQ0Wvl9Ckta2TgJHAjZKxE0D66cxhTJUWSrEMOZ14E4EWRF4VguQB3oM67id6UmDawa+L9czhqRdEUYqUGHqXqP1tRAltOtPvefHUvJEQa3qF5LIIRMZUtC5Xv0oUmwZ37D7D/LBLgXuTyuDrz/aaGgVpFXhvv+BLcbwy+C63flc6mt18WmRH3nxU27UXBEsQNQ/ADtpAv09g8F056u+/oK/4Jm/FgrDJzOvxCRnegvOHmZ0LGVRMkIOI9IcMnaQB99JWQwY8QhPJePeGiRmXPAzxPxOR5cJWOfMJD/GauQUdBeHRribGnggiXdJseY0A8EYNsGBmpOOHhJ3T38RSU8ND9nkmNp4DwoFssCd27LDzcAG5XAmiFzMXp4pM6VSGDyri7rwZTpBxmSk+zoDCpUhqCQMwUNqwKHjfbXsJGHnnSa4A+YUOsJ9PruypstqH6gBxEhc2ThwzTxazCZpBxGSHFW7hkvi7xWaAnXFh4M6WL2ITMJqc+TRYIIePcp4gtkCZcQEyFDNV7hYuFRKEYjbcwMbuXQTuNT5j4ZUDYN9IpbKC0d1sFsoUNdwCV2lWYaJKUOltWmROEFEpECpaG8UqhNDQRV27sJZTqCSQT3DILj3MORk/clRriwkO1QE6fBqpwGdwwTHn2UrjQlorYm6m1EHNVkMt26FqqFDK315WZjweETIeiO4FWrJB5FLL+ujNOqIwpxlIJJJhHqim6wzcjo+WX5HLNYXOvS2De4m1USw2ua9+ErHanoSz1fxK4olUsXEUZD1LZc/OL02p1gJ2FMMrnHfKA7d08gElJm1jdjMmAemMPGsjo1BOKY8d0ny9s6CDX1kZadFEJG6t54+nSvG0AC5sVZucbUxUhch5bry/KVIgkudgw0KaECCsl1Rz4cyHiqa+rYqxH1EznvHcHWEImSJUHY+wpRK6GtDi81GoyDJHc8Gz5On2FiO9ndjXTW0LEOzbGuivJQke9THRqc7TQcVVXngbpCJfXdnM3HmptKQsXud6k7jftwobCo98F0qSQCUHPi0t6bN7pkSR2CGeGJUx0z3iHWEwLF1ambVjnZeGSnFV/D+aRo3a7SYwarB219V+EhKSAUy7H3eFYsfpSdPG2wzerX1Xnp3PoQDVZ9Lo5Z/x6OIfg17155K9v68LJ17M11bKfK8pd5VkBk7ODjBb5K1oLXLzaNIK1hB6Kxr1mMQPIK/wSJLZtt0QBGSYnBWOifwb2wp4VvdqSmYk+E3/7ywhtr7gwU+mbWInNF//buyFXO0TnKFFmYs7coISgZuSRG0/jhS9JAxJymdO4i9whmk6TdCuS5wKWj5pELNbIo1K6/MYPUAHdze8/paAMg1Z5Ltrd1QKLX/GiSbiviih98b9mnMquA8YmKWBeYmJIEoamo8iNpZG0kyZa5hX+pwcYjtszrkdL3BcYIu0G6rlxRQp0KBrVLv+ysDV9lcwj6Qv2Nbyd0Eb2Or7ibBC+wDJw9MV/fbo6cXKHsgRJFvMseZ4VeR4hmQduXb5HqMxFhevkquOuwEEr2OfJucYdkJrlGV5WEBUVVi4sfc6vT+3tsq6BPMSvbl+t9BI4c9btHf33Ea5+tpjExlyYmZcztyjHcGPyyO3IQtCWrrDrnMZdJpn9glMloVq586iAeQdSzzureWEPzQR0ui7zxWxTOwHiyejBodh6B5yKLfTsqevK+nuU/UtyZDB4fTJ6z2zokE5/WcqY16XL1wf+h2taxo6uxfyFOu7Y/C9a6zo7xh+uGJtjEye1WYg75C5wc7P2ae90Y1739vQUI6frHU4SNtWwJO1BLnqkUaFqHE2HL64UPxIbReejo92CySN3hy1rtb1cQwKSXBz/AdPdrCqTXlDIZc6wnntY2wIfkdo3fyqtfzk3kfo2o8evT4j+2uOP/XVXRzctDjeZ/7fwyZtbrC3d76MG0198tjaaT2+YkneX3Pv6UV+DzZaTtm+f3u1t1bl6u9FWZhUh+9uwPfh9oEgo0wOC7/gF3B/04/BazBfaAdNNm//q8PuXdw046fkZNYTq6odbfkWCP1pd181zXsM3qq/1PcPmTS+dmi4OPjfmX995Hh68aWTi5vOVQqLuwZwet3QieRnffCHJonmy11up09T/58UEe3iKXb8OZHVE1Gqe7a/9tRSW3AfqbvXJQQe4rTjCgZKBlbUccqg1px/PFdYnH5Ta3Le4Ep6l+4LVKhOhS4i06fDsr4RKm0U+OxjmpNzd2x45m93mmE9tEvCrIe+rEwz+Ehpwg5J/rqaF2VWawguwUkwML4OgNgmT6VO8OoiFUJudodesEu3lu/Szh81bEplw1SaOuEz4ahOHAZ5Bd110Xvb6Szxg9PFga3MOahI6lhSm1ewoSVbJY6WBopupzegMh541O5UceA5Da3acCNjcZHJg9cNZ6MtlxtGa1DVtBW35iyFbasdzKAM600mIa/eeG/3uuDVrEKOZwmK7dsnAc82qKyKYc4JLVixbJM+F4tMP6DWCrB1vYMFb5dc80nuKE4nAWaN0W9PR9HIwn+GxrIBdVuhgc6/xXpPR0z2a5OyUJJVokNUMrd76jS4BLZYBKWyOXFLEDnh9xZjK13D0RALrPoulE3MuCTDYVHav7VE76ESxdzdp6s7BR0m5KeT0P/lBZjyK8zV7QjIOLyfa1wyIez2NeoWuBbL+GfRrSonmi5QkmVyz8nIedNQXvCzQVSDa06cpZAvIssMDm6MPN9XozA1HVLCpzF6nkVd0VAbPaGpJ0L8mbOwakNryqsrPyeWDBDbXG2TqytcqYyBeuUM0gKBcV60PQL5muePzJhHU11yfqkq96LE+BvKaPSdJpkZ+NHRyYDelIb3mmkyFMwk0V1gFaK0nCG/IIXzN0iXbUMB8TXHJGhNBoCQOCVbe7ijNmNrYmhu3M6LGPtViRqeHDnjAoqp06lxAlvXIAp53IuuiWeYZwMwLqJTXWlbzSYJh/I7i42YAeDaHYwi2QhxKIyZgeZZWlwD4bG4lSRegHGN1hEL2qm7e2EIi+AQ0HxY7XAdwjXQ6RLCABOlebbyy4CoN6tncZ6BZW+U6lOTSPl1Y9h55bWthfr0UFG326uRpk2wZfaPYed+jvbLCuEAe6oLw09E5UOlzojalM8dLAbc2HaE+WOadudfeylPRqSl3LjkXO4Uqitjcg41HZvJWvcngFTzeZLU7VvwuVrwrEH9Gmg46dNUWHgJmX6/aPfer44UzmOJ2T5mMc8L3LQYgvEE5/giqVW7AieUuQhM8EV5YbfORhrZwBW44nHi5Y2PDJE8cXsC7bjKMSfl24Zhzs3MeOuahcGNVP1GMHM0sHIYR7UgWLKnalztoQ5va4o1VTuiJVrkBJ47WeaDa5IWtGl6U97wgCrSqNU683FEecnQqC4aBFhxCaCtObUq5E/UZfxYr85OIbkX9BUC7UG4TU6IKqoZy8MH0lniQRndWL4yNFzy2NVKcvt4QmV1dQObwjVMjPc/mwkTSG0plCtT2ePziGI/6uKp0OPvmp3TOVVlVVRG0Co8zeCfEvFj2nGpgPiE9WHBkMBGLM0l+RzbgzYXb3rr79xKPHw878NokF8ANwl8IvPS9LjVlASTtocRuej9nroXzX5i3WVPE5AzvL/y2OyBi+wz7iaQFpDlp3B6zL5o2mOlDsfcVQ2ATGLqzJK10nlOiKblvs0FwTo8dQYYDTTwrgd+c1EKf6GDTTmVJEyyJz/IUlRqkua6kq/g+Tb8yO+f3VATvzKgLSvyCjUBF1y4f6frIpnnJIxMK1XrK2zZ9nDrgU/szAbCGHHwzFBDpXAMqB1euTw48igBa4LTYcEnnGtCE83YgoYwTrhpcjU0PbOlcA0Yo1krTbjuW/VEBYLj8Y0c6ka7DGjCB4jzcBUzpNWCaSnOYIk7vNWRtGhPOXbhsF7IqbtDLRLRfpXoyrSCn8yyod1OEO50k8taFy/woT/C/2swQfJ57MwO27iaT4v9OALp2F8viVQ+EMtY4PmKTDY6KrWlgz41VRcG0aNuZHREx7TCnJXGjUZTFKe+qDIIcTh/McPr4mRZMOQ+dNh4+Qpz1sAOnTpbEn4/PeZdRMO3nOmxiSX+ik/jEmbJmODCZdvXrWnDRVudHPUNn2meUTaRMOhUsTctOlBIk0UlULKVSnmRqAeG0Ok1HVBclL5JUP1qndSYDYgqNdIQ0cE+rJcjh1KTe3RXXiAtaVxYgLoCE6uGoXom7V67IOtyppGkIi2DEBZVTv+UTOOQ/NgwApDrI9JieMwXBb++7/womVdJH+yZHK5uf1OeXNBzJayM9KR47ngeyOdPiPk6LykruT2Luyu1Q3/cB8loYRr0gghodPErJ76TBPASzJi/kdGZjxJtpPgTNwef3jQ/j7BN9c/Y/f5Ou3zn8Xen7KjzcCl+FBxngq/Dtw6LW/Mn1Q3hUDykV/iLbRa0HZ25B6s1/Cg+V4EL2UCk9zhWZc5Kom5I2oBigzRSBU0rbGNxVTYGwb/OEC5XSFocoVQk8yjkdRAC0IgNKw0Z+enreBSoA4qxP7/p551fccBvEIJZs1Xq6zP4YoN3P08OsWIomRCiOq1kF4qe55MFxdYmjx5xSqSsCBK31NvraPq8t9Y6C4FbSaavc2/bd764tJQ6lUoaMqcSQWgbkfO0lG3WuS65mR09VXJilSSLNEmxLSTM/fNpf8srrPu9iW6AISWcJw5Ms8UN50kuDvD267SkN/sIkaiUKzeQBPF8NzyYhuibBtIft65TasKZsK0F0l5Kgv8iG/SWvvM+mmFI27HWS27HEQEmaGSnPGmmR0fxXVYTuqZrgrESxDFEUus5oUPk96MH0vmVUo6WSmbRE6z8kiT0rTFqVPmzZV+XHtyRupTn+txKGYvIAULkIlA3D26jfxkz3viNvkoOoEN11CQG9fk8+wMsnCYedMm+flb/jk6feia8RIuMSg6kcPGqBfpuPrk1RrBgqf516E/ygJQqp4diZ95dKVn+UvNVED/Hj+L3oEUVbiUIxeQDJlx6xSWiuSRDHI7IVq4SqJLMrUThDEgFpIwyhHU+Vty5SRULXDwCpdYmdmY8CYRyi4TiyWlRvLk/pSTpSBNglBrHIBbBW6xbcJOhKq9Bv9AyZ6CfynM/wdZcoXBVJgUo6DVG5BU49jrShs8CS97KEQhckrvEkXS9bTjOoVpEUqSY5lksUwRBFh644eVD546BukwVjlgpw1pfYpyFJ7Flx0qr0bq3nXJXQ+V1Ne1uiUCSM4kVnNEqHojohFdsCBOh0SxSZZJHtPmx7TlnvGl4zFpkm+YVLHJDkKSj5NDDlFjjN+VyxrRZD9P4lepAsMUN50kiDjOafrmaBU03T+JfgDahzXghmqE4aaZCxUQye0msdRHznJQbK8mBw3yj9ApCm0cGqm1/Bbqaa4SAuUXRDkmA660wiUelbN9zfcbmd+rncR/LteSPPJaFa+7rENll511VcTX04Ho4XboBGwBSMnoubrxV+lXGtbqynfU2JqJrmOzBBsKNMilFvc4Qh+rEL83IewXZ4l6nuNmnb76CPDfPUO7cZEC2Z2I7byAJ2X7FwNQqC3dSno0bvhWwbunSsuNRLFFcXJGgaUxJDL1s1V3//mqNWNUnDZaIYJEviUJ2M0qCoaX3cInpVzbL4mOhl+RMSvsdvbz282KQ81rSpKkA1YoIX36NUhmWoj+KRDmGysT81fatqhtzDBK8Kj+JgGKLhMLIqaGiSben0PUHbYaJxSCIgbYRDO56Cz9mlUvZ0qlP8YCYKRNIMjJSXF1y/VK9vYUq3oNqwsCpl14RLwhQTtRtZYPu5DzekF7AF9MPEURMWq6ZYXUwcoG6IUXD5KD2KPrK8TukURzkpTQyopJlVDbJWWmQ1NK+mnVcBulETwiRZ4ofuqJeG4cdI2YInXTXBLGeiELogCY0wGXrZCmN0WEGDrSJ0NCaKYUgSd1addCp9uDFms+IaWM0wrZpo/YckMWedSaPShymWuJvaArd+bSm7CSp6LrAwt7eG3Zxeu27aM4tTqk0TbchrcbVmn8Px6nBVF10mjwkRb05e7svX4pfsscHx9P3zG/eHjXeLfmrVfhrv3re/LPZWPcWp/tJbAAu0CR6HJE2t6jBlJbILq/q5laJh1+wbP94c/x6yp8nxl2MyQelqokeRLsjQN8oJ4P1Xd4C5V8iPDgOrEhy2Wv+QwReTJ+uvvGOKBtlEW1yyLA7VSSTS4e04ShsxBqpuz/XQylb9tw2ff35RQ5noNUvwkKsFok1P2eTQB8zL+xbs5HH5O/ltvHbvn8khAbO8/znC5YSLym4RCuBaYK6jLB5b3eQFMshfvoL2UcqmTye6Klvo/eXs/+KiaR9gbKsZhupButxHSx+8fZamWbR3296XXm1n2xV2/1L15Rqd3pZoG8xt1x50gmHBCMyAVW8JjMOMHn79Mevtqv5zafw7ojwmpEvidrLgLh0cY7piK/jM/kCztyRR7tPsdD403z27S4Ou15eBHaOxAHk5D5cDqKcA4evtepLI95be9B2kOfw3HkTfR2tMP7923/IrhTeR72LGbzf0TnliWHsekSwZne8aQKFbZ2uhkUXlzZnzTBZg82178ByF8063e36NttYB05Yc181OOxkzbpuTY8S59pHNZgzfwYo6RX3gSut08LSPfKbJgF/enDZ7UkSgjnxVoToeujgMZx1ejdw2NxwOpo88fvbJfBbJW6Myciw35cVxM6AeeX78NJY3Dh6G3Kuv8czlhu3maO0et+KsveXHcFNFo4Agqt4C8ea/8lAu1ps0te3Li+mmNC0Bv5Ir/sAy4mLKmS5A5s5il1ilC9luGFw67DfftkDK93TNTv6K8s/IDUGIwvpUt856/msPw2Qs+zWgyxek3w52wDc4wWBwB8PBg9naEYeMSvi2/MJ9AQvGO7s3Kt4AuHf2EkvBM+5cvPSxoAVSuD/K6NOBQfrtpqyuRq7GnXJer3zivl715Nutm9z1zVgNS29kFtjG0/qZj+KHWiDzZrjGr2xHLg9Aeli83nWjdzYcaH8Lm4RiP0S+zvro51ZuSjwBz5vhrdh6kQPmzSmigHC+68rH8VYYpMfLKMzHPQnfXQQtUQMmb6VlmuhOnqZAAe799P3M/axyMwW7/Mb9+iIXTbm1BEuSf+bi7XqCmFIZ1/jID0uMJXCDHwfXrk9LGm14/d73fQVggbt0IH7X/PNh+a6szZymbyKOWv81p82b5uJ90wXS+Vz16Vj8L+W3sUXlw41SfhdTnLqomMDUl+Yd+pYfx8nVox95oVP00il+LnY8QfxLAZAA958YIGsPsvbrBXpXlqS4TP2i2ufuLeIVVxAJ1pKM/Bbvulf5Mpk79QbwuXOdiMxwjSNsYu67UcJpuJfcdzef5iBtZ0m67L6JWbGT3cAa7IH+jSrAhutyFrBrDsi7d+kkBpWZFxw13VWSq9oUw/TIlW8AbFZRNBzpSEc60pGOdKQjbfhs1K3ESSIiIqKnYuj4rXa1tsRHyMzMzPysPKnqC5d36Q/+KagttXmkrO5mKCSxOv2Bu9hjuw2FJFba2G5LIYmVNrbbUUhipZtX+LTn3iJFSGKlje1yfv8gPOf5IgU/ErCkJtC0m6DXx39casNQtQgxGlKUIgFpNRFSWXnpYdRmPshxslTtQ8cVc/IkMafREZo4U06OxOSU3I4j/nk9TjWs6SL/FnJvUhplsMoi8LeBcSbLK0U0YfS9CYN5VKxYZmgmFZtYrhasd3QsFLwzMX06N3VLH47r3D2rAcDXuuxZlUFNW+pBlV4QSBXFapLi13WL1nozCVtmCTmq/7nEu8w+6h79L/ynYxYoUuC3LSG8FmHl035/2tWnalvbo0GpQU9TsoGe4E3pO09kI8gUMEHOeUpbo2CYlvMEu34t+jTB5ilsHXrMEyyP5pTMFJYnYpw8+TYolGmZI0/w+TiPBtyT55bkWjwhFSJQPCVtqTCYJvGEbCQJ/U/kyhu9MRPiSW3TLIgnuPYi1MRZIri0qWdW9cQEseAJ1kwXeNKIKwS0GlGtuLlJE/edYsQkeycUCBaxTZl8eqcUqPEMBuYxL1XsCQ7roNUNJhVQ6pYcotwSzKGtN5zQpWiUf0r5v9UMH+Ml1iVqJE9pADDn426PtMfLrdeP5/7cjloLRR7uXRG85FpaD9IfWg4hOXSiwlnbY62LWMZPSZmLCemVX367kgKYNDlkSCTQ5paq2/VmI14mVl3/7q94R07CRkXpf0u9ubI80uUZhAlYwRtp5umIXfCUs89y218eTDJ4AgSnQUEGk8r9bQ4w5wy8hWuMKmuCtu3BIJUDDIMnhPcR5XsudV40J0LBk88LeIJViNkoRcWWKDYlAzwxxd/JZfM7Obx9pyQ330ltY29B2arcxPp/ylqiRd0/+3vl12TJmIpULJAq7hCqC+7bc0cJBpOUWYJmBF4ZcuUr4LIoBgoylOUDGU+ftbhyzlq3B/kr85XWQ5I0PW1Jrmav7IAnnyrwxDY0BHRuPWQIf7eWa7cYxIGnufa+3a2tPjMxgR61vkMFHZWY00Ta6BiGQ2MSKrWYtcLGJwcTiFiLJLSaMIZ3hkQBB+EJg7twiwPqFYR/p7n2M/bIzMKyDzMz6d+J7jl1RxkEEw/AfQZi5Fdr19aP56tR8d65Yncc1x0zw+WuUrwUT/EnoeP6TiOsttfwPUE2rVaTFawrc1mhPl5El9+3b5H9oclYSkiyikAv4JfS/EvYe9txotHmDJvZtj5LwlPR74jPqxzRVkr0NfvlN+vXsDd3DpBAEjDQBQ/kYMn8dtGfahVlLuyki5ttAeb/SDI6PPU476+9piN46VIj6yfz9+knEPoW2q+KIxY0n85lknmc4Mi9G4vC3b4PNCvMjXRrmV7Iocf5pMB9u2y4dSBlGyLTY8fLempN+lXvilfJjbtWiAoh0rhbO6+xtm+iO4x/UF5hakLdGu3pc2OWbUrmlaelLIHlfwJUZbSK0Fdq91Xu4W7NHfdqNJ1hmsza7fL0UkyBT0qiEKNVgMWb2Prfdv5dYF93MhCSIHBBj0Pmqah8pz5pKhKkEqzurNXO0t1trFSNoIwggvarhLdDQnlqnvL5xu/C73E5aKu+U2pia+kc5vW9tPilvVzCOTWTK9lelXWaNBtqtH0r75qkYoQco6Sv6x55i1+3jxRWUAKcAGZDh6PnKRz9PATygCgwjW9HfFyJ2+bd3BTQcSg2ZvfP01JIkU9LAgwX8ZFN+4TOBXa/BBYCXrlboxitkT8GaQ/FbTjOHs5t4y4pBXAciC72nb0udiRtzz2bRJpOaYqeh8BbmcqrY6AtqxDENEg0vh2n4g/a9nv7aBAAhYFYFBqz52jbGGkBUBiIC2yCeioj1YNn2CmA40BssEHq6SlJzg/rccX40xjOALN6s9hwuwi//eodVYZzINA45tHoH+5H8RYnBDENEqvj+FqYP2xtIMZldP0Y9sKMITBjQ0HvgiaZHybYT4+b9Nt93ajcnWs90cWPBG8MCfc4gKyLg6yHGZ6k1S2yIbtov42sMpwTzKr4JH3W41PnrDKcM0xj924eiG9zz94i0SlRbJQz7al4jVxFz6W3sdI0gjKCaNx5dk3PK8QG0cXiXT82aGG1oPljivn3XCaZHyfYPhruxv1SfpSzWEuLEj1NMqtXj03BBhZubKg6kLIg0Ys4Pi5ew3HfNltJLGSJkGkcNZPXbNzrOiqHFmaFGJme6F7m8aF4gcc9jrNSM7KG0U0v7gv0jzWC3O0gBTntDURqmW6/xUnarx9bHCyPRoFAWIAg20qfyo/CD5G8QRTAhh6r6VPR79ScZiPIBtl67KdP1dUY/PMC0QbRd8kxU4wA3H6wHKqkpHDOs4RML+YX+NmyyO1PN0NQAMeBCCqr61MrwuVPSGoFGMuuoXYaDbBP1f01uPICUQAb5Nl8YpXEfEOuH25P70FYz74GGcsKyfINeL3oqsVcZzgUxElCLqhL7KdSlBLHMg7T0viWcSqnnp7OWk5TPcfZZ88P5UMfnNFPIVasZ29TGs4VOqE1qi1b+IMTiKLWyf3bPmFw8TeSKNuGqlWfI/a+xfjt7VPVK7MEOAFMkIzdT0stRT4lCTKoAovjjPFr7+M2RpMAKAxE8PIG9ipcWqoo8ilJNAabbeVP+rOqWAUnQhhCxJQkWRQlTZPJbDSajNfifVbn/7b1Xp5xY8smBDENEhu6XPhP5aHsQyIPFAUQRGf+09IV+ZQkJgPC4sbcNnifxo0tuxDENIgszk2sKkcMuLc9+4i0ObVsga1wlxEAqrwPH27ywFEAAW4AqGUEGwDUUlCRT0liMPgDFieB/xU015P7Q+b2KAedItDHhl7LAVQ1R0YAFAYiiAYEqKLfqZSGBCGEHaYEqPLB8/CQB44C2MBP2um275H7lMvWUwuyQsj0Q2y/ZAtHuK/9vmGVFuKclmC24lBndL8de+WY63a/S6igO04X3b+BelLkbcfmyeYUW6AOM4xqQTNmihk6i3M4hwdEP0YOpGLmCTdWRWU4J5gu/jvYd+F7P+9Tr4DERdPc+6zx8tuH5eNFIigBTPD3fdx+XOSDDE4UKP+4PFpZxT4jca2/bw3+r+o/qW6rCtRKCE5AJXixEv6YwNU/333jv26T3xK8/7TF6AwL98Ns9VWBkAMVG7qdKFAe93gWQIWhuLD2pUC1Clz+hKS2Mdqe9ZM6o4lK3Gt+0EHmnTtJnURfi+J5s8vFtAzusWpFGk4xSjKyywWqfLt+yOSBowA2dHleoMoyI8oDokD0TXjsPgwJ5D5i7xKCmAaJDaK/vNrjyBP33NeLjBmSzEDP/UKG0HD3XVNV9JBrPbC4TyZOfn+zCj3CCNIg0ws5ut5ejnLPo+K1zKyI0/R84lvzkdO+trK0lK4vfq83XbWYWTfF7HomUzxr1ARHHRuuyf11nY29lJYFtMzqAbzNe5XIjS4hiGkQaTyR/7tXvoIMnSyCJMg0jjoxupP7btk4SEEWBJjGUfda68m9oI1aCrIAZDbA8oTNptPFNq55oAcdM2WZgdVDZstlzxY31jcZCEnDbOgxoEHVb/ejkgdEAQSVKQ1q2TkXfyOJHS+DfS4sPjau78awcGONRYJToCKoUC3omsJRQBaHQ4GzhHfp6KgEX4a67NixMoRyfMuPH2eLU/8+EJNFYlxjX0cZIyQZgTwxi19VY1x8Idx1qDotsGIlwAlggux9hKrOcg5KGhAEEGQ/JFRVYcBpQBBAkD2SUBUGkgYEARSiDRKqGHeE82pEaZBWeSmh2u65/AlJrTPYcSM7jQ5LqOqWGbxpQBBAULsuoVj2EqAtoDFag8WB9trmMQb3M2BllQAngOmC34pTNXx5u9/jRaBOmC4uvc+8CVU9kAaSB4oCCGpDJ9QyCNAW0BitQVr0eUJVGNQ0IAggqL2fUAsIgAWA0QC5okX/o120ofK32XcRYuKI+CKiibwQWJZKyeSAWozIEPMUyixTKLNFofK+uehm1NLq8VKkYsJF6cpPdBaebtZKRYHxOZqgZdFqJ32aKvlTH/OyG57NYUvIhKLI3Cf5Rulk8SqhMj0ZYgAf5gYInPpNFKQw6GgAEDYdY1HQ/lxjiX7hj9SgKKNKDicH4FdzfKt6oNXUma9Dk98543JrcZ2eIHnG9KdmUGANnDfB2RuIT2w8huQC3ZrbbzN/fR3gTSVzOfPuUq6CCC7gBC6YYcOE8S3C+V8G9hK6axaRpTGk9CTfM6uO1/pAqzfg9utGkSMXQyAKD/17QXT9cg5N5md+In5ReSx1OK2hObDXmp0DehkVUmcrdeFYX0BHo/Jo5HA6ddjP20IXTe0sPdCVnWVq5132o/jy9K6LVNBLin7n/L/P5tABVbOu8rhb7aJOrrX8Ea2APwaND8C5v93vwBtExqdRahjtlECvXqvu7W9TOXSxRZTZZP0vGvGmmVpJTbVUknfcFZxrR4HSpepSjJf8XnvVZ5X8v0zj+A1Mi9Jz/7ENObPYf0NjWT2Ih0XJXvqVVZdvpQ38SaiylbyKCymFppBRaNiEKSpTSzaoEyV4L2pIwjdB7T4ATZSKgie651xj8pexpKUtUjrISZJfTpJVgiNpJRoStUfjIHGiPxEbjgooPYCRVE84EaYkIBEmPAiR5rustCghaJ1fEe1AMCC0FwVcyZO40DxoCL1D+nA6pC+KuYDF5d6oCtDNkBLV38AZVFNAGewAvAExZl8W+oIq2ggP3KJXuCveitWNICuU7IIVQ6pQQ33DUrAOREeBpFcxuVFRKNkHLUWZ01OHMG0sYcs2292+ezearlVqimW9JXVI4kN0YJLDclj158ilzoFEP4l7Us7a7Cf6wprIeBeg7H+1j3E5KRaYX08pCFFBNT0ahSX5K64EpiqQBCU8goSVw0ZY6SZBaHo2a3s2ogMpviTX53CLUoDmtzvvxQaWlECNzWH/b/kM/rnWv6UT4cQHYCoWCQDlbPYx2RnqU/4wwsfW+mFWD+ooqrGC1rV2R2vF1vEmbk3OVT3Zk5u5gua1BCf1rIG36bPXRkuFigXpOC9zYv8pp/NiNbyMe1nuZXNPuTvskKkltAkU/1h9ocCsiSmfGbElOtthJ1UtudkNO7XM5WyEtY2YYTDV9KyBOdmfLJWMgKGrLIU/eufbqDT6L38ESCTbwPAnzOOi4mFCo789/G6I6UXlDC9Sn+OJC0blaFQPczd7zxaVOEYFfxfvXzHsE0uWoTN6N6xi7PRvr0bj7nIebEJTrOFTJU5jS6En0uQj/tuWIg67Yv/phatafzS3Mpzro+0cC6QR4ikPEBeUvGcoNPeYUfP9bIvD1AGkAZ9yRfXk67qZe+D4yWsaBJrZA+OTe1/UzbzKcIc7sQ7q4rq23nSqEuuQtp5Jo6Guwax1KgkMojO+p5A+02PG1twuk3HMvJkFM31mOiYwGD11DWYtgUF0xllDgSUWiE6toU5gMHqWs4Y6gUF0xtdrYF5y0Lw5lEvnynnNaYmLMA4oduIKs85JIi6EzbieHMqzB8n7gh77iV95dS8uFDvLVXl1Ly6EzbgqYwM37wQNe8RTpm7iQrGzXJWpm7gQNjHZgX58ZphSfRB4tnSVb3m6sn8ASBlCsi42T8tymptcwI6dVJiUFM0LpU4aYmh1Rf6c+CY/UZ1zQzOJziGDvMiXM/m8+cigKCc96NLlBMmuAvuOMLXFYJPAhGLU5U0UozPIRcS2jEVLYJ7P/n4yf3yU/BrXBw9gurj6p/fxpvML40hyk5bXOh/r3Hpk3S8hsnlZH8jX9nyzPEGYRya8dGxBUhvyPkhVdwCbu8fv831xZOvtjDzsduL+KBtLu3VELnMG8GIgd4URkEkEN781VMPb+dBv3DtnXm7/l+rRPlUPucwZzKfocVppBGQSwc1vDRXreD7eKPfOkeOPUvBst47IZc4AXgzkrjACMong5reGCmc9XymD986R44+Sb/d264hc5gzgxUDuCiMgkwhuflcsqv7R85GduXeOHH+Ukkq7dUQucwbwYiB3hRGQSQQ3vysWVTfr+TJ7vXeOHH+UneR264hc5gzgxUDuCiMgkwhuflcsqPTY88UIe+8cOf4oJ89264hc5gzgxUDuCiMgkwhuflf8Bnzc0/+gQ3Xl57fPy+4b60h7+dujaTebDOy+B0weZgHBpKyXv/+ubFE3Vfh8IIju3zjzmsDvhvzqJB+p/TsjnX8dMvjXImdfaB6kWi+97kc7c+KzS4PbpLGdv1tP2DWeKi20rM37vvYvJZN5zuY8eBYHOD6vA8NzGofAWQ542NlgWpyh55BOtKuzyiW7fdF2yEqJtAS82zhd8RdRSlUYM1a1xsdoqI6skNkMLuU4e5omZ52KSMWqzE5rV1o9+P0wTVV7Wgabp1T4MmSRIiWygj4ZXJEmG2Q04iiZ2dO0GB52pPgwZXalw2OuXV+hq5bBJr74l+pLnc6EE5E80QrTQTDJ02ZmtLFic6pdzdX9GnCtB8iJclMEqVITS1VmQpUlJoOUdQCmq3uarHIijJWSaHYlozW6SwG1koctg01UkH191tDlRLgIyIuMl2NggaetwFBTxeVMu1rHvXCMpT9bhhkqLv/qxMECc7KGyBzcEZob5DDiKI/Z00QXHnayAJ1tVyI83qXtV+C2ZajRMtSXvo530bVd8L7LOi5kz+WBnh988jWUH6rgtj8u/HZlbwpDtww0XI33sNK72Lpd6HaXNbqArS5P6/mRR07OnW0J8shr9VpgvWWwwZL0G1SQLktn7ErTj9GXpxunOoNb6e4eLdX8UxH9lr0363g56tv3x4f+s8izWJLClW6i7GpT6LYuZY18FrCVy/I0LeZH/jnq7w8Ead3Xo/b/KB5SPNbTQ3hoC+2bF8VGgQGAcJhtf+T+LZG3Zj6x387U8nEZbOiF1zOeWCmKpqxBwerik1H2OoLT1j1NZzlBRv9wUDzbuni5Uq5k5TLAPBWd9JEKEgWqxyGsHDdKSe3ldJSnqSUgsESFiGNb6lite7RWrs7mMuRMnbwOKVUuzoSqQSSLB62QrA6CnCVPU1RmtLEyc6ptqW1NuWyhywDzNHbSR4pLFKgqh7Cc3Cg3tZeTUp6mnIDAEkUijm2pY63ujWCnDqfLwPOkAreYK1I0RFaQD4MrQmKD3EUcZTF7mszCw84UIbFtS47rmrVrXQ4bqEQFEKpAkRSVJ1BVcTJOWu2nZHVPU1ZIeKkKEsuulPNE6D5nlis0uww5VTsKKVlAYuqoSMiWlGTFlBWonLfyNGVlRhstNFFtS22LdGdKf5EJvMxXOvu/5C9sfgsCY82p0BjKxgYGKDD0NIsNOHc517bsoPfDmqr6uww2U3R+qxpzzbnYGNswNzCCgbGnWXLMwcvJtmWr7K726hDUt3gJe7dhGnx8uzMjG3AVGmO5sUEjGDT2wBYbc2YDsm21Zd3j5GqNmJcBZwrwVUSh04lwEpAnGU/HwARPm4GhpqrMmbY1V/o1k14PkBNVpghSp1iqU6jylMF0AE73tJkTYayURLOtuVp3IrxYJOxluJkaUkC5Lp6GC1d3GbpDii5P87Q4g1Ulom35mk6tvJdh5mrqy3zVU/n6Rf3S1BFfRafdjcyMuw4xIbZovezsesK1dNfv9Qi1GuDVP9Dx/j0d/0fo+Lvq607cRT4KXr6szTzX0M2/zj3nEE/93EO4xjmIDLXqkKJe5WnnJmlxBp+ziGhXunomfEc0/QXRmq4vrbtNbT+qMUUvUfWWoLzQqkuoxpKHrdiAs1Unrm2tA98bA4oivww5T3d4k+Ajtcd0Jf0xvKZBNkpsRnJyswfqMT/46M8y9Fb57Zn0fuxTPfGXwWbq8V08sToUTVl/gtV1J6OkdQQnq3uavqKCzH0NJ55tiekT9dvlUvovg4180b1FiG2iKTfB6k1GzRHc3CNbSpC5TTzbastXr4+PooaXjIBJVacNbAoo18RTN+EaJkNzSNHkaZYWZ/AS0bZsRQ8RCFVTgRlgpKDsnoGkujOhI5IdreAOAidP88xoYyXmVNvyY//lNdcZghlktsx+cBEq28XVc2GbLiu7YA2Xp3lyzOHCE9m2/DiXBq7OBTPUbPX9eIorfomuvwRvL1lnCdlc8ryVH3z01YtvVtjW6oF/4fpzMIPM1uIPFqGyp7h6U9jmlJWnYI0pT5vBMYe/HhTZvtrxroxDpUaYgWaL70fXsNJdbF0Xuu2yhgvYcnma50ceL0fR7cqfG7/FWucUZpDZcvxBESp7iKs3hG0OWXkI1hjytJEcc7j4RLat8Qn+5lYTGGaQ4S83obKbuHpN2GaTlZtgjSZPa8kxhzeRbasd9Re3r4A2zBBjlae7QxfdRdXqgva6rNqFanR5WI8NOHuKa1v9WE97i4cGfqUNugeLsY0pK43RpcYGjYHY2NPaqMjnN8/8FMpW71qUgacdS9+7JfqGb15+uoxio8AAQDjMtj9y/5Zot9Y2x/ylg4uwxAwwTZCP68TEUnXoTKhBRLL+0Ao57CDIX/I0zWVGG3sh1Km21Y992ZUFhWKGnK22Ly6xxcvOKdv686P0hejWyXJH99LdPU2j405I9FdKfauG7bnnyjgW6ooZaLJidU9m08Uqtq5OhW5LVNZIawFbGS1P02R+5PGvQUW3LUEe97KLBe9ihpysSr/vv/HSdMq2Pv0ofZG6dTLe0b20d0/XbP4JiX4t+maN2/GuBV9UMmawwZr1e9Gc3p2x2/0Y/e7GncGt7p7c809F9nyrzu15cN2mkq0xg06Wq98X7Xx3zr77cfru1nKHN9090MedlnQBv1m/7chrspdHjhlssnj97p1nG5P2zY/UN7eeOb5r7oE28eSkrzer2pbsUXDkQyPfUUHfafHNKftN6HaTNZqAnSYPbcRWkfu3RJViq+rGQ7/QotgoMAAQDrPtj9y/JbqN0x78fuyvIh0yg428XKuHEiFWiqIpa1CwuvhklL2O4LR1T9NZVJC5b0YRz7YuXq70S9TIHiAnKkoRpHaxVLtQ5S6D7gDs7mk9J8LYKZpt9dXNukwyhw3UkAII7SIpdoGqXcZd+6m7p/WQ8FKnWLbV1/RrkMkeICeqRxGkmliqJlTZZGAOQHNPs5wIY5dotmVr7XFOpUPf/FrB/gPzO6XxA/6R6cyHXsSzFw2doeA1T/Mp8Sdfc//B8uN2uPdkfgtYygw3U5kKKFaR4mkoUbiGAmWYuw7hnHWPU1panKGv7JxoV/7UqNVxlb3aO09LJ3umik4G1I8hWDlmkI3aiXkoT9NJQFR5qjgptqWHxX5hYtkD5ER9KIJUjYilqhOhylqRQW46APPTPU03ORHGakg029LRUu9B0X1UXlqmI5lNVJYHkqouZ0KFIZJVhlbIZAdBNpOnKS4z2lj1OdW2FLjKHtZjPjTwXSsev3xpQ2dG7gyudDboiKPOntZp8gnbfyYmBTaXfTjkf2wpCRAUOgR3sf1s/xKzltKH+ZckkCjpInRV9s+/xEvrcg/zL8lARpluhF01++df4q1N+Yf5l+Qgp1x3wq+6/fMv8dG2wsP8S+pBPdXrPdHf7W2ff4mvOoYXqK5JOdOuoW9b+BJ/qo0/oaYBGqrCT0l57qsmYtwnywwIKfFNAdv6RJjPB9feWFZ1ZrCBgvCHEC1UGE6EAkEgCoWM89MxkKfgaQIKDDVVWM60LYEtdgoNzwwzT13izxSWOFhTjinKSYYJqt2Qm+5p+kmILVQwItmWVpZO3DV/F9KeWZ8pl3fxxC7RlJdg9SWj5Qhe7mkrKshcJYlnW2sVP4EAL00fUjzxw4kflbifpS4R8XAMDzcc2g3DPW2ExDb/moAHSUHeUTrNxcOhVKoJAIyGyGcEzmHXbf7FoqU0zrgA0STqswRdk2XzL1Zal40zLsBoJtpnE+yc2TX/Yg0374+S/NbCRVqJimbIeVcS4EMPGSklpkNV1eAssJpRRjOSk5s9TYHpweffEru3qtyeZvt13GgPkBNFqQhStSiWqgSFKitPBlnrAExW9zR55USYe3Wdcm5XfV2neCHNMPP0I/7MIQ4ejikOGQ7thuGeNhJiC1WLSHY1nhb+RCFyhU6awebJBR9i0UjlMB2KqAZnPdWMEpiRnMvsgYLLDz768t+bFfV45PWdatvSDDpSk/6IpMbq0alQiwxlHbJBIgMKkhg9TXuxAee+/nOubQlvqV/9mfYAOVF5iiBVdGKp6k2ostRkkLYOwIx1T9NWToSxYhLNtnS0qlPOnGaYefoRf+YQBw/HFIcMh3bDcE8bCbGFqkUk2xp+A0GO/Gu4ND/thJ02TC7Fx1g3Uj9VUhRU50issI5BYpfxmOllTxPl0JOT/IO1D5art5Xf8vqZK/JyGDWBZSMVrShiNSyasmoFq+tURsnsCE5f9zT1RQWZ+5pRPNtaq5tVYmoOG6gmBRA6RFIcAlWHjIf203BPGyHhpWpHLNsaa/oVkWoPkBPVowhSTSxVE6psMjAHoLmnWU6EsUs027Jf2a9xsL7Hh/5RtO3/i2fa+FGYTpUTM6K0ysdoyIwMUroGhvSuepoUZ52K6B9/vVlpW2fPOhcX16sZaqZS/XHMztWoc7E6GdvQpRtkM8Egj9nTVJgcc+4rSCfblvqeHf4tC1WirBlisPI+3otH1YmnoTjhGmqTYd46hHPWPU5hYXEGq0pE+1LUkU/q6dDQTxfoD2V59nA+HAzlwQYDUDDQ00ZywPM/8IVzishRe00VxkP+LYcNgUFF5yzb/oD9WywbL/VQ74e1FwyvGWzmRUl/KORzNehcbIxtmBsYwcDY0yw55uCLm062rYucR18TU1y/ZrC58st9+JrE0+nCtbqMu0O4yyN7UJzRU0Qb6398ebn6VvUlbAacKSxFFGwiapiAHZOxOaZq8jjLCzV5iWlfduy/Yh1VRGyGnaeyx08UQeQCLlwVLC82WASDxZ62kmPOFCCQbWutqT7RiV5UxyawbKQUFUWsCkVTFqBgde3JKIkdwfnrnia2qCBz1SWebQlrba3WlO3V3nkKOtkzxXMyoG4MwZIxg1TUTsxCeZpGAqLKE8VJsS09rNPTU9mpqGYz8EyB+NNfEa4VkTVlI3BHQW71xBWuk8PyOIllh52sQWfblhz/sUC/Xc+9wqDNoBPV6M8UR+4wKh4M5YFGA1Aw2MNGasC52nOujY1lak9QqFfatDly6A+0FERqF0u1C1XuMugOwO6e1nMiTJ2i2ZiWvoJ23VnbA+RAISmC1CaWahOq3mTcBMDmHtdiIoxtotlYW6znmbVWb9lmsHkawufGJVJMTIeqqsFZXjWjPGYkJzR7oPLyg4/+THFvVyXIo1w5pkLlNgONluMPL1GlD5H1hsDdIWsM4RpDHjeyw84UH6bMvnR4tBfSWd3fZpjZMnwJKruLq9WFbXZZuQvW6PK4Hhxz+BTZxvpRr219TYybwUbr7ydTXOlLdP0leH/JGkvI5pLnrfzgsy+Rvl31dnSX662uzM2QszX5KrT05Yzd5cfoLzdeDG4t9+SVfyqi5frhcnk7+qvNqK50M+BotX4hRhbenbDZ/Qjd7sadsZ3uHtvzT0L0fLu+7RiubUPFspvBRkv0J0tc8UN07SF4f8g6Q8jekAeO/OCjL+C+Wc32nHTlmEv93Qw0Wo4/ukYVPkTWHAJ3h6w+hOsMedrIDTv/Clex7aw9p7naPJUybwYcrcUvrJGF69EJm5r0I3R16cZpzthOqrtnajT/JIS/qvxwedqOuNq81WdvBpwt0leRhTcnbDY/Qre5cWNsp7nHtvyTEN3eLrMd+dLeV3G+GWq0Qn+0h5U+xdadQrenrDEF7E152oyPPP5yreg2Zke5ciwl0G8Gmq3Ie1ThXWTNLnC3y+pduE6Xp/XwsNOn2PbVj/bprfHQwM8GCE//X6wzIzuD2SsGjjh28jQn8Anb/0YDRn4SbFrNwyH/lsQGQaFDcJSNh88Pe377nwy0Lfc7X1fQwT1ADrxAqghidSiWqgCFKitPRtlrAE5b8zSR5UQYe4lSNPu6KLn8b76uG4XTrnmiuZNH6uUkQKkYoKASGSXguQ9y75WnySIgpCwdnAz7koB/DpffZS0VhjPwvBd4Kh0jG5Fhq4C5VQwa4qixp7XwsDMbsW2rfUWdn4cGVksPJ02eNq15dKF6dCLUIgFZh2Sczo6hVAYP015gqKl6c6Z9aW2ZZt1JnMMGSkwBhMpLJEVpCVSVlYwzVfsxS83TpBQSXqp8xLIv6Sw0i6ziHDbwRQGENpEUm0DVJuOm/dTc01pIeKlNLPtqi5sVhXEOG/iiAEKbSIpNoGqTcdN+au5pLSS81CaWfbUl/fLZuAfIifJRBKkmlqoJVTYZmQHQ3NMsJ8LYJZp92bK1ovG4V3vnCedkzxTNyYCCMQSLxQwSUTsxCeVpAgmIKk8UJ8W+BLG0WQYh57CB4lAAoUskxSVQdcl4aT8t97QVEl6qbsSyr7VcueZHzgDzJHPSRw5R4HAIDzca2stDnjYCAksUiDj2NZbXz6GOaiWbnAGH6kQRBatFRA3NCNhRjowT1THVdJWnaSkw1GR1iWlfGjuE92P/1HXKGWyows54YodoykOw+pDRcAQP97QRFWSunsSzrfFU1C9rlnuAHCgpRZDaxVLtQtW7jLsA2N3jekyEsVM0G+vLlIv55QwwTzwnfeQUBU6H8HSjqb085WkzILBEhYhjX3OhWacy57CBMlEAoS6SogtUdRm79pO7p3lIeKnCEcu+fHG5KGvOAPMkc9JHDlHgcAgPNxray0OeNgICSxSIOPY1ltjPhxs+NPMjUP35nM8ezoeDoTzYYAAKBnraSA54/sebck6hshRfs9WNh/xRlQMEBhWds9h/sH+5aFr9OP9yBBEjVbrOyv75lyvN1TDOvxyDGGOq6XbW7J9/uab5Gsf5l+MQZ1x13c+6/fMv11XwviStxcwpmCE0d2dxWPtledMkm01fpCNuo+2y5cHuuBnOer9xlcLnLktRGwmNkP6fy7MPkYiiDEADagZXAspZUOzh5XlkHUz4g0n0MiAqcDlo4mwQeOpcYtktClLE3Dzsf/98mr3Xl6tyBzVmRrdhdT5WSdysp6X7Bc+evyZ2DEgbaNdvOx02kl8SUKaskefmNWol+aWIlezaWV9k9QGZ/gANSEW5h+pF6yBdMDLdXb63RxwvuZyg/Fw4j8R0YDomd9YiDm5ARmM/OErvXMqmaroS4/SzPEooPbGiJvo4W7PREH2ktyhSZLWyuPwrZQfPIW5fQ7fXmTTDLrLp0FXT975OEnC36f9FOP5m8+DhKLZeXRU/UzRj4CVjEMksUtqwp3/IRHRyY9RZJzMxoq3Y0Qc8VjQ1ne/iHJqk9vln8BjHHxTGt3mXejExXtQDAjZM2Y7hWGcXEHhI5efHQPMgRD1YBukwCupy9IyCJQMfcXQkGQBJYiaaf/hQ6bS6N2MoERXt+598vunJcgKatReDwIkOg1ngMvxhK5DD+7R5/zBhH8SZPoE53ILyuLWAm/0htz5oPhDhDezneX7vut4MSgn8VJhqnv9XQ1jvq6LVOr2+7H3HtWnMGW7YH26wUF7KrlBKwgdNKgMVT+c+7EVrugV6WIhk/GhT+/cZF9uDnrf3EU8fgtEBjUDgvcv9tsr4+nxv/H5l9b7GNYXZh2FQlAMxXwG4v49xfqHS8HZCB0BrqXB/LghE1OUgRJoJRWqGqWGH6PsbC1tZUU6HHXI0gR60MWLYH3aQ7xc8eRMsvJu7fn8nmcWKMkrsEH3/5MmbLD3xMGoEavHuYKb3xv6B1WKiuLMvHmntGUcyMYlmrLs4y9da5PpYi1zvqi3cWPqBNxWgFZr4UOjfwh27WN/31KmD737ELACjKA/3pDV1bwFW2pA38YOvFVcX595dgfHdACw5v4OCqRBas+iJmFMuZLoImN1a5Toua33NDUfQqhkRrJGns4Ok0Lo+KIl5FV5ERtphH9kYjF2IVj1Xh0RuQZv0xPcNpkQU6Qz+ZA/ZvorYeG/lsbA98vyIdbfQmq75DMITUNuO4dr4BdrzhPNAoVIW+gHcEspayJMNA1lWIvwdQ9c8PzO+Gn2p+tBL5WiLQdbXrLfOk2DIP7fWrui5A4Da95Rkml78bO4tBiCauWf2e/Ct9KMr6fNSqOABwGgTMFu7lMTj0Vj3qRFZq0S4EwT689Yr6hRACjpCQDEWE/4FcT8LOYoK0dIx00fR52vwPmpxSI7LgzsXlzPFkeOxaBF2U+BmX8tY9iGoUIhZDq4b0iKafEomaCGEaM79vS+Kv9g37/oPpVuQ2et4BSoMINIFx8GYrN/ZVEff88wyJb9VCHhwVBpXZPQAC+MNAIABACZTgF45i0aWFPPxf9HMA7BET48d7SPnbuduIacjL7uwCEAAp9P6fJGxlAfYWdZvzqit53rrFWl6qQkdhb4gOo8EuO7zMuseiFra0VRLyaMDN6rVHnmAB+EGiBvAcwLHEQwSwKm6K93LVVcAgyOwv84maZRbwM/jAPOfnk4fw3chkAAsQmRNdcfKZakEvRIg2AQN82gANT54A01BBCAg1BOCM3U4qBAAgMQHFtGMPQhwT+u9ec27yEiGG3gFwy4rimVcejpol91eYLHn/EzOlea7LStC27VzfqJLBjyFhxpEf0U/hUKOYOIOubCGlyXtzbaqQ+dZ9tgDBCF2LN2MhKuNuVrT3jFrsiWsh2wrFeAWAIpBC8BxlEbeBgAWE4Bi4gy8hldCpBuIDWQYQPgvy8Kaijf0pJavpTjFO0E2kktrDgbbKbAgcClVmAkAtuFxp+eK7ywBmwcdT6zYup1wFuM3BbSVbwQvQvBWckCVR6p7yARt+QbDBw0gjBIAAnMKWBLEjwG43y6BEWSXiZeW9ee8RyWuBfgTQMxRlQAaybl5c9wcc+ocKw0CkrLAZQBgilVBEvmfPXwr6lV3h6jk8H1e6JKkIDhk3Vs5CtzQhiYlu8nIGHMb2A/Joc+Ly0k2eUPBEwA4cz+n/V4Ykkc++S79k2J+D83PVxTWgBuAJw0AEGEAAyoEoDAdD5CKEvKyVDf0QK7cjXuPjvK6jC4SQEqH286gV+EjmI4BKx6A2higsBYAD/BgoNiLBAppBqDAwAiClAAgUIsBwo2zRFJ1gQpWGMAo3wOPN4pjROkKD68PzaEq3fdg+VN98LCjAQKv1GAQFwOEtuuiA8kBXYfWThLtGm1TJOlB2BTymJ9fRCdz9aSx6es7GDRk1Dq3of48BPRnImc+87yRN8VGzW5y9z4sXO/yMb+Yr7X7Qyt2a613fTqK9uqQbN3pOFOn3ooSu4WuQDvzd/t193W21ZHOg4CkRh0jHJwazfexxzdmv1St4dnGDzBkZhu1HiVkR98kzhn+ONd++GxTd/rsCOJ4R5DH50AP6R6YoBs9qswzcrQ15flctpo1VCDAf4Aq5x10JHsM8jJemNxRwNJCvf2+kMe1KRZrLNSQw36t2zaVveBql35SYhP0xwABPAL8Tlhh+aehrTZw74UlWKVJGEUBjPwB8NyZkhUr7CAlr7tO+5vtm+bZYiFxsyVh3G1N9HyWi/+Up6XpOld6XbwodegeJ9uOqyRxzCyjhQQQ69ehJQr/rDYXVfecFAnDidJ+4k+Dm+mnHiQZk63oqq37Fbta5LyYNlq5rmrohO59o/RCEF+5qJjzNBwLgOxYTggVRSDhERj7F57vPNHjl91XojoZzoSij/gKMHnAbPvWncRyllrlJmd67rYWin0MT9i0UB37/sNyTbll7Wb4xXpFaTu+7vjGHamn2egUKtyfb4kFR9WpEb7ysUYV9ikoz1U5mnWo2sIOfW7100pLPX65LwVD9tf4WPHjV6JLwmvFC4m2pzdtBNkzE3Z5Vg3ZbgrvB+hjvPBMxcagC4yo5kFI1F03nB4kpBcyuoxxHDJPIOCYWwaR7E0EsUneuJbWbpmsRDJCCAdKwJIZmOHwWreilPb2rrPjWZniRg/druNbXtuewdJrvXBVDOSfAm0Wa7TLrTRe/jpa2JJ3ZimNppW9apVom46YeU3uOR+01uN3r7cpku+/ev/1o02CsuIclMQ3Vo6WhaYyaUc+Hklr4oXx+RdALi94/h63oQUHevO+LFQcbBygPcS17krLUj0C2yW16tEgDs9W+FZ+gNFRZ/OiXBPaDcfcLpvQe4DEPTQzjXxXu0pAtrQ+K8XR+y8uZxh0SLq3vRDswsifMjLj6lYKqQm2cw/fSPIwS2g4pptCiS3+Wm1McMWyq8CoollSyiStwu2sfUDkU4ebQZKH3G/FUwhCYSmHhhyNgfvE7+dQnoZOWwQt0U9vkjUR0kTm/ru4ex7EQrzRAEqXirIYhrEFbITKFE3p7/J7cVH+681P1uvLsvqY0+vsFDonEz2pTRSITpxa6LPimYbmIm4YF2HqVonc+pp+fnlWKtsGIxzbLc/YDFOuD3v9K0EoT8q3BrIDOCJlhmakxcxemmxXWtoHBjxb1zqKPNR9VjyzoXT9BwDPH/bu7o/CtEjG/2qJ6eX0flx6Y8/qoxBTrapTYofjDju7j9Ry4crAr6c6LeFHTgaTNssJZ05Vxr2GpIwoK2Nq1AnjT6eTC5lw7pAQlevuGeWJ+6xi3FBwS8Ev07MtQfZNOmO2ekL2Cj5v1y9uqbCbO3a4DTsVtdxkAe4RociHjjooV5TvPK4v2kkpNOccetmkeFW1eWDsC22/ZibAbBB7bS4MuEi2ZuWhGVe30qjr4PYGd72UPqeAz6PAedYlKqje//Bpdx/89rfU/eV88MO652QgcjB6LCviWIBU01Byn3W2K4VXUS7Xiaz+Fi6NxGM0azibF+8MxpXlyD26ITP1P7tW/3ATIfhMUDbyNUF3E+scHMVSSMoKRY1GK0TDuJhmrpWvWflBkZu63zAbYI5QBYaNqsSOMmVoZowtYqMkU1aUILY5h/GRb8wJmQWduHXBn5/WcW+hsn/VVJxpxcp7D/8j/+tl8w6NBbSPZbMG8IjS3O7wP6hZkQkNofOy+SFTox2jXM74I/jMW537Piy8ZvchX3+rex5foZi7mRLCwQSVsNUYKTsQGtnd/Lsah0cr3fVhbi6rFm75SPhl/cE5GLuNjeswHcTMKz/Y5RRuMjR52YS2ceagGqKmzKE5UsdMmkmJ01xWnTo96pXcxH7DbIA5Ql0w02yVoLhlwM4M2Us4amWulU0Q29yF8fFGS7RkUOSl7nXmwbzSjorrwlMzeOGzC/JYtgzc8sTYF6xx7XXBFH74z8yGhr22ttNOmAjvV9IenuvqVg7q+sN501RgB+bnJQXjtOzMZzJ6WdkG9ENQfyUPcY8GvTaAtCm4mvKZGaPo/cjrnB+QXYIjykolcLzLn66ru9AkL83Oq/3BU2if+XVRnYkCITaBjmCZpEkpdODGIRGMwi4Rtlrzm4hb/zAdiO1DmbJYKSleJSBRWX/iLDhTqg4RsqKEzHRo2OG0a3u0GY0FfClBFT8Urq+q8YRpYIRLMako1kdAcNDE5Fcc9UvQjDK0myQ3uc/IK58aMGOknr9jRuxrPxA7REdETezKmQQdbOTuxKnjF5N1YW1JsNTArZwc7vbTWDVdq6b5YdNSuu5o33eqZao7s/MlgNSnjw6ZvXVf1msDTbO6ixjcPWXjNHwJ1EAn0EgwYmSOzYkyHYC8SucMCeujzJLGXJpbqSOdcNbCEQtli6QsyYd3ZWTCb4ltSbYA/UDIgA31Xm51bRZFm/0IdOwxYxxcPEGyJdgHYAZcYe9xXBLmyTyrF+b06xJqjbI0qsEDcPZNVbjPrRXSrVrgwxa1PHXpwpneLKbDUVGMBB8p11W3WPglxXs5WLQFrC1eY/0oMdMsfFAeJhYXudgCDSjAl1fBh2yRslKiRi0z+bSSS/8A1sd+Fh39OIPSoan3uqpF20KtbqV5c5DITLMslWCfmjAb2TEDSGwUdZQndZkU29wV2NztLp1pi+R08tbEXidzZa7UFfabUEm+ctkzgjMq1gAZNBTP63j3zATY5YTbpQrOsxXahgYY8L1cbm+ad1on1WbSOKUawjfCU2/TUTo0db9hNmTmqFEDZqpUqY/uLDf2sYAZEGKjIiWmoiQfgY5t7jC+IrCT8PVhHjp5a6HXKQ2y1kXUmsrVpa1l8MVt7eTTpuqCeSLFDq3ebuj227Nqe1dt3zs7eH0q12alhM6JdI8prpcMLSkRNGAER4zNiT3NTADyx3MWupzEyIAFOmLLXJorZR2EPZwRGLItCU2Hoe2z4pkH5SqEOLjHEYacJMXZ58qIuNjX8jAbhvZw+sFtHiDYtesWD3XF2z9w8SA3XvaBQDiMb85pODp34fofHtYmpL2WGOqrV9AYxQwMHyqTXuxX98vt/dm+8K+Vcfl28Srbp5t6qrutSSG7rErA/R77APteavyo+iCB+fM1lpqGfycqpQIPeISjHs1H+7F69PJzzFAqkDSLzohO3jrodaZgq1SRcSOVGvvMg7+X0l9TaoAMxilMB47P+IOruMa5yt0cDzBVtMtKBCI9z2e0R+BNjU8L1k+ck0YLYjbinBOOB9peElE6DHWfFc8MnkgFsO54jxCUSGLMgBgbkdhpeW5sEOfhjAOlIQnO7qoaEU2zZbaf6FBVwcM5DZO39BQWJ692CZNTVYqY5PlhXW163bX6Df7ahP3+xZP85Me+D7IYnq94wSw7adOSOjS53zAbYI5QF4yXtz5+zr+QeSADlmhj5TlN+7y7N+MPtthcYybrDK84PGZuzIBdbNSeeVCuSOqR2eo0UQdzWf4D5+Fx9rkaRF3Ma/NGu1WI5q5UmdsaDjCoYgYcMFEH82Ae1ANDD9l/KDX9IgUGUoNG0QOhETFNO9EZcqavoByAt8zw1a/h61D+uVGp5qT0FbwNHvOk+TGGlR551eQIEvwwmYkU/hUVKklN3IjTwFu3pA5D7rfMEUqBpFYxKf96areqHss2Qc9BBpTQUWW7wjSh1nDzYEteeln29tJ0OGwUYbJMUqWYq2hXoVmpr4S5cTZTL/q1PMwGcaeonhByQMkIlmiB1lbRRommZMq/qiAn9G6165TtQd60pA5D7rfTQZczwZoTeaqqkrIF2o0MsNCG7TkeTy83O9zsmkJszq7CiZK92osZEGAjUmZoRmrM3C8T0acyMyhIJ3d96DPyiveyL6WP74y80lkZTp7Lu+C/X9N+AlVXA1pgRNvs2N03J4Dyx3MWTj0/WQ0ma6gm8fsh7Q8NmIL3u6c2c2W87NEYj3M5ugp1ycKTt+goHYa63zJHUhZkdYtJs3RVq5IQXY6YASvsOevvuKXgluJXd3puju+EY87zUds6yiH/QlGX3MxYd45GKSyHTDh2PZhwEfz+Hr2dfNnd1fpA3Tk09I4s3q4GX3wdp6JhOZ/qi1bEEfmuGlaK0xsGMORUiUoEni4xozqjfG5PQGPmHIjb/6+0iZMXGglM9tb82G5wy+vBIFRXKOIvq8kI5fuhQZ8loM13tNeVAGZgBmpqOf0o5epIJMt+c94hakARNEqe2VH3doVtbm/M1+pDaNzcpA5L3mvV3wzN8M3wDUxVI0YW8FXTKIgMoNBxNJOQmQ7NaDTVdCUj7HIsyTFfhRIbGzLCDBCwUSpTNCVVZrxVaC1V1rCRnTIHndx1od8wG8QcWTWYblxZbWAkh7UXpQaYYJR13CGVM4k118HTNTeQ7YCbQ+qwZP48018EfRkv1yGCMrg0iv2reHLP+BP+cspyyIAEHZOWR172GH7a6P3+vm/EbwszoAsb0TRbZlvtcOZ72855aIdOnpros+KZA3WKaWPo9nc7Da2pWANGYMTYnsjNDrf8+pVcLz2pw8ERC3PLXP5lhfK40Eo+FZJFovusmZ4SO0qEDNim7jPyird8IJ5cIBFX6tHv0HWi+8OyKWbACRtxNi/29ag/VJbM+X1VzjZoi06+a+H2BRZFufEyDwra/rDCZRd8c9/KteoWRYh9Wh552WNaL2yfz2UOYIodoAFVcETRLJlltcIteqc9RM3QPkqHoe6z4pmExlIOp/J+O3U5ueOd2XbLV5gBNDaCsdnysMvx2Fngex9Cd/ug1RXIESpTNCVN5q5S/G6xZcFH1jiuXegkgvuBXLl8mWv14+PmjNm6hQaYcJQ1vbIhly9zrT41N50eSdJTOiz16QeLBm68XC8I6ZWhANZEN4kSOifWfSLOx21NiTADEmxMWh55hQPvF4CJaNhdEuPsZhVEtMy22TG6gyh/PGdAXkHqVIcDIwbmlDk0RiHQwT3GYE8khQZMk/uMvOIZizDIwT22oFpO78paolluWEkD5aigYv6Qrld1s6rbH9IdRbi0exNs03U74JXthn6sYAYcsFFXypGsnP4GO/XMzPa8YNkDqiw7trR0cteNfjPtAbmD/i8A4MYlM68Lyy4oJRj7P9vxH3WZP4HSv6L+ycJk6IAR5Q5QGFg+ca1WYdzeBmUAt7RBHTa43y0XikaHOkjFqSr53bzJTQnOCSkDytSRFaZnYmZmdtngyv64ZOnRD0QzgKCNYylkKBdQnkeluakYt2ckGdpLZ7PrQRzH5to8VeCuVpWdykjnZaKessV6GCfZsq1oao3VaL537LMlwNIGddhg4TzHibxkk0aHGg25LIP9fhIkDMzHMB0cpqcZF40OMwosyX4j+LMF0HPTDAho41J2qERBasxNk6yz0cln7CdCF07uh4uew+ysnHAxj9bQeFWX21L0BEtCvWU362Vcy27bHa1bUz3R80YnQ8PSlK2bwA4dvN/cXQJ2qVamFXnUfuuWtvOglbOeNe4o9nOOthLVNn4G6aOwCxSBah6SsGnZ8TA4Tn6/A+V2l9WqHeZhOyKmNU675PdwSRK8x5S6uo2ubhvd3YOj8HuPVGXGm1tmVHWiefexVw2m0pJVbywhIZDhpTYLPp6FqHTnOUv6q7J9lMzqF4/5SLusRKU1/f36c4xtQ6dNb8xBNbt+EwCjAZo5bG5H6qKNmYpZg6zRgU27gliSC7QY3ZHlu/MxsoP7+V//I0GbNX3K4i76NW1c8u+n1xECkIcYdYTaUBe2FDld93sH2pnixKOOYdNxSLMrD/5cm0nMFiZsUTndsB5dabwT3sSpxWtk1CKNlARBnYh/3O6ePU/sbHcyMxf/v0ctGTMX4YdsZww70a11PIqFoK9uAMBOflcIe8Byxfmlr/xMMCs+ziFQuSXCbB2HiC8SJKHXAAmQ3p+y+LufM7kaGqfcyuefR0F/J88Tra/pnyh1QyYq1aSdoEUCAj8vADFP0P1mK6xGoU6wDfa5BeZq0nv71P3ra6E20AuBIKy/Npxp+rh0cel3wG/Ylc+Q2TFHyjOdR2EwjPyHAjEZR49Ep9RygKKncT2mg+I1nUzgDIxpKCpzFlwsx9xRz6/WjcYMpa5rZKi7dd8Ywc7yhBizv//jM6qZiqKIeY3lFhD9sonSk0us75VKBQtIYKibpfW42FbeT2HzeLBvTWBqFnjtJDvb14x/ia6Q0BciAmgvLYecb01hZ3M6zc1aZNtJxLSnYRF5F4jNhWODLzIMPKEVfJ5P4zn7ipAAzKO6mhnd1X16LWX4GfJ+K2OL8XT9lXcJnlJKMQ5NvSPPYtRvruFuzbHmJjgnIh6GwPZkxnFxchtZbrYOwTg3gCGwaEGE9QRADXhSEzALs1BOfw3duW99TPnbJnTGvbpDIiXseUs7femd/fqtlOUT0TkU9Gz6PWe0Zyt/g+LJdbvN+QY2MW5x6jVaB32uT530pvy2S6iemDa5LcMDHwaSYNoNJhrCE2t6uAo03QZXRSi/9uhiu8NJegJXM7VV9+ugiJuiuDIYnYRz7uB5lFv6+uf0B+vDRjfu7GqLxNqt8YOmOpSvR4WQiGf7SI3+yrY7o3oivUe2bDqVztpxqoURk80RIv2HSNN8+IIll5cTBJC5JHYbhtLb5knaW5xTH9BE5Z6a1WBfU+fBwU4MG8FiLFcykvosPeN5wid8woxwG9mTDG1jrH1CaFWwgvJDUmX/xU8uMZUdLSGVnSIZlZ0AX8alFNBiUAyKQTEoBsWgGDQPts/Zio355eyNEIs2tpugkFi0sd0MhcSije0WKCQWbWy3hkJi0cZ2GygkFm1st4VCYtHGdjsoJBZt7LlLgEJi0cZ2KygkFm1sN0IhsWhjuwkKiUUb281QSCza2G6BQmLRxnZrKCQWbWy3gUJi0cZ2WygkFm1st4NCYtHGnrsMKCQWbWy3gkJi0cZ2IxQSiza2m6CQWLSx3QyFxKKN7RYoJBZtbLeGQmLRxnYbKCQWbWy3hUJi0cZ2OygkFm3suSuAQmLRxnYrKCQWbWw3QiGxaGO7CQqJRRvbzVBILNrYboFCYtHGdmsoJBZtbLeBQmLRxnZbKCQWbWy3g0Ji0caeuxpQSCza2Nrg5WA41r1+1crHZnoZtJx1M7rUxQ/vPOGX3ZRF3DmBDt47kZqF4xPSXM0tDzQDP5iEG5zG11KSgLH1l3O7ivXy6/GXU36Pa/Y/PhRpcqK81K1muTJdeZFNqu18xWdYu0w3Xx+Sb3hkw0zfC3KRWpYxMsnO0Uh2Oo3WtPrd/R5wJ+jiLwMOfylY+EvwQnaNEbK3RAPZo7TvSx5t+xKHnX45ksdOFaJ+HLFjx0pQP6z+9MOKTz8q16bDqBv7YqSNnaFr7BlJ5th3sv0ndbXO8jE/X3Ce38aK8aWSEkjwntnE7w8PqV8Za0SBYjj8ypS5r8ywmt9e5Jh+S9PnB/YVCqNq7AxJY3eBML9tZZN+DC5jR0jLL2TKBZyckDD2uDRv7AqRWHfoIf0a6KaXKKLyW6IlfYSc/CbBJb/fBv30bc0hkl8KhfxC+OOXQh6/nAu8cYe1VVmmOoDB5L4MDvfd7zqdiW/Y9tfIfKpIXcYWkfm4V4llITBFqb5ljM/t0XjSYuT1td/TxzOhN1R/0wn3DWbvaz5fIj0UKhN6LFTsa2qd9jxvqs3Dv0FiQZN2rx7Nzzx1sWIy2yp8j4U7RB11t4n51N7F+vb2DbpyjrzhYfaBhl+vg8WHsz/Kk5zOa3XXPZ+eF3CkDm67nN013fuD5B/y/0M/uvo/KYSple2gZL6Yg76K/O9vyKvS5JYHjSN5eV/pH/WNyxRQnAYWLX5PeGGPtIZ6Yzzg8vb6cjcIqVCoUEi+MyTqENpDHlM0TUkn2BEgNIgVQdMgck7p21fkMulobjx33MV6Uzzg+/Tv5W4QUqFQkZB8b0hUHr5vLaZcEE2aVmpAqIi1QpOjKk8T35FF8iXipFjuQIOER0g0HnCdPy93g5CKhAqF5HtDonKbpP1sWE5T1xy4sbhrNLDMGsHKxqnNKZpML5VfBs2D4467WG/i8IDz+/vL3SCkAqGiIfm+kKjcMr5vDcKU23Bqc17rUWGTtUKTDVKVU/SNENZcp3jiNnucNaw3xQNu/flyNwipSKhQSL43JCoP37cWU/y5pzzwi4RQEWuFJkdVTsGQVy0PDHPm+3bcxXpTPODx+vFyNwipQKhgSL4zJCoP37cWU54I9jtFLQKhItYKTY6qPMUUNDluMNGU1+1Ig4RHSDQe8H77erkbhFQgVDQk3xcSldsk7GfHcgrOm5BW1PPRwDKLBCsbpzZndIaxH93WJ65fPV/qXiccCP1m34uE79GmZceq+8EqGVhVeJV+5ypVvd8chBG8hJxIXXkPsgd4lXZgtNqKccpRlXefAK0hyJN6pkXnEfZdBnKx3vhjLv/QfP0j8/WPz9c/Ol8l3xsS1YbvWItvRPMMTM4up/Q/2ut/ty+zZwMvH8wBqRY/l7ov+mRRHYOuP30eOZ5b1T9nxfv/3PiNr45IE+3zSg6N1ytd9+ucu/uQx8yhqv29Eduxz6HLbFCg5DH/iK4adCRLSg9nFT+mvYcc2FI2eJtg+89iShZYUU9qEqKK97pWElw+KVXlaXpzhlEU532CV8cgc/GpEtuDWG7JEDFT8/Li5W2gXNzAdImLW+8k/CZOxCMwNjDgmsLNxqzN08Ble1n2SOi5W5eB9gyPkGLnv025FV4oXE3DKwdoA+Hi+khcLE4TsmLE1lOLsUGsKdwctXltWfr4PS3U+fiYaoWbtWT6pPY4lleUiHJoABUqF+wEFfTVZmYU7RC4/F0XOn3+WkeJ0d8CDox8IuiU08IknugKM4ww6TxbelrwxwuBJ1NpfVXR1TvYmouv+UvH1+dry9X3vselbaa91X1DdyDUxNvB4ZFPEZ3yatD4ZvROanz9F3xCj7c//rr6ueZcRk8NUvPTghc/JXgbJC5x21OB9rLHpSlwofGO5QFvEOt6GDS1fM7LlftR1fUWH5pIie9ifD1qII+nWme1MxQxL5LnxZmXvFy8PMfWrkDb3c3h/9Jhujd7uhfVuIW3ACPJjqJfPeWTlnpK3Sv0dVbxughNab9b+Mq/ydd7l+TJATw585QXjafn2C+JW32PO/BLUPiqurn1jAYngRU+DBraP+epIZsOrGSwhyby6qqNr8cD5J9+R8/BVUJ8lZ5fvfg1f7n49fna1Pja4w7/sniKeSrnpI0GJ4H1PiRydMpr7BnCl36c8/Gx2tXAUwCfRR84iOWWDFF2Nd2s0Bbb0GbiFnbPe9fAXuLuXK3lgfTRwN4LiztbuUPePTK1u0oda1IlltsWz6/G/rdY3t1PeEmGQKkgIel3opGqgQFtPxmKKavTnAgib0aF0VYMULZMVZ4Jx1zdE5o4vROLzTJqviT2GJZbqswnizElK87KuwAx1zaxle9RA3iaGzq1DKrM0cBiq4k1m7E2v6tNQqozigZ70cgU9WfF5CjscSyvKAHf0IAYh4KccydgHfTVJkYMjf9lK1mU1uI6R4293wCOinwOaJR/yeI2bb/C9C3+9/LY/erNVn/+FVrvsbgUxNoSUkuruJXVAXBJ18C62meOZQrMOcuCG4vRwJRrBKuBo3KeRv3IxRpR4snkmYEmCo+Q+Oi3h7CzJGIlLSsvXt6EStJ6cyUWhu4Kt9EWwm05Coy2okCzAWvz7tFd5kXJKc89huMLn954/a+xvBcQRtIxPirKRg2Ai2QdLKa9ZUCmLI0sn70eGg1stTqYGhgn54w59U5nNddri/PGWka9Kb7CM7++fbkbbFKRTcU2yXduErXYtIcsptSYj+d70QKhQawImgbWyDnDGgkfjMN9KrjQ2It6U+iP9TNjMA1iISkGYsWpqAehkbKFcbT/LGakVnANWBiiBrFg4BrYKuc13lZdGBvQ+/iYl4mbbPCUY+uXgeVVLWIZWgDTXJxt7kWMQ0e1RfdSNPiXoXAmikruHCX2fTs4JLL5e+RPXrhTdX/V9a8xH/xTy/vMObQex/KKEp8OvIFvXnzLXzS+PV/rNxE0zndxx7Kc7gYZJSZ/o6Bf4vicU7q6RFs8TZ/HocEex9OJrEewfKhBhpWUW1VFTeo9BJGUPYyp/edfTeG6cKmQWh8N7Ll04LKnqvLHrEL7HeSFyq/HIuPmwlMHrF8CltekhFzoIABzcY6hFeAMDQ3MGHj5r4rrl8/MNKZq+qqBMdcaejZybd79zCH8iYO/6YJVfOEzh6v/LZZ39wNykgFcKsxI+r1gpOphQO0nQzGFtUj0oFFjNDDdugBqYJacMyAPFLzm+KdbDY21iXpT/Amfpx7dD0IyEioY0u8NqXqE9pPFlDcVbPIyJlA0iHUB1CByXgJDXVxF3tsnb3KoWfhMn+oxLLdUmU8WY0penJV1AWKmrbdVImIATwNq2yJDr+5oYLHVxJrNWJvXnl3T0vX0+fjQAY0atGjeP/Uolps6RNfl+OaVb6iP3FzdwLqMnGG/es/ljSUaGQ1svc4HQzZ8p7y7dagSvBnXJ3/LsdX5/F7qASwfSghBKRk8L85NLQCZhD2Mqz1ncKaoMtcrApYaDQy5Usg62Cvn9wn00IKv58gvHzTjhuIT+aiHsNwQIVLSspsXv3kTuklab7HEwtCdBq63MofY49HAbusINBuwNr+L1kDa41wa+aVEaKNsGB4hxfOfDpXMTALASzrGSoU5qQEwkqzabmmfW5xmPTe3rzYuogaxXuCyrWrzNCEN1Z4neE8RB42++COkeP69GNqzSgFWCemq4qs6wCpdk9X3nMVpdNFtLTptgGoQq4YvW6w27+7DonSnLO2Jm3NuLjw1d3oMyy1VJpTFmJIVJ+VdgJZry+3mFAzXlGcgZxG6lqOBxdYOYgPT5byGHXqZhTguHx+gRzHrDZ6SNz2A5UMJoyclTBVMbwEpYQ/T5b1oAC/BiWrPNDh8NDDjAmLNNuyQl3gseLjab+HpiZ+hlsyPk0K/m3k7bxKxm7Ts5sVv3oRukva45T1qcYkpvkzB8DaYDWIxEWerdsi787Js2lwLnU0rHWtP9SZi+sPDzlfXkKuk+OrFr+oBVyl7mFH7zxBNuZZrnm0bHA1Mt17gGlgs5/eaDjmJvIoY+aXfadxcfHKt9CiWmzrGzOSUmxdjl/sQP1PXWy/RMZin2T570mIEOhrYcGURZ5PW5nVLCNht+qJ8fEwPyH1bMd9OegzLLVXmm8V08+Kbd5HNtOXGRayM86UxyxQweAJHA0svLf28NspLrEQj3tWFekoAqMDaaKaN9CCWWzKG1tVs9coraSOri3tYO+9eY3sJ00A+PTS60cDOS0s8R4u8+zF1JSrrexO5o9y7eFZ99DCW20KG0PX45gVvuRHdXF5vXediAKdgr5IQ2saMBgZdTawNrjlnvLEwzcft89+iYy2p3hTgP7IvCi8WrsfhBSM3onB5kxAXAzgj5UlFzZaMBpfVxNogcn5jel6hdCIO7X4p1iLz5+gpdNGDWG7JCFNX79/2FN28DWwurjfoTkrG9mdOqFqa/zjN8dZdXeJ0rc9zR86Uosbg+/h4nZD6ePAkmuhBLLdkGOum5uHFw9tobOJ6G+9jZNdLcXHIdDApgh1/XVzc9Fqfnw2wesCfJHxGXohbeNfjhCD/LSnZ6gsLVGgAlYpW7gQV9NW1j5rFpbIWivYWA1CPj+U+AKDN6/P6NWuGZhkWHx+Ys3G3j59aCz2M5baQMXc9vnrBa25EV5fX2x3RM/KXbj809QK+HCXmX/Pjga/1eSZPvBlFjHolw98g3/NpdNAjWD7SMKSbFNP04iC3HsRwU9abOVEwaKc0U6nizKke4y27mCjH+5DnhO/5amZ15r8/sen4hBjof43lvQDw2XQ0t+K5NYDcZOXm8v1sQD6F+rNzvR5LlRhqtTCNNw7P7322vkhi2TnI6560uIvGT4B/HsHykYaR26S4tuLlPag2Zb3VEB9je+m2azYKq6ZRYshVJc5dW5+X9jkzvhme8PxB00Ajk4cLgf8bP/OKEkL2Bo7aiwLPnQy76+vNjhg6/yvfrQ1d2Z1RcnkDOCrACaE+7750bcuxqjax5Yndz2e6Pf9rLO8FwNibjvp5K27jrQGQ2mTlpvX9bECmUwjrbnGIjOF2XC1M413Ec0bTtcZKW85Md461zNYbgkxfeX6kYUw2Ka6teHkPqk1ZbyLb8x5TRQZBNkBpEY2PBQQ33lY876000UrxKGejOgdftt4QO6emO9/dD7hsMsRkK85j0wMWm6raPr6HLabCPkLXp+aMYnysE6DxNuE5Awctt97qPp/HM/BivSHAf4hwPtIwHpsUM9mKc/EexGZT1tvH97wjmvmEuKBVgsb4y/qBG28rnnfvMHOudCaeFeIceLHeEOg/3kg3VICRi+nNi9+8i9xcW20xp+C4ZnpoA6xx3Bh/WUuI4+3GcwrOgJXpLsXPZzkZe9l6Q+z9LxTRewEgtOkonK04l60BINlk5Yby/ewxk5LLyGODgYyP1cI03jI8fyLd2pxEwfmw4k8IeITPDW8exHJDRpC4moPx4ni8DUFyMfdTWPDsx+bnsX3vQjQzpcvJAEb6T3yzsjC562pX8+fS2VLNg6x34jEA8LIhGUFGz0LORc1LzEELm25DXteEx4+BVepdXnzT6Ovu4+3I4A7eoNwfBKsgDmMnfOz1Vnn6gxIGMclAzEFjVvOoi0fdRmMWB8UDmlXSHTd1jgVmHLMw/cFz8TRl5iFuIX5sw50XRpDRs5BzUfMSc9DiptuOVyIz8WNgDfGheondrruPtCODO3iDcn8QPJe33674JzB2GuCzoZlzVDcZc6GYlTTmwlG3kJiFOW95d/vrH9aoADVodqDGkQcMubNd6plEzEPdW5mXd/u+o7uc0HI6mIyDio8IpYGM0/+LU5o43lXyrzgUinZpzCMIOjLftuSe8cGqzvTjfthuYD7/iPlxsLxOw+DOUkx4Lo657kGsZ2XOm8advn9bpdgyN8xk+8ZxyA3ZtGHqmbnLg8wbVHiNWsBjgBSgxAlZ6BjJYCrcR/2/QLGJg16pJMIZWtH3YY8j/NiO25Lzj9tdg8kshuzCPuhsn+WHQbwAuA5AX/agQ0EXOC5AMzhIREvOG92dfgmrJKZHRO3IME4N2MnbbG/CSV3LQ7xrTmk8rFZ32NxhcaO9vdZuYWufpU123pyX1zDyY2athgJBnC73B5mP4SOJnyG2KPfvNB66ZqfGZ3h0guGTa5Zz0dtcokSBFlaqQIFeUKIj5V2InX7iVTInXoEaER0nA9763NAq0TRS5cEmeXGNN93gbe5rg6d9fvZ62e9jm4c9/t2c15ky8mNljYa5LZ7o8dniqD2C+Blhe3L+gxD4njtXYD4NP6OAaZLKo/kPo/CdY24DgpPe6c+zVm5FUHVm5GccPc75+7j735fY+c9Tv21YQzOYwLZicb1gXk+PPC7bah3bajnbRPGt7mNbpWYu/1r030NbYx7/gJlPrD+xWvuojrGWmRjfe+F+jyu7WJXcQ5vnL5iabs3B9vkSH0zgaxysT2999PG6upcxfKB/s4RO1wOtaf9BaO3q4djvj1miXcKlikIyykuOoaaUxMjrTkRhGedlak7JlEwRmeQVakkplEJRmeZVak2pGuq+WoSILVC/zF9L/+4wn8PsiSHww4aQOH45syIvfAtkfCPEBlCBRAx4uJMSRQyOTBQKGRUL5gJHHo6RdzTE02oVzCVhXSAfTi+ZRik2QrpA1m/SXsYCzsgQ2QUmXoog04JiRkSAF8hOCc7CZkTJpM0LPJqHDZ2wzcBke4H8XwoSg4bssKCkYPI/yAVSXZZA5V/g0hGCP+DB0KEoQRQlF83H+IWFeLjKP4z1VZghmwyZVFqpVZg1v2SCgblTA/ZcUqyWr+WBga4N3OhwjWevbYod/S4bFcUB6yXpxkOoRNn9q+ay47Ds0Zo8+ejy3q/D5gyWkCsspPOHyorSFDcmrCPAdRz2flubdiHoygbNERExBjbDjQl2gMTVe7+G3R4RxhFk3dc8zE61npBaWHEkawy0t5rhJUHlZAojyu73ouVV617p7DD0+u7vr17IS9+jKKpNZ3gkNgZ8iMDvoGqxq/V89XQtAebZNGKB/PArqu4Qv5avU+9VR03nrKGE7hv2VbHQdlFsz1AAhHYATambFu2+gMut7wHjYxGMYqenLIrIwOejynLVI6BYEKnMlYD+a6loSSYDuZAl3RxnI/KhZMdhCN7SPfOhCcq8lnwZv+ioNnJkMokzA/neZqmsCW2NGOlm4Oh3/FC9YTZlZyAfgP/1FBClG558VaCBfAPUU0djyE33GarYFTlyyNfHzB4qlocGckUd4DjQuFfzaEcDOf9JGxnI5QXLLqQko1CJ0zOkikbl89I/+WnjNvsur9MHpwm/492LEm2G8t3ZW0/OZgEy1zNpSgP5St+7SdOSteA0kGvqx6nlXopnqBg1kK+egb3jY5AMxX7FY4wfM0Qz7B5xsdsTc1zBpTIrJlRCO4DGd51rlW26RdBWNv3GFbbeW98BzQCDFypofZe0dgOPdJEBne85t/WxB3j+BzrfI521aVKIq8XC7nwecJ9E9L01yuonHr0cIYuqHvB0uXbK+EkfQyKyTkFRuXBgRxGsWmy1QiZDiU7m2O8o+SzW3iQNlcdyE/+BaljxKLZmHCqhr2xAI1/CPIrH8QtPi1OZk7/Wat8sFWDLwqXtMdeHlAFjexGkwqPkThX1F8i2Ec47imtPlSlp7d3borElJsSjNMFVVZKvZEG2ncKWR3GK85Z0TdAE8uBAL56ZhlR6lHzlA0UE8SQkCksk8U+G0OhMMBeMHMNm9JQDjlbgHTlTPUY+Sr5LSe8GTZdpk3WPkp+6E9Cgnu0m0+5UusEQytlItoWnjLgPolEfTc5fM30094XX1pXMqMyOb4PNwqx57F8cfUVNJmsvq+WkxUpl3KzUpkVN24yeaW+2q7bL399cd75oFUS5FwKJoNh93vQ3Rq34CrD1+qRQLZ8Q6PYJQS2fJuTN5/WE0N6cFKaVE8K6c0K4Vk5T1Zsv6wmpvD0psdUTktw9IbnV06S+ek0xD/iphz+5m213gHLqhcATOD7S9GmaPR8tHs0wedxZ13cX3qCQWLSx3QiFxKKN7SYoJBZtbDdDIbFoY7sFColFG9ut8W8lXrjf3XXRWmut9T2wColFG/u6sxMA';
  if (compressed.length !== 300744 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758098) throw new Error('Invalid embedded sheet data length.');
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

  var VERSION = '0.6.32';
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
