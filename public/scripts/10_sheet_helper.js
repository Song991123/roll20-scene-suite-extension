/*
 * Scene Suite 10 - Sheet Helper 0.6.40
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
  if (compressed.length !== 300572 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4757325) throw new Error('Invalid embedded sheet data length.');
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
      if (field[12]) restored.radioRange = field[12].slice();
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

  var VERSION = '0.6.40';
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

  function numericRadioField(field) {
    var range = field && field.radioRange;
    return !!field && field.type === 'radio' && field.numericCandidate &&
      Array.isArray(range) && range.length === 2 &&
      range.every(function (value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }) &&
      range[0] <= range[1];
  }

  function userFacingField(field) {
    if (numericRadioField(field)) return true;
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
        !userFacingField(field) || !(numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()))) return;
      if (numericRadioField(field)) result[field.name] = true;
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
        field.defaultVariants || [], field.radioRange || [],
      ]) : '';
      var number = (numericRadioField(field) || /^(?:text|number|range)$/.test(type))
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
      if (tracked && numericRadioField(field)) result.tracked[fullName].radioRange = field.radioRange.slice();
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
      if (numericRadioField(field)) item.radioRange = field.radioRange.slice();
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
      else if (!field.hidden && (numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) && own(field, 'default')) {
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
    payload.secret = !!payload.secret || !!(message &&
      (message.type === 'whisper' || message.type === 'gmrollresult'));
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
    if (item.radioRange && (!isFinite(value) || Math.floor(Number(value)) !== Number(value) ||
        Number(value) < item.radioRange[0] || Number(value) > item.radioRange[1]))
      return { attribute: item.attribute || null, changed: false, error: '원본 시트에 없는 숫자 선택값입니다.' };
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
