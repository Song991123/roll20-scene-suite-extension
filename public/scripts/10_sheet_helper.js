/*
 * Scene Suite 10 - Sheet Helper 0.6.28
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
  if (compressed.length !== 300828 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758022) throw new Error('Invalid embedded sheet data length.');
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

  var VERSION = '0.6.28';
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
        roll.visibility || null, !!instance.hidden, roll.kind || '', candidate.mode || null,
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
