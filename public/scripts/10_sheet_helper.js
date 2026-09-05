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
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="W5/fcQLn5gKf2XUbAiQ1XULX+TZz6ADToDsgqk6qVfeC0e4m6OO2wcQ1J76ZBVRV1fRkEsdu//62zQsFEZWSTCnMhcsQKlS2qOhuVYYMGCkV0fXWEoMFbESXrKEZ9wdUEsyw9g4bJlEt1Y6oVMxMRTEVbCIwZzJzboK5j8m4YH02qgXYhv1V+PM435sLVxyHJihaJREEhZGqL03txGFQLm76caGO/ovxKvzCby/3vMTtX/459f0igi7WutnKiMQ6wODSoRh/8Lx1V3Q99MvKtwB6bHdERYRY0hStJoMjNeTsNX7bn+Y7e4EQ3bf8xBc7L0BsyfFPK43dGSXpL6clYC/I328h54/VYrQ5i0648FgbGtl837svJ35L3Mot/+nPlNpWgKx1gGXQYqX6n+bbZ7wuyCHKcUok12Xjqub7NXZGzqBx0SD+uziNf87t7ve42jxSKQoW3nyxVrWIGlFShhCKxjpZZ5MeGna0+lBkk+kaN8F9qFBAFgEogyMBdcX/T1W/WnMOi/7ycWUQloEBKGeC48MkiwqJkJO+12eQiOFHMmck6q/IjWW3RZlany23TBm+cNr/84/oi5GGmGBZWrZ6j+zykVozz5fT/QH/Da6WTbZYYPynVNO7kxzuNN2kxKKWche5WveitPKAecB8YcAHz/+zXLjcLzkdDSktNIDwZE9J9X+tto43oJy65wApM3mDzYtCwX9lM+N5VR3kXYo0Z3t0TtXfgBFg7gU8oN0Dgl7fZlUbhNll+0uuohRVKjrEd8egrSndy5/Tgd2gqjA4CAVuC7ESUmL3DZoGnfhQV8uwnpi8EGvAVVsowNRxPudck7+oqAUDkwZopWqFnW1riss0t1z6iCISVKreYGNvQcXv+1L9+jbP8cd/dPUiqBso2q+7ZyFBvENCkkVr44iyPbtOoOoCecWsiuqMSML5lv+vN5MzUr+Dnh73G7Q1YnRYJVYXHRJaNAOByiaK6CusgFdBPE40r0rvqXV7tksKO2DrHYXBTv8P5ysqxEx8VDXUDDqkPH6NNOV/a2WH8zlkXRELSa8P+heNyJBBP7PgsG1EtWtNef6/i+lcayzQwQCsduidpbKfhWUDgAEmyhGu/zVTacI6RS0zTABrOYueemnVa19u9fT23N/Ta6RvTpof5DWygqreCqrDAgM4LID1+1T/taU6yTFVLqXOv+/MuQOFnaF8vLMKD7tKWDoBdALgxF33zQccCcdHx8fKIVdW69O7qHtXpeGr9jbbpFA+qRMWr5hp0s67FPc7HAiLV0g0/peZlW7hJPYEhZyhpSwahnf93/tZgfqZWXFdmdXBzqxGHLrQKxoAY6fRoBhgCRPmmGueYZ5JexTVDKUIXzkG/fqp/0U3hAgQdJ9zumutK6nqWbaqvm1pgu03IYR+G+8s0jDBBz8cApZFSBeuWasyqo2OMDKAZCozS+GWSvL/HsE9rHxooe17U3s/lTE+VZAk4j3dp6uIGaC0JMiqR5CUsabPyM0dOYDR7Ea7ip4USZlya38YfPtvrX/tBlhHilj55nZ1nfN24AOAi9BVtz/Mbn8AEDJCqJgsVUa6nQnSxv2Fs7l/NlCzpfYEjmPrNyib/+t0ei2eEMjvNhLkHCZlci4WhBe7ePZTmzYqlY9+1pxtS4GB+5lM1BHT9tS270EWUDYFq1I0yY/fNiAk4bk9yBgmef/f2k6AlYQZHsNFnW8wBQxCd68iWv7/35bXfz3JZmfGligWAKRjIs3IpzxQ27vAglHSiOzCYzJ9L9A1CdiyFvyR66ucA4jKifu5ehwER26yV7HjKqn5Mfozo7Coxxt8LWWPT47BeMxX8p0Pjb7hZn+6bw7z3Lw+7653j5sI8CLu5kThpMlj1m4c2ch3jGcP1FsT13vuK3qjecKTZk2kHcOZY40UX+qdaxstZqsqQqgXz+QGF99ZJLqr3VYu4aecl1Ab5GmqS8k/GV5b95zxQ5d4EfXUJ6kTS/CXF/aiqKDOT1T7Jz5z0PwDUcwr9clLN1OJGCiKfqvah+h3XzrBOiLOW8wvn8gW6qE8vPxi+Efv+UH55T7PQFVMh6cZ1pZQlzJpKZ7P7uWvwPGJ6DTlR6wbyj3Iv2HyefnRo/dv7dNx+qaa0N38iBsR++Uil7Wd4afwDNsrzDAK4fXZwvEY/jdKuIKXlfrQd2C39dW7ntnRbIp9OtGy9pPBn/V2ASoi/2UJZfS+xuGLH8bnLuPlzdTNS6zdyk8Dt/h6sfOW5myxh1f+zf3zZ3MX/mO9cQPp5pOx967ZA6/pqHvclNfnUFF+rq+Vd7alKr6KWPcIDhpn6v2K6NlUu6LrKo8b/pYpU/Gazfvtwhn7tEOUuXht5rUJdSf6sLjYf0VTYDgwJ81yaqKTUYej/tbHckSRb/HZicwGJqh1mAHB/IuNs9dc9yuvF3D5Xocm3elWFdq5oEy70dYFit79yaLiNjPj5UUcVmZUVhQEhW5V2Z6Cm4HVH/R8qlamRYwBileuh07CbEce3TXa2JmXWBf+ozt319psboobeZhVnwhMZzOeQJzhpTDbP71Tv8HuZxxUI/+ma3XW6DFDDs4+qmpERwHGBd2edxwUKlODRdUWZ/g0GOezrbzOZauFMai4QU6GVHV6aPNBiBndHSsV4IzpvUiiYyg6OyyrL4Dj5q/Lw3N5kAwftEVl9rNd7Jk5PDij2hTH6wIXnsyXkKePxbmHYgC8A6an5Fob/KH5GtC0l4eFso+VpxedtJHdHpNm+Bvy4C79yVOkrZsLrQ3OHCeB0Ra+kBIRldUGlDCEmq2RwXnfyh6Dz+alk6eftI2n6sastRrGwbwszBeDRS/Fa/KwRJkCzTsLr/JCs5hOPE/MPLYdZ1F1fv7D+VmysX6NpOC8aU9F4Qs6HvDyUy9PvFGDKZ/P5101TYHFl8pjj6wm/qyS75etZhhfg0UEL4OYmHk6m6dO192AzoIyPSV9QedDA4Ml23rRbqxMPMxf7FJnDc5FTElVS/PyqgePzmwVZ26NWhRDQ+oaT7ly7ell4s3DypS1s0g+tOr7XHrrkZj9+x/mJBttrLx98lFIaRZzHz4aC7r52/JQ4VjHahY2/YVXZn/QC2ztQb/sY3uRlyc5vQS8nLPGT/n27495i8HPA152z7Fh5aFpyn1GPJKHuPL8Iw94DuW3KjkURAWZXn4EQy89xiKEHN1mk/tkM4gYDBxwNoYvRfE6LFqsxWJtPrDGbsnLMap3Ka3MUoytW0cvieozOmdERmhcqzG+3HmZv2yZeiIeQTKGdRT4HHNxekm1tY+/n06rGmFleqLscSERzctTKM6G9P0Pc1RmVvrascIxaO1CQCiYPE15bD7c3xSeW7gXxYjgxcrUlcbIvO0r+Yplhx0kTt3qafDOmFyMjgGxXu73rddMHpV1wMubyAGcf/v5dLr5P72Ta9lBF+fzMJrMycwv+9vnU3ANIl1cH9tfW7af8u0/HG0vV47jNFXzFTtaha1xvze/s8KMtCYucXc1nzfd/MQydUXn/b72RBt5wO/3jRcMH9BdhC/yctKBIveRYPrNpDWqBsO8VMmP+WvRaOcA4zRMR1PvSoO92rS7pYEv+fZfEfTMzEdM+6X5tLlyxExhqLRkms5EuLovLfx66de5fL2/yX02H52FPVwahrPqmN/E0oVXnsCKhbi/yRxX83nRbUKWhzYceXOntfuXn51NszJ6MO73pQf5Pl4in3ec4JU8hF7ppV34+mm9r1LY0ee/i1O1wpd8+zfLztE0cqBxggiBi5Bu95v9l3r9r/U5hweLn+TbfxowrWDqdJauKd8+q/dH8sbPkc9ttuyO94f7/XK/nHX46MPFLEb5qQlNPvhJ50/59t9ft3LXu7uVaWaO2bDrDCnRSzZyWvFKxO1+vT8MwwunR3bX0CkfPjqb4K9O19tn5X50PvmYpEwHtiW9WtzuV/s76B1zvLLNkViNd8ySxIl/3orfqP90TyTGaf7/rx8jQzeHJXdmh/N6YDvbvmTBwCdxfEQ1NcL6wNMdSIXNq7b1EUzRy1/Axsyk5p22GMG1b+GxFgbHErZh92wuvco0AuOLXct9hvw2nw/LqIcDRRmJmmZzcgUa7JpM/WV/S9IUfbF56TL2orzqwebdRD8nIYNJ41D/hz37Fo11p2Y21wzPcn713qVGhqtevStYfGH4n69OEJtPvbbLYWvscDqc3Hgnu166+tAyLnxrX0Y5zoYjV++1sI7t5kMr02KT/+uwtkc+rZLOf/qn/s3nYCf13Dg8/sB2diJgjGqjQ+TLhxbzyue2Ob7X6/9lUwW7a+lbznHzOYy8LKW1C/uRPbQY3KW/0gO9LXunHLvPL97afba9bFtc9hmz7GAttjVYlCvQAiOwAk/gC5+hkLEs6tr3AZKxLJtOEwk2dLxTYWsIB/j/ToWtIWzo906FrSG8iaqqqqqqiIiIiAgzMzMzNz+AyK+01/zi8n8S+Y1MjoRaQ80WU/G8MBlO+53VPXANrWm4wzGUVZUjjBJZVdhpcfkjsmcWaO+UEldXi1e+zq+HOsCpknYshuh8pOLISJun7TN0EIGW2xTnlOImeecnoGW4raxe2G1T3HEvfYUYMhG+gAFOAwh5nK8mZhwJMmN7r224QVsNFvZ87Z0qatvknklyPDK3Hy45PgVKXji52Wen4d4PlFVVYGnNap+fSpFbK90rYnhUc6n91Q3AY9E0tJOFrcfZtm/491XbcG/jsViUPPX76qmeuiz+qY1Hk7/1VPM405zWVuoheLUimpWYdVzCmUdKHebMdzgrYrb8mL2eeLSnRWHdonfZa8RsOU9F37w+591l5FLYHiOqWeHtE/lWrBHcRKp3uhtr8yXm8LU/5ms+NM6ZKsqu90cFZ4o58+k4rdrtB97NADFbwmEG7lXqvirhOTOqU14xuUF2myIjURcPHrPOQ4lmM3PeMg7bUuk0nnZi67bXsU6H8lhqIo8TaOrEafCO1ARK9PjC0QOoq2BxmMdgYB9G/lIb9++fqNJ2s7BHGFyBNmZAR8J3KCo012ikaSP8BCrf6VI0X5xdnbhHIO+B5rbOyB54zXkzfObyJ4ecwxfqBJMLFc7m59rNcw7hoHnFZ0b00zee+gTqvjm61Pb4xn0kcDX4jvHM0rBXZypG3DCKnD/Waa/ZtHmtFPgO5eETx+k7RrVg3aSwm2YoNXnCs3XPQDhNn+Fia6IlOOuIG6VJH7TP6ava26ehKHQa2T4N0tcZ9dPCGo3ZdnNltsHQbeYt5vPnJezV/cAeNypdml1vCHI8M81nSRP5Qi2+mI8v/sxiZru9187nRtp3f/42NemcONa+4eVC3PCZzc88aZh851CqSsshe70uPxeN/dmYwlwb3trwMrN1Gq8jbnApcVDx/yDPeYs5/7r62tsQ6lLg+DiFXTEhzR9dHqv0iT4tgj825W+H3XiRUNUZT2kR9Ri0+lp+UM3iQtS8uOE23Ly4KYtvqH13jghUntJRAewuzNLDXp8RxdcaA3cMY6TO2IeSFRXezeWIjCqyhsUdMYuCgYTZSKpBype1zRfq8FshvfBPc6BAQWl7/QxIDp3VGo1J3vn42OEs3qznws+YLRXbymyB19a9XBx6n/owcyxlEYyFWCi+kG9F+EyD/4yn80+agaZ9P7ay2Dny99aK2o91FkfEOY8hBwyfi5uwx2y5SaHmG+oq/zl1FX/8irOf8Y3vAcX/6uLP6A6nvMO24edSGPjQc827Rw2atX+z2bKq0CmW9mOtYnr5/AfDa1ZfPaXnKtlWborup7QYx+Or2uWb+N3N//2+yDcXMqIJdf55xl7/vsj4WoPPlxLxtVrkJ4w/tTe3mLdATOOYwxcq52w5Wxz5MbPdVs5O8/lhfE7dPj0bIiPQ3QV0iqm4m3YX8hRfc6jQ3fWepevMqUDJd86Z4vwM40CWHnn+WphsGHfieF02D3tmZvpWD+kBpNCFcLnZhcmmrhpGzzbdA+sQ1ar18OJD87IOKOFoRNznaHPNHUfUNhvY1iU+uhvEvpKHaUn3qK3exVVyX4joipp3um7FmYJWmA+WbIDshRpbVRx5/nqstCgy87FGbfVB8yDGCqS+2qCsnRwnSAN6zgzxfdB2nBT/vZ4/6uxb6oH8b4VBRxiIB93wLa47hG3w2SL/2Z27yOXJFwZpSJaBYyvajA7vRRYNKqljXKpt/CFD/tSMr18DKKbwB0xggBePatl1nki0yvqW5zchlyZmJ0OTxJ3D+fsYJs/mxYN5+Le5oagtcl+YsVvy8kSjI2YGvGjvmpkRS9W2dtXqWnVuxUhURm1lKtou/hdEq19VBp9OjGvHEQSmrpuf2R24mXGheil8KeiANY8fW1VERUfBImb64j12caBZmRViZHbeVMjCrPDg9A90IXrtnsYCuZtRQ0PyrKDjBNOsPfKsg1pA02gHlVr0OXiFhtp6nJqXVzcbfM0KnzC3ggOENPE9VBdmHKN6LYaijb4wXxJn5A0FSDF5j+h1ooZx885Jt3ZKzO5n7Z5WfNEOtyyPqQEnn7WLv5Fis3PdgMshjF1FRydbNyeBbyKI1oN1TRVrVK7kgsb/zjX4NDPIRMctVeaxVB38Vh1x5KbeJbU138AM5KzmZu3uny0ErygxiJF7GVXUrPzFxrlx1uFdAaZFDN9cvIb74qD9tzBMo7L7WIEYK+sla1DVMHpF0F7b3+Y6S+zjvLeDMCpapmJo1weBWuxKF3rOocih1gun4BoJh1kWnV/Jmiq6uOhK3VfKxEHEkafjLgK3oujaPzY6SXg8phhL4TNR1xvJd1Wa0aYFfPUMLrNBDCh4AuGRTbtKMc6Z1Udj8evY/ZpCuMAUefdo69DZUngoqE1P9A3PJfOf7WixCEj+Y6t7fYeHbbxUAoFV3M89cCKfma3fc1+jKRe7MFWEbQqEfyzO2x/wrO2VYH7iYdQ9BkPyI8/3kXBpLaCpU7eC0Yv/am/tEDu7HZpqg0EvHo0nf/R/gRzUWy33/HXMJQeu1GylKmOkXzlCfGFruAcPPhaGqZOtu19zsJ1SO2Jz4Ztth5cBX6mRQwWmDwryG9FUMlZzNckMdK+IoMJv1rOWnBamS2w2KHiaPMPLC15hCZm4KTpoZyj4E2TqC/P6r7/EhnDMhKicZZ1ZwxuC7DPzDGs53q8gXaI9kFTK+2LTq7bhwsTbrMV8Rsfua5lMS0FwbTitUVnVa1yTb5IX51mmYnUcP9wPr8Ji1tiYJeJV9GZTrQhF7vvdU2OTU42ogJ9FDwhmycI2LIg++03C6scYhUyUuMV5tkw6kGUoL+mjNC38+wMdWNljn6tGPpRES7veqrSn5TRuv+dh6JVL/iDHU1db4c9WK3++OrH3PqziF916UMUKn8G67nN60GfWiHrXYhUG3yVWmyYak59NHj8t1smG4UDiWz2rPHNrKnN4Zo1LBbr2/eF9YZ0n0blx2nG4X+EKFxvS3W28JESD+FWk61VCD3z/URGHiJl++7TdBwkCj6tGOH3qDb0QqcOF9Kzpj0HUb/KyFW3Yhj2VMKJqGZleFBH7vqvf7WqLC3XMuHV8q8a4sTFuxUtkD/6JIBvKaVjv96ndgruKZ1k/BHzqf2K9fLk7HGXANyLDd1vxkK/i055pnzl+zw6zLnwXlVYVtfmacJgEpRP1hbGgrYPVN6v2lG+idQNGmwcKXu/8xEj/P6qe/sB2WmwNp6pp8jaISMkwdleFXYK55NHWLTTbutSUqjBfDGWo/Yg918qQ+8BRZSAHZbfuNZz2O0sov1Ue4CWlVg3rFhM3Kljj9ksGd/NUhk4nH+a5UN2+1i8+NM3vRNp7uQ6sqexSCukEVlVZriHNqFi5rLm9TMWa4qm3idJqppQACol2l4VSuvWLfta4JcXy3bROPNbXOgdOhG47LC0CwW/dMlSx4Jf17aEU3yA1x9p+Yc0jupXgcMuYNku64iYOkGToVDuJvlbEKlJqsmiHbvNrIVZEH+yFdF8DbleZ6iNiWwMqvtMp/mSpwx5KxRrT9p3MAPTHGtMbfvdFhyj9vhaKcn3At8Lc16Ai+vBcSp1ztXi7rCJZx/ql7TXcclq6Q76UeKWDy9boS0WHIjUuWhPG8LBmW5y2rhuTpM5vsLt+HOLh1Yf0DqXa9tsfC+kaKt2htA0ai/L2i7RKoNjEwztkmRU0GfgW1TxUvPFhg0V7DdfWJk5gfrccpYv+MA9M0dkGTLECeYwUixRzjRFdmjG7zdZIl3XKB9YliNKI31lfa7i2JG5C8Ss+rHe0D7Z696/V3DEAOWHnQ9yNahMUl5kENWS6pHKKp2D1BaSrrHdE1w2qNxIztpXgUIrF0bm15YML4b6V1k+GpNysTahKMVrrS85lTVo9OGJ96I47eAy5rYWpRf/mIzeoYU1DKaQCTUVwrhHeyNoDqHel+lLxr9WKzhSYw7vrR6+V5q0pfi2k3L1zqkubY6rrd9ZLvSuWNf0uqnkY+FpTvFzSW9Fp0b9l8JA7THV9eCi/PY/SCZIUYx3BU2alj7Cm3VV6eYpios4b6WuNOJdYXUK3zTqj5CVG2FqYM4Z7CuIU0qO05XR0d71FHM0YhZmJmTRfLlXEumN82BGtzdX0S19t1e+bUieK8zRmqpa4Qc5TSjifmaQsY2ETLjhI36gMR1+7qpjdXXHiceUekfBaucHShAOiFXmv3sNmGQyU5iVgnoocuonQXEPTFwslHtS8R+A47StI9wj0iSrtbi5rMysczFiImsQ+bdFClnFjjpXXwMy6O7qfjOr8Fb0a7ODItisjnn3EQO16+ypd1cwyaAW5Yzxz5QknfMO7643fXW/I9y3U2xH27Oapqr56Z/tEzglj6IbT6HEHjopiXqeRbe5mQQvxtcbDOVverN0ZgMdzqRYRjaXtMRd56Q4cZSmdPvZJdSrhJ1D9zNXPqAEqPIavPdfubt5oke2kmv0dztIszSv2VYuoyf1UuopbsYb+uX9h6WpwjpgtZ6fNNawNJ4q8O3CFoSbioAaOSZMx2GYaPYB+rEb6qjQiNRFQ76TvwNFVKD+BhH9VhcKGsXzmMI7BptU/CNWolM7YzROvpFAntsiWJp6eR2d3GarcYShVYSUqhmYOWj5E96NK2WvmYNTeY7Zs4RUEdv9h9QT4EseKt6LzLrqEOs3hxAY1MaNWpSa6zZx8F3YOVeCYMS88W+CYHDuWe4yoc6YK+djDuEOrBR5lvh0r+Q9uM88lrjx9x9AtgpQVNE8r+3O6Gvw59D+kBF/UMXyhliYUtPjmvXGY6Dk3x+kEOW+GtdMVC4EZTqoS/jmR0P0LS75DOc/w2vnri97M4SdbZ8qeU7gg8DVbERkU5geaMQO3mYrSYyAngeUQqrN0C0/vsFmcgWNXNeidsTAj7/4MncJR0caaBUpbLK1yBCBNRjEv6KvuVSdpPnEMJdsRRtqJ+U8tN1gXA4ePHc6ZT0eviI73UOJF0fEZ8YaneAQqQdGphNvwM4nIqPnXxV0xA0fnCT+oAhJuyw/q8jO0y8CjSteZExwBpIN6SvNp6A5G/abi6egeND/1GTguhuNjaUbbnSbGd4L8937Ezm34Eyi6n1maeOBxh3PI0jzJDf5mh/BsLD7F2GOKvlA/5gtvxI3/eV4sLfKW5Wy+oio+es/u6T8UU+nsofy57Icb/JlZHPFtCgd/x+bwt3ZT+xXTtTtTrGAb4QehC6X9G+8YT+ozcLxDsdCjsuOqwPFnrdLYaFc92Ui0m4fr39lYmlCaqTit7G6O/3kWDkgtXjNH4BiEm/+jegQnihOtfffn33WxsFjhfMd48HT+f6o6X65j7XR8WLSHMFkxbvOYsrRsF1bowDuSQ18Mkxk4qz2zoGPL5fu9h2Hqmt1asl3Q3Yu3szOc+spiCmX4AETBM3pLoTYSp3sVxahyhL8eC4mPN9k2x3o0xkiixIzM3CZFzf5oR4mecQ5+ax2wCah3/crmnHoqR0+KMaOPxRif1oEFRFOO/kTPPmtww+NfMXxEK6gn6iU32U6fFruIz8Q4WgljtnaCVTBgWx7diUdshC9ZEa5yKpRBBeW12r/iNc/+EgNqmhswNB8SBoihHXeDF7rrWDLcmt3V8GYYN7pXRy4DZjj4DJuUBL5iC3DQAaoo4vkftqVTYRGLS3mHZ7gdmdTTqbgNN/PTdTCOTgXolc88MhXAEUMdX0iy1JMuk5wLsgeu0QUYlz2S4skTWwJz6pOm/8ihrmgGfFgri+ZWUK2gAPHgbWa8jaocdSuM4FJYoKicYX/ZSENkg9Q1ZzJfwScfVnR2DegOGwCvmogaWJCLQepv9WNlU6QgsmOwICquU28Mlk3d9W5E81lU/5Ez0LcX6lwKMWDNluNKfBDUy/phJgBcMnfkh9iRxrdOzgs08JdPB85Lwo+GUSb4t3nC+0byqMZtO2fQJ4U2zGIr49t/28qmmGv2RanDD7a3FEcdtutkW8twwwlUSpb8QalodddbBfNHKDQ828BdE7OBgFdiKYohLawFYqpybQoxATZrheLhdI7+0Zlu9Q1myRcd15r9UIm8K2LGJxqTegntqNVMKnf1a8zQiyUR1rxoqjiFxeHxqFcYUTHfDu7rhbWng6qOxOsI+5A1p9mRyEPdVkTlE24vY54W7bWc6jMgZvNXdfC9/9q7408KDsbdL7Utz7QFSDetz2picArzrdpL8OaCHC9V26RroemtDZ5yNM/KGkWMyTmfnInEvwtSD23UcFcjhaE3VKzkoaEMKGBft4XbIO6forTY1lmGQwVmKicBCiArDzE+1oIxE08fWeviIOD5TznqH+OoHadvoOP20drMPe5Irg3XBQziW2XDuHYzjqQQ4wySssjXUs5H+t3FWYMHppUnBHMx/nYIT5d7OmjDbgD9F6na3m4l7KdkeSO3kTEPXafiWinogag7b52taiZhL1TSvBFmEZafFq2H8khQaZXuitCewT5FBgVtPK0j4xUHPfUz3Q28eac1Z139DAP23dgki94EC8vbDPTQC97HPPSWjUNG5tWKMsaxAEMKC0665Xvo1Ntd07wCLNf8Q56mrEPVpCxlIMVlQlWRxM3oAfpgIc+8KC3rEXUog5g06vt7zgXY8grH7hhwVSaeuvC06YYRAwpbyk/Unzj9hLEZNs2oxPQB9yc+GnL6zTgq7rI++KDJwX2SP8Sd6YzTuw5lV/kU6eQxRD12omfQAW6caTR4LikYkBB1CMOrvgRr/VY75+NSB40Cni6bADAtaK+vyxVWpf9NeKJxN2KYQ8Q2xPB3K1s7fuhvWbr2XpgW044VD6DRs0qXoqKf1NFsaGvKJc47leUV3pppP/5VTKFhaGuol4Esfjf5zyCyUHmHthChcYh4hYLQF+AFWsuq4t0wJyWgdwQVOZiV0efRHPoK5+E1vjz9wTJmVkITC9oEstAsyZSgE/dbicwKr89YUxKZI+owD205Tm5lnnmDRuP/JnzxX3gMtlrcX0UesZdxyQqYQuEW4R51vmQ5xOZteUd8SJruMlTUzhtVw/Nq7eUBcqN2/HVotgfngif60yKEtoUx3WYOZlVJuJOh8u59fzSDPFYtQgqDUAGyGhQOAvKroXMcOYY0qjnStJR/G3aP+Jt1sLVlGV8POwr/6OGsqetnyF3TmTqZjENfnXh51oxe9qVUw2M78EzAJ+IM8lZ1MBPQ9ZWSVc4J3mWSrLKrMHReA5qdGoz0ODRsaA+vwxXA2cAM4qlfzBJA6581m4hzxItQw5dxrrBL3Y6kCbUcFxo1S8jyV44q//+7ASNNudZ6xeaNOSIUffqMn4A9lIjFctYn2gpEPAb3f7p3iIBN8H14FUGQ9ct2hPsL+cEsTgUrR47uJVN4n4wt/wgfwwHuOnLd4yobkofy8JvxSQTA7rMpDIc608SlZFJfZYcmbT0tAHpPE8MrtQ42siTUNWxqvWZOmvu9f0JPoQmg+6l7sZWwyfi6PXkxJnwBraUG0MYG4zYHQz3igy/XsFkx5tNQxw43qvI9dU3f0DdhOUlHKjmi1VAr2Kiy0HZwD8VeEbhh0OiDdMYspolQsYdSwjCcjeowIXNZVUPmL2wwIkYhmXKhGozdCJ4lRKbsf4NBh/XnQoS92NJEWOVOFs2YhN8c5QZFeK0pRdAG40hqvLbmoSA8xQmzOOEc7wLcme9JOsjPCEgpCwUs9E2DohMHRhUeyGIN6TFvrbny8nDuilsDpzrH5mS76APoIEJmItS67sQJ+nfwddzmjPxcBEBBCw0kWDwd0EZCkNeOD7NNQhtBm7KHL9mRxj6U1yWU2puzlIDtpYxdH4ZPeXBJkTGAJfUr/oTCz/iypY6uXaR2V1doPxJYlrw2ghH0D5gbrhFcIxzYwi4a/4hqVdf2DdxBp6vGYDjavxMAAoy+1+3aiO6S3W/QAKNVXagDtvsNtx7Ks+HKgo6U21B+QSZgIogV5Bt+BnXisdVfy9VyXV+2P5fMuvdpAjM1o/K9Z+XnE4EOCrue+kcdYHqAQ0/Y/OmNlQ6OI33jH/uD1RalPaHpJAm2av0/xtpqdXVKNDrc9F2izo23Wu7firgbURFDNX9eGGeYBhiypyXZft2j3hTvzE6PMWKsod//rEILDkzBXfi7xh0eFkfb3/1zzPK/PI5Nk3FbZyTl4mq5BfBoVoqiPHO4Q4QKZAlrQ3MdNfi3oxIjvsM3kAFv3fdufurqYR3PSwX/mpGy/GFI/B2MNPiNdOppWVbs/gjF3YH+QA9jMhlAbhvasAHstB0IJew09iAkmXHl1/TEj+jvHOpOGrPRQXbPADM+Ig2/OEcUcpgPTItMtW4DdqgfYVI/+4hAFWYjUGpOP/UwNuB7+BbKOcALbjobdgzeBQfjgNSp2GOpxzGLj70Vvq5cw2AoYENwKLUtJUX8sGRox4dVa/TN4xKwaKcl9XawQR/uNus700Hf17pyNnezrUgaY9e4MADhEDBpsJT6y1gDJs1q6wlwGhuUzGR7C8kgpjPyHWwsvrf3yn1zJEIRa5eSxoLAZOCR9xbuztxFRJW9ZmMYfCFJ0evm9F2fVnuje92Rc4Pl6A8bluN8MZyyJGZ0+sNSb//DvAFxC2BqlEsFwccWeAl6CyBcQV1bx4mQMBP1Jxqk1EUADNLeieS2dUFbQ/c/kvwItbZ7tx0st16viqd53WsRmPTKv2AD8CUnhtPWg5aUegNpsYgasaw2+EVooeNKmrW3MFtj76bYHJm5K9gpAXZXsE5U8DM8XmVOSJ1F1WnLy6nQup+jx52bAb+rCq6y9WXl2B2oZDhfDkW7H3oYfT/4xx5VncBuxMXP2lNfhUVQjSSzSRbuZFE4vFawlzveXxaYKVs8LpvAb8IRYF3ZHiRnm0ADeNPWocwxSzNseG7NrSEVZoHdKWqaGEBz1N8Pt7kFbqh3LYmAbm9i1IChIpLpM5AS6mr6OAPHMwwznVy61YpBYX8xZDN/a+lt7n+x5j4bNOVteZ8lj3hpAHSx1VR8vZHec4AHO9XFCdjZ9eRkSV65ljMmZVzaej2qFn/qt1lvWzNZEfHxK3qOJrHL6crr0CRzMox5f2e8ALBB4UGFZKA3tN6F6IXd32GTJXGQ7DTi9j/dNcLF9jCbDcWGKxoKTYblIwbLDReL00LRcDPMcQuXLMh5YzgtfjkFK1DP1iDzzYYVZz5M/kWYRlRpig1htVRjVCknm+h1M5LiEDXOyHREhvzCGpFZjHS0RsK27o2avgdilrJkalWqPW3D9gmwV37HKmfM3F8YZj2ar+vHFvf3B8CRoH4kDHIK9mrAg+owiEwNjjd9V+FsQKYR8czJrUkf7Qoi2YaW6EVDZp5zYlqiYtuXOTHk4fAcZ7qBbdLDiJq0WNV1l2+Hntk1mMWvxrYmc8kIx8G3rW36J6Ra4lLrTOCgiOihmow+YnzUT19jbV2B3RWqSHyxkhmgsBqMYWvOcUom1jDQ436+fcbu3xf2bbeqU/ca+C4DOKE+e3qvmeMqW3AxejfzBRFVcwVYPq4L0APSWWoJu+5UYX4qg5U6YTioqQGPG9XrnuZ/BkxuYpe6Li87+18EskyQW/uA+uk2rpHpr6hut2TlVbKgWkFpx+AZffweiw2+VittkEyf/ifinS/0ItRL2Jq3tQOcxPaWO2xrG68GdFoUpZgFXaP2wYVtRc6xYCfI1CaBqyWpg4bx8OHBQwsV4XWMibZZ0LYjWEy2IxQ1mZrf1/UNbYCJplWu3nZ4WpodIGVA05d+RWSS+ET9tH3RfGGmNI1cIY7evZZq7o+a0bjjygpmR3mVfalkT/SZGT27Q8QGalwGlDOS9VHCyFAIL0a1Q7JiW3saz9gqY8lqKynFrPCzxkU4SIfLc9VfCI5edgRhDXs0edO992nhTKHriREP1NJC6SROMgQ0xO5kNNZOhMOIT99AUElbxqeZF8A3xrfDJsWtDnUenAHdYWSwAbYjFqQZ+D5gi3hNK8CSxU9i6f6ClL9IGlj1OPMQAsr84YG6ijsJpCaGWj75c3yOZKBB9mNpQNPUKkK0D6wgLH8MGoyRxTX6Y05Q4AnYNXMZwXM4eij/9WpsM/9CoRnFQXGR6MEaY+FXvXEO3RO0JaStk6OXuHVATHJE+1W+TU3bSZ2ksMtqjO0zfSJCdBv7y2d8DMx6TfVme3q0ZpTKMMu4YL/t7ciTNtdDkwPogh3Cnjx7qk08SHwf+dksZ7M2vCOlfsF0hQ6J4ehPCaHTNrM/zBSOqD83dBEBCW/F/LEmeh0nOHd7oVl3/Qo/9GUDkkbj7yz+9cvvu+dDAtx8NzCDTP4iKdZvk9MWiizvtILLepysflSvTLFBZ37RLwiriqyRxYv/zrgFd/9XVHh/OmzBvDX4mitMR/lUavs2Vx6cR94lzAkplm3IRNy4TFfu47tuYs9EQPIPVta4P64tV+sZ7n3ued3cgEx2YK+QL5+xms6osk8qQbTyuKVGdaX9FQqk6qfDnT5ykxk0VK7KZ62b6DNDUfQlqGHxSMKv1P0XN5BqMeKG1P4Wp5QfZDUCEldppoX0U6ss2jIko2XpURKCIhfaOqLPfShdtS37ZrT+jFRSH2xYVV1rmT/MBtRQhxiO4MQ3iAGlaZi+9PWBEIXOVnu9jN1f921lWLZky9bqbM3J2MAAI9jmuAx3gyoEUa6P2ivs0EeNv/OR+AX6q5SW6l5HaoFuS6jr6yg9limu+P0KYKzfMXWcQSfTXzpOzKEKpwI3YGXZpSSy2LTlMgfmFA3CF6R5c9xWEtRuCg2ZPUQ2Nb6dRFTNd4TfGHrnEWSKHPuRyiJSDAZ+KX0VxmSHjGPbQTLVpqixia2uyhQ394gBMt7C3ZAmxn/DJS+l1fBsAo2Eir/C0jG9csd4+/tp12pPc/BVJGaK9mfvr7M/CeztrmCO5qY06Edi4xAGtiEhnWAbzLy2VEyazE1J5nPmgU4RpW4Sa0TnOT6w5lgt3/tMpROigHHmexBGAMY0mdcDbDxWIz41NgdD6oxgHsJRgr5RnT6wZAkTOcStU4NMOQNemSO7gxGahdEsC+NRVGxMUhQmmM0llWRbbmFGHzEqLM4Iw0H7577Kyo+Zf+2cUFIOw93gEY171vQaM0HLwpjpdRR6Jz7V0ckE7XzYJ0TmY9znLdzkva0vNrAGGT5SUZ5uaHDkcGvI0ySpwkasEgZPMseYcu85w8HPdSNi+4T6A83iAwDbxgeFcB1ZM2iGXzFcEOUlYVrEckaOyodfvaYSQ7GuB4ISE0nYJc15X/1ciDTPbPCgYJK55VkEor4LvzL9S2WDy4xj+6FOqVyTAC2ZNowheeeSI5hA/02l8UYkv4nk9iaVn+kCVEUstgk5Hyq+gJm6R9vG3rhuM904he/hFmNQaUIATB1y3vw+OmxP4X5Yi6A5I5jJufHCjF9+AGNwnEllZjUco6XhsO5T5+R3yxz5yLVOnAn0zuS+6zdj0nTJbEZCbXJdtpfYZfCeCOqJHoE2vPPFS6eRLjIJlG69X93nfR0mxSFXzp1Zc0lt/VafDaImhUMtbnqWVb9M4nGNQLN68BHP7AR8Il9dkcxzmBv8PCZlw9guY0lurbBsmNYlwJZsA/B15/HfkbjbwPddaVecls/elmDHNW2r4crAx43feNkfRwsaNq/yyJ0d/p5hZ6AZajz7DBfUok0ZU62gCzz7x8eVfJTKA8IWn45vINLSM1q+HF9CV9qF3zP6Ml21kPPL3CXzkuYUlnSqT+Ij4tI/od5KwIs+tDajDs64owN7tOAd6eucGz+KfO26iNcBFpbWA5732bBNWO4kHNpr9D955L61bvHCF/mwSrz6eQaDjfDEANqGMkFc+NGxpKZzCD2sj/JrHd+zlPQ8Iz7Q+2JVIiVCuCKoK/hlAEHzvk/Piq3mRL1rT/fEh9hoT5GJmeYswg1otiKydizJ/fS2SeKHVu6Z3JEHjiW8NaTQgP5xdBli8nC57XiN9hrquBu99hn9zqwo92+PM2JXtpeVZS0PdqR5mDyDreMMtEws+CpwaRyyzoYtfcvt9PJIW0fJVNNi/FFyRsea7peLvJrL+5b4GOXJ8tAr+ATk9f8KmiIsRhqRy0vFzwRV3Z5dZ3QqIU8JQ/uQpkJbjMUMFj2F9sCFeaBjI4+fL/oN3+LQgjI4zuAfQ+3IPIPFQBccf0clJpsfpnBxD84atwtupkGqKvrH7cGNl/QcWcSi6wcVDML6ljOgYbo+2BOAWNNjlUBPiyitUAwbnhFvLbnqw42kR3Yp2kv2dMeDdcGOX5kT4S6M44KHEB/SpCfl7xgsUvs+JNY9G3O2X/6FEt9FyAn57lrbiu+tl83sCymSvq9eZbe9mchL7MTf/Ta78e80zSf0hYY5eUU7+ff14jv7Xy8qjzfzzzvaJnrIdvFb5BLWKcWGy5/w7+vV2cvIfwHqdTB+RuJK5oj9mbt0Hy94AmjMjjwYNZlNS6uiyxNnwNyt3gdreLb64p/3+08nXkb92LTkkRgFOwk1oGEVllcOj5lv1hfAZywDows0944U8vUFw+A/nuVq/UCygsrmWIBnHyU01d0XJPwriEOvx/ISK6Pk4y2w0gmojZs7lU8TtakBAdne4v/aNxmMpK4VcGMp7si0yqsiolXRuOi1Z1P7SqD3Zmp0CWcyK4Ubmp2SXiXuI5nGLCieFHKHNRIlcY3Pys2dwMTYCaqlyWSITwr2oGXvyU3h1Pf8eQ3w1bnD7ilocVjYDkcXR3Oo1BXgMLTUjNw2xMVwjtp99NhSVc5aIWrDQT5DHPKtCtheBP4zHcw4dz2eRdTMamhlHhtfgqJJHI7NGDUw1XL8vsSeSHyKqDtqoAmrQqsYwvwi7HW3ojWyhIa5oz5xJTaq14NAzFLjVLR12rRNUQ6xohDnrWFb5bG9yf8aCD8d5phoackcNJp+Dw3Due3RM+5Rid7EuIgsnwgpX0rUWh/nqPtByMhMZZ69NpgvRTKZ62ViZ+Q7Dp5r4K0d7EfJuiy06KuIYauRh5Ecrhdt2QpTS1k1AscEHvapNbU3HL1F2TFyR33Wxb5MvH5iZsrn3SDcsxlnnshO8PLwmdGN+paWnQuORtZGX37uhFT64SeuPsx8UOokY6ON85WdQ1dki5zErsJGazcBOddWJEKqNPiJpsMD1GrVLrVY+AOdPWQneTyyP1hRX/lMM4ZogGGOhYuAdr7F/DOiAoc++cn5vlf0zkMUJ40Z1rlgv9BelPqVOpxKeOpzKdF8maK+1Vv23MO9k/8+qpLoxrIGH2EDQlnGmH8CD31G8QqlyQIcpmR5bwmSVw9/Ns6IHgulCRehvZ/+VrM60Cu/r3AontFfrljew74skYe2uyn7JKQtFQBQRJ9ryGic/zQOsbS4scUBctA8cPToQ3x6ZBQu6DPu5m1bnCtP8TllLYA0UTQNVqza5nfew3Mopy1GPUwG5jsl0OVXniPmAcmLqO5HG8Hv3nSLecE9oOjPDXcsTxoCBxYyzBdj4wmnyEV4kvFDunipS8SSkvdaMnTBN9brHUR8xdmmEAp/Pdqk9uextp1t+JrtXwpN/MG2w/qhRMpSNxQ1uhg/kKO30eQ/FyHUDkWHT8V6gGRU4DhDMxZu7xXij9Ui6jlpWmQCqJg3FkOTq3WKneCRYZxBXMNAVLQgHXSCGSqNdjebY94oyIpVjMYehAiFx/tqzBXFHZaL5PeeD74rW5OysFoUXY8sebUZleFTUa/+zBKVTFDopTReXNuZq47QjkWnxjirCommO4L/GrFtVV21EpMyw8wyThL5Y59d88xtlx1g1ttSICDwnof6lt/6zliPzgVUL8jWBjC0o2D6Kg+jNuThkAlaDJsq/AG2aKA//A76avw2KNqtv223P+Wq3StRDDNKFFgtsFukYt1GFDWooFVXitaNhb3RCyJi4cMeNjROiPEDb4k+G3+hD8tsg+5hhmSc/8t2JTSwYoCzAI75doq8QTHe+E/Tw0RQSUDlU+6uBeNN3h6jJGX/mH8oj0i3caCNsjvTnoh73BtyZpsflHLq6AfwJNCDX4S98h4+pCOhGKDhV3rtkKHMa3EG4J9y8zFWI4UsfNzC/Rl5midNn7gwoN9j23HGCQQ+OAZpTTPMdiVow740gIyuEtd0qVxMyNXhHcnuXRKdw5wDUSL358ktjMXmAkvIB73BLa1vfF9BAUZInPYJiwxqFWQQBVk7gQH4ojfUQ/KEjn+A/WR6EEe4CtbpoLe1mzHkajgTIoE0SLDHVauKhrq12zrAXBGbPPWKCt4DGedq3JyGRbmPFW32bE7T20+73BatV/qQhhBWfWBFHfhYWXjALts38FemnoT+9bn1jDBMcUMmYgSc0e7GQjv2MUBwLU8ionCpgV+Qrhg7iUIfUY6JFxR0Y+ZTCPM+rVuq0GNLyJXX6nrUTt8HzFBRY1E/FIm2EeVA9NcXrj7S6YYIChVQCWr/m2fYUjC4j0XLkzZ8GCSLfmkW3PB/xq+nlXsKVBOj7vTvqKCOMq7Ztqr3cQ+N8gBnPaAps+oGwWOkbuxnRYj/x/WjiDclVrs22xMK4qArE1Ztk1456kiJriw6abkNeRHogaPRBgbgF9Z8i/tbzWELN4CvbqtrqV9TtGSnmPS2F9kqOIBaazHYaJ9bi3AoDBvlZasMluxt0BDXfhp02Jn411aVt6S4TUB8ZgFDkI6TP6gwPY85w+oUQSsjIeXVminrwIdK2ZAawb8Se6XOJbOaliQxHSrnAeONDLuCnFejIbp4YDtBcQCwMsYiRZfHefuEJqJcwKTTJ8sx5hjHmJI1sPFHOr6W9AhZ2NAod38mnLQk1gOz2LCAohoQbgMbUK9RMEA3LkiF7Sr9tLZp6lkciIGhE2V546w3Mam53VtVkGbB9w0Yk2XiRnCmbpxmHr2k4eSC0RuNbjNsUfDIfc8DZvRvgUDe1IlKdZTzcT4ZGEb53dp8VtsoZlyXzLHOdAbsp1LPTVaHvLA0GYDFMbAW/WUBfUAdHwqLFAV+3uHvYWrCfhUOR2i89qvCBoOb48usAGdcF2M4aKn79k/43WzBZ+xR1L0uZfia70XP9soQReeuhZiUnXFDG1T8/OXNmssTSnYO+3kVLAgeiY719uDwL9FQycgLPessNihMZbAKG7qwPZyG11G1+ZA3jAX2yddpYfmaKBlmfcK/V0mwIRUDC0nJSOPUl2KB8h13F4dlVZiRhdGY5farwN+f9hEb1cRi41ZcGDn6Xe9MMSTOY81ULJyXIHSWFIQHstVYLiJEiUjktlHiGjntN5/btB8Fu+vp28zl2fZXN+dJDyN6EXhS+0yzqpl/LSJNEUVxmu7BsNdjAY0jVsAhkNuuY0E1G48ej25mSt+00yPbQ4SRCVkIwb6ISvYtmJRPz9Zt5dk76blf+lJwAPH5KDF+vHAmACLoCdG2Adii6dOHnNJnTmZtoOGO8Q1jy1veMw6gbLFToQmfJa7nT7Al89mRbRkZZQxJTKgK5Kc9INzmTJFp0tpAPzNmyL/F08bX3nhCumM/cR/2RPn9emZ3VljokttZD1zVWXlUIqEU7SLk5I0lFRU0AcENXBYazNaVzsVHA/sD3o9hm42wbHIRb/BBQTKzAi8s3+bMtpOOZgLdQzCYPfX3UUxKd1WYVkGH7lh/RBBgMZZwXzU9+GYxdBqlGs0LP+DZ5g2BWNh6FAcR944B+K/JTWI3t9YyVyRhlP4CCoUk/mmF7+r2pilVBjxXBHFaBfBtr9hbVn2zDuI0kEOG3kBx8CGdPOjX1ph1POOZJUO1JEGG0jzUy2tK4X0CgVNYhmkqqQysRNtKuPdCJqK3WW57kaV17vXgiyPrl4KEEWgiGF1euI4QkSFHFf0TDroQiLNKJiLbdhH0YBhriRNCHPxSqJmNNoketaioohqMglh6wLtEGWSM1EZbQg72h0UJAIPVFCAJOThpQGGdKfFovcwEeiBuZHN2Ob4uVM7+gwZLz1D9E7ta4RmMZ24OBBAg7Eh6dLXGofZ4U2TFOCQMKjwhVckjrydRS+YaqCw1kYt6UexuzbNEDyYLTZnrY1PzsHZJT4U+awO2xlqTSYu6n/U29O2wPXgGOEKDMSq+zTUtyc8+6iLp0ivav4FKx+xxVy4FxhIF/pucVDqpsVe2jFOfdZhTzLz2QjtzvsTCvDPU7bzDH2eXVKUV9TZ+qFtaSSxnYgYdXKwVreIgvWhT9eGDB2OvnWyPLfIIIfNnfIxU8nW7MbcH05nhlsYtaW9EZRsxWcKdEqInq1DiZPKCz7iGmAU9/ccnnQud2pNgIGFYOTAWjhIrd63aPDgfj8/sdlD4l+UTlcxTI9jbaMqqN0gQxSHs60IAcW3cH4p3V1aSciTKB29L1tz2eUQhRiTgTvmqc+sGtBNh4ky0mQJGsdycBREP+fAaSs1EREDVo5gvgi5+aCN7NECw30owbCc1mSpjiahyNVwJd1jiGgzSwfTpzf2c5XJvG/g1n0fH88KHNnf+u7ZiRMlXueSIsloJBUtW9ezvsx9grfsX/FNxnbxU1Lvg0hLxixypHKGFAaPu0xCD8oDTeFSyfRT6s8109GMUZL8m2xXp8X2dpPCWWdX84iga4BrTlOfqox4shqEgh/Ht4qRst52cA1xOIUuOxgfUivp6v5f8IVyaryEdpVk72ERAwdT4aoY1usBgmP+0m06Q216H/nubtNYxHaOIYjcach3A8Ez/zc0KcShhel0HCYjFsA0FjYqyJ5ZUH1aZw3+zWC0hLpM6GDfcAdn9fq2orPmZbW6XXrf+Krc9RtvII5jeD3dFoT1KwZJwxfUMvc5KLfn8rROW23Jw89sJ2a5dpB3qWDUBWF2iX8OCuKprHosJ2mflBR+Wqs86VvgI/XMnsqb97+VlKdPVysczPj8Jhzf+WCvGBHijAqYlavbF60soMWlHbvKT+ScvhprgeTln51xX0sF+Eadc/l2s2a5BgkVbHYyz0E85p0LstqH+gEGiR84nBRRFIn8hLSZrGwqjZ3E29cuGi+5Z5bp7EM8MWFa9ssS/vy4VrDfECSv7DSU84DaP0sXI3Ap4lWznQ65nQoTKRWU30gd7Nn8ZowUvGIx4aqyXGwmA/PB4qN8msJUODezUHEl0VP9uo+cZ8vPFodSIB4C7lQYjEFj8yu49C2KIV3qxMFYTevG8KqAr0TPlkbzHHnTpDpvpzziAiNFh8xiT7C/TiyH0EguUw4vxAgpnE27WIypV+uFN2zW7xniF/n75trs9IJ5amB1zXXZ1LFkJ6GbS/dFokzl4cc2mamVwhL4XU0Av5gDWAl+aEWhAP7t2VIwU+EpvfOPDcLASX7H7lZpXA2XQfbSlD4qU18NffNPoAKMNSccBfO9YVVgmlW4RydBqfHAV7+hrZ84WJGho6bNT0YMhxxLdOx/dwGj0oyak9aAkNJ8lRJzUuA8sR+fPyiyTgUHio5+Pp+YaKlHrhR41jY5NESPS3x+zTMe0S2HnLOKCOQPpdxKyviBvdHrCDRqO+l96HhhNBLXWv4yEMuEUYo8kXnYJM8oIgVM4XJ+xXOev4YbWeqsvgq0lmw4/PiYr9sYLt+W5EAuYSFnJEan8CwJwbtASBfLBBpJZiRPor/aCJBZsM+MhvS7ZepyHvU8m5WSmaZnxuLts8ojl6KkS8oSAHkq5GWlCB/NgJ5W3rO2Cj1MK7ahxsCrbTT3a0V/QQH+sErxV4XUWDHx0kkFy25bPmBMBQ6BU3HoHhhYcJB9JhP6NXUWKxnE0raXHB6U9KHpWdQCQI72qevp5fMzcm+AvC85rsynVQhruDA9fp9COe7N56cg1UKGSas89vrN+WlGLYTwi5W+0xYdKEGtGCeNJwXKDU0XqU5uQYnWsMwTENLGtbQMvoGjIFIEMzCRal4rnBAg7D/CSn8MsCvS+FDJJAzoiioJEhZJgAp9n2+1Yznr7H+6eT4YkJ9Mpj60ImcW4i4iHDLn9RydB8dx3QYm3rsX6n4VRrZDsYK6DCGwkwd5n3/INFEpk16fYpP6JtMQpqEMzcOfQGAHXBTEGzuLJ03GYQL9bmV2/7ExDlRf+Uvf1sM2frRtCWmal12pMgtonvSCtR4n1CLUZRdTHDHP1Otwqd+rcdlavnKjUB/OYXQHUJzpNyFoKpQK+2OgrEKpGyIgIBgn2y9QHnTJihZOpEvOKIoHAMGAXHmj21Lym39Mbiow4IF+77xNuewziNVBxr6KD5e+9HzZSBIlUa/AmsDFJFXeyrQakR3FwowTGcADJHcEfhGkXYNGSYo4dh4bxwLM+28xjiqkdn0/3R4UEkvcBrBfn/SzBc1XhKM2VPlJgKSorjDac96V2UnQYXl1/yZPT4DVelgO+soMjexXwYO58VLl5xInQUZI8jc3H2CPnCNb9X05nOxIy4MlecasTqGK6s2az4RjpF2cQP2G28R+7wDPsZDZC/kWtjdoHC7SpdPmqQrUAhMwKVuxCmYTiD9q/O7GHtZvPSN0CAUQN/rymXZNniYLlJDE70bsk6Xxsh4kDOdxe7A2wo7P9F5YvqqRDI6brf79yPCSp4I0jVoO4YnLYtX5nzspR5WB4AKOYtR1ujXbOQpPyYDvfRE3FN5zw0i7reehdi7yV0YDRKRllGCGRk5Yz+Uv1fYl2ZwrnGsqsjgAVo0xEUba8ohjaNMJNwTwZA/wBDWFSCpg1eUH8MYL2zdioxRTqgGQrDZxQyNzyBJPXZF0+oxITJAbj7oNC5JwgDMUJaM5GqlGCWc//KCIrI+aclEe4IA0uzv7cuj6GCdaJONpi13O544vbtIHBF+A+JeDFUQNy61Gki3rtyQ4aUywn6ru314/dkGiP8Iwjo0J/2Txs49ZkwEl4mx+iYUUO55I6pJzU4P+7RRs+DXZkyKUYZqVWrPF4I94m4Wx1tXeE74o9GuX977yvJ/jkdak8+AmoHVjI15V+WwBdARFV2IPirJgVMdsg1Pez2VNHqa7EHWdTkl3XTcyjG9BiueWFvQfXI8aWSkuuRmqi/HUuzqyvLJfNfs0txMqldYYflWB1BS31WkuPJGGwXUCpjiQSktkuBMWwHjSkQxeehqw1Kgz0Trzm7QbtgxiEPDVmWCNCAeCfROTphd1ZNOhzLy6XfJyG6Xgd5MCAZw4xie0Sj5AnY1/akDgNS9YFl3Y06vd6FAsg2gVQJtzG7LVq1OH2frbXNHWH/NY89NNZ4QUSJqL2yEcGADbT38X0bGdukqYlSoliKOcsSTuqhcaemUeYLLoI8+MZor2RxXTRThF1LrHfqf/5LcLAjdl4EERgUysYS2geE+yFdasU91UgUDsc2cSQ1ZoT9+uLOwdgAmifwQqF028INc2IQEDfTmUw3eZxvz7Ud1z3xc1PQfeCvfKsB9jOhRj7rFyb9XcDWLcYj0bByosychMezMLVkFiYcdBBQtvI6K0KRuOZQH2kBsYHJaXTkup8F0eIhO1/GcIwWKpr2mouB7g5TUDJNvORXPXa/mU8bh27TAZYBe2sKx4NSv5OjnHIWD2RuysCzBlUfeNXhDd2jxnHoUlheJ3jBApzURy0fwm2FwwsSU0caQGl0Kv8hopRQE211NnvtLRsmCNrhhpEDoNiZEzD2QdJWKbRRWnaFedXHAELSN0t0bfsCsMf0ktfBoXBoNA+nZN9+pSlmuzspFevmsqqcMllzzvkyXrzoA+Ryo1ePXpdGOoJvhyru+EBRsmOp7MXZ0vNUMUqHLUoKglg1p73sWeZmPc+KAw0pE2zIsFFE5H4192KwDvDxdxEYoDBDNZjbg2bmADTeUKK57IPD4fTYF4c6EnXx/teYMORBDtIhPJneiZny7Nv/zG+YmekIKCoxr6kauE2bZtBLufetNG0BtBY7f+/ImUypMBvdWu/Q7vTMRzw5aQGZWuc1V0HEsItFYMIBnoKGZ0xcarba/TYZq50kCaflFysYjA4EDKHqGdpYWdKYmm+a7TADmW35yfnOYpZYrkpVEtiqF0EujI00aeplNs2k+qyFZNeE3CDPL9P6b4PQ/kataHkVpLSEVGK7EX6rAa7IVNrvZtFvOA6okKvBgMtFDAGZOx88MeBcJ8AR3AgUUeIznAN6tjCUipGDZONm1FjWJp4A3QIzSaIOmZ7DvF/ysYYbM/fFDOV0jntAjRdapxJxL0eThpEhKOjCDDq2ks+3GrwxqIFKLe1WdOzII8XIOPGnwy6LKXVfpSDOTEfaRsGujhpS4hBIsMOqHbl16PJxc4EkaVu9wpEYlF/84NSv5Zum4drMfp9yXbzzAOJqqS4YkI4cBrFrC7bMPiCfgI3nNZAqkk3QOZqR+yyqx+nDQKBBBZ7QKrfGMCL+XpqFaBJU0wpkBdAhbR4hJsmT5aynlvkouoxm/NjD5oe6BzVIO9uktM+/5dEC5P7vZvarmuO/lKXz4sBabVPIATuKTrwbJP8XUkdM6uEctHKXICUJGjaZIWRbZp8czquQYfY6ynBUCfIU+gG6wqSIBmYIm9pZpXdaL121V7q0VjDjmQnXvMe7ysoEZnZL15B0SpxS1jjd83uNIOKZwu5MPzg2NhOx3xMOPYwEn2CUzbSrwAs5OAtrz3GAaUkJOU74XwjaYUmGJdZBS1NJVkGYrToINLKDjxcuIlyfVsKQSG/G4DyiO2SlQvJ0d0Ot1uOG5IFSAkq+PRVMgVMDvOIJMdqjeCFKUGRWBW9wigYvcbU7CQL/7meF2KZAaWl+4y9uhowAX7elogAvItAAxo2+SFxGRsHGEW9BnhlTuWigYxRcnVUBRQHV41LV+Fr5CJYV7sHfeywswx4XMtUx6EkBhR+q8AXXUA8uPJ73Pb49i9KG9fOljvXeyFj9ixgbo6CcbAJ7WHWqKHy/h+YjBwp6VcN7M89FGzQ04qbrQtgrOFybg3gQRTYG5xn73ArkfQWjCJROwy3J38Dx/D7jOa6BBNsitEw1wGq780EEioOeD+ZGp2J66ADiVGMayiHYucMk8nTK2zzT9CnEraAk95kQjy4k0GRElLL5YAKLQErJ5rp1eay9O4Fb6yJGm9U4FaMwPGxtKD6odIIHKoWnhKo1U8KIpFC+MVn59ZXmc7ZTBZfsg6FQ8W10YfTr4u0nYrpHZbZ1jXiLmooF0cOm0+mPnJBXQtepc7n0BqOipNCqI6yyloTeRShNKH04FIo0gcMk0H/xThyN4pPAWjDDkEp3lNNPRNVfpMI44CWRlRgViP64eK0JSRp0WUvCWYumlW/c58Vcz/yMwVcW5oYb9+26TEhwvbxiNg48hl1VI1UXTU//Eta+BMKnGUivctfL5wINDD0giQL1ipt6U7C9cd4+lgqY2lMUZ02Uv6Prs+ZEZer7ZfWBXVghlfOOrClwsoOFKzWEfz6RZu1eCs+K8fLvkts5+BX0gyrFYve0C3qHrn5U/Oh6D/CihmWIrY7HUZRhJaxde+tldu6adYJ+LeXupQw0XExC36RETdNFxcq9glMu4cNQSX9cqR/GQYp+IxUkIcNGWVU7ZtGa6P3XAyodRt0XeS3Tp01AnCh0ZbUh4VrSZeV9RWfSoWyxnY3hzcZ30G/InDq4wxRrEejreBxnhIQbkxenxkaxl+k7eLUQkUR6vKJ2iDFNGX3WmVA1yaOH+mvhBd+sE6vacQzFobwY5BqEAFmejwW5ne7HtVNolOUgJc8CsUxmc/LBi8N5mu9VsIA5HyErnS6zeCz7VLI9+n/hbT6hTokMXTVyXJRKSG2hd2labXTbtmK4fNH3IZBPreSA4FMeVouVN3zG5x9CiGpLw/3pceo4qGqp+rVp+z+7yQ98oEf+nyH4F3+J9IheDBa94Wi63zJbLBCIZm7P0asHGpIJt3PzE3m0S4YIWyXBCVXGikj8MudDPB/6Nm2v4IxJ5gU0ii0guy5SUHqGUYzTP0jIJU5E82RHUXtX4lDdrihBLdP1YaG1AGUC12rQKuIaGvCpMjZC9bWSCYnjDlvpWbkdXMTNeBHLKiuoozMGIvkczmP0aRJSJ8PYnLCVNhKHXBNckH79e8Z8Kc2wUej4sQZoH8qDRGkg86maW/ZQWGNnLcXmq3FlXM6ssR/3P6E/bHMvm6HLrv1yRixit25JsH3/IOr2UV4BWJhxXW5BJ6Xdr07n9kF3ZNAk6/Xpc5MSFmYJ2R7bdL8Kk7q1OU9Elg/tCxJ8giT27wSTySF0GOxg4PbYJdi/Nyia9Nn89CGDulfJemm1aiEr/eleGSN+5MRrVJ4K6lgyTTIW3i9cQ0dAi6FHt0YMbH3wDSAtGLSAccezzxHitt1QdhW36CQgPcA8vIIBh3/JNjf/Obmc2yzpk8edSlS4lVdwgW5vzbYEyFoF4GCBBby1keVNueHAH+evi+H7oOVfS3XuPQSNTXOONAbzJeSb5stwdQHl1ZjrGoE49I8+A9j3t+ahhQj74FCSWpZrj7wRSFJJnnwi1T9HL5qrCFW/JZq6P62XkMWTb+u4lGpKfmmwiJWx178GOG7KbrZGqyWwmuyKWPkNswkZ1q8uptUlviIi+AXh2bOOTOLsrtNkfqbQJeh24reebkINLkjut5r4d9GR/r8CBa9SU0UQhsnZp5cP+RqWCixRm7i4YRFbtZ4EAkhtNa6jHb6gPYQv7MKqkPLRmX3dFsK8XsRLVZ6IEVrCbmNDc8o5mqsogjAQfoC9Bc7R6gfw03m+lQpv6kTfhxscDIX6s0w+fBxtkhjXAXr10UouWCx3C/p/FYwJRS/AXRKkjOb5CLmK4XRe0+xeDDwVkJPZau52bzLEDHCqV0f44pPgKOkYKgTZJ33fmk3Tu8SdxJ02SHM8Fem5SMsWqRyi2F1ynfRJszcFKykdWlNqgDA/L9lKYBmc7Zu/q9ii1FPF47VJkqhirUob53zoiJtVVRVwMR34gV9iqcBaHbRu9kkvqk3yMpfRFG49pKKjIiq7h/VpRwPGTHoY4cg05X5028iHsLvUW/uz+kjPyIEhhcKUwCkJAwbR9pIEGOn8z6svAO8i89sJ3dL5qDWFYbS+HGPRMxYwJItFQN86YESeJQhn2urGiLRffQeLptDl8dAgb+Tp47UQPxWOw17OeChLN1WnzlkPL1T5O+O3Menpn4C3IY5LEepHpnPeZHbvuWfeVtPlkH4LZjPbBrkJT3NoRJzBt86CO0Xq59oQ+8dsm0ymRcmQyn8w71mhmcuEI5byuF+C88VPYly2sEzjlzAQ3vdn/1+Hzguw6qFNNbqenhZGbdiG6RwZaTG7jTA2X9RdXjDN9yj1uQpyO4Lx8KRAcZcbZMafp4wPOd5MdXoFY52V1A8M9hi3sso93+uprE0qYNMjkE22CvK4HuUxqN7oIz5pWuETq1lQAjqlSlqdD2Rnr/ggp/TVkQYjn9lMfYelk2sH5HPdopYo7MHwlV1or9Bxf+QCyLzm92vzG2wjiIjC/ZHEJzeroJl6bdFPTpZho5MV2U86fLQqxNlGIMqCGy+9WYhJ8ob1r0+Whxde9L2PdysETv97O+xVw+VNN1TZSQN5I6l9m5Ip6pLIqLm4a1B1ffH6gHyqT9p82NOjntRWGIofO3bJz5GhkvSWbsXueTAMaJDou99kGLqDlhwBZNEQ4mKPuDvVwSK4WmLluHyhA97pZiVe8g+JxmnJF8IkV/tCs4Jq/HgOoAEGR9tCDsDbDmi3OviUQpG5D8XmKcSAUaFLRXb2lmJTNYdhtYyfjBYZQmN5qT5CNuaD3BVnlkCk7bsMW3AtXkNMMTuW4HjUERSJnVQ0vsBGa1wo3Qh7115XGeTF3NTz8w0440AgU7c3bSXO/KMINaIWXd0oLpoq/0/QJxCQSJ9XnYy1W7TYLBJpHsVWD1ahsA7FjNvRd6mxCiHsm8g6Z0pnzqIpF1dHUtP2ITU5Z1hZHbu+L3BEEStBbL9XYvGfEakv1bmf+bOZGnoiuHEdlBnaChxYKNzB23b8sw8YyT7Ajxfk49eJIAvdbVkdFCe2J0gMefhQ0bIZxhx3fzMIysQNiN8PgOUKxOMur10LduigREDRMZyP4oGWrP1GFY4t6groASsZ421os48wAdnrbovNhLt7ScNULkwZ5AIZJTrbaKYTLjA1oJ3sIuN/aYocm/9uoQHEIlacF1s/TM1fLcPTL38O9fOsjMEIwoPKfvt7opuI9G2Hf/PR4aCLDQ7wNmIdEuXJ/QNL72k5q4NejAldPfe3UVVqzkys8YZ/jYOGOp6c+YzRCrCuq0M11y7TiN6qk7YXRMn/gukxrEimbMQjr3jwRM6dKVZ4RUfWQr8noPXLJq6yh5R3EH1IVOHESst/LItbG2D2vRsZRkAObzvQAAD3mb3/G4NzopI0FAiHfbpq0X72adg6SRj+8OHMShtFxxLZlf/nLgRLbClwl5WmaYSs+yEjkq48tY7Z2bE0N91mJwt+ua0NlRJIDh0HikF4UvSVorFj2YVu9YeS5tfvlVjPSoNu/Zu6dEUfBOT555hahBdN3Sa5Xuj2Rvau1lQNIaC944y0RWj9UiNDskAK1WoL+EfXcC6IbBXFRyVfX/WKXxPAwUyIAGW8ggZ08hcijKTt1YKnUO6QPvcrmDVAb0FCLIXn5id4fD/Jx4tw/gbXs7WF9b2RgXtPhLBG9vF5FEkdHAKrQHZAJC/HWvk7nvzzDzIXZlfFTJoC3JpGgLPBY7SQTjGlUvG577yNutZ1hTfs9/1nkSXK9zzKLRZ3VODeKUovJe0WCq1zVMYxCJMenmNzPIU2S8TA4E7wWmbNkxq9rI2dd6v0VpcAPVMxnDsvWTWFayyqvKZO7Z08a62i/oH2/jxf8rpmfO64in3FLiL1GX8IGtVE9M23yGsIqJbxDTy+LtaMWDaPqkymb5VrQdzOvqldeU0SUi6IirG8UZ3jcpRbwHa1C0Dww9G/SFX3gPvTJQE+kyz+g1BeMILKKO+olcHzctOWgzxYHnOD7dpCRtuZEXACjgqesZMasoPgnuDC4nUviAAxDc5pngjoAITIkvhKwg5d608pdrZcA+qn5TMT6Uo/QzBaOxBCLTJX3Mgk85rMfsnWx86oLxf7p2PX5ONqieTa/qM3tPw4ZXvlAp83NSD8F7+ZgctK1TpoYwtiU2h02HCGioH5tkVCqNVTMH5p00sRy2JU1qyDBP2CII/Dg4WDsIl+zgeX7589srx6YORRQMBfKbodbB743Tl4WLKOEnwWUVBsm94SOlCracU72MSyj068wdpYjyz1FwC2bjQnxnB6Mp/pZ+yyZXtguEaYB+kqhjQ6UUmwSFazOb+rhYjLaoiM+aN9/8KKn0zaCTFpN9eKwWy7/u4EHzO46TdFSNjMfn2iPSJwDPCFHc0I1+vjdAZw5ZjqR/uzi9Zn20oAa5JnLEk/EA3VRWE7J/XrupfFJPtCUuqHPpnlL7ISJtRpSVcB8qsZCm2QEkWoROtCKKxUh3yEcMbWYJwk6DlEBG0bZP6eg06FL3v6RPb7odGuwm7FN8fG4woqtB8e7M5klPpo97GoObNwt+ludTAmxyC5hmcFx+dIvEZKI6igFKHqLH01iY1o7903VzG9QGetyVx5RNmBYUU+zIuSva/yIcECUi4pRmE3VkF2avqulQEUY4yZ/wmNboBzPmAPey3+dSYtBZUjeWWT0pPwCz4Vozxp9xeClIU60qvEFMQCaPvPaA70WlOP9f/ey39macvpGCVa+zfa8gO44wbxpJUlC8GN/pRMTQtzY8Z8/hiNrU+Zq64ZfFGIkdj7m7abcK1EBtws1X4J/hnqvasPvvDSDYWN+QcQVGMqXalkDtTad5rYY0TIR1Eqox3czwPMjKPvF5sFv17Thujr1IZ1Ytl4VX1J0vjXKmLY4lmXipRAro0qVGEcXxEVMMEl54jQMd4J7RjgomU0j1ptjyxY+cLiSyXPfiEcIS2lWDK3ISAy6UZ3Hb5vnPncA94411jcy75ay6B6DSTzK6UTCZR9uDANtPBrvIDgjsfarMiwoax2OlLxaSoYn4iRgkpEGqEkwox5tyI8aKkLlfZ12lO11TxsqRMY89j5JaO55XfPJPDL1LGSnC88Re9Ai+Nu5bZjtwRrvFITUFHPR4ZmxGslQMecgbZO7nHk32qHxYkdvWpup07ojcMCaVrpFAyFZJJbNvBpZfdf39Hdo2kPtT7v0/f8R/B5Nz4f1t9/3zNM/7n6SUHfcWk5dfQFJvcJMgPolGCpOFb/WC0FGWU2asuQyT+rm88ZKZ78Cei/CAh939CH0JYbpZIPtxc2ufXqjS3pHH9lnWK4iJ7OjR/EESpCo2R3MYKyE7rHfhTvWho4cL1QdN4jFTyR6syMwFm124TVDDRXMNveI1Dp/ntwdz8k8kxw7iFSx6+Yx6O+1LzMVrN0BBzziZi9kneZSzgollBnVwBh6oSOPHXrglrOj+QmR/AESrhDpKrWT+8/AiMDxS/5wwRNuGQPLlJ9ovomhJWn8sMLVItQ8N/7IXvtD8kdOoHaw+vBSbFImQsv/OCAIui99E+YSIOMlMvBXkAt+NAZK8wB9Jf8CPtB+TOUOR+z71d/AFXpPBT6+A5FLjxMjLIEoJzrQfquvxEIi+WoUzGR1IzQFNvbYOnxb2PyQ0kGdyXKzW2axQL8lNAXPk6NEjqrRD1oZtKLlFoofrXw0dCNWASHzy+7PSzOUJ3XtaPZsxLDjr+o41fKuKWNmjiZtfkOzItvlV2MDGSheGF0ma04qE3TUEfqJMrXFm7DpK+27DSvCUVf7rbNoljPhha5W7KBqVq0ShUSTbRmuqPtQreVWH4JET5yMhuqMoSd4r/N8sDmeQiQQvi1tcZv7Moc7dT5X5AtCD6kNEGZOzVcNYlpX4AbTsLgSYYliiPyVoniuYYySxsBy5cgb3pD+EK0Gpb0wJg031dPgaL8JZt6sIvzNPEHfVPOjXmaXj4bd4voXzpZ5GApMhILgMbCEWZ2zwgdeQgjNHLbPIt+KqxRwWPLTN6HwZ0Ouijj4UF+Sg0Au8XuIKW0WxlexdrFrDcZJ8Shauat3X0XmHygqgL1nAu2hrJFb4wZXkcS+i36KMyU1yFvYv23bQUJi/3yQpqr/naUOoiEWOxckyq/gq43dFou1DVDaYMZK9tho7+IXXokBCs5GRfOcBK7g3A+jXQ39K4YA8PBRW4m5+yR0ZAxWJncjRVbITvIAPHYRt1EJ3YLiUbqIvoKHtzHKtUy1ddRUQ0AUO41vonZDUOW+mrszw+SW/6Q/IUgNpcXFjkM7F4CSSQ2ExZg85otsMs7kqsQD4OxYeBNDcSpifjMoLb7GEbGWTwasVObmB/bfPcUlq0wYhXCYEDWRW02TP5bBrYsKTGWjnWDDJ1F7zWai0zW/2XsCuvBQjPFcTYaQX3tSXRSm8hsAoDdjArK/OFp6vcWYOE7lizP0Yc+8p16i7/NiXIiiQTp7c7Xus925VEtlKAjUdFhyaiLT7VxDagprMFwix4wZ05u0qj7cDWFd0W9OYHIu3JbJKMXRJ1aYNovugg+QqRN7fNHSi26VSgBpn+JfMuPo3aeqPWik/wI5Rz3BWarPQX4i5+dM0npwVOsX+KsOhC7vDg+OJsz4Q5zlnIeflUWL6QYMbf9WDfLmosLF4Qev3mJiOuHjoor/dMeBpA9iKDkMjYBNbRo414HCxjsHrB4EXNbHzNMDHCLuNBG6Sf+J4MZ/ElVsDSLxjIiGsTPhw8BPjxbfQtskj+dyNMKOOcUYIRBEIqbazz3lmjlRQhplxq673VklMMY6597vu+d89ec/zq7Mi4gQvh87ehYbpOuZEXj5g/Q7S7BFDAAB9DzG35SC853xtWVcnZQoH54jeOqYLR9NDuwxsVthTV7V99n/B7HSbAytbEyVTz/5NhJ8gGIjG0E5j3griULUd5Rg7tQR+90hJgNQKQH2btbSfPcaTOfIexc1db1BxUOhM1vWCpLaYuKr3FdNTt/T3PWCpEUWDKEtzYrjpzlL/wri3MITKsFvtF8QVV/NhVo97aKIBgdliNc10dWdXVDpVtsNn+2UIolrgqdWA4EY8so0YvB4a+aLzMXiMAuOHQrXY0tr+CL10JbvZzgjJJuB1cRkdT7DUqTvnswVUp5kkUSFVtIIFYK05+tQxT6992HHNWVhWxUsD1PkceIrlXuUVRogwmfdhyrf6zzaL8+c0L7GXMZOteAhAVQVwdJh+7nrX7x4LaIIfz2F2v7Dg/uDfz2Fa+4gFm2zHAor8UqimJG3VTJtZEoFXhnDYXvxMJFc6ku2bhbCxzij2z5UNuK0jmp1mnvkVNUfR+SEmj1Lr94Lym75PO7Fs0MIr3GdsWXRXSfgLTVY0FLqba97u1In8NAcY7IC6TjWLigwKEIm43NxTdaVTv9mcKkzuzBkKd8x/xt1p/9BbP7Wyb4bpo1K1gnOpbLvKz58pWl3B55RJ/Z5mRDLPtNQg14jdOEs9+h/V5UVpwrAI8kGbX8KPVPDIMfIqKDjJD9UyDOPhjZ3vFAyecwyq4akUE9mDOtJEK1hpDyi6Ae87sWAClXGTiwPwN7PXWwjxaR79ArHRIPeYKTunVW24sPr/3HPz2IwH8oKH4OlWEmt4BLM6W5g4kMcYbLwj2usodD1088stZA7VOsUSpEVl4w7NMb1EUHMRxAxLF0CIV+0L3iZb+ekB1vSDSFjAZ3hfLJf7gFaXrOKn+mhR+rWw/eTXIcAgl4HvFuBg1LOmOAwJH3eoVEjjwheKA4icbrQCmvAtpQ0mXG0agYp5mj4Rb6mdQ+RV4QBPbxMqh9C7o8nP0Wko2ocnCHeRGhN1XVyT2b9ACsL+6ylUy+yC3QEnaKRIJK91YtaoSrcWZMMwxuM0E9J68Z+YyjA0g8p1PfHAAIROy6Sa04VXOuT6A351FOWhKfTGsFJ3RTJGWYPoLk5FVK4OaYR9hkJvezwF9vQN1126r6isMGXWTqFW+3HL3I/jurlIdDWIVvYY+s6yq7lrFSPAGRdnU7PVwY/SvWbZGpXzy3BQ2LmAJlrONUsZs4oGkly0V267xbD5KMY8woNNsmWG1VVgLCra8aQBBcI4DP2BlNwxhiCtHlaz6OWFoCW0vMR3ErrG7JyMjTSCnvRcsEHgmPnwA6iNpJ2DrFb4gLlhKJyZGaWkA97H6FFdwEcLT6DRQQL++fOkVC4cYGW1TG/3iK5dShRSuiBulmihqgjR45Vi03o2RbQbP3sxt90VxQ6vzdlGfkXmmKmjOi080JSHkLntjvsBJnv7gKscOaTOkEaRQqAnCA4HWtB4XnMtOhpRmH2FH8tTXrIjAGNWEmudQLCkcVlGTQ965Kh0H6ixXbgImQP6b42B49sO5C8pc7iRlgyvSYvcnH9FgQ3azLbQG2cUW96SDojTQStxkOJyOuDGTHAnnWkz29aEwN9FT8EJ4yhXOg+jLTrCPKeEoJ9a7lDXOjEr8AgX4BmnMQ668oW0zYPyQiVMPxKRHtpfnEEyaKhdzNVThlxxDQNdrHeZiUFb6NoY2KwvSb7BnRcpJy+/g/zAYx3fYSN5QEaVD2Y1VsNWxB0BSO12MRsRY8JLfAezRMz5lURuLUnG1ToKk6Q30FughqWN6gBNcFxP/nY/iv+iaUQOa+2Nuym46wtI/DvSfzSp1jEi4SdYBE7YhTiVV5cX9gwboVDMVgZp5YBQlHOQvaDNfcCoCJuYhf5kz5kwiIKPjzgpcRJHPbOhJajeoeRL53cuMahhV8Z7IRr6M4hW0JzT7mzaMUzQpm866zwM7Cs07fJYXuWvjAMkbe5O6V4bu71sOG6JQ4oL8zIeXHheFVavzxmlIyBkgc9IZlEDplMPr8xlcyss4pVUdwK1e7CK2kTsSdq7g5SHRAl3pYUB9Ko4fsh4qleOyJv1z3KFSTSvwEcRO/Ew8ozEDYZSqpfoVW9uhJfYrNAXR0Z3VmeoAD+rVWtwP/13sE/3ICX3HhDG3CMc476dEEC0K3umSAD4j+ZQLVdFOsWL2C1TH5+4KiSWH+lMibo+B55hR3Gq40G1n25sGcN0mEcoU2wN9FCVyQLBhYOu9aHVLWjEKx2JIUZi5ySoHUAI9b8hGzaLMxCZDMLhv8MkcpTqEwz9KFDpCpqQhVmsGQN8m24wyB82FAKNmjgfKRsXRmsSESovAwXjBIoMKSG51p6Um8b3i7GISs7kjTq/PZoioCfJzfKdJTN0Q45kQEQuh9H88M3yEs3DbtRTKALraM0YC8laiMiOOe6ADmTcCiREeAWZelBaEXRaSuj2lx0xHaRYqF65O0Lo5OCFU18A8cMDE4MLYm9w2QSr9NgQAIcRxZsNpA7UJR0e71JL+VU+ISWFk5I97lra8uGg7GlQYhGd4Gc6rxsLFRiIeGO4abP4S4ekQ1fiqDCy87GZHd52fn5aaDGuvOmIofrzpVwMvtbreZ/855OaXTRcNiNE0wzGZSxbjg26v8ko8L537v/XCCWP2MFaArJpvnkep0pA+O86MWjRAZPQRfznZiSIaTppy6m3p6HrNSsY7fDtz7Cl4V/DJAjQDoyiL2uwf1UHVd2AIrzBUSlJaTj4k6NL97a/GqhWKU9RUmjnYKpm2r+JYUcrkCuZKvcYvrg8pDoUKQywY9GDWg03DUFSirlUXBS5SWn/KAntnf0IdHGL/7mwXqDG+LZYjbEdQmqUqq4y54TNmWUP7IgcAw5816YBzwiNIJiE9M4lPCzeI/FGBeYy3p6IAmH4AjXXmvQ4Iy0Y82NTobcAggT2Cdqz6Mx4TdGoq9fn2etrWKUNFyatAHydQTVUQ2S5OWVUlugcNvoUrlA8cJJz9MqOa/W3iVno4zDHfE7zhoY5f5lRTVZDhrQbR8LS4eRLz8iPMyBL6o4PiLlp89FjdokQLaSBmKHUwWp0na5fE3v9zny2YcDXG/jfI9sctulHRbdkI5a4GOPJx4oAJQzVZ/yYAado8KNZUdEFs9ZPiBsausotXMNebEgr0dyopuqfScFJ3ODNPHgclACPdccwv0YJGQdsN2lhoV4HVGBxcEUeUX/alr4nqpcc1CCR3vR7g40zteQg/JvWmFlUE4mAiTpHlYGrB7w+U2KdSwQz2QJKBe/5eiixWipmfP15AFWrK8Sh1GBBYLgzki1wTMhGQmagXqJ2+FuqJ8f0XzXCVJFHQdMAw8xco11HhM347alrAu+wmX3pDFABOvkC+WPX0Uhg1Z5MVHKNROxaR84YV3s12UcM+70cJ460SzEaKLyh472vOMD3XnaK7zxZcXlWqenEvcjmgGNR2OKbI1s8U+iwiW+HotHalp3e1MGDy6BMVIvajnAzkFHbeVsgjmJUkrP9OAwnEHYXVBqYx3q7LvXjoVR0mY8h+ZaOnh053pdsGkmbqhyryN01eVHySr+CkDYkSMeZ1xjPNVM+gVLTDKu2VGsMUJqWO4TwPDP0VOg2/8ITbAUaMGb4LjL7L+Pi11lEVMXTYIlAZ/QHmTENjyx3kDkBdfcvvQt6tKk6jYFM4EG5UXDTaF5+1ZjRz6W7MdJPC+wTkbDUim4p5QQH3b9kGk2Bkilyeur8Bc20wm5uJSBO95GfYDI1EZipoRaH7uVveneqz43tlTZGRQ4a7CNmMHgXyOQQOL6WQkgMUTQDT8vh21aSdz7ERiZT1jK9F+v6wgFvuEmGngSvIUR2CJkc5tx1QygfZnAruONobB1idCLB1FCfO7N1ZdRocT8/Wye+EnDiO9pzqIpnLDl4bkaRKW+ekBVwHn46Shw1X0tclt/0ROijuUB4kIInrVJU4buWf4YITJtjOJ6iKdr1u+flgQeFH70GxKjhdgt/MrwfB4K/sXczQ+9zYcrD4dhY6qZhZ010rrxggWA8JaZyg2pYij8ieYEg1aZJkZK9O1Re7sB0iouf60rK0Gd+AYlp7soqCBCDGwfKeUQhCBn0E0o0GS6PdmjLi0TtCYZeqazqwN+yNINIA8Lk3iPDnWUiIPLGNcHmZDxfeK0iAdxm/T7LnN+gemRL61hHIc0NCAZaiYJR+OHnLWSe8sLrK905B5eEJHNlWq4RmEXIaFTmo49f8w61+NwfEUyuJAwVqZCLFcyHBKAcIVj3sNzfEOXzVKIndxHw+AR93owhbCxUZf6Gs8cz6/1VdrFEPrv330+9s6BtMVPJ3zl/Uf9rUi0Z/opexfdL3ykF76e999GPfVv8fJv/Y/+/5hEMon1tqNFyVRevV9y9/uIvsG3dbB8GRRrgaEXfhx+2xeOFt+cEn3RZanNxdEe2+B6MHpNbrRE53PlDifPvFcp4kO78ILR0T4xyW/WGPyBsqGdoA7zJJCu1TKbGfhnqgnRbxbB2B3UZoeQ2bz2sTVnUwokTcTU21RxN1PYPS3Sar7T0eRIsyCNowr9amwoMU/od9s2APtiKNL6ENOlyKADstAEWKA+sdKDhrJ6BOhRJmZ+QJbAaZ3/5Fq0/lumCgEzGEbu3yi0Y4I4EgVAjqxh4HbuQn0GrRhOWyAfsglQJAVL1y/6yezS2k8RE2MstJLh92NOB3GCYgFXznF4d25qiP4ZCyI4RYGesut6FXK6GwPpKK8WHEkhYui0AyEmr5Ml3uBFtPFdnioI8RiCooa7Z1G1WuyIi3nSNglutc+xY8BkeW3JJXPK6jd2VIMpaSxpVtFq+R+ySK9J6WG5Qvt+C+QH1hyYUOVK7857nFmyDBYgZ/o+AnibzNVqyYCJQvyDXDTK+iXdkA71bY7TL3bvuLxLBQ8kbTvTEY9aqkQ3+MiLWbEgjLzOH+lXgco1ERgzd80rDCymlpaRQbOYnKG/ODoFl46lzT0cjM5FYVvv0qLUbD5lyJtMUaC1pFlTkNONx6lliaX9o0i/1vws5bNKn5OuENQEKmLlcP4o2ZmJjD4zzd3Fk32uQ4uRWkPSUqb4LBe3EXHdORNB2BWsws5daRnMfNVX7isPSb1hMQdAJi1/qmDMfRUlCU74pmnzjbXfL8PVG8NsW6IQM2Ne23iCPIpryJjYbVnm5hCvKpMa7HLViNiNc+xTfDIaKm3jctViD8A1M9YPJNk003VVr4Zo2MuGW8vil8SLaGpPXqG7I4DLdtl8a4Rbx1Lt4w5Huqaa1XzZBtj208EJVGcmKYEuaeN27zT9EE6a09JerXdEbpaNgNqYJdhP1NdqiPKsbDRUi86XvvNC7rME5mrSQtrzAZVndtSjCMqd8BmaeGR4l4YFULGRBeXIV9Y4yxLFdyoUNpiy2IhePSWzBofYPP0eIa2q5JP4j9G8at/AqoSsLAUuRXtvgsqX/zYwsE+of6oSDbUOo4RMJw+DOUTJq+hnqwKim9Yy/napyZNTc2rCq6V9jHtJbxGPDwlzWj/Sk3zF/BHOlT/fSjSq7FqlPI1q6J+ru8Aku008SFINXZfOfnZNOvGPMtEmn2gLPt+H4QLA+/SYe4j398auzhKIp2Pok3mPC5q1IN1HgR+mnEfc4NeeHYwd2/kpszR3cBn7ni9NbIqhtSWFW8xbUJuUPVOeeXu3j0IGZmFNiwaNZ6rH4/zQ2ODz6tFxRLsUYZu1bfd1uIvfQDt4YD/efKYv8VF8bHGDgK22w2Wqwpi43vNCOXFJZCGMqWiPbL8mil6tsmOTXAWCyMCw73e2rADZj2IK6rqksM3EXF2cbLb4vjB14wa/yXK5vwU+05MzERJ5nXsXsW21o7M+gO0js2OyKciP5uF2iXyb2DiptwQeHeqygkrNsqVCSlldxBMpwHi1vfc8RKpP/4L3Lmpq6DZcvhDDfxTCE3splacTcOtXdK2g303dIWBVe2wD/Gvja1cClFQ67gw0t1ZUttsUgQ1Veky8oOpS6ksYEc4bqseCbZy766SvL3FodmnahlWJRgVCNjPxhL/fk2wyvlKhITH/VQCipOI0dNcRa5B1M5HmOBjTLeZQJy237e2mobwmDyJNHePhdDmiknvLKaDbShL+Is1XTCJuLQd2wmdJL7+mKvs294whXQD+vtd88KKk0DXP8B1Xu9J+xo69VOuFgexgTrcvI6SyltuLix9OPuE6/iRJYoBMEXxU4shQMf4Fjqwf1PtnJ/wWSZd29rhZjRmTGgiGTAUQqRz+nCdjeMfYhsBD5Lv60KILWEvNEHfmsDs2L0A252351eUoYxAysVaCJVLdH9QFWAmqJDCODUcdoo12+gd6bW2boY0pBVHWL6LQDK5bYWh1V8vFvi0cRpfwv7cJiMX3AZNJuTddHehTIdU0YQ/sQ1dLoF2xQPcCuHKiuCWOY30DHe1OwcClLAhqAKyqlnIbH/8u9ScJpcS4kgp6HKDUdiOgRaRGSiUCRBjzI5gSksMZKqy7Sd51aeg0tgJ+x0TH9YH2Mgsap9N7ENZdEB0bey2DMTrBA1hn56SErNHf3tKtqyL9b6yXEP97/rc+jgD2N1LNUH6RM9AzP3kSipr06RkKOolR7HO768jjWiH1X92jA7dkg7gcNcjqsZCgfqWw0tPXdLg20cF6vnQypg7gLtkazrHAodyYfENPQZsdfnjMZiNu4nJO97D1/sQE+3vNFzrSDOKw+keLECYf7RJwVHeP/j79833oZ0egonYB2FlFE5qj02B/LVOMJQlsB8uNg3Leg4qtZwntsOSNidR0abbZmAK4sCzvt8Yiuz2yrNCJoH5O8XvX/vLeR/BBYTWj0sOPYM/jyxRd5+/JziKAABaPcw/34UA3aj/gLZxZgRCWN6m4m3demanNgsx0P237/Q+Ew5VYnJPkyCY0cIVHoFn2Ay/e7U4P19APbPFXEHX94N6KhEMPG7iwB3+I+O1jd5n6VSgHegxgaSawO6iQCYFgDsPSMsNOcUj4q3sF6KzGaH/0u5PQoAj/8zq6Uc9MoNrGqhYeb2jQo0WlGlXjxtanZLS24/OIN5Gx/2g684BPDQpwlqnkFcxpmP/osnOXrFuu4PqifouQH0eF5qCkvITQbJw/Zvy5mAHWC9oU+cTiYhJmSfKsCyt1cGVxisKu+NymEQIAyaCgud/V09qT3nk/9s/SWsYtha7yNpzBIMM40rCSGaJ9u6lEkl00vXBiEt7p9P5IBCiavynEOv7FgLqPdeqxRiCwuFVMolSIUBcoyfUC2e2FJSAUgYdVGFf0b0Kn2EZlK97yyxrT2MVgvtRikfdaAW8RwEEfN+B7/eK8bBdp7URpbqn1xcrC6d2UjdsKbzCjBFqkKkoZt7Mrhg6YagE7spkqj0jOrWM+UGQ0MUlG2evP1uE1p2xSv4dMK0dna6ENcNUF+xkaJ7B764NdxLCpuvhblltVRAf7vK5qPttJ/9RYFUUSGcLdibnz6mf7WkPO3MkUUhR2mAOuGv8IWw5XG1ZvoVMnjSAZe6T7WYA99GENxoHkMiKxHlCuK5Gd0INrISImHQrQmv6F4mqU/TTQ8nHMDzCRivKySQ8dqkpQgnUMnwIkaAuc6/FGq1hw3b2Sba398BhUwUZSAIO8XZvnuLdY2n6hOXws+gq9BHUKcKFA6kz6FDnpxLPICa3qGhnc97bo1FT/XJk48LrkHJ2CAtBv0RtN97N21plfpXHvZ8gMJb7Zc4cfI6MbPwsW7AilCSXMFIEUEmir8XLEklA0ztYbGpTTGqttp5hpFTTIqUyaAIqvMT9A/x+Ji5ejA4Bhxb/cl1pUdOD6epd3yilIdO6j297xInoiBPuEDW2/UfslDyhGkQs7Wy253bVnlT+SWg89zYIK/9KXFl5fe+jow2rd5FXv8zDPrmfMXiUPt9QBO/iK4QGbX5j/7Rx1c1vzsY8ONbP3lVIaPrhL4+1QrECTN3nyKavGG0gBBtHvTKhGoBHgMXHStFowN+HKrPriYu+OZ05Frn8okQrPaaxoKP1ULCS/cmKFN3gcH7HQlVjraCeQmtjg1pSQxeuqXiSKgLpxc/1OiZsU4+n4lz4hpahGyWBURLi4642n1gn9qz9bIsaCeEPJ0uJmenMWp2tJmIwLQ6VSgDYErOeBCfSj9P4G/vI7oIF+l/n5fp956QgxGvur77ynawAu3G9MdFbJbu49NZnWnnFcQHjxRuhUYvg1U/e84N4JTecciDAKb/KYIFXzloyuE1eYXf54MmhjTq7B/yBToDzzpx3tJCTo3HCmVPYfmtBRe3mPYEE/6RlTIxbf4fSOcaKFGk4gbaUWe44hVk9SZzhW80yfW5QWBHxmtUzvMhfVQli4gZTktIOZd9mjJ5hsbmzttaHQB29Am3dZkmx3g/qvYocyhZ2PXAWsNQiIaf+Q8W/MWPIK7/TjvCx5q2XRp4lVWydMc2wIQkhadDB0xsnw/kSEyGjLKjI4coVIwtubTF3E7MJ6LS6UOsJKj82XVAVPJJcepfewbzE91ivXZvOvYfsmMevwtPpfMzGmC7WJlyW2j0jh7AF1JLmwEJSKYwIvu6DHc3YnyLH9ZdIBnQ+nOVDRiP+REpqv++typYHIvoJyICGA40d8bR7HR2k7do6UQTHF4oriYeIQbxKe4Th6+/l1BjUtS9hqORh3MbgvYrStXTfSwaBOmAVQZzpYNqsAmQyjY56MUqty3c/xH6GuhNvNaG9vGbG6cPtBM8UA3e8r51D0AR9kozKuGGSMgLz3nAHxDNnc7GTwpLj7/6HeWp1iksDeTjwCLpxejuMtpMnGJgsiku1sOACwQ9ukzESiDRN77YNESxR5LphOlcASXA5uIts1LnBIcn1J7BLWs49DMALSnuz95gdOrTZr0u1SeYHinno/pE58xYoXbVO/S+FEMMs5qyWkMnp8Q3ClyTlZP52Y9nq7b8fITPuVXUk9ohG5EFHw4gAEcjFxfKb3xuAsEjx2z1wxNbSZMcgS9GKyW3R6KwJONgtA64LTyxWm8Bvudp0M1FdJPEGopM4Fvg7G/hsptkhCfHFegv4ENwxPeXmYhxwZy7js+BeM27t9ODBMynVCLJ7RWcBMteZJtvjOYHb5lOnCLYWNEMKC59BA7covu1cANa2PXL05iGdufOzkgFqqHBOrgQVUmLEc+Mkz4Rq8O6WkNr7atNkH4M8d+SD1t/tSzt3oFql+neVs+AwEI5JaBJaxARtY2Z4mKoUqxds4UpZ0sv3zIbNoo0J4fihldQTX3XNcuNcZmcrB5LTWMdzeRuAtBk3cZHYQF6gTi3PNuDJ0nmR+4LPLoHvxQIxRgJ9iNNXqf2SYJhcvCtJiVWo85TsyFOuq7EyBPJrAdhEgE0cTq16FQXhYPJFqSfiVn0IQnPOy0LbU4BeG94QjdYNB0CiQ3QaxQqD2ebSMiNjaVaw8WaM4Z5WnzcVDsr4eGweSLa2DE3BWViaxhZFIcSTjgxNCAfelg+hznVOYoe5VqTYs1g7WtfTm3e4/WduC6p+qqAM8H4ZyrJCGpewThTDPe6H7CzX/zQ8Tm+r65HeZn+MsmxUciEWPlAVaK/VBaQBWfoG/aRL/jSZIQfep/89GjasWmbaWzeEZ2R1FOjvyJT37O9B8046SRSKVEnXWlBqbkb5XCS3qFeuE9xb9+frEknxWB5h1D/hruz2iVDEAS7+qkEz5Ot5agHJc7WCdY94Ws61sURcX5nG8UELGBAHZ3i+3VulAyT0nKNNz4K2LBHBWJcTBX1wzf+//u/j/9+//v87+9/l9Lbh/L/uyNYiTsWV2LwsjaA6MxTuzFMqmxW8Jw/+IppdX8t/Clgi1rI1SN0UC/r6tX/4lUc2VV1OQReSeCsjUpKZchw4XUcjHfw6ryCV3R8s6VXm67vp4n+lcPV9gJwmbKQEsmrJi9c2vkwrm8HFbVYNTaRGq8D91t9n5+U+aD/hNtN3HjC/nC/vUoGFSCkXP+NlRcmLUqLbiUBl4LYf1U/CCvwtd3ryCH8gUmGITAxiH1O5rnGTz7y1LuFjmnFGQ1UWuM7HwfXtWl2fPFKklYwNUpF2IL/TmaRETjQiM5SJacI+3Gv5MBU8lP5Io6gWkawpyzNEVGqOdx4YlO1dCvjbWFZWbCmeiFKPSlMKtKcMFLs/KQxtgAHi7NZNCQ32bBAW2mbHflVZ8wXKi1JKVHkW20bnYnl3dKWJeWJOiX3oKPBD6Zbi0ZvSIuWktUHB8qDR8DMMh1ZfkBL9FS9x5r0hBGLJ8pUCJv3NYH+Ae8p40mZWd5m5fhobFjQeQvqTT4VKWIYfRL0tfaXKiVl75hHReuTJEcqVlug+eOIIc4bdIydtn2K0iNZPsYWQvQio2qbO3OqAlPHDDOB7DfjGEfVF51FqqNacd6QmgFKJpMfLp5DHTv4wXlONKVXF9zTJpDV4m1sYZqJPhotcsliZM8yksKkCkzpiXt+EcRQvSQqmBS9WdWkxMTJXPSw94jqI3varCjQxTazjlMH8jTS8ilaW8014/vwA/LNa+YiFoyyx3s/KswP3O8QW1jtq45yTM/DX9a8M4voTVaO2ebvw1EooDw/yg6Y1faY+WwrdVs5Yt0hQ5EwRfYXSFxray1YvSM+kYmlpLG2/9mm1MfmbKHXr44Ih8nVKb1M537ZANUkCtdsPZ80JVKVKabVHCadaLXg+IV8i5GSwpZti0h6diTaKs9sdpUKEpd7jDUpYmHtiX33SKiO3tuydkaxA7pEc9XIQEOfWJlszj5YpL5bKeQyT7aZSBOamvSHl8xsWvgo26IP/bqk+0EJUz+gkkcvlUlyPp2kdKFtt7y5aCdks9ZJJcFp5ZWeaWKgtnXMN3ORwGLBE0PtkEIek5FY2aVssUZHtsWIvnljMVJtuVIjpZup/5VL1yPOHWWHkOMc6YySWMckczD5jUj2mlLVquFaMU8leGVaqeXis+aRRL8zm4WuBk6cyWfGMxgtr8useQEx7k/PvRoZyd9nde1GUCV84gMX8Ogu/BWezYPSR27llzQnA97oo0pYyxobYUJfsj+ysTm9zJ+S4pk0TGo9VTG0KjqYhTmALfoDZVKla2b5yhv241PxFaLJs3i05K0AAIdcGxCJZmT3ZdT7CliR7q+kur7WdQjygYtOWRL9B8E4s4LI8KpAj7bE0dg7DLOaX+MGeAi0hMMSSWZEz+RudXbZCsGYS0QqiXjH9XQbd8sCB+nIVTq7/T/FDS+zWY9q7Z2fdq1tdLb6v3hKKVDAw5gjj6o9r1wHFROdHc18MJp4SJ2Ucvu+iQ9EgkekW8VCM+psM6y+/2SBy8tNN4a3L1MzP+OLsyvESo5gS7IQOnIqMmviJBVc6zbVG1n8eXiA3j46kmvvtJlewwNDrxk4SbJOtP/TV/lIVK9ueShNbbMHfwnLTLLhbZuO79ec5XvfgRwLFK+w1r5ZWW15rVFZrE+wKqNRv5KqsLNfpGgnoUU6Y71NxEmN7MyqwqAQqoIULOw/LbuUB2+uE75gJt+kq1qY4LoxV+qR/zalupea3D5+WMeaRIn0sAI6DDWDh158fqUb4YhAxhREbUN0qyyJYkBU4V2KARXDT65gW3gRsiv7xSPYEKLwzgriWcWgPr0sbZnv7m1XHNFW6xPdGNZUdxFiUYlmXNjDVWuu7LCkX/nVkrXaJhiYktBISC2xgBXQnNEP+cptWl1eG62a7CPXrnrkTQ5BQASbEqUZWMDiZUisKyHDeLFOaJILUo5f6iDt4ZO8MlqaKLto0AmTHVVbkGuyPa1R/ywZsWRoRDoRdNMMHwYTsklMVnlAd2S0282bgMI8fiJpDh69OSL6K3qbo20KfpNMurnYGQSr/stFqZ7hYsxKlLnKAKhsmB8AIpEQ4bd/NrTLTXefsE6ChRmKWjXKVgpGoPs8GAicgKVw4K0qgDgy1A6hFq1WRat3fHF+FkU+b6H4NWpOU3KXTxrIb2qSHAb+qhm8hiSROi/9ofapjxhyKxxntPpge6KL5Z4+WBMYkAcE6+0Hd3Yh2zBsK2MV3iW0Y6cvOCroXlRb2MMJtdWx+3dkFzGh2Pe3DZ9QpSqpaR/rE1ImOrHqYYyccpiLC22amJIjRWVAherTfpQLmo6/K2pna85GrDuQPlH1Tsar8isAJbXLafSwOof4gg9RkAGm/oYpBQQiPUoyDk2BCQ1k+KILq48ErFo4WSRhHLq/y7mgw3+L85PpP6xWr6cgp9sOjYjKagOrxF148uhuaWtjet953fh1IQiEzgC+d2IgBCcUZqgTAICm2bR8oCjDLBsmg+ThyhfD+zBalsKBY1Ce54Y/t9cwfbLu9SFwEgphfopNA3yNxgyDafUM3mYTovZNgPGdd4ZFFOj1vtfFW3u7N+iHEN1HkeesDMXKPyoCDCGVMo4GCCD6PBhQ3dRZIHy0Y/3MaE5zU9mTCrwwnZojtE+qNpMSkJSpmGe0EzLyFelMJqhfFQ7a50uXxZ8pCc2wxtAKWgHoeamR2O7R+bq7IbPYItO0esdRgoTaY38hZLJ5y02oIVwoPokGIzxAMDuanQ1vn2WDQ00Rh6o5QOaCRu99fwDbQcN0XAuqkFpxT/cfz3slGRVokrNU0iqiMAJFEbKScZdmSkTUznC0U+MfwFOGdLgsewRyPKwBZYSmy6U325iUhBQNxbAC3FLKDV9VSOuQpOOukJ/GAmu/tyEbX9DgEp6dv1zoU0IqzpG6gssSjIYRVPGgU1QAQYRgIT8gEV0EXr1sqeh2I6rXjtmoCYyEDCe/PkFEi/Q48FuT29p557iN+LCwk5CK/CZ2WdAdfQZh2Z9QGrzPLSNRj5igUWzl9Vi0rCqH8G1Kp4QMLkuwMCAypdviDXyOIk0AHTM8HBYKh3b0/F+DxoNj4ZdoZfCpQVdnZarqoMaHWnMLNVcyevytGsrXQEoIbubqWYNo7NRHzdc0zvT21fWVirj7g36iy6pxogfvgHp1xH1Turbz8QyyHnXeBJicpYUctbzApwzZ1HT+FPEXMAgUZetgeGMwt4G+DHiDT2Lu+PT21fjJCAfV16a/Wu1PqOkUHSTKYhWW6PhhHUlNtWzFnA7MbY+r64vkwdpfNB2JfWgWXAvkzd42K4lN9x7Wrg4kIKgXCb4mcW595MCPJ/cTfPAMQMFWwnqwde4w8HZYJFpQwcSMhjVz4B8p6ncSCN1X4klxoIH4BN2J6taBMj6lHkAOs8JJAmXq5xsQtrPIPIIp/HG6i21xMGcFgqDXSRF0xQg14d2uy6HgKE13LSvQe52oShF5Jx1R6avyL4thhXQZHfC94oZzuPUBKFYf1VvDaxIrtV6dNGSx7DO0i1p6CzBkuAmEqyWceQY7F9+U0ObYDzoa1iKao/cOD/v6Q9gHrrr1uCeOk8fST9MG23Ul0KmM3r+Wn6Hi6WAcL7gEeaykicvgjzkjSwFsAXIR81Zx4QJ6oosVyJkCcT+4xAldCcihqvTf94HHUPXYp3REIaR4dhpQF6+FK1H0i9i7Pvh8owu3lO4PT1iuqu+DkL2Bj9+kdfGAg2TXw03iNHyobxofLE2ibjsYDPgeEQlRMR7afXbSGQcnPjI2D+sdtmuQ771dbASUsDndU7t58jrrNGRzISvwioAlHs5FA+cBE5Ccznkd8NMV6BR6ksnKLPZnMUawRDU1MZ/ib3xCdkTblHKu4blNiylH5n213yM0zubEie0o4JhzcfAy3H5qh2l17uLooBNLaO+gzonTH2uF8PQu9EyH+pjGsACTMy4cHzsPdymUSXYJOMP3yTkXqvO/lpvt0cX5ekDEu9PUfBeZODkFuAjXCaGdi6ew4qxJ8PmFfwmPpkgQjQlWqomFY6UkjmcnAtJG75EVR+NpzGpP1Ef5qUUbfowrC3zcSLX3BxgWEgEx/v9cP8H8u1Mvt9/rMDYf6sjwU1xSOPBgzFEeJLMRVFtKo5QHsUYT8ZRLCah27599EuqoC9PYjYO6aoAMHB8X1OHwEAYouHfHB3nyb2B+SnZxM/vw/bCtORjLMSy5aZoEpvgdGvlJfNPFUu/p7Z4VVK1hiI0/UTuB3ZPq4ohEbm7Mntgc1evEtknaosgZSwnDC2BdMmibpeg48X8Ixl+/8+xXdbshQXUPPvx8jT3fkELivHSmqbhblfNFShWAyQnJ3WBU6SMYSIpTDmHjdLVAdlADdz9gCplZw6mTiHqDwIsxbm9ErGusiVpg2w8Q3khKV/R9Oj8PFeF43hmW/nSd99nZzhyjCX3QOZkkB6BsH4H866WGyv9E0hVAzPYah2tkRfQZMmP2rinfOeQalge0ovhduBjJs9a1GBwReerceify49ctOh5/65ATYuMsAkVltmvTLBk4oHpdl6i+p8DoNj4Fb2vhdFYer2JSEilEwPd5n5zNoGBXEjreg/wh2NFnNRaIUHSOXa4eJRwygZoX6vnWnqVdCRT1ARxeFrNBJ+tsdooMwqnYhE7zIxnD8pZH+P0Nu1wWxCPTADfNWmqx626IBJJq6NeapcGeOmbtXvl0TeWG0Y7OGGV4+EHTtNBIT5Wd0Bujl7inXgZgfXTM5efD3qDTJ54O9v3Bkv+tdIRlq1kXcVD0BEMirmFxglNPt5pedb1AnxuCYMChUykwsTIWqT23XDpvTiKEru1cTcEMeniB+HQDehxPXNmkotFdwUPnilB/u4Nx5Xc6l8J9jH1EgKZUUt8t8cyoZleDBEt8oibDmJRAoMKJ5Oe9CSWS5ZMEJvacsGVdXDWjp/Ype5x0p9PXB2PAwt2LRD3d+ftNgpuyvxlP8pB84oB1i73vAVpwyrmXW72hfW6Dzn9Jkj4++0VQ4d0KSx1AsDA4OtXXDo63/w+GD+zC7w5SJaxsmnlYRQ4dgdjA7tTl2KNLnpJ+mvkoDxtt1a4oPaX3EVqj96o9sRKBQqU7ZOiupeAIyLMD+Y3YwHx30XWHB5CQiw7q3mj1EDlP2eBsZbz79ayUMbyHQ7s8gu4Lgip1LiGJj7NQj905/+rgUYKAA5qdrlHKIknWmqfuR+PB8RdBkDg/NgnlT89G72h2NvySnj7UyBwD+mi/IWs1xWbxuVwUIVXun5cMqBtFbrccI+DILjsVQg6eeq0itiRfedn89CvyFtpkxaauEvSANuZmB1p8FGPbU94J9medwsZ9HkUYjmI7OH5HuxendLbxTaYrPuIfE2ffXFKhoNBUp33HsFAXmCV/Vxpq5AYgFoRr5Ay93ZLRlgaIPjhZjXZZChT+aE5iWAXMX0oSFQEtwjiuhQQItTQX5IYrKfKB+queTNplR1Hoflo5/I6aPPmACwQCE2jTOYo5Dz1cs7Sod0KTG/3kEDGk3kUaUCON19xSJCab3kNpWZhSWkO8l+SpW70Wn3g0ciOIJO5JXma6dbos6jyisuxXwUUhj2+1uGhcvuliKtWwsUTw4gi1c/diEEpZHoKoxTBeMDmhPhKTx7TXWRakV8imJR355DcIHkR9IREHxohP4TbyR5LtFU24umRPRmEYHbpe1LghyxPx7YgUHjNbbQFRQhh4KeU1EabXx8FS3JAxp2rwRDoeWkJgWRUSKw6gGP5U2PuO9V4ZuiKXGGzFQuRuf+tkSSsbBtRJKhCi3ENuLlXhPbjTKD4djXVnfXFds6Zb+1XiUrRfyayGxJq1+SYBEfbKlgjiSmk0orgTqzSS+DZ5rTqsJbttiNtp+KMqGE2AHGFw6jQqM5vD6vMptmXV9OAjq49Uf/Lx9Opam+Hn5O9p8qoBBAQixzQZ4eNVkO9sPzJAMyR1y4/RCQQ1s0pV5KAU5sKLw3tkcFbI/JqrjCsK4Mw+W8aod4lioYuawUiCyVWBE/qPaFi5bnkgpfu/ae47174rI1fqQoTbW0HrU6FAejq7ByM0V4zkZTg02/YJK2N7hUQRCeZ4BIgSEqgD8XsjzG6LIsSbuHoIdz/LhFzbNn1clci1NHWJ0/6/O8HJMdIpEZbqi1RrrFfoo/rI/7ufm2MPG5lUI0IYJ4MAiHRTSOFJ2oTverFHYXThkYFIoyFx6rMYFgaOKM4xNWdlOnIcKb/suptptgTOTdVIf4YgdaAjJnIAm4qNNHNQqqAzvi53GkyRCEoseUBrHohZsjUbkR8gfKtc/+Oa72lwxJ8Mq6HDfDATbfbJhzeIuFQJSiw1uZprHlzUf90WgqG76zO0eCB1WdPv1IT6sNxxh91GEL2YpgC97ikFHyoaH92ndwduqZ6IYjkg20DX33MWdoZk7QkcKUCgisIYslOaaLyvIIqRKWQj16jE1DlQWJJaPopWTJjXfixEjRJJo8g4++wuQjbq+WVYjsqCuNIQW3YjnxKe2M5ZKEqq+cX7ZVgnkbsU3RWIyXA1rxv4kGersYJjD//auldXGmcEbcfTeF16Y1708FB1HIfmWv6dSFi6oD4E+RIjCsEZ+kY7dKnwReJJw3xCjKvi3kGN42rvyhUlIz0Bp+fNSV5xwFiuBzG296e5s/oHoFtUyUplmPulIPl+e1CQIQVtjlzLzzzbV+D/OVQtYzo5ixtMi5BmHuG4N/uKfJk5UIREp7+12oZlKtPBomXSzAY0KgtbPzzZoHQxujnREUgBU+O/jKKhgxVhRPtbqyHiUaRwRpHv7pgRPyUrnE7fYkVblGmfTY28tFCvlILC04Tz3ivkNWVazA+OsYrxvRM/hiNn8Fc4bQBeUZABGx5S/xFf9Lbbmk298X7iFg2yeimvsQqqJ+hYbt6uq+Zf9jC+Jcwiccd61NKQtFvGWrgJiHB5lwi6fR8KzYS7EaEHf/ka9EC7H8D+WEa3TEACHBkNSj/cXxFeq4RllC+fUFm2xtstYLL2nos1DfzsC9vqDDdRVcPA3Ho95aEQHvExVThXPqym65llkKlfRXbPTRiDepdylHjmV9YTWAEjlD9DdQnCem7Aj/ml58On366392214B5zrmQz/9ySG2mFqEwjq5sFl5tYJPw5hNz8lyZPUTsr5E0F2C9VMPnZckWP7+mbwp/BiN7f4kf7vtGnZF2JGvjK/sDX1RtcFY5oPQnE4lIAYV49U3C9SP0LCY/9i/WIFK9ORjzM9kG/KGrAuwFmgdEpdLaiqQNpCTGZVuAO65afkY1h33hrqyLjZy92JK3/twdj9pafFcwfXONmPQWldPlMe7jlP24Js0v9m8bIJ9TgS2IuRvE9ZVRaCwSJYOtAfL5H/YS4FfzKWKbek+GFulheyKtDNlBtrdmr+KU+ibHTdalzFUmMfxw3f36x+3cQbJLItSilW9cuvZEMjKw987jykZRlsH/UI+HlKfo2tLwemBEeBFtmxF2xmItA/dAIfQ+rXnm88dqvXa+GapOYVt/2waFimXFx3TC2MUiOi5/Ml+3rj/YU6Ihx2hXgiDXFsUeQkRAD6wF3SCPi2flk7XwKAA4zboqynuELD312EJ88lmDEVOMa1W/K/a8tGylZRMrMoILyoMQzzbDJHNZrhH77L9qSC42HVmKiZ5S0016UTp83gOhCwz9XItK9fgXfK3F5d7nZCBUekoLxrutQaPHa16Rjsa0gTrzyjqTnmcIcrxg6X6dkKiucudc0DD5W4pJPf0vuDW8r5/uw24YfMuxFRpD2ovT2mFX79xH6Jf+MVdv2TYqR6/955QgVPe3JCD/WjAYcLA9tpXgFiEjge2J5ljeI/iUzg91KQuHkII4mmHZxC3XQORLAC6G7uFn5LOmlnXkjFdoO976moNTxElS8HdxWoPAkjjocDR136m2l+f5t6xaaNgdodOvTu0rievnhNAB79WNrVs6EsPgkgfahF9gSFzzAd+rJSraw5Mllit7vUP5YxA843lUpu6/5jAR0RvH4rRXkSg3nE+O5GFyfe+L0s5r3k05FyghSFnKo4TTgs07qj4nTLqOYj6qaW9knJTDkF5OFMYbmCP+8H16Ty482OjvERV6OFyw043L9w3hoJi408sR+SGo1WviXUu8d7qS+ehKjpKwxeCthsm2LBFSFeetx0x4AaKPxtp3CxdWqCsLrB1s/j5TAhc1jNZsXWl6tjo/WDoewxzg8T8NnhZ1niUwL/nhfygLanCnRwaFGDyLw+sfZhyZ1UtYTp8TYB6dE7R3VsKKH95CUxJ8u8N+9u2/9HUNKHW3x3w5GQrfOPafk2w5qZq8MaHT0ebeY3wIsp3rN9lrpIsW9c1ws3VNV+JwNz0Lo9+V7zZr6GD56We6gWVIvtmam5GPPkVAbr74r6SwhuL+TRXtW/0pgyX16VNl4/EAD50TnUPuwrW6OcUO2VlWXS0inq872kk7GUlW6o/ozFKq+Sip6LcTtSDfDrPTcCHhx75H8BeRon+KG2wRwzfDgWhALmiWOMO6h3pm1UCZEPEjScyk7tdLx6WrdA2N1QTPENvNnhCQjW6kl057/qv7IwRryHrZBCwVSbLLnFRiHdTwk8mlYixFt1slEcPD7FVht13HyqVeyD55HOXrh2ElAxJyinGeoFzwKA91zfrdLvDxJSjzmImfvTisreI25EDcVfGsmxLVbfU8PGe/7NmWWKjXcdTJ11jAlVIY/Bv/mcxg/Q10vCHwKG1GW/XbJq5nxDhyLqiorn7Wd7VEVL8UgVzpHMjQ+Z8DUgSukiVwWAKkeTlVVeZ7t1DGnCgJVIdBPZAEK5f8CDyDNo7tK4/5DBjdD5MPV86TaEhGsLVFPQSI68KlBYy84FievdU9gWh6XZrugvtCZmi9vfd6db6V7FmoEcRHnG36VZH8N4aZaldq9zZawt1uBFgxYYx+Gs/qW1jwANeFy+LCoymyM6zgG7j8bGzUyLhvrbJkTYAEdICEb4kMKusKT9V3eIwMLsjdUdgijMc+7iKrr+TxrVWG0U+W95SGrxnxGrE4eaJFfgvAjUM4SAy8UaRwE9j6ZQH5qYAWGtXByvDiLSDfOD0yFA3UCMKSyQ30fyy1mIRg4ZcgZHLNHWl+c9SeijOvbOJxoQy7lTN2r3Y8p6ovxvUY74aOYbuVezryqXA6U+fcp6wSV9X5/OZKP18tB56Ua0gMyxJI7XyNT7IrqN8GsB9rL/kP5KMrjXxgqKLDa+V5OCH6a5hmOWemMUsea9vQl9t5Oce76PrTyTv50ExOqngE3PHPfSL//AItPdB7kGnyTRhVUUFNdJJ2z7RtktZwgmQzhBG/G7QsjZmJfCE7k75EmdIKH7xlnmDrNM/XbTT6FzldcH/rcRGxlPrv4qDScqE7JSmQABJWqRT/TUcJSwoQM+1jvDigvrjjH8oeK2in1S+/yO1j8xAws/T5u0VnIvAPqaE1atNuN0cuRliLcH2j0nTL4JpcR7w9Qya0JoaHgsOiALLCCzRkl1UUESz+ze/gIXHGtDwgYrK6pCFKJ1webSDog4zTlPkgXZqxlQDiYMjhDpwTtBW2WxthWbov9dt2X9XFLFmcF+eEc1UaQ74gqZiZsdj63pH1qcv3Vy8JYciogIVKsJ8Yy3J9w/GhjWVSQAmrS0BPOWK+RKV+0lWqXgYMnIFwpcZVD7zPSp547i9HlflB8gVnSTGmmq1ClO081OW/UH11pEQMfkEdDFzjLC1Cdo/BdL3s7cXb8J++Hzz1rhOUVZFIPehRiZ8VYu6+7Er7j5PSZu9g/GBdmNzJmyCD9wiswj9BZw+T3iBrg81re36ihMLjoVLoWc+62a1U/7qVX5CpvTVF7rocSAKwv4cBVqZm7lLDS/qoXs4fMs/VQi6BtVbNA3uSzKpQfjH1o3x4LrvkOn40zhm6hjduDglzJUwA0POabgdXIndp9fzhOo23Pe+Rk9GSLX0d71Poqry8NQDTzNlsa+JTNG9+UrEf+ngxCjGEsDCc0bz+udVRyHQI1jmEO3S+IOQycEq7XwB6z3wfMfa73m8PVRp+iOgtZfeSBl01xn03vMaQJkyj7vnhGCklsCWVRUl4y+5oNUzQ63B2dbjDF3vikd/3RUMifPYnX5Glfuk2FsV/7RqjI9yKTbE8wJY+74p7qXO8+dIYgjtLD/N8TJtRh04N9tXJA4H59IkMmLElgvr0Q5OCeVfdAt+5hkh4pQgfRMHpL74XatLQpPiOyHRs/OdmHtBf8nOZcxVKzdGclIN16lE7kJ+pVMjspOI+5+TqLRO6m0ZpNXJoZRv9MPDRcAfJUtNZHyig/s2wwReakFgPPJwCQmu1I30/tcBbji+Na53i1W1N+BqoY7Zxo+U/M9XyJ4Ok2SSkBtoOrwuhAY3a03Eu6l8wFdIG1cN+e8hopTkiKF093KuH/BcB39rMiGDLn6XVhGKEaaT/vqb/lufuAdpGExevF1+J9itkFhCfymWr9vGb3BTK4j598zRH7+e+MU9maruZqb0pkGxRDRE1CD4Z8LV4vhgPidk5w2Bq816g3nHw1//j3JStz7NR9HIWELO8TMn3QrP/zZp//+Dv9p429/ogv+GATR+n/UdF+ns9xNkXZQJXY4t9jMkJNUFygAtzndXwjss+yWH9HAnLQQfhAskdZS2l01HLWv7L7us5uTH409pqitvfSOQg/c+Zt7k879P3K9+WV68n7+3cZfuRd/dDPP/03rn+d+/nBvWfgDlt8+LzjqJ/vx3CnNOwiXhho778C96iD+1TBvRZYeP+EH81LE0vVwOOrmCLB3iKzI1x+vJEsrPH4uF0UB4TJ4X3uDfOCo3PYpYe0MF4bouh0DQ/l43fxUF7Y+dpWuvTSffB0yO2UQUETI/LwCZE3BvnevJ7c9zUlY3H58xzke6DNFDQG8n0WtDN4LAYN4nogKav1ezOfK/z+t6tsCTp+dhx4ymjWuCJk1dEUifDP+HyS4iP/Vg9B2jTo9L4NbiBuDS4nuuHW6H+JDQn2JtqRKGkEQPEYE7uzazXIkcxIAqUq1esasZBETlEZY7y7Jo+RoV/IsjY9eIMkUvr42Hc0xqtsavZvhz1OLwSxMOTuqzlhb0WbdOwBH9EYiyBjatz40bUxTHbiWxqJ0uma19qhPruvcWJlbiSSH48OLDDpaHPszvyct41ZfTu10+vjox6kOqK6v0K/gEPphEvMl/vwSv+A4Hhm36JSP9IXTyCZDm4kKsqD5ay8b1Sad/vaiyO5N/sDfEV6Z4q95E+yfjxpqBoBETW2C7xl4pIO2bDODDFurUPwE7EWC2Uplq+AHmBHvir2PSgkR12/Ry65O0aZtQPeXi9mTlF/Wj5GQ+vFkYyhXsLTjrBSP9hwk4GPqDP5rBn5/l8b0mLRAvRSzXHc293bs3s8EsdE3m2exxidWVB4joHR+S+dz5/W+v00K3TqN14CDBth8eWcsTbiwXPsygHdGid0PEdy6HHm2v/IUuV5RVapYmzGsX90mpnIdNGcOOq64Dbc5GUbYpD9M7S+6cLY//QmjxFLP5cuTFRm3vA5rkFZroFnO3bjHF35uU3s8mvL7Tp9nyTc4mymTJ5sLIp7umSnGkO23faehtz3mmTS7fbVx5rP7x3HXIjRNeq/A3xCs9JNB08c9S9BF2O3bOur0ItslFxXgRPdaapBIi4dRpKGxVz7ir69t/bc9qTxjvtOyGOfiLGDhR4fYywHv1WdOplxIV87TpLBy3Wc0QP0P9s4G7FBNOdITS/tep3o3h1TEa5XDDii7fWtqRzUEReP2fbxz7bHWWJdbIOxOUJZtItNZpTFRfj6vm9sYjRxQVO+WTdiOhdPeTJ+8YirPvoeL88l5iLYOHd3b/Imkq+1ZN1El3UikhftuteEYxf1Wujof8Pr4ICTu5ezZyZ4tHQMxlzUHLYO2VMOoNMGL/20S5i2o2obfk+8qqdR7xzbRDbgU0lnuIgz4LelQ5XS7xbLuSQtNS95v3ZUOdaUx/Qd8qxCt6xf2E62yb/HukLO6RyorV8KgYl5YNc75y+KvefrxY+lc/64y9kvWP0a0bDz/rojq+RWjO06WeruWqNFU7r3HPIcLWRql8ICZsz2Ls/qOm/CLn6++X+Qf7mGspYCrZod/lpl6Rw4xN/yuq8gqV4B6aHk1hVE1SfILxWu5gvXqbfARYQpspcxKp1F/c8XOPzkZvmoSw+vEqBLdrq1fr3wAPv5NnM9i8F+jdAuxkP5Z71c6uhK3enlnGymr7UsWZKC12qgUiG8XXGQ9mxnqz4GSIlybF9eXmbqj2sHX+a1jf0gRoONHRdRSrIq03Ty89eQ1GbV/Bk+du4+V15zls+vvERvZ4E7ZbnxWTVjDjb4o/k8jlw44pTIrUGxxuJvBeO+heuhOjpFsO6lVJ/aXnJDa/bM0Ql1cLbXE/Pbv3EZ3vj3iVrB5irjupZTzlnv677NrI9UNYNqbPgp/HZXS+lJmk87wec+7YOxTDo2aw2l3NfDr34VNlvqWJBknuK7oSlZ6/T10zuOoPZOeoIk81N+sL843WJ2Q4Z0fZ3scsqC/JV2fuhWi1jGURSKZV637lf53Xnnx16/vKEXY89aVJ0fv91jGdfG+G4+sniwHes4hS+udOr4RfhFhG/F5gUG35QaU+McuLmclb5ZWmR+sG5V6nf+PxYzlrnFGxpZaK8eqqVo0NfmAWoGfXDiT/FnUbWvzGDOTr8aktOZWg4BYvz5YH12ZbfCcGtNk+dDAZNGWvHov+PIOnY9Prjg8h/wLRrT69suaMVZ5bNuK00lSVpnqSX1NON/81FoP92rYndionwgOiA8WMf4vc8l15KqEEG4yAm2+WAN5Brfu1sq9suWYqgoajgOYt/JCk1gC8wPkK+XKCtRX6TAtgvrnuBgNRmn6I8lVDipOVB9kX6Oxkp4ZKyd1M6Gj8/v2U7k+YQBL95Kb9PQENucJb0JlW3b5tObN7m/Z1j1ev388d7o15zgXsI9CikAGAViR6lkJv7nb4Ak40M2G8TJ447kN+pvfHiOFjSUSP6PM+QfbAywKJCBaxSVxpizHseZUyUBhq59vFwrkyGoRiHbo0apweEZeSLuNiQ+HAekOnarFg00dZNXaPeoHPTRR0FmEyqYExOVaaaO8c0uFUh7U4e/UxdBmthlBDgg257Q33j1hA7HTxSeTTSuVnPZbgW1nodwmG16aKBDKxEetv7D9OjO0JhrbJTnoe+kcGoDJazFSO8/fUN9Jy/g4XK5PUkw2dgPDGpJqBfhe7GA+cjzfE/EGsMM+FV9nj9IAhrSfT/J3QE5TEIYyk5UjsI6ZZcCPr6A8FZUF4g9nnpVmjX90MLSQysIPD0nFzqwCcSJmIb5mYv2Cmk+C1MDFkZQyCBq4c/Yai9LJ6xYkGS/x2s5/frIW2vmG2Wrv0APpCdgCA9snFvfpe8uc0OwdRs4G9973PGEBnQB5qKrCQ6m6X/H7NInZ7y/1674/ZXOVp7OeuCRk8JFS516VHrnH1HkIUIlTIljjHaQtEtkJtosYul77cVwjk3gW1Ajaa6zWeyHGLlpk3VHE2VFzT2yI/EvlGUSz2H9zYE1s4nsKMtMqNyKNtL/59CpFJki5Fou6VXGm8vWATEPwrUVOLvoA8jLuwOzVBCgHB2Cr5V6OwEWtJEKokJkfc87h+sNHTvMb0KVTp5284QTPupoWvQVUwUeogZR3kBMESYo0mfukewRVPKh5+rzLQb7HKjFFIgWhj1w3yN/qCNoPI8XFiUgBNT1hCHBsAz8L7Oyt8wQWUFj92ONn/APyJFg8hzueqoJdNj57ROrFbffuS/XxrSXLTRgj5uxZjpgQYceeMc2wJrahReSKpm3QjHfqExTLAB2ipVumE8pqcZv8LYXQiPHHsgb5BMW8zM5pvQit+mQx8XGaVDcfVbLyMTlY8xcfmm/RSAT/H09UQol5gIz7rESDmnrQ4bURIB4iRXMDQwxgex1GgtDxKp2HayIkR+E/aDmCttNm2C6lytWdfOVzD6X2SpDWjQDlMRvAp1symWv4my1bPCD+E1EmGnMGWhNwmycJnDV2WrQNxO45ukEb08AAffizYKVULp15I4vbNK5DzWwCSUADfmKhfGSUqii1L2UsE8rB7mLuHuUJZOx4+WiizHBJ/hwboaBzhpNOVvgFTf5cJsHef7L1HCI9dOUUbb+YxUJWn6dYOLz+THi91kzY5dtO5c+grX7v0jEbsuoOGnoIreDIg/sFMyG+TyCLIcAWd1IZ1UNFxE8Uie13ucm40U2fcxC0u3WLvLOxwu+F7MWUsHsdtFQZ7W+nlfCASiAKyh8rnP3EyDByvtJb6Kax6/HkLzT9SyEyTMVM1zPtM0MJY14DmsWh4MgD15Ea9Hd00AdkTZ0EiG5NAGuIBzQJJ0JR0na+OB7lQA6UKxMfihIQ7GCCnVz694QvykWXTxpS2soDu+smru1UdIxSvAszBFD1c8c6ZOobA8bJiJIvuycgIXBQIXWwhyTgZDQxJTRXgEwRNAawGSXO0a1DKjdihLVNp/taE/xYhsgwe+VpKEEB4LlraQyE84gEihxCnbfoyOuJIEXy2FIYw+JjRusybKlU2g/vhTSGTydvCvXhYBdtAXtS2v7LkHtmXh/8fly1do8FI/D0f8UbzVb5h+KRhMGSAmR2mhi0YG/uj7wgxcfzCrMvdjitUIpXDX8ae2JcF/36qUWIMwN6JsjaRGNj+jEteGDcFyTUb8X/NHSucKMJp7pduxtD6KuxVlyxxwaeiC1FbGBESO84lbyrAugYxdl+2N8/6AgWpo/IeoAOcsG35IA/b3AuSyoa55L7llBLlaWlEWvuCFd8f8NfcTUgzJv6CbB+6ohWwodlk9nGWFpBAOaz5uEW5xBvmjnHFeDsb0mXwayj3mdYq5gxxNf3H3/tnCgHwjSrpSgVxLmiTtuszdRUFIsn6LiMPjL808vL1uQhDbM7aA43mISXReqjSskynIRcHCJ9qeFopJfx9tqyUoGbSwJex/0aDE3plBPGtNBYgWbdLom3+Q/bjdizR2/AS/c/dH/d3G7pyl1qDXgtOFtEqidwLqxPYtrNEveasWq3vPUUtqTeu8gpov4bdOQRI2kneFvRNMrShyVeEupK1PoLDPMSfWMIJcs267mGB8X9CehQCF0gIyhpP10mbyM7lwW1e6TGvHBV1sg/UyTghHPGRqMyaebC6pbB1WKNCQtlai1GGvmq9zUKaUzLaXsXEBYtHxmFbEZ2kJhR164LhWW2Tlp1dhsGE7ZgIWRBOx3Zcu2DxgH+G83WTPceKG0TgQKKiiNNOlWgvqNEbnrk6fVD+AqRam2OguZb0YWSTX88N+i/ELSxbaUUpPx4vJUzYg/WonSeA8xUK6u7DPHgpqWpEe6D4cXg5uK9FIYVba47V/nb+wyOtk+zG8RrS4EA0ouwa04iByRLSvoJA2FzaobbZtXnq8GdbfqEp5I2dpfpj59TCVif6+E75p665faiX8gS213RqBxTZqfHP46nF6NSenOneuT+vgbLUbdTH2/t0REFXZJOEB6DHvx6N6g9956CYrY/AYcm9gELJXYkrSi+0F0geKDZgOCIYkLU/+GOW5aGj8mvLFgtFH5+XC8hvAE3CvHRfl4ofM/Qwk4x2A+R+nyc9gNu/9Tem7XW4XRnyRymf52z09cTOdr+PG6+P/Vb4QiXlwauc5WB1z3o+IJjlbxI8MyWtSzT+k4sKVbhF3xa+vDts3NxXa87iiu+xRH9cAprnOL2h6vV54iQRXuOAj1s8nLFK8gZ70ThIQcWdF19/2xaJmT0efrkNDkWbpAQPdo92Z8+Hn/aLjbOzB9AI/k12fPs9HhUNDJ1u6ax2VxD3R6PywN7BrLJ26z6s3QoMp76qzzwetrDABKSGkfW5PwS1GvYNUbK6uRqxfyVGNyFB0E+OugMM8kKwmJmupuRWO8XkXXXQECyRVw9UyIrtCtcc4oNqXqr7AURBmKn6Khz3eBN96LwIJrAGP9mr/59uTOSx631suyT+QujDd4beUFpZ0kJEEnjlP+X/Kr2kCKhnENTg4BsMTOmMqlj2WMFLRUlVG0fzdCBgUta9odrJfpVdFomTi6ak0tFjXTcdqqvWBAzjY6hVrH9sbt3Z9gn+AVDpTcQImefbB4edirjzrsNievve4ZT4EUZWV3TxEsIW+9MT/RJoKfZZYSRGfC1CwPG/9rdMOM8qR/LUYvw5f/emUSoD7YSFuOoqchdUg2UePd1eCtFSKgxLSZ764oy4lvRCIH6bowPxZWwxNFctksLeil47pfevcBipkkBIc4ngZG+kxGZ71a72KQ7VaZ6MZOZkQJZXM6kb/Ac0/XkJx8dvyfJcWbI3zONEaEPIW8GbkYjsZcwy+eMoKrYjDmvEEixHzkCSCRPRzhOfJZuLdcbx19EL23MA8rnjTZZ787FGMnkqnpuzB5/90w1gtUSRaWcb0eta8198VEeZMUSfIhyuc4/nywFQ9uqn7jdqXh+5wwv+RK9XouNPbYdoEelNGo34KyySwigsrfCe0v/PlWPvQvQg8R0KgHO18mTVThhQrlbEQ0Kp/JxPdjHyR7E1QPw/ut0r+HDDG7BwZFm9IqEUZRpv2WpzlMkOemeLcAt5CsrzskLGaVOAxyySzZV/D2EY7ydNZMf8e8VhHcKGHAWNszf1EOq8fNstijMY4JXyATwTdncFFqcNDfDo+mWFvxJJpc4sEZtjXyBdoFcxbUmniCoKq5jydUHNjYJxMqN1KzYV62MugcELVhS3Bnd+TLLOh7dws/zSXWzxEb4Nj4aFun5x4kDWLK5TUF/yCXB/cZYvI9kPgVsG2jShtXkxfgT+xzjJofXqPEnIXIQ1lnIdmVzBOM90EXvJUW6a0nZ/7XjJGl8ToO3H/fdxnxmTNKBZxnkpXLVgLXCZywGT3YyS75w/PAH5I/jMuRspej8xZObU9kREbRA+kqjmKRFaKGWAmFQspC+QLbKPf0RaK3OXvBSWqo46p70ws/eZpu6jCtZUgQy6r4tHMPUdAgWGGUYNbuv/1a6K+MVFsd3T183+T8capSo6m0+Sh57fEeG/95dykGJBQMj09DSW2bY0mUonDy9a8trLnnL5B5LW3Nl8rJZNysO8Zb+80zXxqUGFpud3Qzwb7bf+8mq6x0TAnJU9pDQR9YQmZhlna2xuxJt0aCO/f1SU8gblOrbIyMsxTlVUW69VJPzYU2HlRXcqE2lLLxnObZuz2tT9CivfTAUYfmzJlt/lOPgsR6VN64/xQd4Jlk/RV7UKVv2Gx/AWsmTAuCWKhdwC+4HmKEKYZh2Xis4KsUR1BeObs1c13wqFRnocdmuheaTV30gvVXZcouzHKK5zwrN52jXJEuX6dGx3BCpV/++4f3hyaW/cQJLFKqasjsMuO3B3WlMq2gyYfdK1e7L2pO/tRye2mwzwZPfdUMrl5wdLqdd2Kv/wVtnpyWYhd49L6rsOV+8HXPrWH2Kup89l2tz6bf80iYSd+V4LROSOHeamvexR524q4r43rTmtFzQvArpvWfLYFZrbFspBsXNUqqenjxNNsFXatZvlIhk7teUPfK+YL32F8McTnjv0BZNppb+vshoCrtLXjIWq3EJXpVXIlG6ZNL0dh6qEm2WMwDjD3LfOfkGh1/czYc/0qhiD2ozNnH4882MVVt3JbVFkbwowNCO3KL5IoYW5wlVeGCViOuv1svZx7FbzxKzA4zGqBlRRaRWCobXaVq4yYCWbZf8eiJwt3OY+MFiSJengcFP2t0JMfzOiJ7cECvpx7neg1Rc5x+7myPJOXt2FohVRyXtD+/rDoTOyGYInJelZMjolecVHUhUNqvdZWg2J2t0jPmiLFeRD/8fOT4o+NGILb+TufCo9ceBBm3JLVn+MO2675n7qiEX/6W+188cYg3Zn5NSTjgOKfWFSAANa6raCxSoVU851oJLY11WIoYK0du0ec5E4tCnAPoKh71riTsjVIp3gKvBbEYQiNYrmH22oLQWA2AdwMnID6PX9b58dR2QKo4qag1D1Z+L/FwEKTR7osOZPWECPJIHQqPUsM5i/CH5YupVPfFA5pHUBcsesh8eO5YhyWnaVRPZn/BmdXVumZWPxMP5e28zm2uqHgFoT9CymHYNNrzrrjlXZM06HnzDxYNlI5b/QosxLmmrqDFqmogQdqk0WLkUceoAvQxHgkIyvWU69BPFr24VB6+lx75Rna6dGtrmOxDnvBojvi1/4dHjVeg8owofPe1cOnxU1ioh016s/Vudv9mhV9f35At+Sh28h1bpp8xhr09+vf47Elx3Ms6hyp6QvB3t0vnLbOhwo660cp7K0vvepabK7YJfxEWWfrC2YzJfYOjygPwfwd/1amTqa0hZ5ueebhWYVMubRTwIjj+0Oq0ohU3zfRfuL8gt59XsHdwKtxTQQ4Y2qz6gisxnm2UdlmpEkgOsZz7iEk6QOt8BuPwr+NR01LTqXmJo1C76o1N274twJvl+I069TiLpenK/miRxhyY8jvYV6W1WuSwhH9q7kuwnJMtm7IWcqs7HsnyHSqWXLSpYtZGaR1V3t0gauninFPZGtWskF65rtti48UV9uV9KM8kfDYs0pgB00S+TlzTXV6P8mxq15b9En8sz3jWSszcifZa/NuufPNnNTb031pptt0+sRSH/7UG8pzbsgtt3OG3ut7B9JzDMt2mTZuyRNIV8D54TuTrpNcHtgmMlYJeiY9XS83NYJicjRjtJSf9BZLsQv629QdDsKQhTK5CnXhpk7vMNkHzPhm0ExW/VCGApHfPyBagtZQTQmPHx7g5IXXsrQDPzIVhv2LB6Ih138iSDww1JNHrDvzUxvp73MsQBVhW8EbrReaVUcLB1R3PUXyaYG4HpJUcLVxMgDxcPkVRQpL7VTAGabDzbKcvg12t5P8TSGQkrj/gOrpnbiDHwluA73xbXts/L7u468cRWSWRtgTwlQnA47EKg0OiZDgFxAKQQUcsbGomITgeXUAAyKe03eA7Mp4gnyKQmm0LXJtEk6ddksMJCuxDmmHzmVhO+XaN2A54MIh3niw5CF7PwiXFZrnA8wOdeHLvvhdoqIDG9PDI7UnWWHq526T8y6ixJPhkuVKZnoUruOpUgOOp3iIKBjk+yi1vHo5cItHXb1PIKzGaZlRS0g5d3MV2pD8FQdGYLZ73aae/eEIUePMc4NFz8pIUfLCrrF4jVWH5gQneN3S8vANBmUXrEcKGn6hIUN95y1vpsvLwbGpzV9L0ZKTan6TDXM05236uLJcIEMKVAxKNT0K8WljuwNny3BNQRfzovA85beI9zr1AGNYnYCVkR1aGngWURUrgqR+gRrQhxW81l3CHevjvGEPzPMTxdsIfB9dfGRbZU0cg/1mcubtECX4tvaedmNAvTxCJtc2QaoUalGfENCGK7IS/O8CRpdOVca8EWCRwv2sSWE8CJPW5PCugjCXPd3h6U60cPD+bdhtXZuYB6stcoveE7Sm5MM2yvfUHXFSW7KzLmi7/EeEWL0wqcOH9MOSKjhCHHmw+JGLcYE/7SBZQCRggox0ZZTAxrlzNNXYXL5fNIjkdT4YMqVUz6p8YDt049v4OXGdg3qTrtLBUXOZf7ahPlZAY/O+7Sp0bvGSHdyQ8B1LOsplqMb9Se8VAE7gIdSZvxbRSrfl+Lk5Qaqi5QJceqjitdErcHXg/3MryljPSIAMaaloFm1cVwBJ8DNmkDqoGROSHFetrgjQ5CahuKkdH5pRPigMrgTtlFI8ufJPJSUlGgTjbBSvpRc0zypiUn6U5KZqcRoyrtzhmJ7/caeZkmVRwJQeLOG8LY6vP5ChpKhc8Js0El+n6FXqbx9ItdtLtYP92kKfaTLtCi8StLZdENJa9Ex1nOoz1kQ7qxoiZFKRyLf4O4CHRT0T/0W9F8epNKVoeyxUXhy3sQMMsJjQJEyMOjmOhMFgOmmlscV4eFi1CldU92yjwleirEKPW3bPAuEhRZV7JsKV3Lr5cETAiFuX5Nw5UlF7d2HZ96Bh0sgFIL5KGaKSoVYVlvdKpZJVP5+NZ7xDEkQhmDgsDKciazJCXJ6ZN2B3FY2f6VZyGl/t4aunGIAk/BHaS+i+SpdRfnB/OktOvyjinWNfM9Ksr6WwtCa1hCmeRI6icpFM4o8quCLsikU0tMoZI/9EqXRMpKGaWzofl4nQuVQm17d5fU5qXCQeCDqVaL9XJ9qJ08n3G3EFZS28SHEb3cdRBdtO0YcTzil3QknNKEe/smQ1fTb0XbpyNB5xAeuIlf+5KWlEY0DqJbsnzJlQxJPOVyHiKMx5Xu9FcEv1Fbg6Fhm4t+Jyy5JC1W3YO8dYLsO0PXPbxodBgttTbH3rt9Cp1lJIk2r3O1Zqu94eRbnIz2f50lWolYzuKsj4PMok4abHLO8NAC884hiXx5Fy5pWKO0bWL7uEGXaJCtznhP67SlQ4xjWIfgq6EpZ28QMtuZK7JC0RGbl9nA4XtFLug/NLMoH1pGt9IonAJqcEDLyH6TDROcbsmGPaGIxMo41IUAnQVPMPGByp4mOmh9ZQMkBAcksUK55LsZj7E5z5XuZoyWCKu6nHmDq22xI/9Z8YdxJy4kWpD16jLVrpwGLWfyOD0Wd+cBzFBxVaGv7S5k9qwh/5t/LQEXsRqI3Q9Rm3QIoaZW9GlsDaKOUyykyWuhNOprSEi0s1G4rgoiX1V743EELti+pJu5og6X0g6oTynUqlhH9k6ezyRi05NGZHz0nvp3HOJr7ebrAUFrDjbkFBObEvdQWkkUbL0pEvMU46X58vF9j9F3j6kpyetNUBItrEubW9ZvMPM4qNqLlsSBJqOH3XbNwv/cXDXNxN8iFLzUhteisYY+RlHYOuP29/Cb+L+xv+35Rv7xudnZ6ohK4cMPfCG8KI7dNmjNk/H4e84pOxn/sZHK9psfvj8ncA8qJz7O8xqbxESDivGJOZzF7o5PJLQ7g34qAWoyuA+x3btU98LT6ZyGyceIXjrqob2CAVql4VOTQPUQYvHV/g4zAuCZGvYQBtf0wmd5lilrvuEn1BXLny01B4h4SMDlYsnNpm9d7m9h578ufpef9Z4WplqWQvqo52fyUA7J24eZD5av6SyGIV9kpmHNqyvdfzcpEMw97BvknV2fq+MFHun9BT3Lsf8pbzvisWiIQvYkng+8Vxk1V+dli1u56kY50LRjaPdotvT5BwqtwyF+emo/z9J3yVUVGfKrxQtJMOAQWoQii/4dp9wgybSa5mkucmRLtEQZ/pz0tL/NVcgWAd95nEQ3Tg6tNbuyn3Iepz65L3huMUUBntllWuu4DbtOFSMSbpILV4fy6wlM0SOvi6CpLh81c1LreIvKd61uEWBcDw1lUBUW1I0Z+m/PaRlX+PQ/oxg0Ye6KUiIiTF4ADNk59Ydpt5/rkxmq9tV5Kcp/eQLUVVmBzQNVuytQCP6Ezd0G8eLxWyHpmZWJ3bAzkWTtg4lZlw42SQezEmiUPaJUuR/qklVA/87S4ArFCpALdY3QRdUw3G3XbWUp6aq9z0zUizcPa7351p9JXOZyfdZBFnqt90VzQndXB/mwf8LC9STj5kenVpNuqOQQP3mIRJj7eV21FxG8VAxKrEn3c+XfmZ800EPb9/5lIlijscUbB6da0RQaMook0zug1G0tKi/JBC4rw7/D3m4ARzAkzMcVrDcT2SyFtUdWAsFlsPDFqV3N+EjyXaoEePwroaZCiLqEzb8MW+PNE9TmTC01EzWli51PzZvUqkmyuROU+V6ik+Le/9qT6nwzUzf9tP68tYei0YaDGx6kAd7jn1cKqOCuYbiELH9zYqcc4MnRJjkeGiqaGwLImhyeKs+xKJMBlOJ05ow9gGCKZ1VpnMKoSCTbMS+X+23y042zOb5MtcY/6oBeAo1Vy89OTyhpavFP78jXCcFH0t7Gx24hMEOm2gsEfGabVpQgvFqbQKMsknFRRmuPHcZu0Su/WMFphZvB2r/EGbG72rpGGho3h+Msz0uGzJ7hNK2uqQiE1qmn0zgacKYYZBCqsxV+sjbpoVdSilW/b94n2xNb648VmNIoizqEWhBnsen+d0kbCPmRItfWqSBeOd9Wne3c6bcd6uvXOJ6WdiSsuXq0ndhqrQ4QoWUjCjYtZ0EAhnSOP1m44xkf0O7jXghrzSJWxP4a/t72jU29Vu2rvu4n7HfHkkmQOMGSS+NPeLGO5I73mC2B7+lMiBQQZRM9/9liLIfowupUFAbPBbR+lxDM6M8Ptgh1paJq5Rvs7yEuLQv/7d1oU2woFSb3FMPWQOKMuCuJ7pDDjpIclus5TeEoMBy2YdVB4fxmesaCeMNsEgTHKS5WDSGyNUOoEpcC2OFWtIRf0w27ck34/DjxRTVIcc9+kqZE6iMSiVDsiKdP/Xz5XfEhm/sBhO50p1rvJDlkyyxuJ9SPgs7YeUJBjXdeAkE+P9OQJm6SZnn1svcduI78dYmbkE2mtziPrcjVisXG78spLvbZaSFx/Rks9zP4LKn0Cdz/3JsetkT06A8f/yCgMO6Mb1Hme0JJ7b2wZz1qleqTuKBGokhPVUZ0dVu+tnQYNEY1fmkZSz6+EGZ5EzL7657mreZGR3jUfaEk458PDniBzsSmBKhDRzfXameryJv9/D5m6HIqZ0R+ouCE54Dzp4IJuuD1e4Dc5i+PpSORJfG23uVgqixAMDvchMR0nZdH5brclYwRoJRWv/rlxGRI5ffD5NPGmIDt7vDE1434pYdVZIFh89Bs94HGGJbTwrN8T6lh1HZFTOB4lWzWj6EVqxSMvC0/ljWBQ3F2kc/mO2b6tWonT2JEqEwFts8rz2h+oWNds9ceR2cb7zZvJTDppHaEhK5avWqsseWa2Dt5BBhabdWSktS80oMQrL4TvAM9b5HMmyDnO+OkkbMXfUJG7eXqTIG6lqSOEbqVR+qYdP7uWb57WEJqzyh411GAVsDinPs7KvUeXItlcMdOUWzXBH6zscymV1LLVCtc8IePojzXHF9m5b5zGwBRdzcyUJkiu938ApmAayRdJrX1PmVguWUvt2ThQ62czItTyWJMW2An/hdDfMK7SiFQlGIdAbltHz3ycoh7j9V7GxNWBpbtcSdqm4XxRwTawc3cbZ+xfSv9qQfEkDKfZTwCkqWGI/ur250ItXlMlh6vUNWEYIg9A3GzbgmbqvTN8js2YMo87CU5y6nZ4dbJLDQJj9fc7yM7tZzJDZFtqOcU8+mZjYlq4VmifI23iHb1ZoT9E+kT2dolnP1AfiOkt7PQCSykBiXy5mv637IegWSKj9IKrYZf4Lu9+I7ub+mkRdlvYzehh/jaJ9n7HUH5b2IbgeNdkY7wx1yVzxS7pbvky6+nmVUtRllEFfweUQ0/nG017WoUYSxs+j2B4FV/F62EtHlMWZXYrjGHpthnNb1x66LKZ0Qe92INWHdfR/vqp02wMS8r1G4dJqHok8KmQ7947G13a4YXbsGgHcBvRuVu1eAi4/A5+ZixmdSXM73LupB/LH7O9yxLTVXJTyBbI1S49TIROrfVCOb/czZ9pM4JsZx8kUz8dQGv7gUWKxXvTH7QM/3J2OuXXgciUhqY+cgtaOliQQVOYthBLV3xpESZT3rmfEYNZxmpBbb24CRao86prn+i9TNOh8VxRJGXJfXHATJHs1T5txgc/opYrY8XjlGQQbRcoxIBcnVsMjmU1ymmIUL4dviJXndMAJ0Yet+c7O52/p98ytlmAsGBaTAmMhimAnvp1TWNGM9BpuitGj+t810CU2UhorrjPKGtThVC8WaXw04WFnT5fTjqmPyrQ0tN3CkLsctVy2xr0ZWgiWVZ1OrlFjjxJYsOiZv2cAoOvE+7sY0I/TwWcZqMoyIKNOftwP7w++Rfg67ljfovKYa50if3fzE/8aPYVey/Nq35+nH2sLPh/fP5TsylSKGOZ4k69d2PnH43+kq++sRXHQqGArWdwhx+hpwQC6JgT2uxehYU4Zbw7oNb6/HLikPyJROGK2ouyr+vzseESp9G50T4AyFrSqOQ0rroCYP4sMDFBrHn342EyZTMlSyk47rHSq89Y9/nI3zG5lX16Z5lxphguLOcZUndL8wNcrkyjH82jqg8Bo8OYkynrxZvbFno5lUS3OPr8Ko3mX9NoRPdYOKKjD07bvgFgpZ/RF+YzkWvJ/Hs/tUbfeGzGWLxNAjfDzHHMVSDwB5SabQLsIZHiBp43FjGkaienYoDd18hu2BGwOK7U3o70K/WY/kuuKdmdrykIBUdG2mvE91L1JtTbh20mOLbk1vCAamu7utlXeGU2ooVikbU/actcgmsC1FKk2qmj3GWeIWbj4tGIxE7BLcBWUvvcnd/lYxsMV4F917fWeFB/XbINN3qGvIyTpCalz1lVewdIGqeAS/gB8Mi+sA+BqDiX3VGD2eUunTRbSY+AuDy4E3Qx3hAhwnSXX+B0zuj3eQ1miS8Vux2z/l6/BkWtjKGU72aJkOCWhGcSf3+kFkkB15vGOsQrSdFr6qTj0gBYiOlnBO41170gOWHSUoBVRU2JjwppYdhIFDfu7tIRHccSNM5KZOFDPz0TGMAjzzEpeLwTWp+kn201kU6NjbiMQJx83+LX1e1tZ10kuChJZ/XBUQ1dwaBHjTDJDqOympEk8X2M3VtVw21JksChA8w1tTefO3RJ1FMbqZ01bHHkudDB/OhLfe7P5GOHaI28ZXKTMuqo0hLWQ4HabBsGG7NbP1RiXtETz074er6w/OerJWEqjmkq2y51q1BVI+JUudnVa3ogBpzdhFE7fC7kybrAt2Z6RqDjATAUEYeYK45WMupBKQRtQlU+uNsjnzj6ZmGrezA+ASrWxQ6LMkHRXqXwNq7ftv28dUx/ZSJciDXP2SWJsWaN0FjPX9Yko6LobZ7aYW/IdUktI9apTLyHS8DyWPyuoZyxN1TK/vtfxk3HwWh6JczZC8Ftn0bIJay2g+n5wd7lm9rEsKO+svqVmi+c1j88hSCxbzrg4+HEP0Nt1/B6YW1XVm09T1CpAKjc9n18hjqsaFGdfyva1ZG0Xu3ip6N6JGpyTSqY5h4BOlpLPaOnyw45PdXTN+DtAKg7DLrLFTnWusoSBHk3s0d7YouJHq85/R09Tfc37ENXZF48eAYLnq9GLioNcwDZrC6FW6godB8JnqYUPvn0pWLfQz0lM0Yy8Mybgn84Ds3Q9bDP10bLyOV+qzxa4Rd9Dhu7cju8mMaONXK3UqmBQ9qIg7etIwEqM/kECk/Dzja4Bs1xR+Q/tCbc8IKrSGsTdJJ0vge7IG20W687uVmK6icWQ6cD3lwFzgNMGtFvO5qyJeKflGLAAcQZOrkxVwy3cWvqlGpvjmf9Qe6Ap20MPbV92DPV0OhFM4kz8Yr0ffC2zLWSQ1kqY6QdQrttR3kh1YLtQd1kCEv5hVoPIRWl5ERcUTttBIrWp6Xs5Ehh5OUUwI5aEBvuiDmUoENmnVw1FohCrbRp1A1E+XSlWVOTi7ADW+5Ohb9z1vK4qx5R5lPdGCPBJZ00mC+Ssp8VUbgpGAvXWMuWQQRbCqI6Rr2jtxZxtfP7W/8onz+yz0Gs76LaT5HX9ecyiZCB/ZR/gFtMxPsDwohoeCRtiuLxE1GM1vUEUgBv86+eehL58/P56QFGQ/MqOe/vC76L63jzmeax4exd/OKTUvkXg+fOJUHych9xt/9goJMrapSgvXrj8+8vk/N80f22Sewj6cyGqt1B6mztoeklVHHraouhvHJaG/OuBz6DHKMpFmQULU1bRWlyYE0RPXYYkUycIemN7TLtgNCJX6BqdyxDKkegO7nJK5xQ7OVYDZTMf9bVHidtk6DQX9Et+V9M7esgbsYBdEeUpsB0Xvw2kd9+rI7V+m47u+O/tq7mw7262HU1WlS9uFzsV6JxIHNmUCy0QS9e077JGRFbG65z3/dOKB/Zk+yDdKpUmdXjn/aS3N5nv4fK7bMHHmPlHd4E2+iTbV5rpzScRnxk6KARuDTJ8Q1LpK2mP8gj1EbuJ9RIyY+EWK4hCiIDBAS1Tm2IEXAFfgKPgdL9O6mAa06wjCcUAL6EsxPQWO9VNegBPm/0GgkZbDxCynxujX/92vmGcjZRMAY45puak2sFLCLSwXpEsyy5fnF0jGJBhm+fNSHKKUUfy+276A7/feLOFxxUuHRNJI2Osenxyvf8DAGObT60pfTTlhEg9u/KKkhJqm5U1/+BEcSkpFDA5XeCqxwXmPac1jcuZ3JWQ+p0NdWzb/5v1ZvF8GtMTFFEdQjpLO0bwPb0BHNWnip3liDXI2fXf05jjvfJ0NpjLCUgfTh9CMFYVFKEd4Z/OG/2C+N435mnK+9t1gvCiVcaaH7rK4+PjCvpVNiz+t2QyqH1O8x3JKZVl6Q+Lp/XK8wMjVMslOq9FdSw5FtUs/CptXH9PW+wbWHgrV17R5jTVOtGtKFu3nb80T+E0tv9QkzW3J2dbaw/8ddAKZ0pxIaEqLjlPrji3VgJ3GvdFvlqD8075woxh4fVt0JZE0KVFsAvqhe0dqN9b35jtSpnYMXkU+vZq+IAHad3IHc2s/LYrnD1anfG46IFiMIr9oNbZDWvwthqYNqOigaKd/XlLU4XHfk/PXIjPsLy/9/kAtQ+/wKH+hI/IROWj5FPvTZAT9f7j4ZXQyG4M0TujMAFXYkKvEHv1xhySekgXGGqNxWeWKlf8dDAlLuB1cb/qOD+rk7cmwt+1yKpk9cudqBanTi6zTbXRtV8qylNtjyOVKy1HTz0GW9rjt6sSjAZcT5R+KdtyYb0zyqG9pSLuCw5WBwAn7fjBjKLLoxLXMI+52L9cLwIR2B6OllJZLHJ8vDxmWdtF+QJnmt1rsHPIWY20lftk8fYePkAIg6Hgn532QoIpegMxiWgAOfe5/U44APR8Ac0NeZrVh3gEhs12W+tVSiWiUQekf/YBECUy5fdYbA08dd7VzPAP9aiVcIB9k6tY7WdJ1wNV+bHeydNtmC6G5ICtFC1ZwmJU/j8hf0I8TRVKSiz5oYIa93EpUI78X8GYIAZabx47/n8LDAAJ0nNtP1rpROprqKMBRecShca6qXuTSI3jZBLOB3Vp381B5rCGhjSvh/NSVkYp2qIdP/Bg="},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 300692 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4755787) throw new Error('Invalid embedded sheet data length.');
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
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var pendingResults = [];
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

  function canonicalResourceLabel(name, field) {
    var key = normalize(name);
    var source = normalize(contractDisplayLabel(field && field.label));
    if (!/^(?:현재|current|now)?(?:hp|mp|san)?(?:값|수치|점수|value|score)?$/i.test(source)) return '';
    if (key === 'hp') return '체력';
    if (key === 'mp') return '마력';
    if (key === 'san') return '이성';
    return '';
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
      var named = (maximumsByName[fieldPairNameKey(field.name)] || []).filter(function (maximum) {
        return maximum !== field;
      });
      if (named.length === 1) {
        result[field.name] = true;
        result[named[0].name] = true;
      }
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
      label = canonicalResourceLabel(fullName, field) || label;
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
    if (speaking.ok) return [speaking.character];
    var who = trim(message && message.who);
    return who ? findObjs({ _type: 'character', name: who }) : [];
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

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    pendingResults = pendingResults.filter(function (pending) { return pending.created >= cutoff; });
  }

  function takePendingResult(message) {
    prunePendingResults();
    if (String(message && message.playerid || '').toUpperCase() !== 'API') return null;
    var template = normalize(message && message.rolltemplate);
    if (!template) return null;
    var who = normalize(message && message.who);
    var fields = messageTemplateFields(message);
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    var candidates = [];
    pendingResults.forEach(function (pending, index) {
      if (pending.template !== template) return;
      if (!who || pending.characterName === who) candidates.push(index);
    });
    if (!candidates.length) {
      pendingResults.forEach(function (pending, index) {
        if (pending.template === template) candidates.push(index);
      });
    }
    if (!candidates.length) return null;
    var labelled = candidates.filter(function (index) {
      return !!values[normalize(pendingResults[index].payload.label)];
    });
    var selected = (labelled.length ? labelled : candidates).slice(-1)[0];
    return pendingResults.splice(selected, 1)[0].payload;
  }

  function captureResult(message) {
    var pending = takePendingResult(message);
    if (pending) {
      emitResult(pending, message);
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
    var templateMatch = String(content || '').match(/&\{\s*template\s*:\s*([^}\s]+)\s*\}/i);
    var pending = {
      created: Date.now(),
      template: normalize(templateMatch && templateMatch[1]),
      characterName: normalize(character.get('name')),
      payload: payload,
    };
    pendingResults = pendingResults.filter(function (saved) {
      return saved.template !== pending.template || saved.characterName !== pending.characterName ||
        normalize(saved.payload.label) !== normalize(payload.label);
    });
    pendingResults.push(pending);
    try {
      sendChat('character|' + character.id, content);
      return { ok: true, payload: payload };
    } catch (err) {
      var index = pendingResults.indexOf(pending);
      if (index > -1) pendingResults.splice(index, 1);
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
        var sourceControl = sourceControls[name] || runtimeIndex.controls[name];
        var controlOptions = maximum ? [] : contractOptionValues(sourceControl);
        var validatesOptions = controlOptions.length > 1 ||
          /^(?:select|radio)$/i.test(trim(sourceControl && sourceControl.type));
        if (actual !== undefined && actual !== null && trim(actual) !== '' && validatesOptions &&
            controlOptions.length && controlOptions.indexOf(String(actual)) < 0) {
          actual = sourceControl && own(sourceControl, 'default') ? sourceControl.default : null;
        }
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

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride, resultMeta) {
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
    merge(payload, resultMeta);
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

  function fixedCombatTitle(instance) {
    var roll = instance && instance.roll;
    if (!roll || !/\{\{\s*(?:damage|피해)\s*=/i.test(String(roll.raw || ''))) return '';
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    var refs = Array.isArray(roll.labelRefs) ? roll.labelRefs : [];
    for (var at = 0; at < refs.length; at += 1) {
      var name = contractRefName(refs[at]);
      var field = fields[name] || index.fieldGlobal[name];
      if (!/^(?:weapon|weap|attack).*?(?:name|title|label)/i.test(name) || !field ||
          field.hidden || field.disabled || !field.readonly) continue;
      var fullName = contractRowAttr(instance.contract, roll, instance.row, name);
      var value = getAttr(instance.characterId, fullName);
      if (value === undefined || value === null || !trim(value)) value = field.default;
      value = contractDisplayLabel(value);
      if (value) return value;
    }
    return '';
  }

  function contractInstanceAliases(instance, compatible) {
    var found = dictionary();
    var result = [];
    [fixedCombatTitle(instance)].concat(instance.aliases || []).forEach(function (value) {
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
      var baseRaw = contractBehaviorContent(structure, instance)
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(fixedCombatTitle(instance) || instance.label),
        normalize(roll.name),
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
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1) return;
      if (best.length > 1) {
        var annotations = best.map(function (candidate) {
          return (contractRollStructure(candidate.instance).match(/\b\d*d(?:\d+|%|f)(?:c[fs])/gi) || []).length;
        });
        var richest = Math.max.apply(Math, annotations);
        if (richest) best = best.filter(function (_candidate, index) { return annotations[index] === richest; });
      }
      if (best.length !== 1) return;
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
    return [fixedCombatTitle(instance), instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
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
    if (/&\{tracker\}/i.test(String(item && (item.sourceRaw || item.roll && item.roll.raw) || ''))) return 'other';
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
    var preferred = dictionary();
    if (!includeEveryInstance) preferSingleInlineRollActions(uniqueContractCandidates(
      data.contractRolls.map(function (instance) { return { instance: instance }; }),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    var instances = includeEveryInstance ? data.contractRolls : data.contractRolls.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      var labelKey = statusRollLabelIdentity(instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      if (!includeEveryInstance && fixedCombatTitle(instance) && labelKey && seenLabels[labelKey]) {
        seenLabels[labelKey].modeEntries = seenLabels[labelKey].modeEntries.concat(modeEntries);
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
    var role = Object.keys(DETECTED_ROLE_LABELS).filter(function (name) {
      return DETECTED_ROLE_LABELS[name].indexOf(wanted) > -1;
    })[0];
    var canonical = role ? uniqueResources((data.resources || []).filter(function (item) {
      return matchesDetectedRole([item.name].concat(item.sourceLabels || []), role);
    })) : [];
    if (canonical.length === 1) return { ok: true, item: canonical[0] };
    if (canonical.length > 1)
      return { ok: false, error: '같은 종류의 수치가 여러 개입니다: ' + canonical.map(function (item) { return item.label; }).join(', ') };
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
    var automaticInsanity = {
      sourceHash: intelligence.item.contract && intelligence.item.contract.sourceHash || '',
      longName: longInsanity.item ? longInsanity.item.name : '',
      temporaryName: temporary.item ? temporary.item.name : '',
    };
    var rolled = executeContractInstance(character, intelligence.item, '', false,
      undefined, undefined, { _automaticInsanity: automaticInsanity });
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
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
